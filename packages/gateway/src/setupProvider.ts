import { ethers } from "ethers";
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

// setup the provider to communicate with the layer2 and a wallet with the provided private key
const setup: () => { provider: ethers.providers.JsonRpcProvider, wallet: ethers.Wallet } = () => {
    if (process.env.PRIVATE_KEY === undefined) throw new Error('no private key');
    if (process.env.REGISTRY_ADDRESS === undefined)
        throw new Error('no registry address');

    const provider = new ethers.providers.JsonRpcProvider(
        'http://localhost:8002/',
        {
            name: "layer2",
            chainId: 22222,
            ensAddress: process.env.REGISTRY_ADDRESS,
        },
    );
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    return { provider, wallet };
}

export default setup;
