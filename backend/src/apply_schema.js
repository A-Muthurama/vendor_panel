
import pool from "./db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function applySchema() {
    try {
        const schemaPath = path.join(__dirname, "schema.sql");
        console.log(`Reading schema from: ${schemaPath}`);

        const schemaSql = fs.readFileSync(schemaPath, "utf8");

        console.log("Applying schema...");
        await pool.query(schemaSql);

        console.log("Schema applied successfully!");
    } catch (err) {
        console.error("Error applying schema:", err);
    } finally {
        await pool.end();
    }
}

applySchema();
