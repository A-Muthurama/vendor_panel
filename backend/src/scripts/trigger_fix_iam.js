import pool from '../db.js';

const triggerFix = async () => {
    try {
        const vendorId = 13; // Vendor "Iam"
        console.log(`🛠️ Manually triggering auto-fix check for vendor ID ${vendorId}...`);

        const client = await pool.connect();
        try {
            // 1. Get Vendor
            const vendorRes = await client.query("SELECT * FROM vendors WHERE id = $1", [vendorId]);
            const vendor = vendorRes.rows[0];

            if (!vendor) {
                console.log('❌ Vendor not found');
                process.exit(1);
            }

            // 2. Check Subscription
            let subRes = await client.query(
                `SELECT * FROM subscriptions 
                 WHERE vendor_id = $1 AND status = 'ACTIVE' AND start_date <= NOW() AND expiry_date > NOW() 
                 ORDER BY expiry_date ASC LIMIT 1`,
                [vendorId]
            );

            if (vendor.status === 'APPROVED' && subRes.rows.length === 0) {
                console.log(`[Auto-Fix] Granting Free Trial to ${vendor.shop_name}...`);
                const approvalTime = vendor.approved_at || new Date();
                const trialExpiryDate = new Date(approvalTime);
                trialExpiryDate.setDate(trialExpiryDate.getDate() + 90);

                await client.query(
                    `INSERT INTO subscriptions 
                     (vendor_id, plan_name, price, total_posts, remaining_posts, expiry_date, status, start_date)
                     VALUES ($1, 'Free Trial', 0, 20, 20, $2, 'ACTIVE', $3)`,
                    [vendorId, trialExpiryDate, approvalTime]
                );

                await client.query("UPDATE vendors SET posts_remaining = 20 WHERE id = $1", [vendorId]);
                console.log('✅ Fix Applied!');
            } else {
                console.log('ℹ️ Vendor already has a subscription or is not approved.');
            }
        } finally {
            client.release();
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

triggerFix();
