import z from "zod";

export const createProblemsSchema = z.object({
  trackId: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.enum(["Code", "Blog", "MCQ"]),
  notionDocId: z.string(),
  mainCode: z.string().optional(),
  boilerPlateCode: z.string().optional(),
  correctCode: z.string().optional(),
  codeLanguages: z.array(z.object({ id: z.number() })).optional(),
  testCases: z
    .array(
      z.object({
        inputs: z.array(z.string()).optional(),
      })
    )
    .optional(),
  question: z.string().optional(),
  options: z.array(z.string()).optional(),
  correctOption: z.string().optional(),
  score: z.number().optional(),
});
