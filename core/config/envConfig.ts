import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Load environment configuration based on ENVIRONMENT variable
 * Usage: NODE_ENV=dev, NODE_ENV=systest, NODE_ENV=staging, etc.
 * Defaults to 'systest' if not specified
 */
export function loadEnvironment() {
  const env = process.env.ENVIRONMENT || 'systest';
  
  const envFile = path.resolve(__dirname, `../.env.${env}`);
  
  console.log(`Loading environment: ${env} from ${envFile}`);
  
  dotenv.config({ path: envFile });
  
  if (!process.env.UI_BASE_URL) {
    throw new Error(`Failed to load environment config. Make sure .env.${env} exists`);
  }
  
  return {
    environment: env,
    apiBaseUrl: process.env.API_BASE_URL,
    uiBaseUrl: process.env.UI_BASE_URL,
    dbHost: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    sysAdminPassword: process.env.SYS_ADMIN_PASSWORD,
    areaAdminPassword: process.env.AREA_ADMIN_PASSWORD,
  };
}

// Load on module import
const config = loadEnvironment();
export default config;
