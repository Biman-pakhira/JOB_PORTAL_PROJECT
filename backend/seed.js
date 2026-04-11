const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    // Clear existing data (optional, maybe just create new ones)
    // await prisma.job.deleteMany();
    // await prisma.update.deleteMany();
    // await prisma.admin.deleteMany();

    console.log('Starting seed...');

    // Dummy Admin
    const hashedPassword = await bcrypt.hash('password123', 10);
    const admin = await prisma.admin.upsert({
        where: { email: 'admin@jobportal.com' },
        update: {},
        create: {
            email: 'admin@jobportal.com',
            password: hashedPassword,
        },
    });
    console.log(`Admin created: ${admin.email}`);

    // Dummy Jobs
    const jobs = [
        {
            title: 'Frontend Developer',
            company: 'Tech Corp',
            location: 'New York, NY',
            type: 'Full-time',
            salary: '$100k - $120k',
            description: 'Looking for a skilled Next.js developer to join our team.',
            skills: 'React, Next.js, Tailwind CSS',
            url: 'https://example.com/apply/frontend',
            isActive: true
        },
        {
            title: 'Backend Engineer',
            company: 'Data Systems Inc',
            location: 'San Francisco, CA (Remote)',
            type: 'Contract',
            salary: '$130k - $150k',
            description: 'Design and build scalable Node.js microservices processing large datasets.',
            skills: 'Node.js, Express, MongoDB, Prisma',
            url: 'https://example.com/apply/backend',
            isActive: true
        },
        {
            title: 'UI/UX Designer',
            company: 'Creative Studio',
            location: 'London, UK',
            type: 'Part-time',
            salary: '£40k - £50k',
            description: 'Create amazing user experiences and interfaces for our new product line.',
            skills: 'Figma, Adobe XD, Design Systems',
            url: 'https://example.com/apply/designer',
            isActive: true
        },
        {
            title: 'Software Engineer Intern',
            company: 'StartupX',
            location: 'Remote',
            type: 'Internship',
            salary: '$20/hr',
            description: 'Great opportunity to learn and grow in a fast-paced environment.',
            skills: 'JavaScript, HTML, CSS',
            url: 'https://example.com/apply/intern',
            isActive: true
        },
        {
            title: 'DevOps Engineer',
            company: 'Cloud Native LLC',
            location: 'Austin, TX',
            type: 'Full-time',
            salary: '$120k - $140k',
            description: 'Manage our cloud infrastructure and CI/CD pipelines.',
            skills: 'AWS, Docker, Kubernetes, CI/CD',
            url: 'https://example.com/apply/devops',
            isActive: true
        },
        {
            title: "React Developer",
            company: "WebStudio",
            location: "Remote",
            type: "Full-time",
            salary: "$90k - $120k",
            description: "Build beautiful UIs with React and Tailwind.",
            skills: "React, CSS, HTML",
            url: "https://example.com/apply/react",
            isActive: true
        },
        {
            title: "Cloud Architect",
            company: "SkyData",
            location: "Global",
            type: "Contract",
            salary: "$160k+",
            description: "Lead our transition to serverless architecture.",
            skills: "AWS, Serverless, Node.js",
            url: "https://example.com/apply/cloud",
            isActive: true
        },
        {
            title: "Data Scientist",
            company: "BrainyAI",
            location: "San Francisco",
            type: "Full-time",
            salary: "$140k - $180k",
            description: "Train LLMs and build data pipelines.",
            skills: "Python, PyTorch, SQL",
            url: "https://example.com/apply/data",
            isActive: true
        }
    ];

    let jobsCreated = 0;
    for (const job of jobs) {
        await prisma.job.create({ data: job });
        jobsCreated++;
    }
    console.log(`Created ${jobsCreated} dummy jobs.`);

    // Dummy Updates
    const updates = [
        {
            title: 'New Government Vacancies Announced',
            date: 'April 10, 2026',
            type: 'Govt Job',
            body: 'There are new vacancies in the railway department. Check them out now on the portal.',
        },
        {
            title: 'Tech Hiring Spree in 2026',
            date: 'April 11, 2026',
            type: 'News',
            body: 'Many top tech companies are scaling up their engineering teams this spring. Be prepared for upcoming interviews.',
        }
    ];

    let updatesCreated = 0;
    for (const update of updates) {
        await prisma.update.create({ data: update });
        updatesCreated++;
    }
    console.log(`Created ${updatesCreated} dummy updates.`);
    console.log('Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
