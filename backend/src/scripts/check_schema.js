import pool from "../db.js";

const checkSchema = async () => {
    const client = await pool.connect();
    try {
        console.log("Checking schema for table 'vendors'...");
        const res = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'vendors';
    `);
        console.log("Columns found:", res.rows.map(r => r.column_name).join(", "));
    } catch (err) {
        console.error("Schema check failed:", err);
    } finally {
        client.release();
        pool.end();
    }
};

checkSchema();
