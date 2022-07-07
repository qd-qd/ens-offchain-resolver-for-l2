const { ethers } = require("hardhat");

/*
 ** This script set the root node, set the qdqd.eth node
 ** and set the public resolver to the freshly created node
 */
module.exports = async () => {
  const [admin, owner] = await ethers.getSigners();
  const l2PublicResolver = await ethers.getContract("L2PublicResolver");

  // create the root node
  await deployments.execute(
    "L2Registry",
    { from: admin.address, log: true },
    "setSubnodeOwner",
    "0x0000000000000000000000000000000000000000000000000000000000000000",
    ethers.utils.id("eth"),
    admin.address
  );

  // create the qdqd.eth domain
  await deployments.execute(
    "L2Registry",
    { from: admin.address, log: true },
    "setSubnodeOwner",
    ethers.utils.namehash("eth"),
    ethers.utils.id("qdqd"),
    owner.address
  );

  // set the custom resolver
  await deployments.execute(
    "L2Registry",
    { from: owner.address, log: true },
    "setResolver",
    ethers.utils.namehash("qdqd.eth"),
    l2PublicResolver.address
  );
};

module.exports.tags = ["deploy-setup-l2"];
