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
    const migrationFile = process.argv[2] || 'add_reset_password.sql';

    try {
        console.log(`🔄 Running migration: ${migrationFile}...`);

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        const migrationPath = join(__dirname, migrationFile);

        const sql = readFileSync(migrationPath, 'utf8');

        await client.query(sql);

        console.log(`✅ Migration ${migrationFile} completed successfully!`);

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
    } finally {
        client.release();
        await pool.end();
    }
}

runMigration();
