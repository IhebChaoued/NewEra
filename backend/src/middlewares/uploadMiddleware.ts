import multer from "multer";
import path from "path";

const maxFileSize =
  parseInt(process.env.UPLOAD_MAX_SIZE_MB || "5") * 1024 * 1024;

/**
 * Configures Multer to store uploaded files in a temporary folder on disk.
 * This is required so Cloudinary can access the file to upload it.
 */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/");
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
  limits: { fileSize: maxFileSize },
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
