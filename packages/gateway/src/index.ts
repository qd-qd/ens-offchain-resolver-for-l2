import { makeApp } from './server';
import { readFileSync } from 'fs';
import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const PORT = process.env.PORT || '8080';

let privateKey: string | Uint8Array | undefined = process.env.PRIVATE_KEY;
if (privateKey === undefined) throw new Error('no private key');

if (privateKey.startsWith('@')) {
  privateKey = ethers.utils.arrayify(
    readFileSync(privateKey.slice(1), { encoding: 'utf-8' })
  );
}

const address = ethers.utils.computeAddress(privateKey);
const signer = new ethers.utils.SigningKey(privateKey);
const app = makeApp(signer, '/');

console.log(`Serving on port ${PORT}`);

// log the address of the signer EOA
// this address must be copied to the .env file of the l1 package (SIGNER)
console.log(
  "\n\n\x1b[34m\x1b[1m",
  `Signer address -> ${address}`,
  "\x1b[0m\n\n"
);

app.listen(parseInt(PORT));

module.exports = app;
