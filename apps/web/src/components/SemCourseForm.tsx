"use client";
import { useEffect, useState } from "react";
import { getAllCourses } from "../actions/problem";
import { CourseType, Semister, SubjectType } from "@repo/db/client";
import { useSetRecoilState } from "recoil";
import { createTrackAtom } from "../atoms/adminAtoms";
import { getAllSubjectsByCollege } from "../actions/track";

const SemCourseForm = () => {
  const [courses, setCourses] = useState<null | CourseType[]>(null);
  const [selectedCourse, setSelectedCourse] = useState<CourseType | undefined>(
    undefined
  );
  const [selectedSem, setSelectedSem] = useState<Semister | undefined>(
    undefined
  );
  const [subjects, setSubjects] = useState<SubjectType[] | undefined>(
    undefined
  );
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>(
    undefined
  );
  const setTrack = useSetRecoilState(createTrackAtom);

  async function getAllSubjects() {
    const subs = (await getAllSubjectsByCollege(
      selectedCourse?.id!,
      selectedSem!
    )) as SubjectType[];
    console.log(subs);

    setSubjects(subs);
  }

  useEffect(() => {
    if (selectedSem && selectedCourse) {
      getAllSubjects();
    }
    setTrack((prevState: any) => ({
      ...prevState,
      sem: selectedSem,
      course: selectedCourse,
      subjectId: selectedSubject,
    }));
  }, [selectedCourse, selectedSem, selectedSubject]);

  async function getReqData() {
    const fcourses = await getAllCourses();
    if (fcourses.error) {
      // show toast
      console.error("Error fetching courses:", fcourses.error);
    } else if (fcourses.data) {
      setCourses(fcourses.data);
    }
  }

  useEffect(() => {
    getReqData();
  }, []);

  const handleCourseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourse(
      courses?.find((course) => event.target.value === course.id)
    );
  };

  const handleCourseSemChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedSem(event.target.value as Semister);
  };

  return (
    <div className="flex justify-between">
      {courses ? (
        <select
          value={selectedCourse?.id}
          onChange={handleCourseChange}
          className="w-full max-w-xs p-2 mb-4 border rounded-lg text-white focus:outline-none"
        >
          <option value={undefined}>Select a course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
      ) : (
        <p className="text-gray-700">Loading courses...</p>
      )}
      {selectedCourse?.id && (
        <div>
          <select
            value={selectedSem as Semister}
            onChange={handleCourseSemChange}
            className="w-full max-w-xs p-2 mb-4 border rounded-lg text-white focus:outline-none"
          >
            <option value={undefined}>Select semister</option>
            {selectedCourse.Semister.map((sem: Semister) => (
              <option value={sem} key={sem}>
                {sem}
              </option>
            ))}
          </select>
        </div>
      )}
      {selectedCourse?.id && selectedSem && (
        <div>
          <select
            value={selectedSubject as string}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setSelectedSubject(e.target.value);
            }}
            className="w-full max-w-xs p-2 mb-4 border rounded-lg text-white focus:outline-none"
          >
            <option value={undefined}>Select Subject</option>
            {subjects?.map((subject: SubjectType) => (
              <option value={subject.id} key={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default SemCourseForm;
