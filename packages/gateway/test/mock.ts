import { ethers, BaseContract, constants, providers } from 'ethers';
import { abi as L2PublicResolverABI } from '../src/utils/L2PublicResolver.json';
import { ConnectionInfo } from "@ethersproject/web";
import { Network, Networkish } from "@ethersproject/networks";
import { formatsByCoinType } from "@ensdomains/address-encoder";

const VALID_NODE = "myname.mydao.eth";
const VALID_NODE_HASH = ethers.utils.namehash("myname.eth");
const VALID_ETH_ADDRESS = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

// Mock ethers.Contract
class MockedContract extends BaseContract {
    constructor(resolverAddress: string, abi: typeof L2PublicResolverABI, wallet: ethers.Wallet) {
        super(resolverAddress, abi, wallet);
    }

    'contenthash(bytes32)'(nodehash: string) {
        return nodehash !== VALID_NODE_HASH
            ? ''
            : '0xe30101701220e09973e8c9e391cb063bd6654356e64e0ceced7858a29a8c01b165e30a5eb5be';
    }

    'text(bytes32,string)'(nodehash: string, key: string) {
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

    'addr(bytes32,uint256)'(nodehash: string, coinType: ethers.BigNumber) {
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
}

// Mock ethers.JsonRpcProvider
class MockedProvider extends providers.JsonRpcProvider {
    VALID_NODE: string;

    detectNetwork(): Promise<Network> {
        return Promise.resolve({
            name: "layer2",
            chainId: 22222,
            ensAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3"
        })
    }

    isNameCorrect(name: string): boolean {
        return name === this.VALID_NODE.replace("mydao.", "");
    }

    // 'addr(bytes32,uint256)'
    resolveName(name: string): Promise<string | null> {
        if (this.isNameCorrect(name)) return Promise.resolve(VALID_ETH_ADDRESS);
        return Promise.resolve(ethers.constants.AddressZero);
    }

    getResolver(name: string): Promise<ethers.providers.Resolver | null> {
        const fakeResolver = { address: ethers.constants.AddressZero } as ethers.providers.Resolver;
        if (this.isNameCorrect(name)) return Promise.resolve(fakeResolver);
        return Promise.resolve(null);
    }

    constructor(url?: ConnectionInfo | string, network?: Networkish) {
        super(url, network);
        this.VALID_NODE = VALID_NODE;
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
            Contract: MockedContract,
            providers: {
                ...originalModule.ethers.providers,
                JsonRpcProvider: MockedProvider
            }
        },
    };
});

// must be imported after `jest.doMock`
export { makeServer } from '../src/server';
export { ethers, VALID_NODE, VALID_ETH_ADDRESS };