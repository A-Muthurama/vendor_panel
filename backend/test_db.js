import pool from "./src/db.js";
pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'vendors'").then(res => {
  console.log(res.rows.map(r => r.column_name));
  process.exit(0);
});
