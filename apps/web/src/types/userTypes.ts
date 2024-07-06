import {
  CodeLanguageType,
  McqType,
  ProblemStatementType,
  ProblemT,
  ProgramType,
  QuizScoreType,
  SubjectType,
  TestCaseType,
  TrackType,
} from "@repo/db/client";

export interface user {
  id: string;
  name: string;
  email: string;
}

export interface TracksType extends TrackType {
  Problems: ProblemT[];
  subject: SubjectType;
}

export interface programsT extends Partial<ProgramType> {
  codeLaungage: CodeLanguageType;
}

export type ProblemWithRelations = ProblemT & {
  problemStatement?: ProblemStatementType & {
    programs: programsT[];
    testCases: TestCaseType[];
  };
  MCQQuestion?: McqType;
  QuizScore?: QuizScoreType;
};
