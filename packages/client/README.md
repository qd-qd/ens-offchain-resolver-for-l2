# ENS offchain resolution client

This package implements a very simple dig-like tool for querying ENS names, with support for offchain resolution. It is intended as a way to test out your code and run the demo, rather than a production-quality tool.

## Notice

Please refer to the [.env.example](/packages/client/.env.example) file to know which environment variables are required.
For the demo, the second-level domain `mydao.eth` is stored and configured on the mainnet and one subdomain of this domain `qdqd` is stored on the layer2. That means you need to request `qdqd.mydao.eth` to see the demo run properly.

## Usage

Make sure dependencies have been previously installed and the package has been built. As this repository uses yarn workspace, you can run these commands from the root of the repository.

```shell
yarn && yarn build
```

Then, start the package

```shell
# From the root of the repository
yarn start:client qdqd.mydao.eth

# From the root of the package
yarn start qdqd.mydao.eth
```

> the `--provider` flag can optionally be specified to supply the URL to an Ethereum web3 provider; it defaults to `http://localhost:8001/`.
