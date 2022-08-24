import { Server } from '@chainlink/ccip-read-server';
import { ethers } from 'ethers';
import { hexConcat, Result } from 'ethers/lib/utils';
import { abi as IResolverService_abi } from './utils/IResolverService.json';
import resolve from './resolve';
import decodeDnsName from './utils/decodeDnsName';

const TTL = parseInt(process.env.TTL || "") || 300;

export function makeServer(signer: ethers.utils.SigningKey) {
  const server = new Server();
  server.add(IResolverService_abi, [
    {
      type: 'resolve',
      func: async ([encodedName, data]: Result, request) => {
        // make the name human readable
        const name = decodeDnsName(Buffer.from(encodedName.slice(2), 'hex'));

        // resolve the requested data
        const result = await resolve(name, data);

        // set the validity of the data
        const validUntil = Math.floor(Date.now() / 1000 + TTL);

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
