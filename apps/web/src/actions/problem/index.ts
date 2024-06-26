"use server";

import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

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

