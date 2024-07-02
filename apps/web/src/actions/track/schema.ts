import z from "zod";

export const CreateTrackSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string(),
  subject: z.string(),
  hidden: z.boolean().optional(),
  course: z.object({
    id: z.string(),
    name: z.string(),
  }),
  sem: z.enum([
    "First",
    "Second",
    "Third",
    "Fourth",
    "Fifth",
    "Sixth",
    "Seventh",
    "Eighth",
  ]),
});

export const UpdateTrackSchema = CreateTrackSchema.partial().extend({
  id: z.string(),
});

export const DeleteTrackSchema = z.object({
  id: z.string(),
});
