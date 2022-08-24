import { Command } from 'commander';
import ethers from 'ethers';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const program = new Command();
program
  .option('-p --provider <url>', 'web3 provider URL', 'http://localhost:8001/')
  .option('-i --chainId <chainId>', 'chainId', '11111')
  .option('-n --chainName <name>', 'chainName', 'layer1')
  .argument('<name>');

program.parse(process.argv);
const options = program.opts();
const ensAddress = process.env.REGISTRY_ADDRESS;
const chainId = parseInt(options.chainId);
const chainName = options.chainName;
const provider = new ethers.providers.JsonRpcProvider(options.provider, {
  chainId,
  name: chainName,
  ensAddress,
});

(async () => {
  const [name] = program.args;

  // Check if a resolver is set for this node on the L1
  const resolver = await provider.getResolver(name);
  console.log(`l1 offchain resolver address: ${resolver?.address}`);
  if (!resolver?.address) return;

  // Check if the subdomain has been registered on the L2
  let resolveName: null | string;
  try {
    resolveName = await provider.resolveName(name);
  } catch {
    console.log("the subdomain doesn't exist on the layer2");
    return;
  }
  console.log(`eth address: ${resolveName}`);

  // Fetch data from the resolver stored on the L2
  const [ethAddress, btcAddress, dogeAddress, contentHash] = await Promise.all([
    resolver.getAddress(), // ETH
    resolver.getAddress(0), // BTC
    resolver.getAddress(3), // DOGE
    resolver.getContentHash(),
  ]);

  // fetch text records
  const [
    avatar,
    twitter,
    github,
    telegram,
    email,
    url,
    description,
    notice,
    keywords,
    company,
  ] = await Promise.all([
    resolver.getText('avatar'),
    resolver.getText('com.twitter'),
    resolver.getText('com.github'),
    resolver.getText('org.telegram'),
    resolver.getText('email'),
    resolver.getText('url'),
    resolver.getText('description'),
    resolver.getText('notice'),
    resolver.getText('keywords'),
    resolver.getText('company'),
  ]);

  console.group('\n-> Data fetched from the layer2 resolver');
  console.log(`eth address: ${ethAddress}`);
  console.log(`btc address: ${btcAddress}`);
  console.log(`doge address: ${dogeAddress}`);
  console.log(`content hash: ${contentHash}`);
  console.log(`avatar: ${avatar}`);
  console.log(`twitter: ${twitter}`);
  console.log(`github: ${github}`);
  console.log(`telegram: ${telegram}`);
  console.log(`email: ${email}`);
  console.log(`url: ${url}`);
  console.log(`description: ${description}`);
  console.log(`notice: ${notice}`);
  console.log(`keywords: ${keywords}`);
  console.log(`company: ${company}`);
  console.groupEnd();
})();
