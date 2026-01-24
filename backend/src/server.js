import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import protectedRoutes from "./routes/protected.routes.js";


dotenv.config();

const app = express();

// Time: 16 Jan 2026, 22:15 IST
const corsOptions = {
  origin: (origin, callback) => {
    console.log(`Incoming request from origin: ${origin}`);
    callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};
app.use(cors(corsOptions));
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);

// Health Check Endpoint
app.get("/api/health", async (req, res) => {
  try {
    // Test database connection
    const { Pool } = await import("pg");
    const isLocal = process.env.DATABASE_URL?.includes("localhost") || process.env.DATABASE_URL?.includes("127.0.0.1");
    console.log("Health Check DB Config:", { isLocal, ssl: isLocal ? false : { rejectUnauthorized: false } });
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: isLocal ? false : { rejectUnauthorized: false }
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
const server = app.listen(PORT, () => {
  console.log(`Auth server running on port ${PORT}`);
  console.log("Environment check:", {
    hasDbUrl: !!process.env.DATABASE_URL,
    // safe log part of url
    dbUrlPrefix: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 20) + "..." : "MISSING"
  });
});

// Debug Heartbeat
setInterval(() => {
  console.log("Server Heartbeat - Process Active");
}, 2000);

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...', err);
  server.close(() => {
    process.exit(1);
  });
});
