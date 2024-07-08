"use server";
import prismaClient from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

export async function getCollege() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return { error: "Unauthorized or insufficient permissions" };
    }

    const colleges = await prismaClient.college.findMany();
    return colleges;
  } catch (error: any) {
    return { error: error.message || "Failed to get subjects." };
  }
}
