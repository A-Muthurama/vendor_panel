import pool from "./db.js";

const migrate = async () => {
    try {
        console.log("Adding Razorpay columns to subscriptions table...");
        await pool.query(`
            ALTER TABLE subscriptions 
            ADD COLUMN IF NOT EXISTS razorpay_payment_id VARCHAR(255),
            ADD COLUMN IF NOT EXISTS razorpay_order_id VARCHAR(255);
        `);
        console.log("Migration successful!");
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
};

migrate();
