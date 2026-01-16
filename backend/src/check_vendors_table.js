import pool from "./db.js";

async function checkTable() {
    try {
        const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'vendors';
    `);
        console.log("Columns in vendors table:");
        res.rows.forEach(row => console.log(`${row.column_name}: ${row.data_type}`));
    } catch (err) {
        console.error("Error checking table:", err);
    } finally {
        process.exit();
    }
}

checkTable();
