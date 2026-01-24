import pkg from 'pg';
const { Pool } = pkg;

// Using the NeonDB URL found in the commented out section of .env
const connectionString = 'postgresql://neondb_owner:npg_C2hmGVoTsr3E@ep-noisy-sound-ah3tjpti-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
});

async function checkDb() {
    try {
        console.log("Connecting to Remote NeonDB...");
        const client = await pool.connect();
        console.log("Connected successfully!");

        // Check for tables
        const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

        console.log("\nExisting Tables:");
        if (res.rows.length === 0) {
            console.log("NO TABLES FOUND! Migration needed.");
        } else {
            res.rows.forEach(row => console.log(` - ${row.table_name}`));
        }

        // Check vendors table specifically
        const vendorsTable = res.rows.find(row => row.table_name === 'vendors');
        if (vendorsTable) {
            console.log("\nChecking 'vendors' table columns:");
            const columns = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'vendors'
        `);
            columns.rows.forEach(col => console.log(`   ${col.column_name} (${col.data_type})`));
        }

        client.release();
    } catch (err) {
        console.error("Connection Error:", err);
    } finally {
        await pool.end();
    }
}

checkDb();
