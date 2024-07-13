"use server";
import { SubjectType } from "@repo/db/client";
import { getAllSubjectsByCollegeAndSem, getTracks } from "../actions/track";
import { Appbar } from "../components/app-bar/AppBar";
import { getCollege } from "../actions/college";
import { Subjects } from "../components/subjects";
import { Tracks } from "../components/Tracks";
import { TracksType } from "../types/userTypes";
import { redirect } from "next/navigation";
import Dropdown from "../components/Dropdown";
import { getCourseByCollege } from "../actions/course";
import { getSemester } from "../actions/semester";

export default async function Page(): Promise<JSX.Element> {
	const colleges: any = await getCollege();
	const courses: any = await getCourseByCollege();
	const semesters: any = await getSemester();

	const subjects: any = await getAllSubjectsByCollegeAndSem();
	const tracks: any = await getTracks();

	if (subjects.error === "user not logged in") {
		redirect("/auth");
	}

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
					<Dropdown items={colleges} type="College" />
					{false ? (
						<Dropdown items={courses} type="Course" />
					) : (
						 <div></div>
					)}
					{false ? (
						<Dropdown items={semesters} type="Semester" />
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
