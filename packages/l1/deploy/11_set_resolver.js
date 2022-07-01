const { ethers } = require("hardhat");

module.exports = async ({ deployments }) => {
  const { deploy } = deployments;
  const signers = await ethers.getSigners();
  const owner = signers[0].address;

  const [registry, resolver] = await Promise.all([
    ethers.getContract("ENSRegistry"),
    ethers.getContract("OffchainResolver"),
  ]);

  await registry.setSubnodeOwner(
    "0x0000000000000000000000000000000000000000000000000000000000000000",
    ethers.utils.id("eth"),
    owner,
    { from: owner }
  );
  await registry.setSubnodeOwner(
    ethers.utils.namehash("eth"),
    ethers.utils.id("mydao"),
    owner,
    { from: owner }
  );
  await registry.setResolver(
    ethers.utils.namehash("mydao.eth"),
    resolver.address,
    { from: owner }
  );
};

module.exports.tags = ["test"];
