import express from "express";
import {
  approveVendorInternal,
  rejectVendorInternal,
  approveOfferInternal,
  rejectOfferInternal
} from "../controllers/internal.controller.js";
import internalAuth from "../middleware/internalAuth.middleware.js";

const router = express.Router();

// INTERNAL – Vendor approval
router.patch("/vendors/:id/approve", internalAuth, approveVendorInternal);
router.patch("/vendors/:id/reject", internalAuth, rejectVendorInternal);

// INTERNAL – Offer approval
router.patch("/offers/:id/approve", internalAuth, approveOfferInternal);
router.patch("/offers/:id/reject", internalAuth, rejectOfferInternal);

export default router;
