import multer from 'multer';
import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary';

// Store files in memory buffer
const storage = multer.memoryStorage();
export const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

/**
 * Uploads a file buffer to Cloudinary.
 * Falls back to returning a mock URL if Cloudinary credentials are not set.
 */
export const uploadToCloudinary = (
  fileBuffer: Buffer,
  folder: string,
  fileName: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!isCloudinaryConfigured) {
      // Return a simulated asset link if keys are missing
      const mockUrl = `https://res.cloudinary.com/demo/image/upload/v12345/${folder}/${fileName}`;
      console.log(`[Cloudinary Mock Upload] Simulating upload of "${fileName}" -> "${mockUrl}"`);
      return resolve(mockUrl);
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `lifeos_ai/${folder}`,
        public_id: fileName.split('.')[0],
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary stream upload error:', error);
          return reject(error);
        }
        if (result && result.secure_url) {
          resolve(result.secure_url);
        } else {
          reject(new Error('Cloudinary response did not contain secure_url'));
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};
