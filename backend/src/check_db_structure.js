import pool from "./db.js";

async function checkOffers() {
    try {
        // 1. Check if table exists
        const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'offers'
      );
    `);
        console.log("Offers table exists:", tableCheck.rows[0].exists);

        if (tableCheck.rows[0].exists) {
            // 2. Check column structure
            const columns = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'offers';
      `);
            console.log("Columns in offers table:");
            columns.rows.forEach(c => console.log(` - ${c.column_name}: ${c.data_type}`));

            // 3. Count rows
            const count = await pool.query("SELECT COUNT(*) FROM offers");
            console.log("Total offers in DB:", count.rows[0].count);

            // 4. Sample rows
            const samples = await pool.query("SELECT id, title, status, vendor_id FROM offers LIMIT 5");
            console.log("Sample offers:", samples.rows);
        } else {
            console.log("Table 'offers' does NOT exist. You need to run the migration.");
        }

    } catch (err) {
        console.error("DB Check Failed:", err);
    } finally {
        process.exit();
    }
}

checkOffers();
