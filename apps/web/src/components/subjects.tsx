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
  const [selectedSubject, setSelectedSubject] =
    useRecoilState(selectedSubjectAtom);

  const handleSubjectChange = (subject: string) => {
    setSelectedSubject(subject === selectedSubject ? "" : subject);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-1">
      <div className="xl:hidden">
        <SelectSubject
          subjects={subjects}
          selectedSubject={selectedSubject}
          handleSubjectChange={handleSubjectChange}
        />
      </div>
      <div className="hidden xl:block">
        <ButtonSubject
          subjects={subjects}
          selectedSubject={selectedSubject}
          handleSubjectChange={handleSubjectChange}
        />
      </div>
    </div>
  );
};

const SelectSubject = ({
  subjects,
  selectedSubject,
  handleSubjectChange,
}: SubjectProps) => {
  return (
    <div className="flex justify-center">
      <select
        className="w-full max-w-xs p-3 bg-background border-2 border-border rounded-[var(--radius)] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        value={selectedSubject}
        onChange={(e) => handleSubjectChange(e.target.value)}
      >
        <option value="All Subjects">All Subjects</option>
        {subjects.map((subject) => (
          <option value={subject.subject} key={subject.subject}>
            {subject.subject}
          </option>
        ))}
      </select>
    </div>
  );
};

const ButtonSubject = ({
  subjects,
  selectedSubject,
  handleSubjectChange,
}: SubjectProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mx-auto p-2 bg-secondary rounded-[var(--radius)]">
      {subjects.map((subject) => (
        <Button
          key={subject.subject}
          onClick={() => handleSubjectChange(subject.subject)}
          variant={selectedSubject === subject.subject ? "default" : "ghost"}
          className={`px-4 py-2 text-sm transition-all rounded-[var(--radius)]`}
        >
          {subject.subject}
        </Button>
      ))}
    </div>
  );
};
