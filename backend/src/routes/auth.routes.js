import express from "express";
import { signup, login, forgotPassword, resetPassword, sendOTP, verifyOTP } from "../controllers/auth.controller.js";
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
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

export default router;
