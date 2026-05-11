import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const dbUrl = process.env.DATABASE_URL || "";
const isLocal = !dbUrl || dbUrl.includes("localhost") || dbUrl.includes("127.0.0.1");

const pool = new Pool({
  connectionString: dbUrl || undefined,
  ssl: isLocal ? false : { rejectUnauthorized: false }
});

export default pool;
