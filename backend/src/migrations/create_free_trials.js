import pool from '../db.js';

const createFreeTrialsForExistingVendors = async () => {
    const client = await pool.connect();

    try {
        console.log('Creating free trial subscriptions for existing approved vendors...');

        // Get all approved vendors who don't have an active subscription
        const vendorsResult = await client.query(`
            SELECT v.id, v.shop_name, v.approved_at, v.created_at
            FROM vendors v
            WHERE v.status = 'APPROVED'
            AND NOT EXISTS (
                SELECT 1 FROM subscriptions s 
                WHERE s.vendor_id = v.id 
                AND s.status = 'ACTIVE'
                AND s.expiry_date > NOW()
            )
        `);

        console.log(`Found ${vendorsResult.rows.length} approved vendors without active subscriptions`);

        let created = 0;

        for (const vendor of vendorsResult.rows) {
            // Use approved_at if available, otherwise use created_at
            const approvalDate = vendor.approved_at || vendor.created_at;
            const trialExpiryDate = new Date(approvalDate);
            trialExpiryDate.setDate(trialExpiryDate.getDate() + 90); // 90 days from approval

            await client.query(`
                INSERT INTO subscriptions 
                (vendor_id, plan_name, price, total_posts, remaining_posts, expiry_date, status, start_date)
                VALUES ($1, 'Free Trial', 0, 20, 20, $2, 'ACTIVE', $3)
                ON CONFLICT DO NOTHING
            `, [vendor.id, trialExpiryDate, approvalDate]);

            created++;
            console.log(`  ✓ Created free trial for vendor #${vendor.id} (${vendor.shop_name})`);
        }

        console.log(`\n✓ Successfully created ${created} free trial subscriptions`);
        process.exit(0);

    } catch (err) {
        console.error('Error creating free trials:', err);
        process.exit(1);
    } finally {
        client.release();
    }
};

createFreeTrialsForExistingVendors();
