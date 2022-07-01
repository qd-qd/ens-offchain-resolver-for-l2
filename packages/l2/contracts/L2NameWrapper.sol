// SPDX-License-Identifier: MIT
import "@ensdomains/ens-contracts/contracts/wrapper/NameWrapper.sol";

contract L2NameWrapper is NameWrapper {
    constructor(
        ENS _ens,
        BaseRegistrar _registrar,
        IMetadataService _metadataService
    ) NameWrapper(_ens, _registrar, _metadataService) {}
}
