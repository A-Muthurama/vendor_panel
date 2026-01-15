import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function runMigration() {
    const client = await pool.connect();

    try {
        console.log('🔄 Running migration: add_profile_picture...');

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        const migrationPath = join(__dirname, 'add_profile_picture.sql');

        const sql = readFileSync(migrationPath, 'utf8');

        await client.query(sql);

        console.log('✅ Migration completed successfully!');
        console.log('   - Added profile_picture_url column to vendors table');
        console.log('   - Created index for faster lookups');

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

runMigration().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
