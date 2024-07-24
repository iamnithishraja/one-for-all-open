import {
  Course,
  PrismaClient,
  User,
  ProblemType,
  Problem,
  Track,
  Semister,
  Program,
  Subject,
  CodeLanguage,
  TestCase,
  MCQQuestion,
  QuizScore,
  ProblemStatement,
  Submission,
} from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

// eslint-disable-next-line
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export type UserType = User;
export type CourseType = Course;
export type TrackType = Track;
export type ProblemT = Problem;
export type SubjectType = Subject;
export type ProgramType = Program;
export type CodeLanguageType = CodeLanguage;
export type TestCaseType = TestCase;
export type McqType = MCQQuestion;
export type QuizScoreType = QuizScore;
export type ProblemStatementType = ProblemStatement;
export type SubmissionType = Submission;
export { ProblemType, Semister };
