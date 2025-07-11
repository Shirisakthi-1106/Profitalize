// import { config } from "dotenv";

// // load .env.development.local
// config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

// export const { PORT, DB_URI, NODE_ENV } = process.env;

import { config } from 'dotenv'; // Use dotenv or dotenvx

// Load environment variables from server/.env.development.local or server/.env.production.local
config({ path: `server/.env.${process.env.NODE_ENV || 'development'}.local` });

export const { PORT, DB_URI, NODE_ENV } = process.env;

// Log loaded variables for debugging
console.log('Loaded environment variables:', { PORT, NODE_ENV });