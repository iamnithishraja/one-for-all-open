import z from "zod";
import { createProblemSchema, deleteProblemSchema, updateProblemSchema } from "./schema";
import { ActionState } from "../../lib/createSafeAction";
import { ProblemT } from "@repo/db/client";

export type InputTypeCreateProblem = z.infer<typeof createProblemSchema>;
export type ReturnTypeCreateProblem = ActionState<
  InputTypeCreateProblem,
  ProblemT
>;

export type InputTypeUpdateProblem = z.infer<typeof updateProblemSchema>;
export type ReturnTypeUpdateProblem = ActionState<
  InputTypeUpdateProblem,
  ProblemT
>;

export type InputTypeDeleteProblem = z.infer<typeof deleteProblemSchema>;
export type ReturnTypeDeleteProblem = ActionState<
  InputTypeUpdateProblem,
  ProblemT
>;
