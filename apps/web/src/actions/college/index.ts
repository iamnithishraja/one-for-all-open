"use server";
import prismaClient, { Semister } from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

export async function getCollege() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return { error: "Unauthorized or insufficient permissions" };
    }

    const colleges = await prismaClient.college.findMany();
    return colleges;
  } catch (error: any) {
    return { error: error.message || "Failed to get subjects." };
  }
}

export async function getCourseByCollege(id: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return { error: "user not logged in" };
    }

    const userDB = await prismaClient.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!userDB) {
      return { error: "Unauthorized or insufficient permissions" };
    }

    const courses = await prismaClient.course.findMany({
      where: {
        colleges: {
          some: {
            id: id,
          },
        },
      },
    });

    return courses;
  } catch (error: any) {
    return { error: error.message || "Failed to get courses." };
  }
}

export async function setProfile({
  collegeId,
  courseId,
  sem,
}: {
  collegeId: string;
  courseId: string;
  sem: Semister;
}) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return { error: "user not logged in" };
    }

    const userDB = await prismaClient.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!userDB) {
      return { error: "Unauthorized or insufficient permissions" };
    }
    const user = await prismaClient.user.update({
      where: {
        id: userDB.id,
      },
      data: {
        collegeId: collegeId,
        courseId: courseId,
        semister: sem,
      },
    });
    return { data: user };
  } catch (error: any) {
    return { error: error.message || "Failed to update user" };
  }
}
