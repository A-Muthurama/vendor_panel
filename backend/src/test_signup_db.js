import pool from "./db.js";
import bcrypt from "bcrypt";

async function testSignup() {
    let client;
    try {
        client = await pool.connect();
        const email = "testsignup_" + Date.now() + "@example.com";
        const password = "password123";
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log("Starting transaction...");
        await client.query("BEGIN");

        const vendorResult = await client.query(
            `INSERT INTO vendors 
       (shop_name, owner_name, email, phone, password_hash, state, city, pincode, address)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING id`,
            ["Test Shop", "Test Owner", email, "1234567890", hashedPassword, "Tamil Nadu", "Chennai", "600001", "123 Test St"]
        );

        const vendorId = vendorResult.rows[0].id;
        console.log("Vendor created with ID:", vendorId);

        // Test KYC Doc insertion
        await client.query(
            `INSERT INTO kyc_documents (vendor_id, doc_type, file_url)
       VALUES ($1,$2,$3)`,
            [vendorId, "AADHAAR", "http://example.com/aadhar.jpg"]
        );

        await client.query("COMMIT");
        console.log("Signup test successful!");
    } catch (err) {
        if (client) await client.query("ROLLBACK");
        console.error("Signup test FAILED:", err);
    } finally {
        if (client) client.release();
        process.exit();
    }
}

testSignup();
