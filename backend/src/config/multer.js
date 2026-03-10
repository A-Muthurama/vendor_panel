import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const isPDF = file.mimetype === "application/pdf" || file.originalname.toLowerCase().endsWith(".pdf");
    const isVideo = file.mimetype?.startsWith("video/") || ["mp4", "mov"].some(ext => file.originalname.toLowerCase().endsWith(ext));
    
    return {
      folder: "vendor_uploads",
      resource_type: isPDF ? "raw" : (isVideo ? "video" : "image"),
      allowed_formats: (isPDF || isVideo) ? undefined : ["jpg", "jpeg", "png", "webp"],
      public_id: (isPDF || isVideo) ? `${Date.now()}-${file.originalname}` : undefined,
    };
  }
});

const kycStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const isPDF = file.mimetype === "application/pdf" || file.originalname.toLowerCase().endsWith(".pdf");
    return {
      folder: "kyc_uploads",
      resource_type: isPDF ? "raw" : "image",
      allowed_formats: isPDF ? undefined : ["jpg", "jpeg", "png"],
      public_id: isPDF ? `${Date.now()}-${file.originalname}` : undefined,
    };
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});
export const kycUpload = multer({
  storage: kycStorage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit for KYC docs
});
