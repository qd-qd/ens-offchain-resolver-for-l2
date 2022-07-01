import { Server } from '@chainlink/ccip-read-server';
import { abi as IResolverService_abi } from '@ledger/ens-l2-resolver-l1/artifacts/contracts/OffchainResolver.sol/IResolverService.json';
import { abi as Resolver_abi } from '@ensdomains/ens-contracts/artifacts/contracts/resolvers/Resolver.sol/Resolver.json';
import { ethers } from 'ethers';
import { hexConcat, Result } from 'ethers/lib/utils';
import resolve from './resolve';

const Resolver = new ethers.utils.Interface(Resolver_abi);

function decodeDnsName(dnsname: Buffer) {
  const labels = [];
  let idx = 0;
  while (true) {
    const len = dnsname.readUInt8(idx);
    if (len === 0) break;
    labels.push(dnsname.slice(idx + 1, idx + len + 1).toString('utf8'));
    idx += len + 1;
  }
  return labels.join('.');
}

export function makeServer(signer: ethers.utils.SigningKey) {
  const server = new Server();
  server.add(IResolverService_abi, [
    {
      type: 'resolve',
      func: async ([encodedName, data]: Result, request) => {
        const name = decodeDnsName(Buffer.from(encodedName.slice(2), 'hex'));

        const resolvedAddress = await resolve(name);
        const { signature } = Resolver.parseTransaction({ data });
        const result = Resolver.encodeFunctionResult(signature, [
          resolvedAddress,
        ]);
        // TODO: set the TTL as an env variable
        const validUntil = Math.floor(Date.now() / 1000 + 300 /* ttl */);

        // Hash and sign the response
        let messageHash = ethers.utils.solidityKeccak256(
          ['bytes', 'address', 'uint64', 'bytes32', 'bytes32'],
          [
            '0x1900',
            request?.to,
            validUntil,
            ethers.utils.keccak256(request?.data || '0x'),
            ethers.utils.keccak256(result),
          ]
        );
        const sig = signer.signDigest(messageHash);
        const sigData = hexConcat([sig.r, sig._vs]);
        return [result, validUntil, sigData];
      },
    },
  ]);
  return server;
}

export function makeApp(signer: ethers.utils.SigningKey, path: string) {
  return makeServer(signer).makeApp(path);
}
