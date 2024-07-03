import { atom, atomFamily, selector } from "recoil";

export const selectedSubjectAtom = atom({
  key: "selected categories",
  default: "All Subjects",
});