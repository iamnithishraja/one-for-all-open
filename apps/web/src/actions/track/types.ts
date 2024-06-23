import z from "zod";
import { CreateTrackSchema } from "./schema";
import { ActionState } from "../../lib/createSafeAction";
import { TrackType } from "@repo/db/client";

export type InputTypeCreateTrack = z.infer<typeof CreateTrackSchema>;
export type ReturnTypeCreateTrack = ActionState<
  InputTypeCreateTrack,
  TrackType
>;
