import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

let aiClient: GoogleGenerativeAI | null = null;
let isGeminiConfigured = false;

if (GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenerativeAI(GEMINI_API_KEY);
    console.log('Gemini API initialized successfully.');
    isGeminiConfigured = true;
  } catch (error) {
    console.error('Error initializing Gemini API Client:', error);
  }
} else {
  console.warn(
    'GEMINI_API_KEY is not defined. AI operations will return Mock generated data.'
  );
}

export const getGeminiModel = (modelName = 'gemini-1.5-flash') => {
  if (!isGeminiConfigured || !aiClient) {
    return null;
  }
  return aiClient.getGenerativeModel({ model: modelName });
};

export { isGeminiConfigured };
