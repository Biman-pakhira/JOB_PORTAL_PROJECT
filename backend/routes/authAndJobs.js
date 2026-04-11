const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const { processExcelJobUpload, processExcelUpdateUpload } = require('../controllers/excelController');

const router = express.Router();
const prisma = new PrismaClient();
const upload = multer({ storage: multer.memoryStorage() }); // In-memory storage for Excel parsing

// PDF disk storage for resumes
const resumeStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../uploads/resumes');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `resume_${req.userId}_${Date.now()}${ext}`);
    }
});
const resumeUpload = multer({
    storage: resumeStorage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') cb(null, true);
        else cb(new Error('Only PDF files are allowed'));
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB cap
});

// Middleware to verify standard User JWT
const verifyUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        req.userRole = decoded.role;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};


// ------------- ADMIN AUTHENTICATION -------------
router.post('/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await prisma.admin.findUnique({ where: { email } });
        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ adminId: admin.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, message: 'Logged in successfully' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create initial admin (only use for setup)
router.post('/admin/setup', async (req, res) => {
    try {
        const { email, password } = req.body;
        const existing = await prisma.admin.findUnique({ where: { email } });
        if (existing) {
            return res.status(400).json({ error: 'Admin already exists' });
        }
        const hash = await bcrypt.hash(password, 10);
        const admin = await prisma.admin.create({
            data: { email, password: hash }
        });
        res.json({ message: 'Admin created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Middleware to verify JWT
const verifyAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.adminId = decoded.adminId;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// ------------- USER AUTHENTICATION -------------
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const hash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email, password: hash, role: role || 'customer' }
        });
        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ------------- JOBS -------------

// Public Route: Fetch all jobs
router.get('/jobs', async (req, res) => {
    try {
        const { search, type, location } = req.query;

        // Construct Prisma where clause dynamically based on search params
        const where = { isActive: true };
        if (search) {
            where.title = { contains: search, mode: 'insensitive' };
        }
        if (type) {
            where.type = type;
        }
        if (location) {
            where.location = { contains: location, mode: 'insensitive' };
        }
        if (req.query.category) {
            where.category = req.query.category;
        }

        const jobs = await prisma.job.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching jobs' });
    }
});

// Public Route: Fetch single job by ID
router.get('/jobs/:id', async (req, res) => {
    try {
        const job = await prisma.job.findUnique({
            where: { id: req.params.id }
        });
        if (!job) return res.status(404).json({ error: 'Job not found' });
        res.json(job);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching job details' });
    }
});

// Public Route: Fetch all updates
router.get('/updates', async (req, res) => {
    try {
        const updates = await prisma.update.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(updates);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching updates' });
    }
});

// Admin Route: Upload Jobs via Excel
router.post('/admin/jobs/upload', verifyAdmin, upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No excel file uploaded' });
    }

    try {
        console.log('Upload received. Body:', req.body);
        const category = req.body.category || 'Private';
        console.log('Processing with category:', category);
        const result = await processExcelJobUpload(req.file.buffer, prisma, category);
        res.json(result);
    } catch (error) {
        console.error('Excel upload error:', error);
        res.status(500).json({ error: 'Error processing excel file', details: error.message });
    }
});

// Admin Route: Upload Updates via Excel
router.post('/admin/updates/upload', verifyAdmin, upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No excel file uploaded' });
    }

    try {
        const result = await processExcelUpdateUpload(req.file.buffer, prisma);
        res.json(result);
    } catch (error) {
        console.error('Excel upload error:', error);
        res.status(500).json({ error: 'Error processing excel file', details: error.message });
    }
});

// ------------- USER PROFILE -------------

// GET: current user profile (id, name, email, role, resumeUrl, resumeName)
router.get('/me', verifyUser, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: { id: true, name: true, email: true, role: true, resumeUrl: true, resumeName: true }
        });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST: upload resume PDF (authenticated user)
router.post('/resume/upload', verifyUser, (req, res) => {
    resumeUpload.single('resume')(req, res, async (err) => {
        if (err) return res.status(400).json({ error: err.message });
        if (!req.file) return res.status(400).json({ error: 'No PDF file uploaded' });
        try {
            const resumeUrl = `/uploads/resumes/${req.file.filename}`;
            await prisma.user.update({
                where: { id: req.userId },
                data: { resumeUrl, resumeName: req.file.originalname }
            });
            res.json({ message: 'Resume uploaded successfully', resumeUrl, resumeName: req.file.originalname });
        } catch (error) {
            console.error('Resume upload error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});

// ------------- APPLICATIONS -------------

// GET: all applications for the current user
router.get('/applications', verifyUser, async (req, res) => {
    try {
        const applications = await prisma.application.findMany({
            where: { userId: req.userId },
            include: {
                job: { select: { id: true, title: true, company: true, location: true, type: true, salary: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching applications' });
    }
});

// POST: apply to a job
router.post('/applications', verifyUser, async (req, res) => {
    try {
        const { jobId } = req.body;
        if (!jobId) return res.status(400).json({ error: 'jobId is required' });

        // Prevent duplicate applications
        const existing = await prisma.application.findFirst({
            where: { userId: req.userId, jobId }
        });
        if (existing) return res.status(400).json({ error: 'Already applied to this job' });

        const application = await prisma.application.create({
            data: { userId: req.userId, jobId, status: 'Applied' },
            include: { job: { select: { title: true, company: true } } }
        });
        res.json({ message: 'Application submitted', application });
    } catch (error) {
        console.error('Apply error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PATCH: update application status (admin use)
router.patch('/applications/:id/status', verifyAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        const updated = await prisma.application.update({
            where: { id: req.params.id },
            data: { status }
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Error updating status' });
    }
});

module.exports = router;
