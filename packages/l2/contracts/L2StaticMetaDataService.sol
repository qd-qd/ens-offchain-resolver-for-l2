// SPDX-License-Identifier: MIT
import "@ensdomains/ens-contracts/contracts/wrapper/StaticMetadataService.sol";

contract L2StaticMetadataService is StaticMetadataService {
    constructor(string memory _metaDataUri)
        StaticMetadataService(_metaDataUri)
    {}
}
