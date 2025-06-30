import multer from "multer";
import path from "path";

/**
 * Configures Multer to store uploaded files in a temporary folder on disk.
 * This is required so Cloudinary can access the file to upload it.
 */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/"); // Local temp folder
  },
  filename: (_req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

/**
 * File filter that accepts common images and document types:
 * - Images: PNG, JPG, JPEG
 * - Docs: PDF, DOC, DOCX
 */
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // ~5MB
  fileFilter: (_req, file, cb) => {
    const allowedExts = [".jpeg", ".jpg", ".png", ".pdf", ".doc", ".docx"];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only images (jpeg, jpg, png) or documents (pdf, doc, docx) are allowed."
        )
      );
    }
  },
});

export default upload;
