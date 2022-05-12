# ENS Offchain Resolver Gateway
This package implements a CCIP-read gateway server for ENS offchain resolution. that fetch records from a registry stored on-chain (same network, side-chain, L2...).

## Usage:
You can run the gateway as a command line tool; it reads the data to serve from a registry stored on-chain

```
yarn && yarn build
yarn start:gateway
```
