import { v2 as cloudinary } from "cloudinary";

/**
 * Configures Cloudinary with credentials from environment variables.
 * Keeps sensitive information secure and avoids hard-coded secrets.
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
