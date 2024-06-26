import z from "zod";
import {
  CreateTrackSchema,
  DeleteTrackSchema,
  UpdateTrackSchema,
} from "./schema";
import { ActionState } from "../../lib/createSafeAction";
import { TrackType } from "@repo/db/client";

export type InputTypeCreateTrack = z.infer<typeof CreateTrackSchema>;
export type ReturnTypeCreateTrack = ActionState<
  InputTypeCreateTrack,
  TrackType
>;

export type InputTypeUpdateTrack = z.infer<typeof UpdateTrackSchema>;

export type ReturnTypeUpdateTrack = ActionState<
  InputTypeUpdateTrack,
  TrackType
>;

export type InputTypeDeleteTrack = z.infer<typeof DeleteTrackSchema>;

export type ReturnTypeDeleteTrack = ActionState<
  InputTypeDeleteTrack,
  TrackType
>;
