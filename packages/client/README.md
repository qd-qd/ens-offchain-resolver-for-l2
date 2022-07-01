# ENS offchain resolution client
This package implements a very simple dig-like tool for querying ENS names, with support for offchain resolution. It is intended as a way to test out your code and run the demo, rather than a production-quality tool.

## Usage:
```
yarn start:client qdqd.ledger.eth
```

`--provider` can optionally be specified to supply the URL to an Ethereum web3 provider; it defaults to `http://localhost:8001/`.
