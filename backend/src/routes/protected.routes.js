import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";

import * as vendorController from "../controllers/vendor.controller.js";

const router = express.Router();

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
router.post("/offers", authMiddleware, vendorController.createOffer);
router.delete("/offers/:id", authMiddleware, vendorController.deleteOffer);

// Subscription
router.post("/subscribe", authMiddleware, vendorController.buySubscription);

export default router;
