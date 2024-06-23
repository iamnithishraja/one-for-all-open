"use client";
import { useEffect, useState } from "react";
import { getAllCourses } from "../actions/problem";
import { CourseType } from "@repo/db/client";
import { useSetRecoilState } from "recoil";
import { createTrackAtom } from "../atoms/adminAtoms";

const SemCourseForm = () => {
  const [courses, setCourses] = useState<null | CourseType[]>(null);
  const [selectedCourse, setSelectedCourse] = useState<CourseType | undefined>(
    undefined
  );
  const [selectedSem, setSelectedSem] = useState<String | undefined>(undefined);
  const setTrack = useSetRecoilState(createTrackAtom);

  useEffect(() => {
    setTrack((prevState: any) => ({
      ...prevState,
      sem: selectedSem,
      course: selectedCourse,
    }));
  }, [selectedCourse, selectedSem]);

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
    setSelectedSem(event.target.value);
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
            value={selectedSem as string}
            onChange={handleCourseSemChange}
            className="w-full max-w-xs p-2 mb-4 border rounded-lg text-white focus:outline-none"
          >
            <option value={undefined}>Select semister</option>
            {selectedCourse.Semister.map((sem) => (
              <option value={sem} key={sem}>
                {sem}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default SemCourseForm;
