const { ethers } = require("hardhat");

const data = {
  "test.eth": {
    addresses: {
      60: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
    },
    text: { email: "test@example.com" },
  },
  "*.test.eth": {
    addresses: {
      60: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
    },
    text: { email: "wildcard@example.com" },
  },
};

module.exports = async ({ deployments }) => {
  const { deploy } = deployments;
  const [{ deployer }, signers] = await Promise.all([
    getNamedAccounts(),
    ethers.getSigners(),
  ]);
  const owner = signers[0].address;

  const [l2Registry, l2PublicResolver] = await Promise.all([
    ethers.getContract("L2Registry"),
    ethers.getContract("L2PublicResolver"),
  ]);

  // create the eth domain
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

  // set a custom name
  await l2PublicResolver.setName(ethers.utils.namehash("qdqd.eth"), "john");
};

module.exports.tags = ["test"];
