"use client";
import { useEffect, useState } from "react";
import { getAllCourses } from "../actions/problem";
import { CourseType, Semister, SubjectType } from "@repo/db/client";
import { useRecoilState } from "recoil";
import { trackAtom } from "../atoms/adminAtoms";
import { getAllSubjectsByCollege } from "../actions/track";
import { Label } from "@repo/ui";

const SemCourseForm = () => {
  const [trackValue, setTrack] = useRecoilState(trackAtom);
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

  async function getAllSubjects() {
    const subs = (await getAllSubjectsByCollege(
      selectedCourse?.id!,
      selectedSem!
    )) as SubjectType[];

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
      subject: selectedSubject,
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
    if (trackValue.courseId) {
      const course = fcourses.data?.find(
        (course) => course.id === trackValue.courseId
      );
      setSelectedCourse(course);
      setSelectedSem(trackValue?.semister);
      setSelectedSubject(trackValue?.subjectId);
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
  const selectClass = `
  w-full p-3 mb-4 
  bg-input text-foreground 
  border-2 border-primary/50 
  rounded-md 
  focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary 
  transition-all duration-200
`;

  return (
    <div className="space-y-6">
      <div className="bg-secondary/30 px-4 rounded-lg">
        <Label
          htmlFor="course"
          className="text-lg font-medium block mb-2 text-white"
        >
          Course
        </Label>
        {courses ? (
          <select
            id="course"
            value={selectedCourse?.id}
            onChange={handleCourseChange}
            className={selectClass}
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-muted-foreground">Loading courses...</p>
        )}
      </div>

      {selectedCourse?.id && (
        <div className="bg-secondary/30 px-4 rounded-lg">
          <Label
            htmlFor="semester"
            className="text-lg font-medium block mb-2 text-white"
          >
            Semester
          </Label>
          <select
            id="semester"
            value={selectedSem as Semister}
            onChange={handleCourseSemChange}
            className={selectClass}
          >
            <option value="">Select semester</option>
            {selectedCourse.Semister.map((sem: Semister) => (
              <option value={sem} key={sem}>
                {sem}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedCourse?.id && selectedSem && (
        <div className="bg-secondary/30 px-4 rounded-lg">
          <Label
            htmlFor="subject"
            className="text-lg font-medium block mb-2 text-white"
          >
            Subject
          </Label>
          <select
            id="subject"
            value={selectedSubject as string}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setSelectedSubject(e.target.value);
            }}
            className={selectClass}
          >
            <option value="">Select Subject</option>
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
