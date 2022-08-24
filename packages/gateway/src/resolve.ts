import { ethers } from 'ethers';

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
  data: any
) => {
  // manage the case when informations from the resolver are requested
  const resolver = await provider.getResolver(name);
  if (resolver?.address)
    return provider.call({ to: resolver?.address, data });

  // data are requested but the name doesn't have a resolver set
  throw new Error('No resolver attached to this name');
};

export default resolve;
