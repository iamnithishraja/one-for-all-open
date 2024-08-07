"use server";
import { getServerSession } from "next-auth";
import {
  BatchSubmissionResponse,
  InputTypeCreateSubmission,
  InputTypeCreateTest,
} from "./types";
import { authOptions } from "../../lib/auth";
import prisma, { SubmissionType } from "@repo/db/client";
import { createSafeAction } from "../../lib/createSafeAction";
import { createSubmissionSchema, createTestSchema } from "./schema";

const processSubmissionData = ({
  languageId,
  sourceCode,
  problemStatementId,
  userId,
  processedSubmissions,
  tokenMap,
}: {
  languageId: number;
  sourceCode: string;
  problemStatementId: string;
  userId: string;
  processedSubmissions: any;
  tokenMap: any;
}) => {
  let runtime = 0;
  let memoryUsage = 0;
  let failedSubmission: any = null;
  let testCasesPassed = 0;
  let lastTestCase: any = null;

  processedSubmissions.forEach((submission: any) => {
    runtime += parseFloat(submission.time) * 1000;
    memoryUsage += submission.memory;

    if (
      submission.stdout?.trim() !==
        tokenMap[submission.token].expectedOutput?.trim() &&
      !failedSubmission
    ) {
      failedSubmission = submission;
      lastTestCase = tokenMap[submission.token];
    } else {
      testCasesPassed += 1;
    }
  });

  return {
    code: sourceCode,
    codeLanguageId: languageId,
    statusId: failedSubmission ? failedSubmission.status.id : 3,
    statusDesc: failedSubmission
      ? failedSubmission.status.description
      : "Accepted",
    runtime,
    memoryUsage,
    testCasesPassed,
    problemStatementId,
    errorMessage: failedSubmission?.stderr || null,
    lastTestCaseId: failedSubmission && lastTestCase ? lastTestCase.id : null,
    stdout: failedSubmission?.stdout || null,
    userId,
  };
};

const fetchSubmissions = async (
  tokenString: string,
  resolve: (value: SubmissionType[] | PromiseLike<SubmissionType[]>) => void,
  delay: number = 1000,
  maxRetries: number = 5,
  retryCount: number = 0
) => {
  const subRes = await fetch(
    `${process.env.JUDE0_URL}/submissions/batch?tokens=${tokenString}`,
    {
      headers: {
        "Content-Type": "application/json",
        // @ts-ignore
        [process.env.API_PROVIDER]: process.env.API_KEY,
      },
    }
  );
  const newData: BatchSubmissionResponse = await subRes.json();

  if (!newData.submissions) {
  }

  const processingSubmissions = newData.submissions?.filter(
    // @ts-ignore
    (submission) => submission.status.id <= 2
  );
  const processedSubmissions = newData.submissions?.filter(
    // @ts-ignore
    (submission) => submission.status.id > 2
  );

  if (processingSubmissions?.length > 0) {
    if (retryCount >= maxRetries) {
      console.error("Maximum number of retries reached.");
      resolve([]);
      return;
    }

    const nextDelay = Math.pow(2, retryCount) * delay;

    setTimeout(
      () =>
        fetchSubmissions(
          tokenString,
          resolve,
          delay,
          maxRetries,
          retryCount + 1
        ),
      nextDelay
    );
  } else {
    return resolve(processedSubmissions);
  }
};

function processSubmission(
  source_code: string,
  language_id: number,
  mainCode: string,
  testcase: string,
  expected_output?: string
) {
  source_code = atob(source_code);

  let result;

  switch (language_id) {
    case 71: // Python
      result = source_code + "\n\ninput = '''" + testcase + "'''\n" + mainCode;
      break;
    case 48: // C
      result =
        source_code +
        '\n\nint main() {\n    char input[] = "' +
        testcase +
        '";\n    ' +
        mainCode +
        "\n    return 0;\n}";
      break;
    case 13: // C++
      result =
        "#include <string>\n" +
        source_code +
        '\n\nint main() {\n    std::string input = "' +
        testcase +
        '";\n    ' +
        mainCode +
        "\n    return 0;\n}";
      break;
    case 51: // C#
      result =
        source_code +
        '\n\nclass Program {\n    static void Main(string[] args) {\n        string input = @"' +
        testcase +
        '";\n        ' +
        mainCode +
        "\n    }\n}";
      break;
    case 62: // Java
      result =
        source_code +
        '\n\npublic class Main {\n    public static void main(String[] args) {\n        String input = "' +
        testcase +
        '";\n        ' +
        mainCode +
        "\n    }\n}";
      break;
    case 63: // JavaScript
      result =
        source_code + "\n\nconst input = '" + testcase + "';\n" + mainCode;
      break;
    default:
      throw new Error("Unsupported language ID: " + language_id);
  }

  result = btoa(result);

  return {
    source_code: result,
    language_id: language_id,
    expected_output: expected_output,
  };
}
async function submitProblemHandler(data: InputTypeCreateSubmission) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return { error: "user not logged in" };
    }
    const userId = session.user.id;
    const { sourceCode, languageId, problemStatementId } = data;

    const problemStatement = await prisma.problemStatement.findFirst({
      where: { id: problemStatementId },
      include: {
        testCases: true,
        programs: true,
      },
    });
    if (!problemStatement) {
      return { error: "problem statement not found" };
    }
    const API_URL = `${process.env.JUDE0_URL}/submissions/batch?base64_encoded=true`;
    const submissions = problemStatement.testCases.map((testCase) => {
      const program = problemStatement.programs.find(
        (pgram) => pgram.codeLaungageId === languageId
      );
      if (!program) {
        return {
          error: "problem is not set properly contact your professor",
        };
      }
      return processSubmission(
        sourceCode,
        languageId,
        program.mainCode,
        testCase.input,
        testCase.expectedOutput
      );
    });
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        submissions,
      }),
      headers: {
        "Content-Type": "application/json",
        // @ts-ignore
        [process.env.API_PROVIDER]: process.env.API_KEY,
      },
    });
    const tokenMap: any = {};

    const resData: any[] = await res.json();

    resData.forEach((submission, index) => {
      tokenMap[submission.token] = problemStatement.testCases[index];
    });
    const tokenString = resData.map((props: any) => props.token).join(",");

    const processedSubmissions = await new Promise<any[]>((resolve) => {
      setTimeout(async () => {
        fetchSubmissions(tokenString, resolve);
      }, 1000);
    });

    const submissionData =
      processedSubmissions.length > 0
        ? processSubmissionData({
            languageId,
            userId,
            sourceCode: atob(sourceCode),
            tokenMap,
            problemStatementId,
            processedSubmissions,
          })
        : {
            code: atob(sourceCode),
            codeLanguageId: languageId,
            statusId: 5,
            statusDesc: "Time Limit Exceeded",
            runtime: 0,
            memoryUsage: 0,
            testCasesPassed: 0,
            problemStatementId,
            errorMessage: null,
            lastTestCaseId: problemStatement.testCases[0]?.id,
            stdout: null,
            userId,
          };
    const submission = await prisma.submission.create({
      data: submissionData,
      include: {
        lastTestCase: true,
      },
    });

    return {
      data: {
        ...submission,
        totalTestCases: problemStatement.testCases.length,
      },
    };
  } catch (error: any) {
    return { error: error.message || "Failed submitProblem." };
  }
}

export async function didUserSolve(problemStatementId: string) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return { error: "user not logged in" };
  }
  const userId = session.user.id;
  const submission = await prisma.submission.findFirst({
    where: {
      AND: {
        problemStatementId: problemStatementId,
        userId: userId,
        statusDesc: "Accepted",
      },
    },
  });
  return submission ? { data: true } : { data: false };
}

export async function getAllSubmissions(problemStatementId: string) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return { error: "user not logged in" };
  }
  const userId = session.user.id;
  const submissions = await prisma.submission.findMany({
    where: {
      problemStatementId: problemStatementId,
      userId: userId,
    },
    include: {
      lastTestCase: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return { data: submissions };
}

export async function getTestCasesLengthAndLabel(
  problemStatementId: string,
  languageId: number
) {
  const testcases = await prisma.testCase.findMany({
    where: {
      problemStatementId: problemStatementId,
    },
  });
  const language = await prisma.codeLanguage.findUnique({
    where: {
      id: languageId,
    },
  });
  return { data: { length: testcases.length, languageLabel: language?.label } };
}

const runTestHandler = async (data: InputTypeCreateTest) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return { error: "user not logged in" };
    }
    const userId = session.user.id;
    const {
      input,
      languageId,
      problemStatementId,
      sourceCode,
      expectedOutput,
    } = data;
    const problemStatement = await prisma.problemStatement.findFirst({
      where: { id: problemStatementId },
      include: {
        programs: true,
      },
    });
    if (!problemStatement) {
      return { error: "problem statement not found" };
    }
    const program = problemStatement.programs.find(
      (pgram) => pgram.codeLaungageId === languageId
    );
    if (!program) {
      return {
        error: "problem is not set properly contact your professor",
      };
    }
    const API_URL = `${process.env.JUDE0_URL}/submissions/batch?base64_encoded=true`;
    let eo = expectedOutput;
    if (!expectedOutput) {
      const correctSubmission = processSubmission(
        btoa(program.correctCode),
        languageId,
        program.mainCode,
        input
      );
      const res = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
          submissions: [correctSubmission],
        }),
        headers: {
          "Content-Type": "application/json",
          // @ts-ignore
          [process.env.API_PROVIDER]: process.env.API_KEY,
        },
      });
      const resData: any[] = await res.json();
      const tokenString = resData.map((props: any) => props.token).join(",");

      const processedSubmissions = await new Promise<any[]>((resolve) => {
        fetchSubmissions(tokenString, resolve);
      });
      eo = processedSubmissions[0].stdout;
    }

    const userSubmission = processSubmission(
      sourceCode,
      languageId,
      program.mainCode,
      input,
      eo
    );

    const res1 = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        submissions: [userSubmission],
      }),
      headers: {
        "Content-Type": "application/json",
        // @ts-ignore
        [process.env.API_PROVIDER]: process.env.API_KEY,
      },
    });

    const resData: any[] = await res1.json();
    const tokenString = resData.map((props: any) => props.token).join(",");

    const processedSubmissions = await new Promise<any[]>((resolve) => {
      fetchSubmissions(tokenString, resolve);
    });
    const submissionData = processedSubmissions[0];

    return {
      data: {
        expectedOutput: eo,
        yourOutput: submissionData.stdout,
        input,
        status:
          submissionData.stdout?.trim() !== eo?.trim()
            ? "Wrong Answer"
            : "Accepted",
      },
    };
  } catch (error: any) {
    return { error: error.message || "failed to test the problem" };
  }
};

export const submitProblem = createSafeAction(
  createSubmissionSchema,
  submitProblemHandler
);

export const testProblem = createSafeAction(createTestSchema, runTestHandler);
