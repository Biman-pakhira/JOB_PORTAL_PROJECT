const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const { OAuth2Client } = require('google-auth-library');
const { processExcelJobUpload, processExcelUpdateUpload } = require('../controllers/excelController');

const router = express.Router();
const prisma = new PrismaClient();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper to handle Prisma errors with descriptive messages
const handlePrismaError = (error, res) => {
    console.error('Prisma Error:', error);
    if (error.code === 'P2024' || error.message.includes('Server selection timed out')) {
        return res.status(503).json({ 
            error: 'Database connection timeout. Please ensure your IP is whitelisted in MongoDB Atlas.',
            code: 'DB_CONNECTION_TIMEOUT'
        });
    }
    if (error.code === 'P2002') {
        const target = error.meta?.target || 'field';
        return res.status(400).json({ error: `Unique constraint failed on ${target}` });
    }
    res.status(500).json({ error: 'Internal server error' });
};

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

// Image storage for profile pictures
const avatarStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../uploads/avatars');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `avatar_${req.userId}_${Date.now()}${ext}`);
    }
});
const avatarUpload = multer({
    storage: avatarStorage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Only image files are allowed'));
    },
    limits: { fileSize: 2 * 1024 * 1024 } // 2 MB cap
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
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const admin = await prisma.admin.findUnique({ where: { email } });
        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ adminId: admin.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, message: 'Logged in successfully' });
    } catch (error) {
        handlePrismaError(error, res);
    }
});

// Create initial admin (only use for setup)
router.post('/admin/setup', async (req, res) => {
    try {
        const { email, password, masterKey } = req.body;

        if (!process.env.ADMIN_MASTER_KEY) {
            return res.status(500).json({ error: 'Server misconfiguration: ADMIN_MASTER_KEY is not set.' });
        }
        if (masterKey !== process.env.ADMIN_MASTER_KEY) {
            return res.status(403).json({ error: 'Invalid master key. Registration denied.' });
        }

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        const existing = await prisma.admin.findUnique({ where: { email } });
        if (existing) {
            return res.status(400).json({ error: 'Admin already exists' });
        }
        const hash = await bcrypt.hash(password, 10);
        await prisma.admin.create({
            data: { email, password: hash }
        });
        res.json({ message: 'Admin created successfully' });
    } catch (error) {
        handlePrismaError(error, res);
    }
});

// Middleware to verify Admin JWT
const verifyAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded.adminId) {
            return res.status(403).json({ error: 'Forbidden: Admin access required' });
        }
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

// Google Social Auth
router.post('/auth/google', async (req, res) => {
    try {
        const { credential } = req.body;
        if (!credential) return res.status(400).json({ error: 'No credential provided' });

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { sub, email, name, picture } = ticket.getPayload();

        let user = await prisma.user.findUnique({ where: { email } });

        if (user) {
            if (!user.googleId) {
                user = await prisma.user.update({
                    where: { email },
                    data: { googleId: sub, profileImage: user.profileImage || picture }
                });
            }
        } else {
            user = await prisma.user.create({
                data: {
                    name,
                    email,
                    googleId: sub,
                    profileImage: picture,
                    role: 'customer'
                }
            });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ 
            token, 
            user: { 
                id: user.id, 
                name: user.name, 
                email: user.email, 
                role: user.role, 
                profileImage: user.profileImage 
            } 
        });
    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(401).json({ error: 'Google authentication failed' });
    }
});

// ------------- JOBS -------------

// Public Route: Fetch all jobs
router.get('/jobs', async (req, res) => {
    try {
        const { search, type, location } = req.query;

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
        const category = req.body.category || 'Private';
        const result = await processExcelJobUpload(req.file.buffer, prisma, category);
        res.json(result);
    } catch (error) {
        console.error('Excel upload error:', error);
        res.status(500).json({ error: 'Error processing excel file', details: error.message });
    }
});

// Admin Route: Manual Job Create
router.post('/admin/jobs', verifyAdmin, async (req, res) => {
    try {
        const { id, title, company, location, type, salary, description, skills, qualifications, url, experience, postingDate, category, urgent, logo, logoColor, deadline, postedAgo } = req.body;
        
        const jobData = {
            title, company, location, type, salary, description, skills, qualifications,
            url, experience, postingDate, category,
            urgent: urgent === true || urgent === 'true',
            logo, logoColor, deadline,
            postedAgo: postedAgo || 'Just now',
            isActive: true
        };

        const job = await prisma.job.create({ data: jobData });
        res.json({ message: 'Job created successfully', job });
    } catch (error) {
        handlePrismaError(error, res);
    }
});

// Admin Route: Individual Job Update
router.patch('/admin/jobs/:id', verifyAdmin, async (req, res) => {
    try {
        const { id, createdAt, updatedAt, applications, ...updateData } = req.body;
        
        const updated = await prisma.job.update({
            where: { id: req.params.id },
            data: updateData
        });
        res.json({ message: 'Job updated successfully', job: updated });
    } catch (error) {
        handlePrismaError(error, res);
    }
});

// Admin Route: Individual Job Delete
router.delete('/admin/jobs/:id', verifyAdmin, async (req, res) => {
    try {
        await prisma.job.delete({
            where: { id: req.params.id }
        });
        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        handlePrismaError(error, res);
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

// GET: current user profile with all fields
router.get('/me', verifyUser, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: { 
                id: true, name: true, email: true, role: true, 
                resumeUrl: true, resumeName: true,
                profileImage: true, headline: true, location: true, phone: true,
                topSkills: true, preferredSalary: true, workSetting: true,
                desiredRole: true, industryFocus: true, openToWork: true
            }
        });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update profile details
router.put('/profile', verifyUser, async (req, res) => {
    try {
        const { 
            name, headline, location, phone, topSkills, 
            preferredSalary, workSetting, desiredRole, industryFocus, openToWork 
        } = req.body;
        
        const updated = await prisma.user.update({
            where: { id: req.userId },
            data: { 
                name, headline, location, phone, topSkills, 
                preferredSalary, workSetting, desiredRole, industryFocus,
                openToWork: openToWork === true || openToWork === 'true'
            }
        });
        res.json({ message: 'Profile updated successfully', user: updated });
    } catch (error) {
        res.status(500).json({ error: 'Error updating profile' });
    }
});

// POST: upload profile image
router.post('/profile/image', verifyUser, (req, res) => {
    avatarUpload.single('image')(req, res, async (err) => {
        if (err) return res.status(400).json({ error: err.message });
        if (!req.file) return res.status(400).json({ error: 'No image file uploaded' });
        try {
            const profileImage = `/uploads/avatars/${req.file.filename}`;
            await prisma.user.update({
                where: { id: req.userId },
                data: { profileImage }
            });
            res.json({ message: 'Profile image updated', profileImage });
        } catch (error) {
            console.error('Image upload error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
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