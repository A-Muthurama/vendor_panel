import express from "express";
import { signup, login } from "../controllers/auth.controller.js";
import { upload } from "../config/multer.js";

const router = express.Router();

router.post(
  "/signup",
  upload.fields([
    { name: "AADHAAR", maxCount: 1 },
    { name: "PAN", maxCount: 1 },
    { name: "GST", maxCount: 1 },
    { name: "TRADE_LICENSE", maxCount: 1 }
  ]),
  signup
);

router.post("/login", login);

export default router;
