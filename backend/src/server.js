import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import protectedRoutes from "./routes/protected.routes.js";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);

// Admin routes exist but NOT used by vendor panel


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Auth server running on port ${PORT}`);
});
