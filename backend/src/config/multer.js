import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const isPDF = file.mimetype === "application/pdf" || file.originalname.toLowerCase().endsWith(".pdf");
    const isVideo = file.mimetype?.startsWith("video/") || ["mp4", "mov", "m4v"].some(ext => file.originalname.toLowerCase().endsWith(ext));
    
    let resourceType = "image";
    if (isPDF) resourceType = "raw";
    else if (isVideo) resourceType = "video";
    
    return {
      folder: "vendor_uploads",
      resource_type: resourceType,
      public_id: `${Date.now()}-${file.originalname}`,
      allowed_formats: (isPDF || isVideo) ? undefined : ["jpg", "jpeg", "png", "webp"],
    };
  }
});

const kycStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const isPDF = file.mimetype === "application/pdf" || file.originalname.toLowerCase().endsWith(".pdf");
    return {
      folder: "kyc_uploads",
      // Use 'raw' resource_type for PDFs (official Cloudinary recommendation)
      // PDFs are documents, not images. Raw asset type is correct for reliable downloads.
      resource_type: isPDF ? "raw" : "image", 
      public_id: `${Date.now()}-${file.originalname}`,
      // No format specified here to preserve original filename + ext in public_id
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
