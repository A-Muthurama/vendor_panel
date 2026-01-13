import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initDb = async () => {
  try {
    const schemaPath = path.join(__dirname, '..', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('Running schema...');
    await pool.query(schema);
    console.log('Database initialized successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error initializing database:', err);
    process.exit(1);
  }
};

initDb();
