const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.send('Job Portal API is running!');
});

// Import and use routes
const platformRoutes = require('./routes/authAndJobs');
app.use('/api', platformRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
