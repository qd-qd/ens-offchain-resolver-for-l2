# ENS offchain Resolver Gateway

The gateway server implements the CCIP Read ([EIP 3668](https://eips.ethereum.org/EIPS/eip-3668)) and responds to requests by searching for names stored on-chain. Once a record is retrieved, it is signed using a predefined key to ensure its validity, and the record and signature are returned to the caller so that they can be provided to the requesting contract, hosted on the mainnet.

It's a simple nodejs server bootstrapped using [`@chainlink/ccip-read-server`](https://www.npmjs.com/package/@chainlink/ethers-ccip-read-provider). This library adds transparent support for EIP 3668.

## Notice

Please refer to the [.env.example](/packages/gateway/.env.example) file to know which environment variables are required.

## Usage

Make sure dependencies have been previously installed and the package has been built. As this repository uses yarn workspace, you can run these commands from the root of the repository.

```shell
yarn && yarn build
```

Then, start the package

```shell
# From the root of the repository
yarn start:gateway

# From the root of the package
yarn start
```
