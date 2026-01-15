import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function verify() {
    const email = process.argv[2];
    if (!email) {
        console.log("Usage: node verify_kyc.js <email>");
        process.exit(1);
    }

    try {
        const vendorRes = await pool.query("SELECT id, shop_name FROM vendors WHERE email = $1", [email]);
        if (vendorRes.rows.length === 0) {
            console.log("No vendor found with email:", email);
            return;
        }

        const vendorId = vendorRes.rows[0].id;
        console.log(`Vendor: ${vendorRes.rows[0].shop_name} (ID: ${vendorId})`);

        const docsRes = await pool.query("SELECT doc_type, file_url FROM kyc_documents WHERE vendor_id = $1", [vendorId]);
        console.log(`Documents found: ${docsRes.rows.length}`);
        docsRes.rows.forEach(d => {
            console.log(` - ${d.doc_type}: ${d.file_url}`);
        });

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await pool.end();
    }
}

verify();
