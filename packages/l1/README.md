# ENS Offchain Resolver L1 Contracts

This package contains Solidity contracts you can customise and deploy to provide offchain resolution of ENS names.

These contracts implement [ENSIP 10](https://docs.ens.domains/ens-improvement-proposals/ensip-10-wildcard-resolution) (wildcard resolution support) and [EIP 3668](https://eips.ethereum.org/EIPS/eip-3668) (CCIP Read). Together this means that the resolver contract can be very straightforward; it simply needs to respond to all resolution requests with a redirect to your gateway, and verify gateway responses by checking the signature on the returned message.

## Contracts

### [IExtendedResolver.sol](contracts/IExtendedResolver.sol)

This is the interface for wildcard resolution specified in ENSIP 10. In time this will likely be moved to the [@ensdomains/ens-contracts](https://github.com/ensdomains/ens-contracts) repository.

### [SignatureVerifier.sol](contracts/SignatureVerifier.sol)

This library facilitates checking signatures over CCIP read responses.

### [OffchainResolver.sol](contracts/OffchainResolver.sol)

This contract implements the offchain resolution system. Set this contract as the resolver for a name, and that name and all its subdomains that are not present in the ENS registry will be resolved via the provided gateway by supported clients.

## Deployments

There are three deployment scripts automatically run when you start the package.

- [00_ens](deploy/00_ens.js) - Deploy a ENS registry. In production, this step must be omitted as you wanna use the official ENS registry
- [10_offchain_resolver](deploy/10_offchain_resolver.js) - Deploy the ENSIP10/EIP3668 compliant offchain resolver that would be attached to our second-level ENS.
- [11_set_resolver](deploy/11_set_resolver.js) - Set the offchain resolver to our ENS. In production, much of this script must be omitted because you don't need to set the root node and your ENS will probably already be registered

## Notice

Please refer to the [.env.example](/packages/l1/.env.example) file to know which environment variables are required.

## Usage

Make sure dependencies have been previously installed and the package has been built. As this repository uses yarn workspace, you can run these commands from the root of the repository.

```shell
yarn && yarn build
```

Then, start the package

```shell
# From the root of the repository
yarn start:l1

# From the root of the package
yarn start
```
