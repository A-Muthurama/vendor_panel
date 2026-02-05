import pool from "./db.js";
const check = async () => {
    try {
        const res = await pool.query("SELECT id, shop_name, status FROM vendors ORDER BY id DESC LIMIT 5");
        process.stdout.write(JSON.stringify(res.rows, null, 2));
        process.exit(0);
    } catch (e) {
        process.stdout.write(e.message);
        process.exit(1);
    }
}
check();
