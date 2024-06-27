import { atom } from "recoil";

export const selectedSubjectAtom = atom({
  key: "selected categories",
  default: "All Subjects",
});