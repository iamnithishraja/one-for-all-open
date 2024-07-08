import z from "zod";
import { createSubmissionSchema } from "./schema";

export type InputTypeCreateSubmission = z.infer<typeof createSubmissionSchema>;
