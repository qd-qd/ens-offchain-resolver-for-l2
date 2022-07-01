const { ethers } = require("hardhat");

/*
** This script set the root node, set the qdqd.eth node 
** and set the public resolver to the freshly created node
*/
module.exports = async () => {
  const [, signers] = await Promise.all([
    getNamedAccounts(),
    ethers.getSigners(),
  ]);
  const owner = signers[0].address;

  const [l2Registry, l2PublicResolver] = await Promise.all([
    ethers.getContract("L2Registry"),
    ethers.getContract("L2PublicResolver"),
  ]);

  // create the root node
  await l2Registry.setSubnodeOwner(
    "0x0000000000000000000000000000000000000000000000000000000000000000",
    ethers.utils.id("eth"),
    owner,
    { from: owner }
  );

  // create the qdqd.eth domain
  await l2Registry.setSubnodeOwner(
    ethers.utils.namehash("eth"),
    ethers.utils.id("qdqd"),
    owner,
    { from: owner }
  );

  // set the custom resolver
  await l2Registry.setResolver(
    ethers.utils.namehash("qdqd.eth"),
    l2PublicResolver.address,
    { from: owner }
  );
};

module.exports.tags = ["deploy-setup-l2"];
