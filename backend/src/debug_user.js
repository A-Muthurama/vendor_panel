import pool from "./db.js";
import bcrypt from "bcrypt";

const email = "muthuramaa1@gmail.com";
// We can't know the password for sure, but we can check if the user exists and the hash integrity.
// If you want to test a specific password, replace 'password123' below.
const testPassword = "password";

const debugUser = async () => {
    try {
        console.log(`Searching for user: ${email}`);
        const res = await pool.query("SELECT * FROM vendors WHERE email = $1", [email]);

        if (res.rows.length === 0) {
            console.log("❌ No user found with that email.");
        } else {
            const user = res.rows[0];
            console.log("✅ User found:");
            console.log(`   ID: ${user.id}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Password Hash: ${user.password_hash}`);
            console.log(`   Hash Length: ${user.password_hash ? user.password_hash.length : 0}`);

            // Check if hash is a valid bcrypt hash (starts with $2b$ or $2a$)
            // And try to compare with a dummy password to see if bcrypt even works
            if (user.password_hash) {
                const isMatch = await bcrypt.compare(testPassword, user.password_hash);
                console.log(`   Detailed Hash Check: matches '${testPassword}'? ${isMatch}`);
            } else {
                console.log("❌ No password hash found!");
            }
        }
    } catch (err) {
        console.error("Debug Script Error:", err);
    } finally {
        await pool.end();
    }
};

debugUser();
