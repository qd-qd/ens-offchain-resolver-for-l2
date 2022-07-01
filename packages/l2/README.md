# ENS Offchain Resolver L2 Contracts

This package contains Solidity contracts you can customise and deploy on any EVM-compatible L2. 

Contracts mimics the registry/resolver logic used by ENS on the mainnet. They can be deployed on any EVM compatible networks in order to move the subdomain management logic to a less expensive layer.

## Contracts

### [L2PublicResolver.sol](contracts/L2PublicResolver.sol)
This contract is a resolver users can attach to their 

### [L2Registry.sol](contracts/L2Registry.sol)
This contract is a basic registry. Resolvers are responsible for performing resource lookups for a name.
