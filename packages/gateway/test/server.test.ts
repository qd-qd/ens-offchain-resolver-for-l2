
import { abi as IResolverService_abi } from '@mydao/ens-l2-resolver-l1/artifacts/contracts/OffchainResolver.sol/IResolverService.json';
import { abi as Resolver_abi } from '@ensdomains/ens-contracts/artifacts/contracts/resolvers/Resolver.sol/Resolver.json';
import { makeServer, ethers, VALID_NODE, VALID_ETH_ADDRESS } from "./mock";
import { formatsByCoinType } from "@ensdomains/address-encoder";

const IResolverService = new ethers.utils.Interface(IResolverService_abi);
const Resolver = new ethers.utils.Interface(Resolver_abi);

function dnsName(name: string) {
  // strip leading and trailing .
  const n = name.replace(/^\.|\.$/gm, '');

  var bufLen = n === '' ? 1 : n.length + 2;
  var buf = Buffer.allocUnsafe(bufLen);

  let offset = 0;
  if (n.length) {
    const list = n.split('.');
    for (let i = 0; i < list.length; i++) {
      const len = buf.write(list[i], offset + 1);
      buf[offset] = len;
      offset += len + 1;
    }
  }
  buf[offset++] = 0;
  return (
    '0x' +
    buf.reduce(
      (output, elem) => output + ('0' + elem.toString(16)).slice(-2),
      ''
    )
  );
}

function expandSignature(sig: string) {
  return {
    r: ethers.utils.hexDataSlice(sig, 0, 32),
    _vs: ethers.utils.hexDataSlice(sig, 32),
  };
}

describe('makeServer', () => {
  const signingAddress = ethers.utils.computeAddress(process.env.PRIVATE_KEY ?? "");
  const server = makeServer(new ethers.utils.SigningKey(process.env.PRIVATE_KEY ?? ""));

  async function makeCall(fragment: string, name: string, ...args: any[]) {
    const TEST_ADDRESS = '0xCAfEcAfeCAfECaFeCaFecaFecaFECafECafeCaFe';
    // Hash the name
    const node = ethers.utils.namehash(name);
    // Encode the inner call (eg, addr(namehash))
    const innerData = Resolver.encodeFunctionData(fragment, [node, ...args]);
    // Encode the outer call (eg, resolve(name, inner))
    const outerData = IResolverService.encodeFunctionData('resolve', [
      dnsName(name),
      innerData,
    ]);
    // Call the server with address and data
    const { status, body } = await server.call({
      to: TEST_ADDRESS,
      data: outerData,
    });
    // Decode the response from 'resolve'
    const [result, validUntil, sigData] = IResolverService.decodeFunctionResult(
      'resolve',
      body.data
    );
    // Check the signature
    let messageHash = ethers.utils.solidityKeccak256(
      ['bytes', 'address', 'uint64', 'bytes32', 'bytes32'],
      [
        '0x1900',
        TEST_ADDRESS,
        validUntil,
        ethers.utils.keccak256(outerData || '0x'),
        ethers.utils.keccak256(result),
      ]
    );
    expect(
      ethers.utils.recoverAddress(messageHash, expandSignature(sigData))
    ).toBe(signingAddress);
    return { status, result };
  }

  describe('addr(bytes32)', () => {
    test('resolves exact names', async () => {
      const response = await makeCall('addr(bytes32)', VALID_NODE);
      expect(response).toStrictEqual({
        status: 200,
        result: Resolver.encodeFunctionResult('addr(bytes32)', [VALID_ETH_ADDRESS]),
      });
    });

    test('resolves nonexistent subdomain', async () => {
      const response = await makeCall('addr(bytes32)', 'test.mydao.eth');
      expect(response).toStrictEqual({
        status: 200,
        result: Resolver.encodeFunctionResult('addr(bytes32)', [ethers.constants.AddressZero]),
      });
    });

    test('resolves random name', async () => {
      const response = await makeCall('addr(bytes32)', 'foo.eth');
      expect(response).toStrictEqual({
        status: 200,
        result: Resolver.encodeFunctionResult('addr(bytes32)', [ethers.constants.AddressZero]),
      });
    });
  });

  describe('addr(bytes32,uint256)', () => {
    const records = [
      { coinType: 0, name: "BTC", expected: formatsByCoinType[0].decoder("bc1q8fnmuy9cfzmym062a93cuqh2l8l0p46gxy74pg") },
      { coinType: 3, name: "DOGE", expected: formatsByCoinType[3].decoder("DBs4WcRE7eysKwRxHNX88XZVCQ9M6QSUSz") },
      { coinType: 60, name: "ETH", expected: VALID_ETH_ADDRESS },
      { coinType: 118, name: "COSMOS", expected: formatsByCoinType[118].decoder("cosmos14n3tx8s5ftzhlxvq0w5962v60vd82h30sythlz") },
    ];

    records.forEach(({ coinType, name, expected }) => {
      test(`resolves ${name} address for existent name`, async () => {
        const response = await makeCall('addr(bytes32,uint256)', VALID_NODE, coinType);
        expect(response).toStrictEqual({
          status: 200,
          result: Resolver.encodeFunctionResult('addr(bytes32,uint256)', [expected]),
        });
      });
    });

    records.forEach(({ name }) => {
      test(`resolves ${name} address for nonexistent name`, async () => {
        return makeCall('addr(bytes32,uint256)', 'test.mydao.eth', 60).catch(e =>
          expect(e).toEqual(new Error("No resolver attached to this name")));
      });
    });


    records.forEach(({ name }) => {
      test(`resolves ${name} address for random name`, async () => {
        return makeCall('addr(bytes32,uint256)', 'foo.eth', 60).catch(e =>
          expect(e).toEqual(new Error("No resolver attached to this name")));
      });
    });
  });

  describe('text(bytes32,string)', () => {
    const texts = [
      ["avatar", "https://metadata.ens.domains/mainnet/avatar/qdqdqd.eth?v=1.0"],
      ["com.twitter", "qdqd___"],
      ["com.github", "qd-qd"],
      ["org.telegram", "qd_qd_qd"],
      ["email", "qdqdqdqdqd@protonmail.com"],
      ["url", "https://ens.domains/"],
      ["description", "smart-contract engineer"],
      ["notice", "This is a custom notice"],
      ["keywords", "solidity,ethereum,developer"],
      ["company", "ledger"],
      ["fake-key", ""]
    ];

    texts.forEach(([key, value]) => {
      test(`resolves ${key} text for existent name`, async () => {
        const response = await makeCall('text(bytes32,string)', VALID_NODE, key);
        expect(response).toStrictEqual({
          status: 200,
          result: Resolver.encodeFunctionResult('text(bytes32,string)', [value]),
        });
      });
    });

    texts.forEach(([key]) => {
      test(`resolves ${key} text for nonexistent name`, async () => {
        return makeCall('text(bytes32,string)', 'test.mydao.eth', key).catch(e =>
          expect(e).toEqual(new Error("No resolver attached to this name")));
      });
    });

    texts.forEach(([key]) => {
      test(`resolves ${key} text for nonexistent name`, async () => {
        return makeCall('text(bytes32,string)', 'foo.eth', key).catch(e =>
          expect(e).toEqual(new Error("No resolver attached to this name")));
      });
    });
  });

  describe('contenthash(bytes32)', () => {
    test('resolves content hash for existent name', async () => {
      const response = await makeCall('contenthash(bytes32)', VALID_NODE);
      expect(response).toStrictEqual({
        status: 200,
        result: Resolver.encodeFunctionResult('contenthash(bytes32)',
          ["0xe30101701220e09973e8c9e391cb063bd6654356e64e0ceced7858a29a8c01b165e30a5eb5be"]),
      });
    });

    test('resolves content hash text for nonexistent name', async () => {
      return makeCall('contenthash(bytes32)', 'test.mydao.eth').catch(e =>
        expect(e).toEqual(new Error("No resolver attached to this name")));
    });

    test('resolves content hash text for nonexistent name', async () => {
      return makeCall('contenthash(bytes32)', 'foo.eth').catch(e =>
        expect(e).toEqual(new Error("No resolver attached to this name")));
    });
  });
});
