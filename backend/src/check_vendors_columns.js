import dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;

dotenv.config();

const checkVendorsTable = async () => {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false }
    });

    try {
        console.log('🔍 Checking vendors table structure...\n');

        // Check columns in vendors table
        const columnsResult = await pool.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'vendors'
            ORDER BY ordinal_position;
        `);

        console.log('📋 Current columns in vendors table:');
        columnsResult.rows.forEach(col => {
            console.log(`  - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
        });

        // Check if approved_at exists
        const hasApprovedAt = columnsResult.rows.some(col => col.column_name === 'approved_at');
        console.log(`\n✅ approved_at column exists: ${hasApprovedAt}`);

        // Show sample vendor data
        console.log('\n📊 Sample vendor data:');
        const vendorsResult = await pool.query(`
            SELECT id, shop_name, status, approved_at, created_at
            FROM vendors
            LIMIT 5;
        `);

        vendorsResult.rows.forEach(vendor => {
            console.log(`  ID: ${vendor.id}, Shop: ${vendor.shop_name}, Status: ${vendor.status}`);
            console.log(`    Approved At: ${vendor.approved_at || 'NULL'}`);
            console.log(`    Created At: ${vendor.created_at}`);
        });

    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await pool.end();
    }
};

checkVendorsTable();
