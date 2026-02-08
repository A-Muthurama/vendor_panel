
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function checkConstraints() {
    await client.connect();
    const res = await client.query(`
    SELECT conname, contype, conkey 
    FROM pg_constraint 
    WHERE conrelid = 'subscriptions'::regclass
  `);
    console.log(JSON.stringify(res.rows, null, 2));
    await client.end();
}

checkConstraints();
