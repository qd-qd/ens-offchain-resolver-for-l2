// SPDX-License-Identifier: MIT
import "@ensdomains/ens-contracts/contracts/resolvers/profiles/NameResolver.sol";
import "@ensdomains/ens-contracts/contracts/registry/ENS.sol";

// TODO: Use more interesting public resolver
contract L2PublicResolver {
    mapping(bytes32 => string) names;
    event NameChanged(bytes32 indexed node, string name);

    /**
     * Sets the name associated with an ENS node, for reverse records.
     * May only be called by the owner of that node in the ENS registry.
     * @param node The node to update.
     */
    function setName(bytes32 node, string calldata newName) external {
        names[node] = newName;
        emit NameChanged(node, newName);
    }

    /**
     * Returns the name associated with an ENS node, for reverse records.
     * Defined in EIP181.
     * @param node The ENS node to query.
     * @return The associated name.
     */
    function name(bytes32 node) external view virtual returns (string memory) {
        return names[node];
    }
}
