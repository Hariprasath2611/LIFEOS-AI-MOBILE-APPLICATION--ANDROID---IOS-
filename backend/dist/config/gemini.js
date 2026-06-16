"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGeminiConfigured = exports.getGeminiModel = void 0;
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
let aiClient = null;
let isGeminiConfigured = false;
exports.isGeminiConfigured = isGeminiConfigured;
if (GEMINI_API_KEY) {
    try {
        aiClient = new generative_ai_1.GoogleGenerativeAI(GEMINI_API_KEY);
        console.log('Gemini API initialized successfully.');
        exports.isGeminiConfigured = isGeminiConfigured = true;
    }
    catch (error) {
        console.error('Error initializing Gemini API Client:', error);
    }
}
else {
    console.warn('GEMINI_API_KEY is not defined. AI operations will return Mock generated data.');
}
const getGeminiModel = (modelName = 'gemini-1.5-flash') => {
    if (!isGeminiConfigured || !aiClient) {
        return null;
    }
    return aiClient.getGenerativeModel({ model: modelName });
};
exports.getGeminiModel = getGeminiModel;
//# sourceMappingURL=gemini.js.map