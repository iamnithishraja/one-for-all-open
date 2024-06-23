"use server";
import prismaClient from "@repo/db/client";
import { InputTypeCreateTrack, ReturnTypeCreateTrack } from "./types";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { CreateTrackSchema } from "./schema";
import { createSafeAction } from "../../lib/createSafeAction";

async function createTrackHandler(
  data: InputTypeCreateTrack
): Promise<ReturnTypeCreateTrack> {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return { error: "Unauthorized or insufficient permissions" };
    }
    const userDB = await prismaClient.user.findUnique({
      where: {
        id: session.user.id,
      },
    });
    if (!userDB?.collegeId) {
      return { error: "Unauthorized or insufficient permissions" };
    }
    const createdTrack = await prismaClient.track.create({
      data: {
        title: data.title,
        description: data.description,
        image: data.image,
        Subject: data.subject,
        hidden: data.hidden,
        semister: data.sem,
        courseId: data.course.id,
        collegeId: userDB?.collegeId,
        autherId: userDB.id,
      },
    });
    return { data: createdTrack };
  } catch (error: any) {
    return { error: error.message || "Failed to create comment." };
  }
}

export const createTrack = createSafeAction(
  CreateTrackSchema,
  createTrackHandler
);
