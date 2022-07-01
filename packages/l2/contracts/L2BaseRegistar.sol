// SPDX-License-Identifier: MIT
import "@ensdomains/ens-contracts/contracts/ethregistrar/BaseRegistrarImplementation.sol";

contract L2BaseRegistar is BaseRegistrarImplementation {
    constructor(ENS _ens, bytes32 _baseNode)
        BaseRegistrarImplementation(_ens, _baseNode)
    {}
}
