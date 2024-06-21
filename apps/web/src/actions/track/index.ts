"use server";
import prismaClient from "@repo/db/client";
import { InputTypeCreateTrack } from "./types";

async function createTrack(data: InputTypeCreateTrack) {
  try {
    const createdTrack = await prismaClient.track.create({
      data: {
        title: data.title,
        description: data.description,
        image: data.image,
        Subject: data.subject,
        hidden: data.hidden,
        // collegeId: req.user!.collegeId,
        // autherId: req.user!.id,
      },
    });
    return createdTrack;
  } catch (error) {
    return { error: error };
  }
}
