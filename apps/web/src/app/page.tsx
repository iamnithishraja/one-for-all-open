import { SubjectType } from "@repo/db/client";
import { getAllSubjectsByCollegeAndSem, getTracks } from "../actions/track";
import { Appbar } from "../components/AppBar";
import { Subjects } from "../components/subjects";

export default async function Page(): Promise<JSX.Element> {
  const tracks = await getTracks();
  const subjects: any = await getAllSubjectsByCollegeAndSem();
  return (
    <div>
      <Appbar />
      <div className="flex justify-center pt-4">
        <div className="text-zinc-950 dark:text-zinc-50 text-4xl p-2 max-w-screen-md font-semibold mt-2 mb-4">
          Learning Paths
        </div>
      </div>
      {subjects.error ? (
        <div>
          put additinal creadential form here
          {JSON.stringify(subjects)}
        </div>
      ) : (
        <Subjects
          subjects={subjects.map((subject: SubjectType) => ({
            subject: subject.name,
          }))}
        />
      )}
    </div>
  );
}
