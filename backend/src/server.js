import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import authRoutes from "./routes/auth.routes.js";
import protectedRoutes from "./routes/protected.routes.js";
import internalRoutes from "./routes/internal.routes.js";


dotenv.config();

const app = express();

// Time: 16 Jan 2026, 22:15 IST
// Security Headers
app.use(helmet());

// Prevent HTTP Parameter Pollution
app.use(hpp());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter); // Apply to all routes

// Time: 16 Jan 2026, 22:15 IST
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://vendor.jewellersparadise.com",
  "https://www.vendor.jewellersparadise.com"
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.indexOf(origin) !== -1 ||
      allowedOrigins.includes(origin) ||
      origin.includes("vercel.app") ||
      origin.includes("amplifyapp.com") ||
      origin.includes("aws") ||
      origin.includes("localhost") ||
      origin.endsWith("jewellersparadise.com") // comprehensive check for subdomains
    ) {
      callback(null, true);
    } else {
      console.log("CORS Blocked Origin:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-internal-key"]
};
app.use(cors(corsOptions));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use(express.json());

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

// Admin routes exist but NOT used by vendor panel


// Additional health endpoint for monitoring
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "Vendor API",
    time: new Date().toISOString()
  });
});

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
