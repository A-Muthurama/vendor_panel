import pool from '../db.js';

const patchDb = async () => {
    try {
        await pool.query(`
      ALTER TABLE vendors 
      ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
    `);
        console.log("Successfully added rejection_reason column.");
    } catch (err) {
        console.error("Error patching DB:", err);
    } finally {
        pool.end();
    }
};

patchDb();
