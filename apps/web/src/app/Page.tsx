import { SubjectType } from "@repo/db/client";
import { redirect } from "next/navigation";
import { getCollege } from "../actions/college";
import { getTracks, getAllSubjectsByCollegeAndSem } from "../actions/track";
import { Appbar } from "../components/app-bar/AppBar";
import { Subjects } from "../components/subjects";
import { Tracks } from "../components/Tracks";
import { TracksType } from "../types/userTypes";

export default async function Page(): Promise<JSX.Element> {
	const tracks: any = await getTracks();
	const subjects: any = await getAllSubjectsByCollegeAndSem();
	const colleges: any = await getCollege();

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
					<select name="College" id="college">
						<h1>{colleges.id}</h1>
						<option value="">Select College</option>
						{colleges.map((college: any) => (
							<option value={college.id}>{college.name}</option>
						))}
					</select>
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
