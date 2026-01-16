import pool from "./db.js";

const updateSchemaVideo = async () => {
    const client = await pool.connect();
    try {
        console.log("Updating schema for video...");

        // Add video_url column to offers table if it doesn't exist
        await client.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='offers' AND column_name='video_url') THEN 
          ALTER TABLE offers ADD COLUMN video_url TEXT; 
        END IF; 
      END $$;
    `);

        console.log("Schema updated successfully: Added video_url to offers table.");
    } catch (err) {
        console.error("Schema update failed:", err);
    } finally {
        client.release();
        pool.end();
    }
};

updateSchemaVideo();
