import dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;

dotenv.config();

const addDaysCountColumn = async () => {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false }
    });

    try {
        console.log('🚀 Adding days_count column to vendors table...\n');

        // Add days_count column (stores days since approval)
        await pool.query(`
            ALTER TABLE vendors 
            ADD COLUMN IF NOT EXISTS days_count INTEGER DEFAULT 0;
        `);
        console.log('✅ days_count column added\n');

        // Update days_count for existing approved vendors
        console.log('📊 Calculating days_count for existing vendors...');

        const result = await pool.query(`
            UPDATE vendors 
            SET days_count = CASE 
                WHEN approved_at IS NOT NULL THEN 
                    EXTRACT(DAY FROM (NOW() AT TIME ZONE 'Asia/Kolkata') - (approved_at AT TIME ZONE 'Asia/Kolkata'))::INTEGER
                ELSE 0 
            END
            WHERE status = 'APPROVED';
        `);

        console.log(`✅ Updated days_count for ${result.rowCount} vendors\n`);

        // Show sample data
        console.log('📋 Sample vendor data with days_count:');
        const vendorsResult = await pool.query(`
            SELECT 
                id, 
                shop_name, 
                status,
                approved_at AT TIME ZONE 'Asia/Kolkata' as approved_at_ist,
                days_count,
                (90 - days_count) as days_remaining
            FROM vendors
            WHERE status = 'APPROVED'
            ORDER BY id
            LIMIT 5;
        `);

        vendorsResult.rows.forEach(vendor => {
            console.log(`\n  🏪 ${vendor.shop_name} (ID: ${vendor.id})`);
            console.log(`     Approved: ${vendor.approved_at_ist ? new Date(vendor.approved_at_ist).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'N/A'}`);
            console.log(`     Days since approval: ${vendor.days_count}`);
            console.log(`     Trial days remaining: ${vendor.days_remaining}`);
        });

        console.log('\n\n🎉 Migration completed successfully!\n');

    } catch (err) {
        console.error('❌ Migration failed:', err.message);
        console.error(err);
        process.exit(1);
    } finally {
        await pool.end();
        process.exit(0);
    }
};

addDaysCountColumn();
