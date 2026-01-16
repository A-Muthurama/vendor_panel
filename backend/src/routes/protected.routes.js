import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { upload } from "../config/multer.js";

import * as vendorController from "../controllers/vendor.controller.js";

const router = express.Router();

// Profile Details
router.get("/profile", authMiddleware, vendorController.getVendorProfile);

router.get("/me", authMiddleware, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user
  });
});

// Dashboard & Stats
router.get("/stats", authMiddleware, vendorController.getDashboardStats);

// Offer Management
router.get("/offers", authMiddleware, vendorController.getOffers);
router.post("/offers", authMiddleware, upload.fields([{ name: 'poster', maxCount: 1 }, { name: 'video', maxCount: 1 }]), vendorController.createOffer);
router.delete("/offers/:id", authMiddleware, vendorController.deleteOffer);

// Subscription
router.post("/subscribe", authMiddleware, vendorController.buySubscription);

// Profile Picture Upload
router.put("/profile/picture", authMiddleware, upload.single('profilePicture'), vendorController.updateProfilePicture);

export default router;
