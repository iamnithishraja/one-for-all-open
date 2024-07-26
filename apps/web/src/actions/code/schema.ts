import z from "zod";
export const createSubmissionSchema = z.object({
  problemStatementId: z.string(),
  languageId: z.number(),
  sourceCode: z.string(),
});

export const createTestSchema = z.object({
  problemStatementId: z.string(),
  languageId: z.number(),
  sourceCode: z.string(),
  input: z.string(),
  expectedOutput: z.string().optional(),
});
