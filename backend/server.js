// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';

import authRoutes from './src/routes/auth.js';
import itemRoutes from './src/routes/items.js';
import cartRoutes from './src/routes/cart.js';

// Load .env only for local/dev; Render/production uses injected env vars
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const app = express();

/* ----------------------------- Middleware ----------------------------- */
app.use(helmet());                // security headers
app.use(express.json());          // JSON body parsing
app.use(morgan('dev'));           // request logs

// CORS allow-list via env:
// - CLIENT_ORIGIN: comma-separated list of allowed origins (prod frontends)
// - ALLOW_ANY_LOCALHOST=true: allow any http://localhost:* for local dev
const allowAnyLocalhost = process.env.ALLOW_ANY_LOCALHOST === 'true';
const allowlist = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, cb) {
    // allow tools/curl without Origin
    if (!origin) return cb(null, true);

    // allow any localhost when enabled
    if (allowAnyLocalhost && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return cb(null, true);
    }

    // explicit allowlist for production
    if (allowlist.includes(origin)) return cb(null, true);

    const err = new Error(`Not allowed by CORS: ${origin}`);
    err.status = 403;
    return cb(err);
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

/* -------------------------------- Routes ------------------------------ */
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/cart', cartRoutes);

/* --------------------------- DB + Server Boot ------------------------- */
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error('Missing MONGO_URI/MONGODB_URI in environment');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    // Bind to all interfaces for Render/containers
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 API running on :${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Mongo error', err);
    process.exit(1);
  });

// Optional: generic error handler (keeps JSON shape)
app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
});
