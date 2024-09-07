
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    
    await prisma.college.deleteMany({});
    await prisma.course.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.codeLanguage.deleteMany({});
    await prisma.problem.deleteMany({});
    await prisma.submission.deleteMany({});

    const college1 = await prisma.college.create({
        data: {
            name: 'Tech University',
        },
    });

    const course1 = await prisma.course.create({
        data: {
            name: 'Computer Science',
            colleges: {
                connect: { id: college1.id },
            },
        },
    });

    const user1 = await prisma.user.create({
        data: {
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'securepassword',
            role: 'user',
            collegeId: college1.id,
            courseId: course1.id,
            semister: 'First',
        },
    });

    const codeLanguage1 = await prisma.codeLanguage.create({
        data: {
            id: 1,
            value: 'js',
            label: 'JavaScript',
        },
    });

    const problem1 = await prisma.problem.create({
        data: {
            title: 'Simple Problem',
            description: 'A simple problem to solve',
            notionDocId: 'doc123',
            problemType: 'Code',
        },
    });

    const problemStatement1 = await prisma.problemStatement.create({
        data: {
            problemId: problem1.id,
        },
    });

    const submission1 = await prisma.submission.create({
        data: {
            code: 'console.log("Hello, world!");',
            codeLanguageId: codeLanguage1.id,
            statusId: 1,
            statusDesc: 'Accepted',
            runtime: 20,
            memoryUsage: 1024,
            testCasesPassed: 1,
            problemStatementId: problemStatement1.id,
            userId: user1.id,
        },
    });

    console.log('Seed data created successfully.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
