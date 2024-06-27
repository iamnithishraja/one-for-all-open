"use server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import prismaClient from "@repo/db/client";
import { authOptions } from "../../lib/auth";
import { CreateTrackSchema } from "../track/schema";
import {
  createProblemSchema,
  deleteProblemSchema,
  updateProblemSchema,
} from "./schema";
import {
  InputTypeCreateProblem,
  InputTypeDeleteProblem,
  InputTypeUpdateProblem,
  ReturnTypeCreateProblem,
  ReturnTypeDeleteProblem,
  ReturnTypeUpdateProblem,
} from "./types";
import { createSafeAction } from "../../lib/createSafeAction";

export async function getAllCourses() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.id) {
      return {
        error: "Unauthorized",
      };
    }
    const userDb = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });
    if (!userDb || !userDb.collegeId) {
      return {
        error: "Unauthorized",
      };
    }
    const courses = await prisma.course.findMany({
      where: {
        colleges: {
          some: {
            id: userDb.collegeId,
          },
        },
      },
    });
    return {
      data: courses,
    };
  } catch (error) {
    return { error: "Unable to Fetch Courses" };
  }
}

export async function getAllProblems() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.id) {
      return {
        error: "Unauthorized",
      };
    }

    const userDb = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!userDb || !userDb.collegeId || !userDb.semister) {
      return {
        error: "Unauthorized",
      };
    }

    const problems = await prisma.problem.findMany({
      where: {
        track: {
          collegeId: userDb.collegeId,
          semister: userDb.semister,
        },
      },
      include: {
        track: true,
        problemStatement: {
          include: {
            programs: true,
            testCases: {
              where: {
                hidden: false,
              },
            },
          },
        },
        MCQQuestion: true,
        QuizScore: true,
      },
    });

    return {
      data: problems,
    };
  } catch (error) {
    return { error: "Unable to Fetch Problems" };
  }
}

async function createProblemHandler(
  data: InputTypeCreateProblem
): Promise<ReturnTypeCreateProblem> {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return { error: "Unauthorized or insufficient permissions" };
    }
    const userDB = await prismaClient.user.findUnique({
      where: {
        id: session.user.id,
      },
    });
    if (!userDB?.collegeId || userDB.role === "user") {
      return { error: "Unauthorized or insufficient permissions" };
    }
    const track = await prismaClient.track.findUnique({
      where: {
        id: data.trackId,
      },
    });
    if (!track || track?.autherId !== userDB.id) {
      return { error: "Unauthorized or insufficient permissions" };
    }
    const commonData = {
      title: data.title,
      trackId: data.trackId,
      description: data.description,
      notionDocId: data.notionDocId,
      problemType: data.type,
      sortingOrder: data.sortingOrder,
    };
    const quizData = {
      QuizScore: {
        create: {
          score: data.score!,
          userId: userDB.id,
        },
      },
    };

    if (data.type === "Blog") {
      const createdProblem = await prismaClient.problem.create({
        data: commonData,
      });
      return { data: createdProblem };
    } else if (data.type == "Code") {
      const createdProblem = await prismaClient.problem.create({
        data: {
          ...commonData,
          ...quizData,
          problemStatement: {
            create: {
              programs: {
                createMany: {
                  data:
                    data.programs?.map((program) => ({
                      boilerPlateCode: program.boilerPlateCode,
                      mainCode: program.mainCode,
                      correctCode: program.correctCode,
                      codeLaungageId: program.languageId,
                    })) ?? [],
                },
              },
              testCases: {
                createMany: {
                  data:
                    data.testCases?.map((testCase) => ({
                      input: testCase.input,
                      expectedOutput: testCase.expectedOutput,
                      hidden: testCase.hidden,
                    })) ?? [],
                },
              },
            },
          },
        },
      });
      return { data: createdProblem };
    } else {
      const createdProblem = await prismaClient.problem.create({
        data: {
          ...commonData,
          ...quizData,
          MCQQuestion: {
            create: {
              question: data.mcqQuestion?.question!,
              options: data.mcqQuestion?.options!,
              correctOption: data.mcqQuestion?.correctOption!,
            },
          },
        },
      });
      return { data: createdProblem };
    }
  } catch (error: any) {
    return { error: error.message || "Failed to create problem" };
  }
}

async function updateProblemHandler(
  data: InputTypeUpdateProblem
): Promise<ReturnTypeUpdateProblem> {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return { error: "Unauthorized or insufficient permissions" };
    }
    const userDB = await prismaClient.user.findUnique({
      where: {
        id: session.user.id,
      },
    });
    if (!userDB?.collegeId || userDB.role === "user") {
      return { error: "Unauthorized or insufficient permissions" };
    }
    const track = await prismaClient.track.findUnique({
      where: {
        id: data.trackId,
      },
    });
    if (!track || track?.autherId !== userDB.id) {
      return { error: "Unauthorized or insufficient permissions" };
    }

    const commonData = {
      title: data.title,
      description: data.description,
      notionDocId: data.notionDocId,
      problemType: data.type,
      sortingOrder: data.sortingOrder,
    };

    const quizData = {
      QuizScore: {
        update: {
          score: data.score!,
        },
      },
    };

    if (data.type === "Blog") {
      const updatedProblem = await prismaClient.problem.update({
        where: { id: data.id },
        data: commonData,
      });
      return { data: updatedProblem };
    } else if (data.type === "Code") {
      const updatedProblem = await prismaClient.problem.update({
        where: { id: data.id },
        data: {
          ...commonData,
          ...quizData,
          problemStatement: {
            update: {
              programs: {
                deleteMany: {},
                createMany: {
                  data:
                    data.programs?.map((program) => ({
                      boilerPlateCode: program.boilerPlateCode,
                      mainCode: program.mainCode,
                      correctCode: program.correctCode,
                      codeLaungageId: program.languageId,
                    })) ?? [],
                },
              },
              testCases: {
                deleteMany: {},
                createMany: {
                  data:
                    data.testCases?.map((testCase) => ({
                      input: testCase.input,
                      expectedOutput: testCase.expectedOutput,
                      hidden: testCase.hidden,
                    })) ?? [],
                },
              },
            },
          },
        },
      });
      return { data: updatedProblem };
    } else {
      const updatedProblem = await prismaClient.problem.update({
        where: { id: data.id },
        data: {
          ...commonData,
          ...quizData,
          MCQQuestion: {
            update: {
              question: data.mcqQuestion?.question!,
              options: data.mcqQuestion?.options!,
              correctOption: data.mcqQuestion?.correctOption!,
            },
          },
        },
      });
      return { data: updatedProblem };
    }
  } catch (error: any) {
    return { error: error.message || "Failed to update problem" };
  }
}

async function deleteProblemHandler(
  data: InputTypeDeleteProblem
): Promise<ReturnTypeDeleteProblem> {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return { error: "Unauthorized or insufficient permissions" };
    }
    const userDB = await prismaClient.user.findUnique({
      where: {
        id: session.user.id,
      },
    });
    if (!userDB?.collegeId || userDB.role === "user") {
      return { error: "Unauthorized or insufficient permissions" };
    }
    const track = await prismaClient.track.findUnique({
      where: {
        id: data.trackId,
      },
    });
    if (!track || track?.autherId !== userDB.id) {
      return { error: "Unauthorized or insufficient permissions" };
    }
    const deletedProblem = await prisma.problem.delete({
      where: {
        id: data.id,
      },
    });
    return { data: deletedProblem };
  } catch (error: any) {
    return { error: error.message || "Failed to delete problem" };
  }
}

export const createProblem = createSafeAction(
  createProblemSchema,
  createProblemHandler
);

export const updateProblem = createSafeAction(
  updateProblemSchema,
  updateProblemHandler
);

export const deleteProblem = createSafeAction(
  deleteProblemSchema,
  deleteProblemHandler
);
