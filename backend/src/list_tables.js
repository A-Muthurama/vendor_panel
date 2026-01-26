
import pool from "./db.js";

async function listTables() {
    try {
        console.log("Checking for tables in current database...");
        const res = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE';
        `);

        const tables = res.rows.map(r => r.table_name);
        console.log("Found tables:", tables.join(", "));

        const required = ['vendors', 'offers', 'otp_verifications', 'subscriptions', 'kyc_documents'];
        const missing = required.filter(t => !tables.includes(t));

        if (missing.length === 0) {
            console.log("SUCCESS: All required tables are present.");
        } else {
            console.error("ERROR: Missing tables:", missing.join(", "));
        }

    } catch (err) {
        console.error("Error listing tables:", err);
    } finally {
        await pool.end();
    }
}

listTables();
