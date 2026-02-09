import pool from "../db.js";

async function checkVendorData(id) {
    const vendorRes = await pool.query("SELECT * FROM vendors WHERE id = $1", [id]);
    const subRes = await pool.query("SELECT * FROM subscriptions WHERE vendor_id = $1", [id]);

    console.log("VENDOR:", JSON.stringify(vendorRes.rows[0], null, 2));
    console.log("SUBSCRIPTIONS:", JSON.stringify(subRes.rows, null, 2));

    process.exit(0);
}

checkVendorData(13);
