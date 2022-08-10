import { ethers, constants, providers } from 'ethers';
import { ConnectionInfo } from "@ethersproject/web";
import { Network, Networkish } from "@ethersproject/networks";
import { Deferrable } from "@ethersproject/properties";
import { TransactionRequest } from "@ethersproject/abstract-provider";
import { formatsByCoinType } from "@ensdomains/address-encoder";
import { abi as Resolver_abi } from '@ensdomains/ens-contracts/artifacts/contracts/resolvers/Resolver.sol/Resolver.json';

const IResolver = new ethers.utils.Interface(Resolver_abi);

const VALID_NODE = "myname.mydao.eth";
const VALID_NODE_HASH = ethers.utils.namehash(VALID_NODE);
const VALID_ETH_ADDRESS = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

const resolve = (signature: string, args: string[] | ethers.BigNumber[]) => {
    switch (signature) {
        case 'contenthash(bytes32)': {
            const [nodehash] = args;
            return nodehash !== VALID_NODE_HASH
                ? ''
                : '0xe30101701220e09973e8c9e391cb063bd6654356e64e0ceced7858a29a8c01b165e30a5eb5be';
        }

        case 'text(bytes32,string)': {
            const [nodehash, key] = args;
            if (nodehash !== VALID_NODE_HASH) return '';
            if (key === "avatar") return "https://metadata.ens.domains/mainnet/avatar/qdqdqd.eth?v=1.0";
            if (key === "com.twitter") return "qdqd___";
            if (key === "org.telegram") return "qd_qd_qd";
            if (key === "com.github") return "qd-qd";
            if (key === "email") return "qdqdqdqdqd@protonmail.com";
            if (key === "url") return "https://ens.domains/";
            if (key === "description") return "smart-contract engineer";
            if (key === "notice") return "This is a custom notice";
            if (key === "keywords") return "solidity,ethereum,developer";
            if (key === "company") return "ledger";
            return '';
        }

        case 'addr(bytes32,uint256)': {
            const [nodehash, coinType] = args as [string, ethers.BigNumber];
            // ETH
            if (coinType.toNumber() === 60)
                return nodehash === VALID_NODE_HASH ? VALID_ETH_ADDRESS : constants.AddressZero;
            // BTC
            if (coinType.toNumber() === 0) return formatsByCoinType[0].decoder("bc1q8fnmuy9cfzmym062a93cuqh2l8l0p46gxy74pg");
            // DOGE
            if (coinType.toNumber() === 3) return formatsByCoinType[3].decoder("DBs4WcRE7eysKwRxHNX88XZVCQ9M6QSUSz");
            // COSMOS
            if (coinType.toNumber() === 118) return formatsByCoinType[118].decoder("cosmos14n3tx8s5ftzhlxvq0w5962v60vd82h30sythlz");
            return constants.AddressZero;
        }

        default:
            throw new Error('signature not mocked');
    }
}

// Naively mock ethers.JsonRpcProvider
// TODO: Improve the mock to make it as iso as possible
class MockedProvider extends providers.JsonRpcProvider {
    VALID_NODE: string;

    constructor(url?: ConnectionInfo | string, network?: Networkish) {
        super(url, network);
        this.VALID_NODE = VALID_NODE;
    }

    detectNetwork(): Promise<Network> {
        return Promise.resolve({
            name: "layer2",
            chainId: 22222,
            ensAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3"
        })
    }

    // 'addr(bytes32,uint256)'
    resolveName(name: string): Promise<string | null> {
        if (name === this.VALID_NODE) return Promise.resolve(VALID_ETH_ADDRESS);
        return Promise.resolve(ethers.constants.AddressZero);
    }

    getResolver(name: string): Promise<ethers.providers.Resolver | null> {
        const fakeResolver = { address: ethers.constants.AddressZero } as ethers.providers.Resolver;
        if (name === this.VALID_NODE) return Promise.resolve(fakeResolver);
        return Promise.resolve(null);
    }

    async call(transaction: Deferrable<TransactionRequest>): Promise<string> {
        // @ts-ignore next-line -- Recreate the transaction
        const tx = IResolver.parseTransaction({ data: transaction.data });
        // @ts-ignore next-line -- Resolve the data
        const output = resolve(tx.signature, tx.args);
        // Encode the result
        return IResolver.encodeFunctionResult(tx.signature, [output]);
    }
}

// Apply the mocks create above. Use doMock instead of mock to avoid hoisting
jest.doMock('ethers', () => {
    const originalModule: { ethers: typeof ethers } = jest.requireActual('ethers');
    return {
        __esModule: true,
        ...originalModule,
        ethers: {
            ...originalModule.ethers,
            providers: {
                ...originalModule.ethers.providers,
                JsonRpcProvider: MockedProvider
            }
        },
    };
});


export { ethers, VALID_NODE, VALID_ETH_ADDRESS };