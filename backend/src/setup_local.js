import pool from "./db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupLocalDb() {
    try {
        console.log("Reading schema.sql...");
        const schemaPath = path.join(__dirname, "schema.sql");
        const schemaSql = fs.readFileSync(schemaPath, "utf8");

        console.log("Executing schema...");
        await pool.query(schemaSql);

        console.log("✅ Local database set up successfully! Tables created.");
    } catch (err) {
        console.error("❌ Setup failed:", err);
    } finally {
        // Close the pool
        await pool.end();
    }
}

setupLocalDb();
