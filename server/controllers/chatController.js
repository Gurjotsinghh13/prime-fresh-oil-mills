import { generateChatResponse } from '../services/geminiService.js';

export async function handleChat(req, res) {
  try {
    const { message, history } = req.body || {};

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required and must be a non-empty string.' });
    }

    const trimmed = message.trim();
    if (trimmed.length > 2000) {
      return res.status(400).json({ error: 'Message exceeds maximum allowed length of 2000 characters.' });
    }

    let sanitizedHistory = [];
    if (Array.isArray(history)) {
      sanitizedHistory = history.slice(-10).map(item => ({
        role: item?.role === 'assistant' || item?.role === 'model' ? 'assistant' : 'user',
        content: String(item?.content || '').slice(0, 2000)
      }));
    }

    const reply = await generateChatResponse(trimmed, sanitizedHistory);
    return res.status(200).json({ reply });

  } catch (error) {
    if (error.code === 'MISSING_API_KEY') {
      return res.status(503).json({
        error: 'The Gemini API key is not configured on the server. Please add your GEMINI_API_KEY to server/.env to enable live AI responses.',
        code: 'MISSING_API_KEY'
      });
    }

    const errorMsg = String(error?.message || '');
    if (errorMsg.includes('429') || errorMsg.includes('quota') || errorMsg.includes('ResourceExhausted')) {
      return res.status(429).json({
        error: 'Our AI Assistant is receiving high trade inquiry volume right now. Please reach our commercial desk directly via WhatsApp at +91 90572 92529 or phone.',
        code: 'RATE_LIMITED',
        fallback: {
          phone: '+91 90572 92529',
          whatsapp: 'https://wa.me/919057292529'
        }
      });
    }

    console.error('[ChatController Error]:', errorMsg);
    return res.status(500).json({
      error: 'Sorry, our AI Assistant is temporarily unavailable. Please try again in a moment or contact our sales team directly at +91 90572 92529 or via WhatsApp.',
      code: 'API_ERROR',
      fallback: {
        phone: '+91 90572 92529',
        whatsapp: 'https://wa.me/919057292529'
      }
    });
  }
}

export function handleHealth(req, res) {
  const hasKey = Boolean((process.env.GEMINI_API_KEY || '').trim());
  return res.status(200).json({
    status: 'ok',
    service: 'Prime Fresh Oil Mills Chatbot API',
    model: process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
    geminiConfigured: hasKey,
    timestamp: new Date().toISOString()
  });
}
