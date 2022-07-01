// SPDX-License-Identifier: MIT
import "@ensdomains/ens-contracts/contracts/resolvers/PublicResolver.sol";

contract L2PublicResolver is PublicResolver {
    constructor(ENS _ens, INameWrapper wrapperAddress)
        PublicResolver(_ens, wrapperAddress)
    {}
}
