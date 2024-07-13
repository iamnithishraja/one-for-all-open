"use server";
import prismaClient from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

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

		const course = await prismaClient.course.findMany({
			where: {
				colleges: {
					some: {
						id: userDB.collegeID,
					},
				},
			},
		});

		return course;
	} catch (error: any) {
		return { error: error.message || "Failed to get semesters." };
	}
}
