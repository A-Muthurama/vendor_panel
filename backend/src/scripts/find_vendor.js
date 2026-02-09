import pool from '../db.js';

const findVendor = async () => {
    try {
        const res = await pool.query(`
            SELECT v.id, v.shop_name, v.status, v.approved_at, v.posts_remaining,
                   s.plan_name, s.status as sub_status
            FROM vendors v
            LEFT JOIN subscriptions s ON v.id = s.vendor_id
            WHERE v.shop_name ILIKE '%Iam%' OR v.owner_name ILIKE '%Jeweller%'
        `);
        console.log(JSON.stringify(res.rows, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

findVendor();
