import { ethers } from 'ethers';
import { abi as L2PublicResolverABI } from './utils/L2PublicResolver.json';
import setupProvider from "./setupProvider";

const { provider, wallet } = setupProvider();

// TODO: Rework this function to use the generic `provider.call(...)`
const fetchData = async (signature: string, nodeToResolve: string, args: ethers.utils.Result, resolverAddress: string) => {
  // Set the contract to request it directly
  const publicResolver = new ethers.Contract(resolverAddress, L2PublicResolverABI, wallet);
  const nodehash = ethers.utils.namehash(nodeToResolve);

  switch (signature) {
    case 'addr(bytes32,uint256)':
      return publicResolver[signature](nodehash, args.coinType);

    case 'ABI(bytes32,uint256)':
      return publicResolver[signature](args.contentTypes);

    case 'text(bytes32,string)':
      return publicResolver[signature](nodehash, args.key);

    case 'dnsRecord(bytes32,bytes32,uint16)':
      return publicResolver[signature](nodehash, args.name, args.resource);
    case 'hasDNSRecords(bytes32,bytes32)':
      return publicResolver[signature](nodehash, args.name);

    case 'contenthash(bytes32)':
    case 'zonehash(bytes32)':
    case 'pubkey(bytes32)':
    case 'name(bytes32)':
      return publicResolver[signature](nodehash);

    default:
      throw new Error("Resolution not supported for this method");
  }
};

const resolve = async (
  name: string,
  signature: string,
  args: ethers.utils.Result,
) => {
  const nodeToResolve = name.replace('.mydao', '');

  // manage the basic case when the address of the owner is requested
  if (signature === 'addr(bytes32)')
    return (await provider.resolveName(nodeToResolve)) ?? ethers.constants.AddressZero;

  // manage the case when informations from the resolver are requested
  const resolver = await provider.getResolver(nodeToResolve);
  if (resolver?.address)
    return fetchData(signature, nodeToResolve, args, resolver?.address);

  // complex data are requested but the name doesn't have a resolver set
  throw new Error('No resolver attached to this name');
};

export default resolve;
