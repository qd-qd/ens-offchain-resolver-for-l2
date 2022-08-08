# ENS Offchain Resolver L2 Contracts

This package contains Solidity contracts you can customise and deploy on any EVM-compatible networks. These contracts manage all the logic related to the subdomains (registration, renew, transfer...).

## Contracts

### [L2PublicResolver.sol](contracts/L2PublicResolver.sol)

This contract is a resolver subdomains owners can use to store arbitrary linked to their ENS.

### [L2Registry.sol](contracts/L2Registry.sol)

This contract is the registry where subdomain would be stored.

### [L2BaseRegistar.sol](contracts/L2BaseRegistar.sol)

This contract extends the ENS BaseRegistar contract. It controls how subdomains are registered/renewed.

### [L2NameWrapper.sol](contracts/L2NameWrapper.sol)

This contract extends the ENS NameWrapper contract. It is a smart contract that wraps existing ENS name, providing several new features:

- Wrapped names are ERC1155 tokens
- Better permission control over wrapped names
- Consistent API for names at any level of the hierarchy

## Deployments

There are three deployment scripts automatically run when you start the package.

- [00_deploy_l2](deploy/00_deploy_l2.js) - Deploy the contracts listed above
- [10_setup_l2](deploy/10_setup_l2.js) - Create the root node, register the `myname` subdomain and attach the `PublicResolver` to it
- [11_resolver_l2](deploy/11_resolver_l2.js) - Save a bunch of data to the subdomain previously registered

## Notice

Please refer to the [.env.example](/packages/l2/.env.example) file to know which environment variables are required.

## Usage

Make sure dependencies have been previously installed and the package has been built. As this repository uses yarn workspace, you can run these commands from the root of the repository.

```shell
yarn && yarn build
```

Then, start the package

```shell
# From the root of the repository
yarn start:l2

# From the root of the package
yarn start
```
