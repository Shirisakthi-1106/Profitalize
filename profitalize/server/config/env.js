import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from server/.env.development.local or server/.env.production.local
config({ path: path.resolve(__dirname, '..', `.env.${process.env.NODE_ENV || 'development'}.local`) });

// Set default for PORT if not defined
process.env.PORT = process.env.PORT || '3000';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PYTHON_PATH = process.env.PYTHON_PATH || path.join(__dirname, '..', '..', 'venv', process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python');

// Export environment variables
export const { PORT, DB_URI, NODE_ENV, PYTHON_PATH } = process.env;

// Log loaded variables for debugging
console.log('Loaded environment variables:', {
  PORT,
  DB_URI,
  NODE_ENV,
  PYTHON_PATH
});