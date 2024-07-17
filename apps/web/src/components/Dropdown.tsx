"use client";
import { useEffect, useState } from "react";
import { getCourseByCollege, setProfile } from "../actions/college";
import { useRouter } from "next/navigation";
import { CourseType, Semister } from "@repo/db/client";

export default function Dropdown({ colleges }: { colleges: any }) {
  const [courses, SetCourses] = useState<undefined | CourseType[]>(undefined);
  const [semister, setSemister] = useState<undefined | Semister>(undefined);
  const [collegeId, setCollegeId] = useState<string | undefined>(undefined);
  const [course, setCourse] = useState<CourseType | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const router = useRouter();

  const getData = async () => {
    setIsLoading(true);

    const res = await getCourseByCollege(collegeId!);

    if ("error" in res) return;
    SetCourses(res);
    setIsLoading(false);
  };
  useEffect(() => {
    if (!collegeId) return;
    getData();
  }, [collegeId]);

  return (
    <div className="flex flex-col">
      <select
        onChange={(e) => {
          setCollegeId(e.target.value);
        }}
        className="mx-auto my-2"
      >
        <option>Select college</option>
        {colleges.map((college: any) => (
          <option value={college.id} key={college.id}>
            {college.name}
          </option>
        ))}
      </select>
      {courses !== undefined ? (
        <select
          onChange={(e) => {
            setCourse(courses.find((course) => course.id == e.target.value));
          }}
          className="mx-auto my-2"
        >
          <option>Select course</option>
          {courses.map((course: CourseType) => (
            <option value={course.id} key={course.id}>
              {course.name}
            </option>
          ))}
        </select>
      ) : isLoading ? (
        <div>loading</div>
      ) : null}
      {course != undefined ? (
        <div>
          <select
            onChange={(e) => {
              setSemister(e.target.value as Semister);
            }}
            className="mx-auto my-2"
          >
            <option>Select course</option>
            {course.Semister.map((sem: Semister) => (
              <option value={sem} key={sem}>
                {sem}
              </option>
            ))}
          </select>
        </div>
      ) : null}
      {collegeId !== undefined &&
      course != undefined &&
      semister != undefined ? (
        //TODO: add loading spinner.
        <button
          onClick={async () => {
            const usr = await setProfile({
              collegeId: collegeId,
              courseId: course.id,
              sem: semister,
            });
            if (usr.error) {
              // TODO: show tost failed to update
              return;
            }
            router.push("/");
          }}
        >
          submit
        </button>
      ) : null}
    </div>
  );
}
