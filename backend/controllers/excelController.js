const xlsx = require('xlsx');

// Helper: case-insensitive column lookup accepting multiple aliases
function col(row, ...keys) {
    const rowLower = {};
    for (const k of Object.keys(row)) rowLower[k.toLowerCase().trim()] = row[k];
    for (const key of keys) {
        const v = rowLower[key.toLowerCase().trim()];
        if (v !== undefined && v !== null && String(v).trim() !== '') return String(v).trim();
    }
    return null;
}

async function processExcelJobUpload(fileBuffer, prisma, category = 'Private') {
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet);

    if (!rows || rows.length === 0) {
        throw new Error('Excel file is empty or has no data rows');
    }

    let added = 0;
    let updated = 0;
    let skipped = 0;

    for (const row of rows) {
        // Accept many common column name variations for job title and company
        const title = col(row, 'title', 'job title', 'job role', 'role', 'position', 'job', 'job role (title*)');
        const company = col(row, 'company', 'company name', 'employer', 'organization', 'organisation', 'employer (company*)');

        if (!title || !company) { skipped++; continue; }

        const location = col(row, 'location', 'city', 'place', 'job location');
        const type = col(row, 'type', 'job type', 'employment type', 'employment');
        const salary = col(row, 'salary', 'ctc', 'pay', 'compensation', 'package', 'stipend', 'ctc (salary)');
        const description = col(row, 'description', 'job description', 'details', 'about', 'summary');
        const experience = col(row, 'experience', 'exp', 'years of experience', 'yoe');
        const postingDate = col(row, 'posting date', 'date', 'posted on', 'postingdate', 'post date');
        let skills = col(row, 'skills', 'skill', 'required skills', 'tech stack', 'technologies', 'tech stack (skills)') || '';
        const url = col(row, 'url', 'link', 'apply link', 'apply url', 'apply');

        const jobData = {
            title, company,
            location,
            type,
            salary,
            description,
            skills,
            url,
            experience,
            postingDate,
            category,
            isActive: true
        };

        const existingJob = await prisma.job.findFirst({ where: { title, company } });
        if (existingJob) {
            await prisma.job.update({ where: { id: existingJob.id }, data: jobData });
            updated++;
        } else {
            await prisma.job.create({ data: jobData });
            added++;
        }
    }

    return { message: 'Excel processed successfully', added, updated, skipped };
}



async function processExcelUpdateUpload(fileBuffer, prisma) {
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet);

    if (!rows || rows.length === 0) {
        throw new Error('Excel file is empty or formatted incorrectly');
    }

    let added = 0;
    let updated_count = 0;

    for (const row of rows) {
        const title = row['Title'] || row['title'];
        if (!title) continue;

        const date = row['Date'] || row['date'] || null;
        const type = row['Type'] || row['type'] || 'Feature';
        const body = row['Body'] || row['body'] || row['Description'] || row['description'] || null;

        const updateData = {
            title: String(title),
            date: date ? String(date) : null,
            type: String(type),
            body: body ? String(body) : null,
        };

        const existingUpdate = await prisma.update.findFirst({
            where: { title: updateData.title }
        });

        if (existingUpdate) {
            await prisma.update.update({
                where: { id: existingUpdate.id },
                data: updateData
            });
            updated_count++;
        } else {
            await prisma.update.create({
                data: updateData
            });
            added++;
        }
    }

    return { message: 'Excel processed successfully', added, updated: updated_count };
}

module.exports = {
    processExcelJobUpload,
    processExcelUpdateUpload
};
