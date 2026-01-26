
import pool from "./db.js";

async function checkRest() {
    try {
        console.log("--- KYC ---");
        const kyc = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'kyc_documents'");
        kyc.rows.forEach(row => console.log(row.column_name));

        console.log("--- SUBS ---");
        const sub = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'subscriptions'");
        sub.rows.forEach(row => console.log(row.column_name));

    } catch (err) {
        console.error("Error checking table:", err);
    } finally {
        process.exit();
    }
}

checkRest();
