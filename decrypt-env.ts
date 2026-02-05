import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

const algorithm = 'aes-256-cbc';
const secret = 'myPoCSecretKey'; // Same key used for encryption
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
  line = line.trim();
  // Ignore empty lines and comments
  if (!line || line.startsWith('#')) return;

  const index = line.indexOf('=');
  if (index === -1) return; // Skip malformed lines

  const k = line.slice(0, index).trim();
  const v = line.slice(index + 1).trim();

  process.env[k] = v;
});

console.log('Env vars loaded into process.env ✅');

// Optional: debug check (remove in real runs)
// console.log(process.env.DB_HOST, process.env.DB_USER);
