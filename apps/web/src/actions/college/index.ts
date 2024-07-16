"use server";
import prismaClient from "@repo/db/client";
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

export async function getSemester() {
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

		if (!userDB?.collegeId || !userDB.courseId) {
			return { error: "Unauthorized or insufficient permissions" };
		}

		const semesters = Object.keys(Semister).map((key) => {
			return { name: key };
		});
		

		return semesters;
	} catch (error: any) {
		return { error: error.message || "Failed to get semesters." };
	}
}

export async function getCourseByCollege() {
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

		if (!userDB?.collegeId) {
			return { error: "Unauthorized or insufficient permissions" };
		}

		const courses = await prismaClient.course.findMany({
			where: {
				colleges: {
					some: {
						id: userDB.collegeID,
					},
				},
			},
		});

		return courses;
	} catch (error: any) {
		return { error: error.message || "Failed to get semesters." };
	}
}