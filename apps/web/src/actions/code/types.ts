import z from "zod";
import { createSubmissionSchema, createTestSchema } from "./schema";
import { SubmissionType } from "@repo/db/client";
// import { ActionState } from "../../lib/createSafeAction";
// import { TrackType } from "@repo/db/client";

export type InputTypeCreateSubmission = z.infer<typeof createSubmissionSchema>;
export type InputTypeCreateTest = z.infer<typeof createTestSchema>;

export interface BatchSubmissionResponse {
  submissions: SubmissionType[];
}
