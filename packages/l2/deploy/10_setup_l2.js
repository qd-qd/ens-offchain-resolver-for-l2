const { ethers } = require("hardhat");

/*
 ** This script set the root node, set the myname.eth node
 ** and set the public resolver to the freshly created node
 */
module.exports = async () => {
  const [admin, owner] = await ethers.getSigners();
  const l2PublicResolver = await ethers.getContract("L2PublicResolver");

  // create the root node
  await deployments.execute(
    "L2Registry",
    { from: admin.address },
    "setSubnodeOwner",
    "0x0000000000000000000000000000000000000000000000000000000000000000",
    ethers.utils.id("eth"),
    admin.address
  );

  // register myname.eth domain
  await deployments.execute(
    "L2Registry",
    { from: admin.address },
    "setSubnodeOwner",
    ethers.utils.namehash("eth"),
    ethers.utils.id("myname"),
    owner.address
  );

  // set the custom resolver
  await deployments.execute(
    "L2Registry",
    { from: owner.address },
    "setResolver",
    ethers.utils.namehash("myname.eth"),
    l2PublicResolver.address
  );

  // log the address of the owner of the ENS
  // this address must match the address output when you run `yarn start:client myname.mydao.eth`
  console.log(
    "\n\n\x1b[34m\x1b[1m",
    `Owner of the ENS address -> ${owner.address}`,
    "\x1b[0m\n\n"
  );
};

module.exports.tags = ["deploy-setup-l2"];
