
import pool from "./db.js";

async function checkTables() {
    const tables = ['vendors', 'offers', 'otp_verifications', 'subscriptions', 'kyc_documents'];

    try {
        for (const table of tables) {
            console.log(`\n--- Checking table: ${table} ---`);
            const tableCheck = await pool.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_name = $1
                );
            `, [table]);

            if (tableCheck.rows[0].exists) {
                console.log(`Table '${table}' exists.`);
                const columns = await pool.query(`
                    SELECT column_name, data_type, is_nullable
                    FROM information_schema.columns 
                    WHERE table_name = $1
                    ORDER BY ordinal_position;
                `, [table]);

                columns.rows.forEach(c => {
                    console.log(`  ${c.column_name}: ${c.data_type} (${c.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'})`);
                });
            } else {
                console.log(`Table '${table}' does NOT exist.`);
            }
        }
    } catch (err) {
        console.error("Error checking tables:", err);
    } finally {
        await pool.end();
    }
}

checkTables();
