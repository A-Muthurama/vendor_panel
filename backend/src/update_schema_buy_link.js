import pool from "./db.js";

const updateSchema = async () => {
    const client = await pool.connect();
    try {
        console.log("Updating schema...");

        // Add buy_link column to offers table if it doesn't exist
        await client.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='offers' AND column_name='buy_link') THEN 
          ALTER TABLE offers ADD COLUMN buy_link TEXT; 
        END IF; 
      END $$;
    `);

        console.log("Schema updated successfully: Added buy_link to offers table.");
    } catch (err) {
        console.error("Schema update failed:", err);
    } finally {
        client.release();
        pool.end(); // Close the pool
    }
};

updateSchema();
