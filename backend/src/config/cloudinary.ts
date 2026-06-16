import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

let isCloudinaryConfigured = false;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
  console.log('Cloudinary SDK configured successfully.');
  isCloudinaryConfigured = true;
} else {
  console.warn(
    'Cloudinary configuration is incomplete. File uploads will run in MOCK mode (returning local paths/mock URLs).'
  );
}

export { cloudinary, isCloudinaryConfigured };
