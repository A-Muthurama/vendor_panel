import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Explicitly load .env from this directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, ".env") });

import pool from "./src/db.js";

async function alterTable() {
  try {
    console.log("Connecting to DB:", process.env.DATABASE_URL?.slice(0, 40) + "...");
    await pool.query("ALTER TABLE vendors ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'India'");
    console.log("✅ Success: country column added to vendors table (existing rows default to India)");
  } catch (err) {
    if (err.message?.includes("already exists")) {
      console.log("✅ country column already exists — no action needed.");
    } else {
      console.error("❌ Error altering table:", err.message);
    }
  } finally {
    await pool.end();
  }
}

alterTable();
