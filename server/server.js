import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRoutes from './routes/chatRoutes.js';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration - allow localhost:8000 and standard origins
const allowedOrigins = [
  'http://localhost:8000',
  'http://127.0.0.1:8000',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

if (process.env.ALLOWED_ORIGIN) {
  allowedOrigins.push(process.env.ALLOWED_ORIGIN);
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or same-origin)
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }
    return callback(null, true); // Dev-friendly permissive CORS
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser with 10kb limit
app.use(express.json({ limit: '10kb' }));

// Serve API routes
app.use('/api', chatRoutes);

// Root health ping
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Prime Fresh Oil Mills AI Sales Backend',
    endpoints: {
      health: '/api/health',
      chat: '/api/chat'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Endpoint ${req.method} ${req.path} not found.`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error occurred.'
  });
});

// Start listening
const server = app.listen(PORT, () => {
  console.log(`[Prime Fresh AI Server] Running on http://localhost:${PORT}`);
  console.log(`[Prime Fresh AI Server] Health check: http://localhost:${PORT}/api/health`);
  console.log(`[Prime Fresh AI Server] Gemini API Key configured: ${Boolean(process.env.GEMINI_API_KEY)}`);
});

export default app;
