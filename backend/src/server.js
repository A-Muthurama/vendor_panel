import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import protectedRoutes from "./routes/protected.routes.js";


dotenv.config();

const app = express();

// CORS Configuration for Production
const corsOptions = {
  origin: process.env.FRONTEND_URL || "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);

// Health Check Endpoint
app.get("/api/health", async (req, res) => {
  try {
    // Test database connection
    const { Pool } = await import("pg");
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    await pool.query("SELECT 1");
    pool.end();

    res.json({
      status: "OK",
      database: "Connected",
      env: {
        hasJwtSecret: !!process.env.JWT_SECRET,
        hasDbUrl: !!process.env.DATABASE_URL,
        hasCloudinary: !!process.env.CLOUDINARY_CLOUD_NAME
      }
    });
  } catch (err) {
    res.status(500).json({
      status: "ERROR",
      database: err.message
    });
  }
});

// Admin routes exist but NOT used by vendor panel


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Auth server running on port ${PORT}`);
});
