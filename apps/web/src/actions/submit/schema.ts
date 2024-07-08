import z from "zod";

export const createSubmissionSchema = z.object({
  problemStatementId: z.string(),
  code: z.string(),
  codeLanguageId: z.string(),
});
