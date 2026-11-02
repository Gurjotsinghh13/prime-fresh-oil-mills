import { Router } from 'express';
import { handleChat, handleHealth } from '../controllers/chatController.js';
import { chatLimiter, apiLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Health check endpoint
router.get('/health', apiLimiter, handleHealth);

// Chat completions endpoint
router.post('/chat', chatLimiter, handleChat);

export default router;
