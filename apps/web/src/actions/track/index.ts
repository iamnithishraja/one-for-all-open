"use server";
import prismaClient from "@repo/db/client";
import {
  InputTypeCreateTrack,
  ReturnTypeCreateTrack,
  InputTypeDeleteTrack,
  ReturnTypeDeleteTrack,
  InputTypeUpdateTrack,
  ReturnTypeUpdateTrack,
} from "./types";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import {
  CreateTrackSchema,
  DeleteTrackSchema,
  UpdateTrackSchema,
} from "./schema";
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
    if (!userDB?.collegeId || userDB.role === "user") {
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
    return { error: error.message || "Failed to create track." };
  }
}

export async function getTracks() {
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
    if (!userDB?.collegeId || !userDB.semister) {
      return { error: "Unauthorized or insufficient permissions" };
    }
    const tracks = await prismaClient.track.findMany({
      where: {
        collegeId: userDB?.collegeId!,
        semister: userDB.semister!,
      },
    });
    return { data: tracks };
  } catch (error: any) {
    return { error: error.message || "Failed to get tracks." };
  }
}

async function updateTrackHandler(
  data: InputTypeUpdateTrack
): Promise<ReturnTypeUpdateTrack> {
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
    if (!userDB?.collegeId || userDB.role === "user") {
      return { error: "Unauthorized or insufficient permissions" };
    }
    const existingTrack = await prismaClient.track.findUnique({
      where: {
        id: data.id,
      },
    });
    if (
      existingTrack?.autherId !== userDB.id ||
      existingTrack?.collegeId !== userDB.collegeId
    ) {
      return { error: "Unauthorized or insufficient permissions" };
    }
    const updatedTrack = await prismaClient.track.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title ?? existingTrack.title,
        description: data.description ?? existingTrack.description,
        image: data.image ?? existingTrack.image,
        courseId: data.course?.id ?? existingTrack.courseId,
        hidden: data.hidden ?? existingTrack.hidden,
        Subject: data.subject ?? existingTrack.Subject,
        semister: data.sem ?? existingTrack.semister,
      },
    });
    return { data: updatedTrack };
  } catch (error: any) {
    return { error: error.message || "Failed to update track." };
  }
}

async function deleteTrackHandler(
  data: InputTypeDeleteTrack
): Promise<ReturnTypeDeleteTrack> {
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
    if (!userDB?.collegeId || userDB.role === "user") {
      return { error: "Unauthorized or insufficient permissions" };
    }
    const existingTrack = await prismaClient.track.findUnique({
      where: {
        id: data.id,
      },
    });
    if (
      existingTrack?.autherId !== userDB.id ||
      existingTrack?.collegeId !== userDB.collegeId
    ) {
      return { error: "Unauthorized or insufficient permissions" };
    }
    const deletedTrack = await prismaClient.track.delete({
      where: {
        id: data.id,
      },
    });
    return { data: deletedTrack };
  } catch (error: any) {
    return { error: error.message || "Failed to delete track." };
  }
}

export const createTrack = createSafeAction(
  CreateTrackSchema,
  createTrackHandler
);

export const updateTrack = createSafeAction(
  UpdateTrackSchema,
  updateTrackHandler
);

export const deleteTrack = createSafeAction(
  DeleteTrackSchema,
  deleteTrackHandler
);
