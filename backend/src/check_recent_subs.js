import pool from "./db.js";
const check = async () => {
    try {
        const res = await pool.query(`
            SELECT v.id, v.shop_name, v.status, s.id as sub_id, s.plan_name, s.start_date as sub_date 
            FROM vendors v
            LEFT JOIN subscriptions s ON v.id = s.vendor_id
            ORDER BY s.start_date DESC NULLS LAST
            LIMIT 5
        `);
        process.stdout.write(JSON.stringify(res.rows, null, 2));
        process.exit(0);
    } catch (e) {
        process.stdout.write(e.message);
        process.exit(1);
    }
}
check();
