import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

const algorithm = 'aes-256-cbc';
const secret = 'myPoCSecretKey'; // Same as encryption
const key = crypto.scryptSync(secret, 'salt', 32);

const envEncPath = path.resolve(__dirname, '.env.enc');

// Read encrypted file
const payload = fs.readFileSync(envEncPath, 'utf8');
const [ivHex, encrypted] = payload.split(':');
const iv = Buffer.from(ivHex, 'hex');

// Decrypt
const decipher = crypto.createDecipheriv(algorithm, key, iv);
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');

// Load into process.env
decrypted.split('\n').forEach(line => {
  const [k, v] = line.split('=');
  if (k && v) process.env[k] = v;
});

console.log('Env vars loaded into process.env ✅');
