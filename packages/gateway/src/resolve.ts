import { ethers } from 'ethers';
import { abi as L2PublicResolverABI } from './utils/L2PublicResolver.json';
import setupProvider from "./setupProvider";

const { provider, wallet } = setupProvider();

const fetchData = async (signature: string, nodeToResolve: string, args: ethers.utils.Result, resolverAddress: string) => {
  const publicResolver = new ethers.Contract(resolverAddress, L2PublicResolverABI, wallet);
  const nodehash = ethers.utils.namehash(nodeToResolve);

  switch (signature) {
    case 'addr(bytes32,uint256)':
      return publicResolver['addr(bytes32,uint256)'](nodehash, args.coinType);

    case 'ABI(bytes32,uint256)':
      return publicResolver[signature](args.contentTypes);

    case 'text(bytes32,string)':
      return publicResolver[signature](nodehash, args.key);

    case 'dnsRecord(bytes32,bytes32,uint16)':
      return publicResolver[signature](nodehash, args.name, args.resource);
    case 'hasDNSRecords(bytes32,bytes32)':
      return publicResolver[signature](nodehash, args.name);

    case 'addr(bytes32)':
    case 'contenthash(bytes32)':
    case 'zonehash(bytes32)':
    case 'pubkey(bytes32)':
    case 'name(bytes32)':
      return publicResolver[signature](nodehash);

    default:
      throw new Error("Resolution not supported for this method");
  }
};

// TODO:
// - Manage when there is no resolver attached
const resolve = async (
  name: string,
  signature: string,
  args: ethers.utils.Result,
) => {
  const nodeToResolve = name.replace('.mydao', '');
  const resolver = await provider.getResolver(nodeToResolve);

  if (!resolver?.address) throw new Error("No resolver");

  return fetchData(signature, nodeToResolve, args, resolver.address);
};

export default resolve;
