const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://jobss.co.in',
  process.env.FRONTEND_URL, // optional override from env
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (curl, mobile apps, same-origin)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin '${origin}' not allowed`));
    }
  },
  credentials: true,
}));
app.use(express.json());

const distPath = fs.existsSync(path.join(__dirname, '../frontend/dist'))
  ? path.join(__dirname, '../frontend/dist')
  : path.join(__dirname, 'dist');

app.use(express.static(distPath));

const platformRoutes = require('./routes/authAndJobs');
app.use('/api', platformRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
}

module.exports = app;