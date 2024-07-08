// "use client";
import { SubjectType } from "@repo/db/client";
import { getAllSubjectsByCollegeAndSem, getTracks } from "../actions/track";
import { Appbar } from "../components/app-bar/AppBar";
import { getCollege } from "../actions/college";
import { Subjects } from "../components/subjects";
import { Tracks } from "../components/Tracks";
import { TracksType } from "../types/userTypes";


export default async function Page(): Promise<JSX.Element> {
	const tracks: any = await getTracks();
	const subjects: any = await getAllSubjectsByCollegeAndSem();
	const colleges: any = await getCollege();
	
	if (
		colleges.error ||
		tracks.error ||
		subjects.error === "Unauthorized or insufficient permissions"
	) {
		console.log("Unauthorized or insufficient permissions");
	}
	console.log("colleges", colleges);
	
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
						{/* {colleges.map((college) => (<option	value={college.id}>{college.name}</option>))} */}
					</select>
					<select name="Course" id="course">
						<option value="">Select Course</option>
						{/* <option value="">{colleges.map((college))}}</option> */}
					</select>
					<select name="Semester" id="semester">
						<option value="">Select Semester</option>
						{/* <option value="">{colleges.map((college))}}</option> */}
					</select>
					<select name="Subject" id="subject">
						<option value="">Select Subject</option>
						{/* <option value="">{colleges.map((college))}}</option> */}
					</select>
					<select name="Track" id="track">
						<option value="">Select Track</option>
						{/* <option value="">{tracks}</option> */}
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
