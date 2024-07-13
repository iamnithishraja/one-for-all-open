"use server";
import prismaClient from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { Semister } from "@repo/db/client";
import { string } from "zod";

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
