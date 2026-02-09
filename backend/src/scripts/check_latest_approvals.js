import pool from '../db.js';

const checkLatestApprovals = async () => {
    try {
        const res = await pool.query(`
            SELECT v.id, v.shop_name, v.status as vendor_status, v.approved_at, v.posts_remaining,
                   s.plan_name, s.status as sub_status, s.remaining_posts
            FROM vendors v
            LEFT JOIN subscriptions s ON v.id = s.vendor_id
            ORDER BY v.approved_at DESC NULLS LAST
            LIMIT 5
        `);
        console.log(JSON.stringify(res.rows, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkLatestApprovals();
