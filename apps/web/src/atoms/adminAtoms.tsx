import {
  CodeLanguageType,
  McqType,
  ProgramType,
  TestCaseType,
} from "@repo/db/client";
import { atom, atomFamily, selector, selectorFamily } from "recoil";

export const trackAtom = atom<any>({
  key: "trackAtom",
  default: {},
});

export const problemAtom = atom<any>({
  key: "problemAtom",
  default: {},
});

export const mcqAtom = atom<Partial<McqType>>({
  key: "mcqAtom",
  default: {},
});

export const programs = atom<Partial<ProgramType>[]>({
  key: "programAtom",
  default: [],
});

export const testCases = atom<Partial<TestCaseType>[]>({
  key: "testCaseAtom",
  default: [],
});

export const programsAtom = atomFamily({
  key: "programsAtom",
  default: selectorFamily({
    key: "programsSelector",
    get:
      ({ languageId }: { languageId: number }) =>
      ({ get }) =>
        get(programs).find((pgram) => pgram.codeLaungageId === languageId),
  }),
});

export const testCasesAtom = atomFamily({
  key: "testCasesAtom",
  default: selectorFamily({
    key: "testCasesSelector",
    get:
      ({ id }: { id: string }) =>
      ({ get }) =>
        get(testCases).find((tCase) => tCase.id === id),
  }),
});

export const currentCodeLanguagesAtom = atom<CodeLanguageType[]>({
  key: "currentCodeLanguagesAtom",
  default: [],
});

export const getAllPrograms = selector({
  key: "getAllPrograms",
  get: ({ get }) => {
    const pgrams = get(currentCodeLanguagesAtom);
    return pgrams.map((pgram) => {
      const pGram = get(programsAtom({ languageId: pgram.id }));
      return {
        mainCode: pGram?.mainCode,
        boilerPlateCode: pGram?.boilerPlateCode,
        correctCode: pGram?.correctCode,
        languageId: pGram?.codeLaungageId,
      };
    });
  },
});

export const getAllTestCases = selector({
  key: "getAllTestCases",
  get: ({ get }) => {
    const tCases = get(testCases);
    return tCases.map((tCase) => {
      const test = get(testCasesAtom({ id: tCase.id! }));
      return {
        expectedOutput: test?.expectedOutput,
        input: test?.input,
        hidden: test?.hidden,
      };
    });
  },
});
