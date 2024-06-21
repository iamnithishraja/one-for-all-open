import z from "zod";

export const trackSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string(),
  subject: z.string(),
  hidden: z.boolean().optional(),
});
