import { GoogleGenAI } from '@google/genai';
import { getSystemInstruction } from './knowledgeService.js';

let aiInstance = null;

function getAIClient() {
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  if (!apiKey) {
    const error = new Error('GEMINI_API_KEY is missing in server environment.');
    error.code = 'MISSING_API_KEY';
    throw error;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

/**
 * Sends conversation to Gemini via official @google/genai SDK.
 */
export async function generateChatResponse(message, history = []) {
  const ai = getAIClient();
  const primaryModel = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
  const fallbackModels = ['gemini-3.5-flash-lite', 'gemini-3.5-flash', 'gemini-flash-lite-latest', 'gemini-3.8-flash'];
  const systemInstruction = getSystemInstruction();

  // Map sliding window history to Gemini format
  const contents = [];

  if (Array.isArray(history)) {
    // Only take the last 8 turns to stay focused and avoid context bloat
    const boundedHistory = history.slice(-8);
    for (const item of boundedHistory) {
      if (!item || typeof item.content !== 'string') continue;
      const text = item.content.trim();
      if (!text) continue;
      const role = (item.role === 'assistant' || item.role === 'model') ? 'model' : 'user';
      contents.push({
        role,
        parts: [{ text }]
      });
    }
  }

  // Add the current user query
  contents.push({
    role: 'user',
    parts: [{ text: message.trim() }]
  });

  const modelsToTry = [primaryModel, ...fallbackModels];
  let lastError = null;

  for (const modelToUse of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model: modelToUse,
        contents,
        config: {
          systemInstruction,
          temperature: 0.35,
          maxOutputTokens: 900
        }
      });

      const replyText = response?.text;
      if (typeof replyText === 'string' && replyText.trim()) {
        return replyText.trim();
      }
    } catch (err) {
      console.warn(`[GeminiService] Model ${modelToUse} failed: ${err.message}. Trying next candidate if available...`);
      lastError = err;
    }
  }

  throw lastError || new Error('All candidate Gemini models failed to generate a response.');
}

