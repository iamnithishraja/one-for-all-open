"use client";
import { useRecoilState } from "recoil";
import { selectedSubjectAtom } from "../atoms/userAtoms";
import { Button } from "@repo/ui"; 

interface Subject {
  subject: string;
}

interface SubjectProps {
  subjects: Subject[];
  selectedSubject: string;
  handleSubjectChange: (subject: string) => void;
}

export const Subjects = ({ subjects }: { subjects: Subject[] }) => {
  const [selectedSubject, setSelectedSubject] = useRecoilState(selectedSubjectAtom);

  const handleSubjectChange = (subject: string) => {
    console.log("Selected subject changed:", subject);
    if (subject === selectedSubject) {
      setSelectedSubject("");
    } else {
      setSelectedSubject(subject);
    }
  };

  return (
    <div>
      <div className="xl:hidden block">
        <SelectSubject
          subjects={subjects}
          selectedSubject={selectedSubject}
          handleSubjectChange={handleSubjectChange}
        />
      </div>
      <div className="xl:block hidden">
        <ButtonSubject
          subjects={subjects}
          selectedSubject={selectedSubject}
          handleSubjectChange={handleSubjectChange}
        />
      </div>
    </div>
  );
};

const SelectSubject = ({ subjects, selectedSubject, handleSubjectChange }: SubjectProps) => {
  return (
    <div className="flex justify-center">
      <select
        className="w-[250px] p-2 border rounded"
        value={selectedSubject || ""}
        onChange={(e) => handleSubjectChange(e.target.value)}
      >
        <option value="">All Subjects</option>
        {subjects.map((subject) => (
          <option value={subject.subject} key={subject.subject}>
            {subject.subject}
          </option>
        ))}
      </select>
    </div>
  );
};

const ButtonSubject = ({ subjects, selectedSubject, handleSubjectChange }: SubjectProps) => {
  return (
    <div className="flex justify-evenly mx-auto border-2 rounded-full py-1 w-2/3">
      {subjects.map((subject) => (
        <Button
          key={subject.subject}
          onClick={() => handleSubjectChange(subject.subject)}
          className={
            selectedSubject === subject.subject ? "bg-gray-300 dark:bg-slate-700 rounded-full" : "rounded-full"
          }
        >
          {subject.subject}
        </Button>
      ))}
    </div>
  );
};
