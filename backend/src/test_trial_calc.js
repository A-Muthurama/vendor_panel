import dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;

dotenv.config();

const testTrialCalculation = async () => {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false }
    });

    try {
        console.log('🧪 Testing Trial Calculation with IST Timezone\n');

        const result = await pool.query(`
            SELECT 
                id,
                shop_name,
                status,
                approved_at,
                approved_at AT TIME ZONE 'Asia/Kolkata' as approved_at_ist,
                days_count,
                created_at
            FROM vendors
            WHERE status = 'APPROVED'
            ORDER BY id;
        `);

        console.log(`Found ${result.rows.length} approved vendors:\n`);

        result.rows.forEach(vendor => {
            const now = new Date();
            const approvedDate = new Date(vendor.approved_at);

            // Calculate using IST
            const istNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
            const istApproved = new Date(approvedDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
            const daysSinceApproval = Math.floor((istNow - istApproved) / (1000 * 60 * 60 * 24));
            const daysRemaining = 90 - daysSinceApproval;

            console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            console.log(`🏪 ${vendor.shop_name} (ID: ${vendor.id})`);
            console.log(`   Status: ${vendor.status}`);
            console.log(`   Approved (IST): ${new Date(vendor.approved_at_ist).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
            console.log(`   Days in DB: ${vendor.days_count}`);
            console.log(`   Days Calculated: ${daysSinceApproval}`);
            console.log(`   Days Remaining: ${daysRemaining}`);
            console.log(`   Show Subscription: ${daysSinceApproval >= 30 ? 'YES ✅' : 'NO ❌'}`);
            console.log(`   Trial Expired: ${daysRemaining <= 0 ? 'YES ⚠️' : 'NO ✅'}`);
        });

        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await pool.end();
    }
};

testTrialCalculation();
