# ENS Offchain Resolver L2 Contracts

This package contains Solidity contracts imported from the ENS library. You can extend them and deploy them on any EVM-compatible networks. These contracts manage all the logic related to the subdomains (registration, renew, transfer...).

## Contracts

### [PublicResolver.sol](contracts/PublicResolver.sol)

This contract is a resolver subdomains owners can use to store arbitrary linked to their ENS. This contract is imported in the `imports.sol` file.

### [Registry.sol](contracts/Registry.sol)

This contract is the registry where subdomain would be stored. This contract is imported in the `imports.sol` file.

### [BaseRegistar.sol](contracts/BaseRegistar.sol)

This contract extends the ENS BaseRegistar contract. It controls how subdomains are registered/renewed. This contract is imported in the `imports.sol` file.

### [NameWrapper.sol](contracts/NameWrapper.sol)

This contract extends the ENS NameWrapper contract. It is a smart contract that wraps existing ENS name, providing several new features:

- Wrapped names are ERC1155 tokens
- Better permission control over wrapped names
- Consistent API for names at any level of the hierarchy

This contract is imported in the `NameWrapper.sol` file. Once the circular import fixed in the ENS library, this contract would be move to the `imports.sol` file.

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
