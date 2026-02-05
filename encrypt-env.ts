import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

const algorithm = 'aes-256-cbc';
const secret = 'myPoCSecretKey'; // PoC key
const key = crypto.scryptSync(secret, 'salt', 32); // 32 bytes key
const iv = crypto.randomBytes(16); // Initialization vector

const envPath = path.resolve(__dirname, '.env');
const envEncPath = path.resolve(__dirname, '.env.enc');

// Read .env
const envData = fs.readFileSync(envPath, 'utf8');

// Encrypt
const cipher = crypto.createCipheriv(algorithm, key, iv);
let encrypted = cipher.update(envData, 'utf8', 'hex');
encrypted += cipher.final('hex');

// Save iv + encrypted data
const payload = iv.toString('hex') + ':' + encrypted;
fs.writeFileSync(envEncPath, payload);

console.log('.env encrypted to .env.enc ✅');
