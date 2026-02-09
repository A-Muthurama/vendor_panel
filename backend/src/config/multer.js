import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "vendor_uploads",
    resource_type: "auto", // Allow images and videos
    allowed_formats: ["jpg", "jpeg", "png", "webp", "mp4", "mov", "pdf"]
  }
});

const kycStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "kyc_uploads",
    resource_type: "image", // Only allow images
    allowed_formats: ["jpg", "jpeg", "png"]
  }
});

export const upload = multer({ storage });
export const kycUpload = multer({ storage: kycStorage });
