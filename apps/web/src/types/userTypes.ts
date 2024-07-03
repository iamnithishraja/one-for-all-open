import { ProblemT, SubjectType, TrackType } from "@repo/db/client";

export interface user {
  id: string;
  name: string;
  email: string;
}

export interface TracksType extends TrackType {
  Problems: ProblemT[];
  subject: SubjectType;
}
