import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import authRoutes from "./routes/auth.routes.js";
import protectedRoutes from "./routes/protected.routes.js";
import internalRoutes from "./routes/internal.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";


dotenv.config();

const app = express();

// Root Endpoint
app.get("/", (req, res) => {
  res.send("Vendor API is running successfully");
});


const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://vendor.jewellersparadise.com",
  "https://www.vendor.jewellersparadise.com",
  "https://vendor-api.jewellersparadise.com",
  "http://localhost:3000",
  "http://localhost:5001"
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // 1. Allow mobile apps/server-to-server (no origin)
    if (!origin) return callback(null, true);

    // 2. Allow any subdomain of jewellersparadise.com
    const isMainDomain = origin.endsWith("jewellersparadise.com");
    const isWhitelisted = allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes(origin);
    const isLocal = origin.includes("localhost") || origin.includes("127.0.0.1");

    if (isMainDomain || isWhitelisted || isLocal) {
      callback(null, true);
    } else {
      console.log("CORS Filtered Origin:", origin);
      callback(null, false); // Don't throw error, just deny origin
    }
  },
  credentials: true,
  optionsSuccessStatus: 200, // Important for legacy browsers/proxies
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-internal-key"]
};

// CORS must be first
app.use(cors(corsOptions));

// Security Headers
app.use(helmet());

// Prevent HTTP Parameter Pollution
app.use(hpp());

// Rate Limiting - Increased for Testing/Production Heavy Use
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, // Increased to 1000 for heavy usage/media uploads
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes); // Fallback for requests missing /api prefix

app.use("/api/protected", protectedRoutes);
app.use("/protected", protectedRoutes); // Fallback

app.use("/internal", internalRoutes);

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

// Additional health endpoint for monitoring
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "Vendor API",
    time: new Date().toISOString()
  });
});

// Global Error Handler - MUST be last!
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Auth server running on port ${PORT}`);
  console.log(`[${new Date().toISOString()}] Server Starting - Deployment Check`);
  console.log("Environment check:", {
    hasDbUrl: !!process.env.DATABASE_URL,
    // safe log part of url
    dbUrlPrefix: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 20) + "..." : "MISSING"
  });
});

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
