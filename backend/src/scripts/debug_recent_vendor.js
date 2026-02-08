import pool from "../db.js";

async function debugRecentVendor() {
    try {
        const res = await pool.query(`
      SELECT id, shop_name, status, approved_at, created_at 
      FROM vendors 
      WHERE status = 'APPROVED' 
      ORDER BY approved_at DESC 
      LIMIT 5
    `);

        console.log("--- Recent Approved Vendors ---");
        console.table(res.rows);

        if (res.rows.length > 0) {
            const vendorId = res.rows[0].id;
            console.log(`\n--- Subscriptions for Vendor ID ${vendorId} ---`);

            const subRes = await pool.query(`
        SELECT * FROM subscriptions WHERE vendor_id = $1
      `, [vendorId]);

            console.table(subRes.rows);
        }

    } catch (err) {
        console.error("Error:", err);
    } finally {
        pool.end(); // Close the pool
    }
}

debugRecentVendor();
