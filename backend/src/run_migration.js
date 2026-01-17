import pool from "./db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
    const migrationFile = process.argv[2] || "update_offers_table.sql";
    try {
        const migrationPath = path.join(__dirname, "migrations", migrationFile);
        if (!fs.existsSync(migrationPath)) {
            console.error(`Migration file not found: ${migrationPath}`);
            process.exit(1);
        }
        const migrationSql = fs.readFileSync(migrationPath, "utf8");

        console.log(`Running migration: ${migrationFile}...`);
        await pool.query(migrationSql);
        console.log("Migration completed successfully!");

    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        process.exit();
    }
}

runMigration();
