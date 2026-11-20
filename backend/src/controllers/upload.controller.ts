import { Request, Response, NextFunction } from "express";
import { uploadService } from "../services/upload.service";
import { ApiResponseHelper } from "../utils/apiResponse";

export class UploadController {
  /**
   * Upload single or multiple images to ImageKit.
   * Handles multipart/form-data via Multer memoryStorage.
   */
  async uploadImages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const files = req.files as Express.Multer.File[] | undefined;
      const file = req.file as Express.Multer.File | undefined;

      const uploadList: Express.Multer.File[] = [];
      if (files && Array.isArray(files)) {
        uploadList.push(...files);
      } else if (file) {
        uploadList.push(file);
      }

      if (uploadList.length === 0) {
        ApiResponseHelper.badRequest(res, "No image files provided for upload.");
        return;
      }

      const results = await Promise.all(
        uploadList.map((f) => uploadService.uploadImage(f.buffer, f.originalname, "/properties"))
      );

      ApiResponseHelper.created(res, results, "Images uploaded successfully.");
    } catch (error) {
      next(error);
    }
  }

  /**
   * Upload document (PDF / Floor plan / Brochure).
   */
  async uploadDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const file = req.file as Express.Multer.File | undefined;
      if (!file) {
        ApiResponseHelper.badRequest(res, "No document file provided for upload.");
        return;
      }

      const result = await uploadService.uploadImage(file.buffer, file.originalname, "/documents");
      ApiResponseHelper.created(res, result, "Document uploaded successfully.");
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete uploaded file from ImageKit by fileId.
   */
  async deleteFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const fileId = String(req.params.fileId);
      if (!fileId) {
        ApiResponseHelper.badRequest(res, "File ID is required.");
        return;
      }

      await uploadService.deleteFile(fileId);
      ApiResponseHelper.success(res, null, "File deleted successfully.");
    } catch (error) {
      next(error);
    }
  }

  /**
   * Client-side auth signature for direct uploads.
   */
  async getAuthParameters(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const auth = uploadService.getAuthenticationParameters();
      ApiResponseHelper.success(res, auth, "Authentication parameters generated.");
    } catch (error) {
      next(error);
    }
  }
}

export const uploadController = new UploadController();
