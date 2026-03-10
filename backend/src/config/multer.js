import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const isPDF = file.mimetype === "application/pdf" || file.originalname.toLowerCase().endsWith(".pdf");
    const isVideo = file.mimetype?.startsWith("video/") || ["mp4", "mov", "m4v"].some(ext => file.originalname.toLowerCase().endsWith(ext));
    
    return {
      folder: "vendor_uploads",
      // Use 'video' for videos, and 'image' for everything else (including PDFs)
      // because 'raw' doesn't support the 'fl_attachment' transformation.
      resource_type: isVideo ? "video" : "image",
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
      // We use 'image' resource_type even for PDFs because Cloudinary supports 
      // transformations like 'fl_attachment' for the image type, which allows 
      // us to force a download in the admin panel.
      resource_type: "image", 
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
