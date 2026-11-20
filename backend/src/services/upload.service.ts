import { imagekit } from "../config/imagekit";

export interface UploadedFileResult {
  url: string;
  fileId: string;
  name: string;
  thumbnailUrl?: string;
  size?: number;
}

export class UploadService {
  /**
   * Upload an image buffer directly to ImageKit cloud storage.
   */
  async uploadImage(
    fileBuffer: Buffer,
    originalName: string,
    folder = "/properties"
  ): Promise<UploadedFileResult> {
    const cleanName = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const fileName = `${Date.now()}_${cleanName}`;

    const res = await imagekit.upload({
      file: fileBuffer,
      fileName,
      folder,
      useUniqueFileName: true,
    });

    return {
      url: res.url,
      fileId: res.fileId,
      name: res.name,
      thumbnailUrl: res.thumbnailUrl || res.url,
      size: res.size,
    };
  }

  /**
   * Delete a file from ImageKit cloud storage by fileId.
   */
  async deleteFile(fileId: string): Promise<void> {
    await imagekit.deleteFile(fileId);
  }

  /**
   * Generate client-side authentication parameters for ImageKit if needed.
   */
  getAuthenticationParameters() {
    return imagekit.getAuthenticationParameters();
  }
}

export const uploadService = new UploadService();
