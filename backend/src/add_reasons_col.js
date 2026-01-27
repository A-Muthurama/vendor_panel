
import pool from "./db.js";

async function addReasonsColumn() {
    try {
        console.log("Adding 'reasons' column to vendors...");
        await pool.query("ALTER TABLE vendors ADD COLUMN IF NOT EXISTS reasons TEXT");
        console.log("Column 'reasons' added successfully.");
    } catch (err) {
        console.error("Error adding column:", err);
    } finally {
        await pool.end();
    }
}

addReasonsColumn();
