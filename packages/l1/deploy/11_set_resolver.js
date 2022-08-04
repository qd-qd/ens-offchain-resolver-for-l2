const { ethers } = require("hardhat");

module.exports = async () => {
  const signers = await ethers.getSigners();
  const owner = signers[0].address;

  const [registry, resolver] = await Promise.all([
    ethers.getContract("ENSRegistry"),
    ethers.getContract("OffchainResolver"),
  ]);

  // create the root node
  await registry.setSubnodeOwner(
    "0x0000000000000000000000000000000000000000000000000000000000000000",
    ethers.utils.id("eth"),
    owner,
    { from: owner }
  );

  // register mydao.eth domain
  await registry.setSubnodeOwner(
    ethers.utils.namehash("eth"),
    ethers.utils.id("mydao"),
    owner,
    { from: owner }
  );

  // set the offchain resolver to mydao.eth
  await registry.setResolver(
    ethers.utils.namehash("mydao.eth"),
    resolver.address,
    { from: owner }
  );
};

module.exports.tags = ["test"];
