"use server";
import { SubjectType } from "@repo/db/client";
import { getAllSubjectsByCollegeAndSem, getTracks } from "../actions/track";
import prismaClient from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import { Appbar } from "../components/app-bar/AppBar";
import { Subjects } from "../components/subjects";
import { Tracks } from "../components/Tracks";
import { TracksType } from "../types/userTypes";
import { redirect } from "next/navigation";
import Dropdown from "../components/Dropdown";
import { getCollege } from "../actions/college";
import { getSemester } from "../actions/college";
import { getCourseByCollege } from "../actions/college";

export default async function Page(): Promise<JSX.Element> {
	const colleges: any = await getCollege();
	const courses: any = await getCourseByCollege();
	// const semesters: any = courses.map((course: any) => course.Semister);

	const subjects: any = await getAllSubjectsByCollegeAndSem();
	const tracks: any = await getTracks();

	if (subjects.error === "user not logged in") {
		redirect("/auth");
	}

	const session = await getServerSession(authOptions);

	const userDB = await prismaClient.user.findUnique({
		where: {
			id: session.user.id,
		},
	});

	return (
		<div>
			<Appbar />
			<div className="flex justify-center pt-4">
				<div className="text-zinc-950 dark:text-zinc-50 text-3xl p-2 max-w-screen-md font-semibold mt-2 mb-4">
					Study Plans
				</div>
			</div>
			{subjects.error || tracks.error ? (
				<div className="grid gap-16">
					<Dropdown items={colleges} type="College" userDB={userDB} />
					{userDB?.collegeId ? (
						<Dropdown items={semesters} type="Semester" userDB={userDB} />
					) : (
						<div></div>
					)}
					{userDB?.collegeId && userDB?.semister ? (
						<Dropdown items={courses} type="Course" userDB={userDB} />
					) : (
						 <div></div>
					)}
				</div>
			) : (
				<div>
					<Subjects
						subjects={subjects.map((subject: SubjectType) => ({
							subject: subject.name,
						}))}
					/>
					<Tracks tracks={tracks as unknown as TracksType[]} />
				</div>
			)}
		</div>
	);
}
