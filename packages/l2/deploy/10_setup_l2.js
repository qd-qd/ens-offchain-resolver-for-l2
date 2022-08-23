const { ethers } = require("hardhat");

/*
 ** This script set the root node, set the myname.eth node
 ** and set the public resolver to the freshly created node
 */
module.exports = async () => {
  const [admin, owner] = await ethers.getSigners();
  const publicResolver = await ethers.getContract("PublicResolver");

  // create the root node
  await deployments.execute(
    "ENSRegistry",
    { from: admin.address },
    "setSubnodeOwner",
    "0x0000000000000000000000000000000000000000000000000000000000000000",
    ethers.utils.id("eth"),
    admin.address
  );

  // register mydao.eth domain
  await deployments.execute(
    "ENSRegistry",
    { from: admin.address },
    "setSubnodeOwner",
    ethers.utils.namehash("eth"),
    ethers.utils.id("mydao"),
    admin.address
  );

  // register myname.mydao.eth domain
  await deployments.execute(
    "ENSRegistry",
    { from: admin.address },
    "setSubnodeOwner",
    ethers.utils.namehash("mydao.eth"),
    ethers.utils.id("myname"),
    owner.address
  );

  // set the custom resolver
  await deployments.execute(
    "ENSRegistry",
    { from: owner.address },
    "setResolver",
    ethers.utils.namehash("myname.mydao.eth"),
    publicResolver.address
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
