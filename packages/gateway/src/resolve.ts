import { ethers } from 'ethers';
import { abi as Resolver_abi } from '@ensdomains/ens-contracts/artifacts/contracts/resolvers/Resolver.sol/Resolver.json';

const IResolver = new ethers.utils.Interface(Resolver_abi);
const provider = new ethers.providers.JsonRpcProvider(
  'http://localhost:8002/',
  {
    name: "layer2",
    chainId: 22222,
    ensAddress: process.env.REGISTRY_ADDRESS,
  },
);

const resolve = async (
  name: string,
  signature: string,
  data: any
) => {
  // manage the case when we try to resolve a name that doesn't have a resolver
  // TODO: that doesn't seem right, find a way to avoid that if possible
  if (signature === 'addr(bytes32)') {
    const addr = (await provider.resolveName(name)) ?? ethers.constants.AddressZero;
    return IResolver.encodeFunctionResult(signature, [addr]);
  }

  // manage the case when informations from the resolver are requested
  const resolver = await provider.getResolver(name);
  if (resolver?.address) {
    return provider.call({ to: resolver?.address, data });
  }

  // complex data are requested but the name doesn't have a resolver set
  throw new Error('No resolver attached to this name');
};

export default resolve;
