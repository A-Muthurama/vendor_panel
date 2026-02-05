import pool from '../db.js';

const addApprovedAtColumn = async () => {
    const client = await pool.connect();

    try {
        console.log('Adding approved_at column to vendors table...');

        // Add approved_at column if it doesn't exist
        await client.query(`
            ALTER TABLE vendors 
            ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP;
        `);

        console.log('✓ approved_at column added successfully');

        // Update existing APPROVED vendors to set approved_at to their created_at
        // This is a reasonable default for existing approved vendors
        const result = await client.query(`
            UPDATE vendors 
            SET approved_at = created_at 
            WHERE status = 'APPROVED' AND approved_at IS NULL;
        `);

        console.log(`✓ Updated ${result.rowCount} existing approved vendors with approval timestamp`);

        process.exit(0);
    } catch (err) {
        console.error('Error adding approved_at column:', err);
        process.exit(1);
    } finally {
        client.release();
    }
};

addApprovedAtColumn();
