import z from "zod";

export const createProblemSchema = z.object({
  trackId: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.enum(["Code", "Blog", "MCQ"]),
  notionDocId: z.string(),
  sortingOrder: z.number().optional(),
  programs: z
    .array(
      z.object({
        mainCode: z.string(),
        boilerPlateCode: z.string(),
        correctCode: z.string(),
        languageId: z.number(),
      })
    )
    .optional(),
  testCases: z
    .array(
      z.object({
        input: z.string(),
        expectedOutput: z.string(),
        hidden: z.boolean(),
      })
    )
    .optional(),
  mcqQuestion: z
    .object({
      question: z.string(),
      options: z.array(z.string()),
      correctOption: z.string(),
    })
    .optional(),
  score: z.number().optional(),
});

export const updateProblemSchema = z.object({
  id: z.string(),
  trackId: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.enum(["Code", "Blog", "MCQ"]),
  notionDocId: z.string(),
  sortingOrder: z.number().optional(),
  programs: z
    .array(
      z.object({
        mainCode: z.string(),
        boilerPlateCode: z.string(),
        correctCode: z.string(),
        languageId: z.number(),
      })
    )
    .optional(),
  testCases: z
    .array(
      z.object({
        input: z.string(),
        expectedOutput: z.string(),
        hidden: z.boolean(),
      })
    )
    .optional(),
  mcqQuestion: z
    .object({
      question: z.string(),
      options: z.array(z.string()),
      correctOption: z.string(),
    })
    .optional(),
  score: z.number().optional(),
});

export const deleteProblemSchema = z.object({
  id: z.string(),
  trackId: z.string(),
});
