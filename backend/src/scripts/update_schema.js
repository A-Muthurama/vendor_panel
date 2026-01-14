import pool from "../db.js";

const updateSchema = async () => {
    const client = await pool.connect();
    try {
        console.log("Starting schema update...");

        // queries to add columns if they don't exist
        const queries = [
            `ALTER TABLE vendors ADD COLUMN IF NOT EXISTS state VARCHAR(100);`,
            `ALTER TABLE vendors ADD COLUMN IF NOT EXISTS city VARCHAR(100);`,
            `ALTER TABLE vendors ADD COLUMN IF NOT EXISTS pincode VARCHAR(20);`,
            `ALTER TABLE vendors ADD COLUMN IF NOT EXISTS address TEXT;`
        ];

        for (const query of queries) {
            await client.query(query);
            console.log(`Executed: ${query}`);
        }

        console.log("Schema update complete.");
    } catch (err) {
        console.error("Schema update failed:", err);
    } finally {
        client.release();
        pool.end(); // Close pool to exit script
    }
};

updateSchema();
