# ENS offchain resolution client
This package implements a very simple dig-like tool for querying ENS names, with support for offchain resolution. It is intended as a way to test out your code and run the demo, rather than a production-quality tool.

## Usage:
```
yarn start:client --registry 0x5FbDB2315678afecb367f032d93F642f64180aa3 qdqd.ledger.eth
```

`--registry` is the address of the ENS registry. If you are running this on mainnet, this will be `0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e`.

`--provider` can optionally be specified to supply the URL to an Ethereum web3 provider; it defaults to `http://localhost:8545/`.
