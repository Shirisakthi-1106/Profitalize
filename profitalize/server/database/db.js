import { neon } from "@neondatabase/serverless";
import { DB_URI, NODE_ENV } from "../config/env.js";

if (!DB_URI) {
  throw new Error(
    "Please define the DATABASE_URL environment variable inside .env.development.local or .env.production.local"
  );
}

const sql = neon(DB_URI);

const connectToDatabase = async () => {
  try {
    const result = await sql`SELECT version()`;
    console.log(`Connected to Neon Postgres in ${NODE_ENV} mode: ${result[0].version}`);
    return sql; // Return the neon client for querying
  } catch (error) {
    console.error("Error connecting to Neon Postgres:", error);
    process.exit(1); // Exit with failure
  }
};

export { sql };
export default connectToDatabase;