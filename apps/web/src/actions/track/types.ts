import z from "zod";
import { trackSchema } from "./schema";

export type InputTypeCreateTrack = z.infer<typeof trackSchema>;
