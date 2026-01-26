
import pool from "./db.js";

async function checkOffers() {
    try {
        const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'offers';
    `);
        console.log("Columns in offers table:");
        res.rows.forEach(row => console.log(`${row.column_name}: ${row.data_type}`));
    } catch (err) {
        console.error("Error checking table:", err);
    } finally {
        process.exit();
    }
}

checkOffers();
