"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCloudinaryConfigured = exports.cloudinary = void 0;
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
let isCloudinaryConfigured = false;
exports.isCloudinaryConfigured = isCloudinaryConfigured;
if (cloudName && apiKey && apiSecret) {
    cloudinary_1.v2.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
    });
    console.log('Cloudinary SDK configured successfully.');
    exports.isCloudinaryConfigured = isCloudinaryConfigured = true;
}
else {
    console.warn('Cloudinary configuration is incomplete. File uploads will run in MOCK mode (returning local paths/mock URLs).');
}
//# sourceMappingURL=cloudinary.js.map