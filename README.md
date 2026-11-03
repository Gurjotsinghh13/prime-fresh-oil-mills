# Prime Fresh Oil Mills — B2B Website & AI Sales Assistant

A modern, high-performance B2B web application for **Prime Fresh Oil Mills** (Mustard Oil, Seeds & De-oiled Cakes Manufacturer) featuring an interactive product catalog, multi-product quote basket, seed-to-oil yield calculator, and a real-time **Gemini AI Sales Assistant**.

---

## 1. Project Architecture & Directory Structure

The project is structured with a decoupled static frontend and an Express Node.js backend:

```
prime-fresh-oil-mills/
├── public/                     # Static Frontend (Deployed to Netlify)
│   ├── index.html              # Main HTML entrypoint
│   ├── css/
│   │   ├── styles.css          # Main styling & layout
│   │   └── chatbot.css         # AI chatbot widget & launcher styles
│   ├── js/
│   │   ├── config.js           # Business data, catalog, benchmarks & API URL config
│   │   ├── main.js             # UI interactions, quote basket & yield calculator
│   │   ├── chatbot.js          # Chatbot UI controller & API client
│   │   ├── marked.min.js       # Markdown parser
│   │   └── purify.min.js       # DOMPurify HTML sanitizer
│   └── assets/
│       ├── logo-emblem.png
│       ├── logo-full.png
│       ├── products/           # Product photography
│       └── video/              # Facility videos & posters
│
├── server/                     # Backend API (Deployed to Render)
│   ├── package.json            # Node.js dependencies & scripts
│   ├── server.js               # Express entrypoint, CORS & middleware
│   ├── routes/
│   │   └── chatRoutes.js       # /api/chat and /api/health routes
│   ├── controllers/
│   │   └── chatController.js   # Request validation & rate-limiting controller
│   ├── services/
│   │   └── geminiService.js    # Official @google/genai SDK integration
│   ├── .env.example            # Environment variable template
│   └── .env                    # Local secrets (gitignored)
│
├── netlify.toml                # Netlify build & security configuration
├── .gitignore                  # Git exclusions (.env, node_modules)
└── README.md                   # Deployment & operational guide
```

---

## 2. Local Development Setup

To run the complete system locally:

### A. Start the Backend API (Port 3000)
1. Open a terminal in the `server/` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and add your Gemini API key:
   ```env
   PORT=3000
   GEMINI_API_KEY=your_actual_gemini_api_key
   GEMINI_MODEL=gemini-2.5-flash
   ALLOWED_ORIGIN=http://localhost:8000,http://127.0.0.1:8000
   NODE_ENV=development
   ```
4. Start the server:
   ```bash
   npm start
   ```
   *The API will be available at `http://localhost:3000` (Health ping: `http://localhost:3000/api/health`).*

### B. Start the Frontend (Port 8000)
1. In the project root, start an HTTP server pointing to `public/`:
   ```bash
   python -m http.server 8000 --directory public
   # or with Node:
   # npx serve public -l 8000
   ```
2. Open `http://localhost:8000` in your web browser.
   *The frontend automatically connects to `http://localhost:3000/api/chat` during local development.*

---

## 3. Production Deployment Guide

### Phase 1: Deploy Backend to Render

1. Log in to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** → **Web Service**.
3. Connect your Git repository.
4. Configure the Web Service settings:
   - **Name:** `prime-fresh-oil-mills` (or your preferred name)
   - **Root Directory:** `server` *(Important: sets context to the backend folder)*
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free` (or preferred plan)
5. Under **Environment Variables**, add:
   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `GEMINI_API_KEY` | `<your-google-gemini-api-key>` | Obtained from Google AI Studio |
   | `GEMINI_MODEL` | `gemini-3.5-flash-lite` | Supported model for B2B inquiries |
   | `ALLOWED_ORIGIN` | `https://prime-fresh-oil.netlify.app` | Your frontend production URL(s) |
   | `NODE_ENV` | `production` | Enables strict CORS and security settings |
6. Click **Deploy Web Service**.
7. Once deployment finishes, copy your Render service URL (e.g., `https://prime-fresh-oil-mills.onrender.com`).
8. Verify backend health in browser or curl:
   ```bash
   curl https://prime-fresh-oil-mills.onrender.com/api/health
   ```
   Expected response: `{"status":"ok","model":"gemini-3.5-flash-lite","geminiConfigured":true}`

---

### Phase 2: Deploy Frontend to Netlify

1. Log in to your [Netlify Dashboard](https://app.netlify.com/).
2. Click **Add new site** → **Import an existing project** (or drag the `public/` folder into Netlify Drop).
3. If importing via Git, Netlify will automatically detect settings from `netlify.toml`:
   - **Base directory:** *(Leave blank / root)*
   - **Build command:** *(Leave blank)*
   - **Publish directory:** `public`
4. Connect Frontend to your Render Backend:
   - **Option A (Direct Service URL - Recommended):**
     In `public/js/config.js`, set `apiBaseUrl` to your Render URL:
     ```javascript
     window.PFOM = {
       business: {
         name: "Prime Fresh Oil Mills",
         // ...
         apiBaseUrl: "https://prime-fresh-oil-mills.onrender.com"
       }
     };
     ```
   - **Option B (Netlify Rewrite Proxy):**
     If you prefer proxying `/api/*` through Netlify without changing `config.js`, `public/_redirects` and `netlify.toml` automatically proxy requests:
     ```toml
     [[redirects]]
       from = "/api/*"
       to = "https://prime-fresh-oil-mills.onrender.com/api/:splat"
       status = 200
       force = true
     ```
6. Click **Deploy Site**.
7. Once deployed, verify your Netlify URL (e.g. `https://prime-fresh-oil.netlify.app`).

---

## 4. Security & Compliance Measures

- **No Secrets in Frontend:** The Gemini API key is never bundled, compiled, or referenced in frontend client code.
- **Git Safety:** `server/.env` and any `.env*` files are strictly excluded via `.gitignore`. `.env.example` contains only non-sensitive placeholders.
- **CORS Protection:** Express backend explicitly validates incoming browser origins against `ALLOWED_ORIGIN`.
- **Rate Limiting:** `express-rate-limit` prevents spam and unauthorized consumption on `/api/chat` (15 requests/minute per IP).
- **Output Sanitization:** All AI-generated Markdown is rendered safely through `Marked` and sanitized using `DOMPurify` to eliminate XSS risks.
- **Privacy & Contact:** Physical office address placeholder remains unconfirmed and protected; verified sales phone (`+91 90572 92529`) and email (`Puneet2garg@gmail.com`) are displayed accurately.

---

## 5. Verification Checklist

- [x] Static frontend organized cleanly inside `public/`.
- [x] Express backend isolated inside `server/`.
- [x] Relative paths for CSS, JS, images and video verified and functional.
- [x] Backend `npm start` script (`node server.js`) verified.
- [x] Backend listens dynamically to `process.env.PORT`.
- [x] CORS origin handling supports production environment variable.
- [x] API health endpoint (`/api/health`) and chat endpoint (`/api/chat`) operational.
- [x] Multi-product quote basket, yield calculator, and catalog intact.
- [x] Zero browser console errors and zero horizontal layout overflow.
