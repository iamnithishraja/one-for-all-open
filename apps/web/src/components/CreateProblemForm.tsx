"use client";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  currentCodeLanguagesAtom,
  getAllPrograms,
  getAllTestCases,
  mcqAtom,
  problemAtom,
  testCases,
} from "../atoms/adminAtoms";
import { CodeLanguageType, ProblemType } from "@repo/db/client";
import { Label, Input, TextArea, Button } from "@repo/ui";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProblemStatementForm from "./ProblemStatementForm";
import Mcq from "./McqForm";
import { getAllCodeLanguage } from "../actions/problem";
import TestCaseForm from "./TestCaseForm";
import { Plus } from "lucide-react";
import { useAction } from "../hooks/useAction";
import { createProblem, updateProblem } from "../actions/problem/index";
import { useRouter } from "next/navigation";
import { createProblemSchema } from "../actions/problem/schema";

function generateBase62Id(length = 10) {
  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const CreateProblemForm = () => {
  const [problem, setProblem] = useRecoilState(problemAtom);
  const ProblemTypes = [ProblemType.Blog, ProblemType.Code, ProblemType.MCQ];
  const params = useParams<{ trackId: string }>();
  const [currentCodeLanguages, setCurrentCodeLanguages] = useRecoilState(
    currentCodeLanguagesAtom
  );
  const [availableLanguages, setAvailableLanguages] = useState<
    CodeLanguageType[]
  >([]);
  const router = useRouter();
  const [testcases, setTestCases] = useRecoilState(testCases);
  const submissionPgrams = useRecoilValue(getAllPrograms);
  const submissionTcases = useRecoilValue(getAllTestCases);
  const [submissionMcq, setSubmissionMcq] = useRecoilState(mcqAtom);
  const { execute: executeCreate, fieldErrors: fieldErrorsCreate } = useAction(
    createProblem,
    {
      onSuccess: () => {
        // TODO: show success toast
        router.push("/");
        setProblem({});
        setTestCases([]);
        setCurrentCodeLanguages([]);
        setAvailableLanguages([]);
        setSubmissionMcq({});
      },
      onError: (error) => {
        // TODO: show failure toast
      },
    }
  );
  const { execute: executeUpdate, fieldErrors: fieldErrorsUpdate } = useAction(
    updateProblem,
    {
      onSuccess: () => {
        // TODO: show success toast
        // setTrack({});
        router.push("/");
      },
      onError: (error) => {
        // TODO: show failure toast
      },
    }
  );

  const addTestCase = () => {
    const len = testcases.length + 1;
    setTestCases((prev) => [
      ...prev,
      {
        id: generateBase62Id(),
        expectedOutput: "",
        input: "",
        hidden: true,
      },
    ]);
  };

  async function fetchAllCodeLanguages() {
    const res = await getAllCodeLanguage();

    if (res.data) {
      setAvailableLanguages(res.data);
    }
  }

  useEffect(() => {
    setProblem((prevVal: any) => ({
      ...prevVal,
      trackId: params.trackId,
      type: prevVal.type ?? ProblemType.Blog,
    }));
    fetchAllCodeLanguages();
  }, []);

  const addLanguage = (lang: CodeLanguageType) => {
    setCurrentCodeLanguages((prev) => [...prev, lang]);
    setAvailableLanguages((prev) =>
      prev.filter((language) => language.id !== lang.id)
    );
  };

  const removeLanguage = (lang: CodeLanguageType) => {
    setCurrentCodeLanguages((prev) =>
      prev.filter((language) => language.id !== lang.id)
    );
    setAvailableLanguages((prev) => [...prev, lang]);
  };

  const removeTestCase = (id: string) => {
    setTestCases((prev) => prev.filter((testcase) => testcase.id !== id));
  };

  const editProblem = () => {};
  const addProblem = () => {
    try {
      let subProblem = undefined;
      
      if (problem.type == ProblemType.Code) {
        subProblem = {
          programs: submissionPgrams,
          testCases: submissionTcases,
        };
      } else if (problem.type == ProblemType.MCQ) {
        subProblem = {
          mcqQuestion: {
            question: submissionMcq.question,
            options: submissionMcq.options,
            correctOption: submissionMcq.correctOption,
          },
        };
      }
      if (problem.type == ProblemType.Code && currentCodeLanguages.length === 0) {
        // show tost message to select at least 1 programming language
        return;
      }
      const finalProblem = {
        ...problem,
        ...subProblem,
      };

      createProblemSchema.parse(finalProblem);
      executeCreate(finalProblem);
    } catch (e) {
      // TODO: show toast fill all required fields
      console.log(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-background rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4 text-foreground">
          Create Problem
        </h2>
        <div className="flex space-x-2">
          {ProblemTypes.map((prob) => (
            <button
              key={prob}
              className={`px-4 py-2 rounded-full transition-colors ${
                problem?.type === prob
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
              onClick={() => {
                setProblem((prevVal: any) => ({
                  ...prevVal,
                  type: prob,
                  score: undefined,
                }));
              }}
            >
              {prob}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <Label
            htmlFor="title"
            className="text-lg font-medium text-foreground"
          >
            Title
          </Label>
          <Input
            id="title"
            className="w-full mt-1 bg-input text-foreground"
            placeholder="Enter title"
            value={problem?.title || ""}
            onChange={(e) =>
              setProblem((prevVal: any) => ({
                ...prevVal,
                title: e.target.value,
              }))
            }
          />
        </div>

        <div>
          <Label
            htmlFor="description"
            className="text-lg font-medium text-foreground"
          >
            Description
          </Label>
          <TextArea
            id="description"
            className="w-full mt-1 bg-input text-foreground"
            placeholder="Enter description"
            value={problem?.description || ""}
            onChange={(e) =>
              setProblem((prevVal: any) => ({
                ...prevVal,
                description: e.target.value,
              }))
            }
            rows={4}
          />
        </div>

        <div className="flex space-x-4">
          <div className="flex-grow">
            <Label
              htmlFor="notionDocId"
              className="text-lg font-medium text-foreground"
            >
              Notion DocId
            </Label>
            <Input
              id="notionDocId"
              className="w-full mt-1 bg-input text-foreground"
              value={problem?.notionDocId || ""}
              placeholder="Enter Notion Doc ID"
              onChange={(e) =>
                setProblem((prevVal: any) => ({
                  ...prevVal,
                  notionDocId: e.target.value,
                }))
              }
            />
          </div>
          <div className="w-1/3">
            <Label
              htmlFor="sortingOrder"
              className="text-lg font-medium text-foreground"
            >
              Sorting Order
            </Label>
            <Input
              id="sortingOrder"
              type="number"
              className="w-full mt-1 bg-input text-foreground"
              value={problem?.sortingOrder || ""}
              placeholder="Enter Slide number"
              onChange={(e) =>
                setProblem((prevVal: any) => ({
                  ...prevVal,
                  sortingOrder: Number(e.target.value),
                }))
              }
            />
          </div>
        </div>

        {problem?.type === ProblemType.Code && (
          <div className="space-y-4">
            <div className="flex-wrap -m-2">
              {currentCodeLanguages.map((lang) => (
                <div key={lang.id} className="m-2 p-4 bg-secondary rounded-lg">
                  <Button
                    onClick={() => removeLanguage(lang)}
                    className="mb-2 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Remove {lang.label}
                  </Button>
                  <ProblemStatementForm id={lang.id} />
                </div>
              ))}
            </div>
            <div className="flex justify-between items-end">
              {availableLanguages.length !== 0 && (
                <div>
                  <Label className="text-lg font-medium text-foreground">
                    Add Language
                  </Label>
                  <div className="flex flex-wrap -m-1 mt-2">
                    {availableLanguages.map((lang) => (
                      <Button
                        key={lang.id}
                        className="m-1 bg-accent text-accent-foreground hover:bg-accent/90"
                        onClick={() => addLanguage(lang)}
                      >
                        {lang.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <Label
                  htmlFor="score"
                  className="text-lg font-medium text-foreground"
                >
                  Score
                </Label>
                <Input
                  id="Score"
                  type="number"
                  className="w-full mt-1 bg-input text-foreground"
                  placeholder="Enter Score"
                  value={problem?.score || ""}
                  onChange={(e) =>
                    setProblem((prevVal: any) => ({
                      ...prevVal,
                      score: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
            <div className="space-y-4 mt-6">
              <h3 className="text-xl font-bold text-foreground">Test Cases</h3>
              {testcases.map((testCase) => (
                <div
                  className="m-2 p-4 bg-secondary rounded-lg"
                  key={testCase.id}
                >
                  <Button
                    onClick={() => removeTestCase(testCase.id!)}
                    className="mb-2 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Remove TestCase
                  </Button>
                  <TestCaseForm id={testCase.id!} />
                </div>
              ))}
              <Button
                onClick={addTestCase}
                className="flex items-center space-x-2 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Plus size={16} />
                <span>Add Test Case</span>
              </Button>
            </div>
          </div>
        )}

        {problem?.type === ProblemType.MCQ && (
          <div>
            <div>
              <Label
                htmlFor="score"
                className="text-lg font-medium text-foreground"
              >
                Score
              </Label>
              <Input
                id="Score"
                type="number"
                className="w-full mt-1 bg-input text-foreground"
                placeholder="Enter Score"
                value={problem?.score || ""}
                onChange={(e) =>
                  setProblem((prevVal: any) => ({
                    ...prevVal,
                    score: Number(e.target.value),
                  }))
                }
              />
            </div>
            <Mcq />
          </div>
        )}
      </div>
      <div className="pt-4">
        <Button
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={problem.isUpdating ? editProblem : addProblem}
        >
          {problem.isUpdating ? "Update Problem" : "Create Problem"}
        </Button>
      </div>
    </div>
  );
};

export default CreateProblemForm;
