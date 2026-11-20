import { Router } from "express";
import multer from "multer";
import { uploadController } from "../controllers/upload.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// Multer memory storage configuration
const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB per file limit
    files: 10, // Maximum 10 files per request
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (JPEG, PNG, WEBP, GIF) are allowed."));
    }
  },
});

const documentUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB for documents
  },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, Word documents, or image files are allowed."));
    }
  },
});

// Protect all upload routes with JWT authentication
router.use(authenticate);

// Upload up to 10 images at once
router.post("/images", imageUpload.array("images", 10), (req, res, next) => {
  uploadController.uploadImages(req, res, next);
});

// Upload single document
router.post("/document", documentUpload.single("document"), (req, res, next) => {
  uploadController.uploadDocument(req, res, next);
});

// Delete file by fileId
router.delete("/:fileId", (req, res, next) => {
  uploadController.deleteFile(req, res, next);
});

// Get authentication signature for direct client-side upload if needed
router.get("/auth", (req, res, next) => {
  uploadController.getAuthParameters(req, res, next);
});

export default router;
