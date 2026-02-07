import dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;

dotenv.config();

const runMigration = async () => {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false }
    });

    try {
        console.log('🚀 Starting Free Trial Migration...\n');

        // Step 1: Add approved_at column
        console.log('Step 1: Adding approved_at column to vendors table...');
        await pool.query(`
            ALTER TABLE vendors 
            ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP;
        `);
        console.log('✅ approved_at column added\n');

        // Step 2: Set approved_at for existing APPROVED vendors
        console.log('Step 2: Setting approved_at for existing approved vendors...');
        const updateResult = await pool.query(`
            UPDATE vendors 
            SET approved_at = created_at 
            WHERE status = 'APPROVED' AND approved_at IS NULL;
        `);
        console.log(`✅ Updated ${updateResult.rowCount} existing approved vendors\n`);

        // Step 3: Create free trial subscriptions for approved vendors without subscriptions
        console.log('Step 3: Creating free trial subscriptions...');

        const vendorsResult = await pool.query(`
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

        console.log(`Found ${vendorsResult.rows.length} vendors needing free trials\n`);

        let created = 0;
        for (const vendor of vendorsResult.rows) {
            const approvalDate = vendor.approved_at || vendor.created_at;
            const trialExpiryDate = new Date(approvalDate);
            trialExpiryDate.setDate(trialExpiryDate.getDate() + 90);

            await pool.query(`
                INSERT INTO subscriptions 
                (vendor_id, plan_name, price, total_posts, remaining_posts, expiry_date, status, start_date)
                VALUES ($1, 'Free Trial', 0, 20, 20, $2, 'ACTIVE', $3)
            `, [vendor.id, trialExpiryDate, approvalDate]);

            created++;
            console.log(`  ✅ Created free trial for: ${vendor.shop_name} (ID: ${vendor.id})`);
        }

        console.log(`\n✅ Successfully created ${created} free trial subscriptions`);
        console.log('\n🎉 Migration completed successfully!\n');

    } catch (err) {
        console.error('❌ Migration failed:', err.message);
        console.error(err);
        process.exit(1);
    } finally {
        await pool.end();
        process.exit(0);
    }
};

runMigration();
