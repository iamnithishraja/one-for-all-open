import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { InputTypeCreateSubmission } from "./types";
import prisma from "@repo/db/client";

export const createSubmission = async (data: InputTypeCreateSubmission) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }
    const { code, codeLanguageId, problemStatementId } = data;
    const problemStatement = await prisma.problemStatement.findFirst({
      where: { id: problemStatementId },
      include: {
        testCases: true,
      },
    });
    if (!problemStatement) {
      return { error: "Failed to get problem" };
    }
    const submissions = problemStatement.testCases.map((tCase) => {
        
      return {
        language_id: codeLanguageId,
      };
    });
  } catch (error: any) {
    console.error(error);
    return { error: error.message || "Failed to submit" };
  }
};
