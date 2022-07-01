import { ethers } from 'ethers';
import { abi as L2Registry_abi } from './utils/L2Registry.json';

const resolve = async (name: string) => {
  if (process.env.PRIVATE_KEY === undefined) throw new Error('no private key');
  if (process.env.REGISTRY_CONTRACT_ADDRESS === undefined)
    throw new Error('no registry address');

  // Provider
  const defaultProvider = ethers.getDefaultProvider('http://127.0.0.1:8002/');
  // Signer
  const customSigner = new ethers.Wallet(
    process.env.PRIVATE_KEY,
    defaultProvider
  );
  // The Registry stored in the layer 2
  const l2Registry = new ethers.Contract(
    process.env.REGISTRY_CONTRACT_ADDRESS,
    L2Registry_abi,
    customSigner
  );

  // Remove the subdomain before resolving
  // TODO: maybe include the subdomain in the layer2 directly
  const nameToResolve = name.replace('.ledger', '');
  const address = await l2Registry.owner(ethers.utils.namehash(nameToResolve));

  return address;
};

export default resolve;
