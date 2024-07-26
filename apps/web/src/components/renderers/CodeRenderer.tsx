"use client";
import React, { useState, useEffect } from "react";
import { ProblemWithRelations } from "../../types/userTypes";
import { RenderNotion } from "./RendeNotion";
import { motion, useDragControls } from "framer-motion";
import { Button } from "@repo/ui";
import ExcalidrawEmbed from "../utils/Excelidraw";
import CodeEditor from "../CodeEditor";
import { CodeLanguageType, TestCaseType } from "@repo/db/client";
import { useRecoilState } from "recoil";
import { programAtom } from "../../atoms/userAtoms";
import { useAction } from "../../hooks/useAction";
import { didUserSolve, submitProblem, testProblem } from "../../actions/code";
import LoadingSpinner from "../LoadingSpinner";
import ResultModal from "../resultModal";
import { Check } from "lucide-react";
import { SubmissionTab } from "../SubmissionsPage";

export default ({
  recordMap,
  problem,
}: {
  recordMap: any;
  problem: ProblemWithRelations;
}) => {
  const [leftWidth, setLeftWidth] = useState(44);
  const dragControls = useDragControls();
  const [isExcalidrawOpen, setIsExcalidrawOpen] = useState(false);
  const [isExcalidrawMaximized, setIsExcalidrawMaximized] = useState(false);
  const [activeTab, setActiveTab] = useState("problem");
  const [availableLanguages, setAvailableLanguages] = useState<
    CodeLanguageType[]
  >(problem.problemStatement?.programs!.map((pGram) => pGram.codeLaungage)!);
  const [selectedLanguage, setSelectedLanguage] = useState<CodeLanguageType>(
    availableLanguages[0]
  );
  const [program, setProgram] = useRecoilState(programAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [testcases, setTestcases] = useState([
    ...problem.problemStatement!.testCases!.map((tCase) => ({
      id: tCase.id,
      input: tCase.input,
      expectedOutput: tCase.expectedOutput,
      isEditable: false,
    })),
    {
      id: "custom",
      input: "",
      expectedOutput: "",
      isEditable: true,
    },
  ]);
  const [selectedTestcase, setSelectedTestcase] = useState(testcases[0]);
  const [showResult, setShowResult] = useState(false);
  const [alreadySolved, setAlredySolved] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    input: string | undefined;
    expectedOutput: string | undefined;
    yourOutput: string | null;
    isSuccess: boolean;
    totalTestCases: number;
    passedTestCases: number;
  }>({
    isSuccess: false,
    totalTestCases: 0,
    passedTestCases: 0,
    input: undefined,
    expectedOutput: undefined,
    yourOutput: null,
  });
  const { execute: executeSubmit, fieldErrors: submitFieldErrors } = useAction(
    submitProblem,
    {
      onSuccess: (data) => {
        // TODO: show success toast
        const isSuccess = data.testCasesPassed === data.totalTestCases;
        setSubmissionResult({
          isSuccess: isSuccess,
          totalTestCases: data.totalTestCases,
          passedTestCases: data.testCasesPassed,
          input: data.lastTestCase?.input,
          expectedOutput: data.lastTestCase?.expectedOutput,
          yourOutput: data.stdout,
        });
        setShowResult(true);
      },
      onError: (error) => {
        // TODO: show failure toast
        setSubmissionResult({
          isSuccess: false,
          totalTestCases: 0,
          passedTestCases: 0,
          expectedOutput: undefined,
          input: undefined,
          yourOutput: null,
        });
        setShowResult(true);
      },
    }
  );

  const { execute: executeTest, fieldErrors: testFieldErrors } = useAction(
    testProblem,
    {
      onSuccess: (data) => {
        // TODO: show success toast
        const isSuccess = data.status == "Accepted";
        console.log(isSuccess);
        setSubmissionResult({
          isSuccess: isSuccess,
          totalTestCases: 1,
          passedTestCases: isSuccess ? 1 : 0,
          input: isSuccess ? undefined : data.input,
          expectedOutput: isSuccess ? undefined : data.expectedOutput,
          yourOutput: isSuccess ? undefined : data.yourOutput,
        });
        setShowResult(true);
      },
      onError: (error) => {
        // TODO: show failure toast
        console.log(error);
        setSubmissionResult({
          isSuccess: false,
          totalTestCases: 0,
          passedTestCases: 0,
          expectedOutput: undefined,
          input: undefined,
          yourOutput: null,
        });
        setShowResult(true);
      },
    }
  );
  const handleDrag = (event: any, info: any) => {
    const containerWidth = window.innerWidth;
    const currentWidth = (leftWidth / 100) * containerWidth;
    const newWidth = ((currentWidth + info.delta.x) / containerWidth) * 100;
    setLeftWidth(newWidth);
  };

  const toggleExcalidraw = () => {
    setIsExcalidrawOpen(!isExcalidrawOpen);
    if (isExcalidrawMaximized) {
      setIsExcalidrawMaximized(false);
    }
  };

  const closeExcalidraw = () => {
    setIsExcalidrawOpen(false);
  };

  const toggleExcalidrawMaximize = () => {
    setIsExcalidrawMaximized(!isExcalidrawMaximized);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await executeSubmit({
        languageId: selectedLanguage.id,
        problemStatementId: problem.problemStatement?.id!,
        sourceCode: btoa(program.code),
      });
    } finally {
      setIsLoading(false);
      setShowResult(true);
    }
  };
  const closeResultModal = () => {
    setShowResult(false);
  };

  const handleTest = async () => {
    setIsLoading(true);
    try {
      const response = await executeTest({
        languageId: selectedLanguage.id,
        problemStatementId: problem.problemStatement?.id!,
        sourceCode: btoa(program.code),
        input: selectedTestcase.input,
        expectedOutput:
          selectedTestcase.id == "custom"
            ? undefined
            : selectedTestcase.expectedOutput,
      });
    } finally {
      setIsLoading(false);
      setShowResult(true);
    }
  };

  useEffect(() => {
    setProgram((prevVal) => ({
      ...prevVal,
      code: problem.problemStatement?.programs!.find(
        (pGram) => pGram.codeLaungageId === selectedLanguage.id
      )!.boilerPlateCode!,
    }));
    didUserSolve(problem.problemStatement?.id!).then((data) => {
      setAlredySolved(data.data ? data.data : false);
    });
  }, []);

  return (
    <div className="relative h-screen overflow-hidden bg-background text-foreground">
      {isLoading && <LoadingSpinner />}
      {showResult && (
        <ResultModal
          isSuccess={submissionResult.isSuccess}
          totalTestCases={submissionResult.totalTestCases}
          passedTestCases={submissionResult.passedTestCases}
          input={submissionResult.input}
          expectedOutput={submissionResult.expectedOutput}
          yourOutput={
            submissionResult.yourOutput
              ? submissionResult.yourOutput
              : undefined
          }
          onClose={closeResultModal}
        />
      )}
      <div className="flex h-full overflow-auto pb-2">
        <div
          className="h-full flex flex-col shadow-lg overflow-hidden"
          style={{ width: `${leftWidth}%` }}
        >
          <div className="bg-secondary/70 px-4 py-2 flex items-center justify-between border-border mt-2 rounded-t-lg">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab("problem")}
                className={`px-3 py-1 rounded-t-lg text-sm font-medium ${
                  activeTab === "problem"
                    ? "bg-card text-primary"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                Problem
              </button>
              <button
                onClick={() => setActiveTab("submissions")}
                className={`px-3 py-1 rounded-t-lg text-sm font-medium ${
                  activeTab === "submissions"
                    ? "bg-card text-primary"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                Submissions
              </button>
            </div>
            <div className="w-16"></div>
          </div>
          <div className="flex-grow overflow-hidden bg-card">
            <div className="h-full overflow-y-auto p-4 border-l border-r border-border">
              {activeTab === "problem" && (
                <RenderNotion recordMap={recordMap} fullPage={true} />
              )}
              {activeTab === "submissions" && (
                <SubmissionTab problemId={problem.problemStatement?.id!} />
              )}
            </div>
          </div>
          <div className="bg-secondary/70 h-6 border-t border-border rounded-b-lg"></div>
        </div>
        <motion.div
          drag="x"
          dragControls={dragControls}
          dragMomentum={false}
          dragElastic={0}
          onDrag={handleDrag}
          className="z-40 w-1 cursor-col-resize hover:bg-primary flex-shrink-0"
        />

        <div
          className="h-full bg-card flex flex-col p-2"
          style={{ width: `${100 - leftWidth}%` }}
        >
          <div className="flex flex-col overflow-hidden border border-border rounded-lg shadow-lg bg-card">
            <div className="flex items-center justify-between px-4 py-2 bg-secondary border-b border-border">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-sm font-medium text-secondary-foreground">
                {selectedLanguage.value} Editor
              </span>
              <div className="w-16"></div>
            </div>
            <div className="flex-grow overflow-hidden">
              <CodeEditor lang={selectedLanguage.label} />
            </div>
          </div>
          <div className="border-t border-border p-4 bg-secondary/70 rounded-lg mt-2">
            <div className="flex items-center mb-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent">
              {testcases.map((testcase, idx) => (
                <Button
                  key={testcase.id}
                  onClick={() => setSelectedTestcase(testcase)}
                  className={`bg-secondary hover:bg-secondary/80 text-secondary-foreground px-3 py-1 rounded text-sm mr-2 ${
                    selectedTestcase.id === testcase.id
                      ? "border-2 border-primary"
                      : ""
                  }`}
                >
                  {testcase.isEditable ? "Custom" : `Case ${idx + 1}`}
                </Button>
              ))}
            </div>
            <div className="flex space-x-4">
              <div className={selectedTestcase.isEditable ? "w-full" : "w-1/2"}>
                <label className="block text-sm font-medium mb-1">Input:</label>
                <textarea
                  value={selectedTestcase.input}
                  onChange={(e) => {
                    setTestcases((prevVal) => {
                      prevVal[prevVal.length - 1] = {
                        ...prevVal[prevVal.length - 1],
                        input: e.target.value,
                      };
                      return [...prevVal];
                    });
                    setSelectedTestcase((prevVal) => ({
                      ...prevVal,
                      input: e.target.value,
                    }));
                  }}
                  className="w-full h-24 bg-input text-foreground border rounded-md p-2"
                  readOnly={!selectedTestcase.isEditable}
                />
              </div>
              {!selectedTestcase.isEditable && (
                <div className="w-1/2">
                  <label className="block text-sm font-medium mb-1">
                    Expected Output:
                  </label>
                  <textarea
                    value={selectedTestcase.expectedOutput}
                    className="w-full h-24 bg-input text-foreground border rounded-md p-2"
                    readOnly
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ExcalidrawEmbed
        isOpen={isExcalidrawOpen}
        leftWidth={leftWidth}
        onClose={closeExcalidraw}
        isMaximized={isExcalidrawMaximized}
        onToggleMaximize={toggleExcalidrawMaximize}
      />

      <div className="absolute bottom-0 left-0 right-0 h-12 bg-card border-t border-border flex items-center justify-between px-4">
        <div className="flex items-center">
          <Button
            onClick={toggleExcalidraw}
            className="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-3 py-1 rounded text-sm mr-3"
          >
            {isExcalidrawOpen ? "Close Excalidraw" : "Excalidraw"}
          </Button>
          <select
            id="language"
            value={selectedLanguage?.id}
            onChange={(e) => {
              setSelectedLanguage(
                availableLanguages.find(
                  (lang) => lang.id === Number(e.target.value)
                )!
              );
              setProgram({
                code: problem.problemStatement?.programs.find(
                  (prog) => prog.codeLaungageId === Number(e.target.value)
                )!.boilerPlateCode!,
                languageId: selectedLanguage.id,
              });
            }}
            className="w-1/2 bg-input text-foreground border-2 rounded-md transition-all duration-200"
          >
            {availableLanguages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
        {alreadySolved && (
          <div className="flex items-center ml-3 text-green-500">
            <Check size={20} />
            <span className="ml-1 text-sm font-medium">Solved</span>
          </div>
        )}
        <div>
          <Button
            onClick={handleTest}
            className="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-3 py-1 rounded text-sm mr-2"
          >
            Test
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary/80 text-primary-foreground px-3 py-1 rounded text-sm"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};
