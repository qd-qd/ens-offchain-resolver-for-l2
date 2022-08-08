const { ethers } = require("hardhat");
const { formatsByCoinType } = require("@ensdomains/address-encoder");
const contentHash = require("content-hash");

/*
 ** This script set additional informations for the myname.eth node
 */
module.exports = async ({ deployments }) => {
  const [, owner] = await ethers.getSigners();
  const node = ethers.utils.namehash("myname.eth");

  // TODO: shouldn't this be managed automatically on-chain during the registration step?
  // Set ETH address
  await deployments.execute(
    "L2PublicResolver",
    { from: owner.address },
    "setAddr(bytes32,uint256,bytes)",
    node,
    60,
    formatsByCoinType[60].decoder(owner.address)
  );

  // Set BITCOIN address
  await deployments.execute(
    "L2PublicResolver",
    { from: owner.address },
    "setAddr(bytes32,uint256,bytes)",
    node,
    0,
    formatsByCoinType[0].decoder("bc1q8fnmuy9cfzmym062a93cuqh2l8l0p46gxy74pg")
  );

  // Set COSMOS address
  await deployments.execute(
    "L2PublicResolver",
    { from: owner.address },
    "setAddr(bytes32,uint256,bytes)",
    node,
    118,
    formatsByCoinType[118].decoder(
      "cosmos14n3tx8s5ftzhlxvq0w5962v60vd82h30sythlz"
    )
  );

  // Set DOGE address
  await deployments.execute(
    "L2PublicResolver",
    { from: owner.address },
    "setAddr(bytes32,uint256,bytes)",
    node,
    3,
    formatsByCoinType[3].decoder("DBs4WcRE7eysKwRxHNX88XZVCQ9M6QSUSz")
  );

  // set texts
  const texts = [
    ["avatar", "https://metadata.ens.domains/mainnet/avatar/qdqdqd.eth?v=1.0"],
    ["com.twitter", "qdqd___"],
    ["com.github", "qd-qd"],
    ["org.telegram", "qd_qd_qd"],
    ["email", "qdqdqdqdqd@protonmail.com"],
    ["url", "https://ens.domains/"],
    ["description", "smart-contract engineer"],
    ["notice", "This is a custom notice"],
    ["keywords", "solidity,ethereum,developer"],
    ["company", "ledger"],
  ];
  for (const [key, value] of texts) {
    await deployments.execute(
      "L2PublicResolver",
      { from: owner.address },
      "setText",
      node,
      key,
      value
    );
  }

  // Set a public key
  await deployments.execute(
    "L2PublicResolver",
    { from: owner.address },
    "setPubkey",
    node,
    "0x934ddbf47f355fd7569b46dbeb8255e06c207b17a54e13fec5e201ac2ddf5ae4",
    "0x671d4ed12be38d21744044337db1d46be093bd1e0aa1d57d5ac24c956235a757"
  );

  // Set content hash: ipfs://QmdTPkMMBWQvL8t7yXogo7jq5pAcWg8J7RkLrDsWZHT82y
  await deployments.execute(
    "L2PublicResolver",
    { from: owner.address },
    "setContenthash",
    node,
    `0x${contentHash.fromIpfs(
      "QmdTPkMMBWQvL8t7yXogo7jq5pAcWg8J7RkLrDsWZHT82y"
    )}`
  );

  // Set canonical name
  await deployments.execute(
    "L2PublicResolver",
    { from: owner.address },
    "setName",
    node,
    `${owner.address.toLowerCase()}.addr.reverse`
  );
};

module.exports.tags = ["deploy-resolver-l2"];
