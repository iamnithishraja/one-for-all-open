import z from "zod";
export const createSubmissionSchema = z.object({
  problemStatementId: z.string(),
  languageId: z.number(),
  sourceCode: z.string(),
});
