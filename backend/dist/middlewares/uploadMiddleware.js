"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("../config/cloudinary");
// Store files in memory buffer
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});
/**
 * Uploads a file buffer to Cloudinary.
 * Falls back to returning a mock URL if Cloudinary credentials are not set.
 */
const uploadToCloudinary = (fileBuffer, folder, fileName) => {
    return new Promise((resolve, reject) => {
        if (!cloudinary_1.isCloudinaryConfigured) {
            // Return a simulated asset link if keys are missing
            const mockUrl = `https://res.cloudinary.com/demo/image/upload/v12345/${folder}/${fileName}`;
            console.log(`[Cloudinary Mock Upload] Simulating upload of "${fileName}" -> "${mockUrl}"`);
            return resolve(mockUrl);
        }
        const uploadStream = cloudinary_1.cloudinary.uploader.upload_stream({
            folder: `lifeos_ai/${folder}`,
            public_id: fileName.split('.')[0],
            resource_type: 'auto',
        }, (error, result) => {
            if (error) {
                console.error('Cloudinary stream upload error:', error);
                return reject(error);
            }
            if (result && result.secure_url) {
                resolve(result.secure_url);
            }
            else {
                reject(new Error('Cloudinary response did not contain secure_url'));
            }
        });
        uploadStream.end(fileBuffer);
    });
};
exports.uploadToCloudinary = uploadToCloudinary;
//# sourceMappingURL=uploadMiddleware.js.map