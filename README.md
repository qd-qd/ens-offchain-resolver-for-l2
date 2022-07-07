# ENS Offchain Resolver

This repository contains smart contracts and a node.js gateway server that together allow hosting ENS names offchain using [EIP 3668](https://eips.ethereum.org/EIPS/eip-3668) and [ENSIP 10](https://docs.ens.domains/ens-improvement-proposals/ensip-10-wildcard-resolution).

## Overview

ENS resolution requests to the resolver implemented in this repository are responded to with a directive to query a gateway server for the answer. The gateway server generates and signs a response, which is sent back to the original resolver for decoding and verification. The gateway fetch the from a new registry contract that can be hosted on any network we want to. Full details of this request flow can be found below.

All of this happens transparently in supported clients (such as ethers.js, or future versions of web3.js which will have this functionality built-in).

## [Gateway Server](packages/gateway)

The gateway server implements CCIP Read (EIP 3668), and answers requests by looking up the names in a store stored on-chain. Once a record is retrieved, it is signed using a user-provided key to assert its validity, and both record and signature are returned to the caller so they can be provided to the contract that initiated the request.

## [Contracts](packages/contracts)

There is two important smart-contrat: The OffchainResolver smart-contract that will be stored on-chain on the L1 and the L2PublicResolver/L2Registry smart-contracts that are stored on-chain on the L2/side-chain we decide to.

The OffchainResolver smart contract provides a resolver stub that implement CCIP Read (EIP 3668) and ENS wildcard resolution (ENSIP 10). When queried for a name, it directs the client to query the gateway server. When called back with the gateway server response, the resolver verifies the signature was produced by an authorised signer, and returns the response to the client.

The L2 contracts replicate the ENS ecosystem on the layer 2 network. That to that, we control how records are stored on-chain and all interaction with them.

## Trying it out

Start by generating an Ethereum private key; this will be used as a signing key for any messages signed by your gateway service. You can use a variety of tools for this; for instance, this Python snippet will generate one for you:

```
python3 -c "import os; import binascii; print('0x%s' % binascii.hexlify(os.urandom(32)).decode('utf-8'))"
```

For the rest of this demo we will be using the standard test private key `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`.

First, install dependencies and build all packages:

```bash
yarn && yarn build
```

Next, create a new `.env.local` file in the `packages/gateway` directory, and add the previously generated private key to the `.env.local` file

```
PRIVATE_KEY=<MY_PRIVATE_KEY>
```

Next, run the gateway:

```bash
yarn start:gateway
```

You will see output similar to the following:

```
Serving on port 8000 with signing address 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

Next, edit `contracts/deploy/10_offchain_resolver.js`; replacing the address on line 4 with the one output when you ran the command above. Then, in a new terminal, build and run a test node with an ENS registry and the offchain resolver deployed:

```
cd packages/contracts
npx hardhat node
```

You will see output similar to the following:

```
Compilation finished successfully
deploying "ENSRegistry" (tx: 0x8b353610592763c0abd8b06305e9e82c1b14afeecac99b1ce1ee54f5271baa2c)...: deployed at 0x5FbDB2315678afecb367f032d93F642f64180aa3 with 1084532 gas
deploying "OffchainResolver" (tx: 0xdb3142c2c4d214b58378a5261859a7f104908a38b4b9911bb75f8f21aa28e896)...: deployed at 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 with 1533637 gas
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:9545/

Accounts
========

WARNING: These accounts, and their private keys, are publicly known.
Any funds sent to them on Mainnet or any other live network WILL BE LOST.

Account #0: 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

(truncated for brevity)
```

Take note of the address to which the L2Registry was deployed (0xe7f1...).

Open the `.env.local` file in the `packages/gateway` directory and add the address to the `REGISTRY_ADDRESS` variable.

```
REGISTRY_ADDRESS=<MY_L2_REGISTRY_ADDRESS>
```

In the first tab you opened, kill and restart the gateway server:

```bash
yarn start:gateway
```

Now, take note of the address to which the ENSRegistry was deployed (0x5FbDB...).

Finally, in a third terminal, run the example client to demonstrate resolving a name:

```
yarn start:client --registry 0x5FbDB2315678afecb367f032d93F642f64180aa3 qdqd.mydao.eth
```

You should see output similar to the following:

```
resolver address 0x8464135c8F25Da09e49BC8782676a84730C318bC
eth address 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

The address displayed in the output should match the address of the first account generated by hardhat when you run the command (`npx hardhat node`). This is because I use this account to take a the `qdqd.mydao.eth` node as you can see in the file `packages/contracts/deploy/10_offchain_resolver.js`.

If you try to resolve a mydao subdomain that does not exist yet, you should see the following output:

```
resolver address 0x8464135c8F25Da09e49BC8782676a84730C318bC
eth address null
```

This is because the script correctly find the custom mydao's resolver but the subdomain is free in the registry stored in the layer2.

If you try to resolve a non-mydao domain using the command above, you will see no outputs.

## Appendix

### Transaction flow

![l2-request-flow](./assets/l2-request-flow.png)

### Ressources

#### Improvement proposals

- [Nick Johnson](https://github.com/arachnid), "EIP-137: Ethereum Domain Name Service - Specification," Ethereum Improvement Proposals, no. 137, April 2016, [Link](https://eips.ethereum.org/EIPS/eip-137)
- [Nick Johnson](https://github.com/arachnid), "EIP-181: ENS support for reverse resolution of Ethereum addresses," Ethereum Improvement Proposals, no. 181, December 2016, [Link](https://eips.ethereum.org/EIPS/eip-181).
- [Richard Moore](https://github.com/ricmoo), "EIP-634: Storage of text records in ENS [DRAFT]," Ethereum Improvement Proposals, no. 634, May 2017, [Link](https://eips.ethereum.org/EIPS/eip-634)
- [Dean Eigenmann](https://github.com/arachnid), [Nick Johnson](https://github.com/arachnid), "EIP-1577: contenthash field for ENS," Ethereum Improvement Proposals, no. 1577, November 2018, [Link](https://eips.ethereum.org/EIPS/eip-1577)
- [Nick Johnson](https://github.com/arachnid), "EIP-2304: Multichain address resolution for ENS," Ethereum Improvement Proposals, no. 2304, September 2019, [Link](https://eips.ethereum.org/EIPS/eip-2304)
- [Nick Johnson](https://github.com/arachnid), "EIP-3668: CCIP Read: Secure offchain data retrieval," Ethereum Improvement Proposals, no. 3668, July 2020, [Link](https://eips.ethereum.org/EIPS/eip-3668)
- [Nick Johnson](https://github.com/arachnid), "EIP DRAFT: Storage of SECP256k1 public keys in ENS," Ethereum Improvement Proposals, [Link](https://github.com/Arachnid/EIPs/blob/56cce2377d4b1f38632315a6aa71ac980202f9cf/EIPS/eip-draft-ens-public-keys.md)
- [Nick Johnson](https://github.com/arachnid), [0age](https://github.com/0age), "ENSIP-10: Wildcard Resolution," ENS Improvement Proposals, no. 10, February 2022, [Link](https://docs.ens.domains/ens-improvement-proposals/ensip-10-wildcard-resolution)
- [Nick Johnson](https://github.com/arachnid), "EIP-1844: ENS Interface Discovery," Ethereum Improvement Proposals, no. 1844, March 2019. [Link](https://eips.ethereum.org/EIPS/eip-1844)
- [Dean Eigenmann](mailto:dean@ens.domains), [Nick Johnson](mailto:nick@ens.domains), "EIP-1577: contenthash field for ENS," Ethereum Improvement Proposals, no. 1577, November 2018. [Link](https://eips.ethereum.org/EIPS/eip-1577).

#### Documentation

- [ENS: Name Processing](https://docs.ens.domains/contract-api-reference/name-processing)
- [ENS: Registry](https://docs.ens.domains/contract-api-reference/ens)
- [ENS: ReverseRegistrar](https://docs.ens.domains/contract-api-reference/reverseregistrar)
- [ENS: PublicResolver](https://docs.ens.domains/contract-api-reference/publicresolver)
- [ENS: Permanent Registar](https://docs.ens.domains/contract-api-reference/.eth-permanent-registrar)
- [ENS: Layer2 and offchain data support](https://docs.ens.domains/dapp-developer-guide/ens-l2-offchain)
- [ENS as NFT](https://docs.ens.domains/dapp-developer-guide/ens-as-nft#metadata)
- [vbuterin: A general-purpose L2-friendly ENS standard](https://ethereum-magicians.org/t/a-general-purpose-l2-friendly-ens-standard/4591)

#### Others

- [ENS Contracts repository](https://github.com/ensdomains/ens-contracts)
- [General-Purpose Layer 2 Static-Calls Proposal Presentation by Vitalik Buterin at ENS Online Workshop 2020](https://www.youtube.com/watch?v=65z_j4n8mTk)
