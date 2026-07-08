const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

const envPath = path.join(__dirname, '.env');
dotenv.config({ path: envPath });

const app = express();
const port = process.env.PORT || 5000;

if (!process.env.DATABASE_URL) {
  console.error('[server] CRITICAL: DATABASE_URL is not set. The server will not work until this is configured.');
  if (!process.env.VERCEL) {
    console.error('Set DATABASE_URL in your .env file to continue.');
  }
}

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://jobss.co.in',
  'https://jobs.co.in',
  process.env.FRONTEND_URL,
].filter(Boolean);

// Inside your cors() config, replace the origin check with a function:
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow server-to-server / curl
    if (
      allowedOrigins.includes(origin) ||
      /^https:\/\/job-portal-project-sgkt[a-z0-9-]*\.vercel\.app$/.test(origin)
    ) {
      return callback(null, true);
    }
    callback(new Error('CORS: origin ' + origin + ' not allowed'));
  },
  credentials: true,
}));