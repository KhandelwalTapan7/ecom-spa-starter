import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';

import authRoutes from './src/routes/auth.js';
import itemRoutes from './src/routes/items.js';
import cartRoutes from './src/routes/cart.js';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// CORS allow-list (env) + optional "allow any localhost" for dev
const allowAnyLocalhost = (process.env.ALLOW_ANY_LOCALHOST === 'true');
const allowlist = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, cb) {
    // allow tools/curl without Origin
    if (!origin) return cb(null, true);

    // allow any http://localhost:* or http://127.0.0.1:* when enabled
    if (allowAnyLocalhost && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return cb(null, true);
    }

    // otherwise, fall back to explicit allowlist
    if (allowlist.includes(origin)) return cb(null, true);

    return cb(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
}));


// Routes
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/cart', cartRoutes);

// DB + server
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('MONGO_URI is not set in .env');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`API running on :${PORT}`));
  })
  .catch((err) => {
    console.error('Mongo error', err);
    process.exit(1);
  });
