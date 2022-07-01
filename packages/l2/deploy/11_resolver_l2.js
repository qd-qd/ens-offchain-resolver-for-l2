const { ethers } = require("hardhat");
const { formatsByCoinType } = require("@ensdomains/address-encoder");

/*
 ** This script set additional informations for the qdqd.eth node.
 ** A name, a BITCOIN address, a COSMOS address, and a Twitter profile is set.
 */
module.exports = async () => {
  const l2PublicResolver = await ethers.getContract("L2PublicResolver");
  const node = ethers.utils.namehash("qdqd.eth");

  await Promise.all([
    // Set custom name
    l2PublicResolver.setName(node, "john"),
    // Set BITCOIN address
    l2PublicResolver["setAddr(bytes32,uint256,bytes)"](
      node,
      0,
      formatsByCoinType[0].decoder("bc1q8fnmuy9cfzmym062a93cuqh2l8l0p46gxy74pg")
    ),
    // Set COSMOS address
    l2PublicResolver["setAddr(bytes32,uint256,bytes)"](
      node,
      118,
      formatsByCoinType[118].decoder(
        "cosmos1g6n59apjxwk0lpah9aax6sfszsht7ycfnsg7cv"
      )
    ),
    // Set twitter profile
    l2PublicResolver.setText(
      node,
      "com.twitter",
      "https://twitter.com/qdqd___"
    ),
  ]);
};

module.exports.tags = ["deploy-resolver-l2"];
