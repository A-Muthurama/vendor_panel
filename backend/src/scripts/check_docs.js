import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function check() {
    try {
        console.log("Checking vendors and documents...");
        const res = await pool.query(`
      SELECT v.id, v.shop_name, v.email, COUNT(k.id) as doc_count
      FROM vendors v
      LEFT JOIN kyc_documents k ON v.id = k.vendor_id
      GROUP BY v.id, v.shop_name, v.email
      ORDER BY v.id DESC
      LIMIT 10
    `);

        res.rows.forEach(r => {
            console.log(`[${r.id}] ${r.shop_name} (${r.email}) - Docs: ${r.doc_count}`);
        });

        if (res.rows.length > 0) {
            const topVendor = res.rows[0].id;
            const docs = await pool.query("SELECT doc_type FROM kyc_documents WHERE vendor_id = $1", [topVendor]);
            console.log(`\nDocument types for vendor ${topVendor}:`);
            docs.rows.forEach(d => console.log(` - [${d.doc_type}] (length: ${d.doc_type.length})`));
        }

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await pool.end();
    }
}

check();
