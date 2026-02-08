
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function checkIndexes() {
    await client.connect();
    const res = await client.query(`
    select
        t.relname as table_name,
        i.relname as index_name,
        a.attname as column_name
    from
        pg_class t,
        pg_class i,
        pg_index ix,
        pg_attribute a
    where
        t.oid = ix.indrelid
        and i.oid = ix.indexrelid
        and a.attrelid = t.oid
        and a.attnum = ANY(ix.indkey)
        and t.relkind = 'r'
        and t.relname = 'subscriptions'
    order by
        t.relname,
        i.relname;
  `);
    console.log(JSON.stringify(res.rows, null, 2));
    await client.end();
}

checkIndexes();
