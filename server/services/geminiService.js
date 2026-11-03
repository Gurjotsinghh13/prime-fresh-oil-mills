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
 * Checks whether an error is transient (network drop, TCP reset, rate limit, timeout, service overloaded)
 */
function isTransientError(err) {
  if (!err) return false;
  const msg = String(err.message || '').toLowerCase();
  const code = String(err.code || '').toLowerCase();
  const status = Number(err.status || err.statusCode || 0);

  if (status === 429 || status === 502 || status === 503 || status === 504) return true;
  if (msg.includes('connection was forcibly closed') || msg.includes('wsasend') || msg.includes('econnreset')) return true;
  if (msg.includes('etimedout') || msg.includes('socket hang up') || msg.includes('timeout') || msg.includes('timed out')) return true;
  if (msg.includes('fetch failed') || msg.includes('network error') || msg.includes('overloaded') || msg.includes('resourceexhausted')) return true;
  if (code.includes('econnreset') || code.includes('etimedout')) return true;
  return false;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Executes a promise with an enforced timeout.
 */
function withTimeout(promise, timeoutMs = 18000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      const timer = setTimeout(() => {
        const err = new Error(`Gemini request timed out after ${timeoutMs}ms`);
        err.code = 'ETIMEDOUT';
        reject(err);
      }, timeoutMs);
      if (typeof timer.unref === 'function') timer.unref();
    })
  ]);
}

/**
 * Sends conversation to Gemini via official @google/genai SDK with timeout and transient retry.
 */
export async function generateChatResponse(message, history = []) {
  const ai = getAIClient();
  const systemInstruction = getSystemInstruction();

  // Deduplicate and prioritize active production models (skip deprecated 2.5)
  const candidateSet = new Set([
    (process.env.GEMINI_MODEL || '').trim(),
    'gemini-3.5-flash-lite',
    'gemini-3.5-flash',
    'gemini-flash-lite-latest',
    'gemini-2.0-flash'
  ].filter(Boolean));

  candidateSet.delete('gemini-2.5-flash');
  const modelsToTry = Array.from(candidateSet);

  // Map sliding window history to Gemini format
  const contents = [];
  if (Array.isArray(history)) {
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

  let lastError = null;

  for (const modelToUse of modelsToTry) {
    const MAX_RETRIES = 2;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const callPromise = ai.models.generateContent({
          model: modelToUse,
          contents,
          config: {
            systemInstruction,
            temperature: 0.35,
            maxOutputTokens: 900
          }
        });

        const response = await withTimeout(callPromise, 18000);
        const replyText = response?.text;
        if (typeof replyText === 'string' && replyText.trim()) {
          return replyText.trim();
        }
      } catch (err) {
        lastError = err;
        const isTransient = isTransientError(err);
        const isLastAttempt = attempt === MAX_RETRIES;

        if (isTransient && !isLastAttempt) {
          const delay = Math.min(600 * Math.pow(2, attempt), 2500);
          console.warn(`[GeminiService] Transient failure on ${modelToUse} (attempt ${attempt + 1}): ${err.message}. Retrying in ${delay}ms...`);
          await wait(delay);
          continue;
        }

        // Non-transient error or exhausted retries for this model
        console.warn(`[GeminiService] Candidate model ${modelToUse} failed: ${err.message}. Trying next candidate if available...`);
        break; // break inner attempt loop to try next model
      }
    }
  }

  throw lastError || new Error('All candidate Gemini models failed to generate a response.');
}
