import { atom, atomFamily, selector } from "recoil";
import { TracksType } from "../types/userTypes";

export const selectedSubjectAtom = atom({
  key: "selected categories",
  default: "All Subjects",
});

export const currentTrackDetails = atom<TracksType | undefined>({
  key: "currentTrack",
  default: undefined,
});

export const programAtom = atom({
  key: "programAtom",
  default: {
    languageId: 13,
    code: ``,
  },
});
