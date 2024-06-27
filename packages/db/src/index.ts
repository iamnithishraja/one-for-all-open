import {
  Course,
  PrismaClient,
  User,
  ProblemType,
  Problem,
  Track,
  Semister,
  Subject
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
export { ProblemType ,Semister};
