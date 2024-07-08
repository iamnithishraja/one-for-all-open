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
  const [availableLanguages, setAvailableLanguages] = useState<
    CodeLanguageType[]
  >(problem.problemStatement?.programs!.map((pGram) => pGram.codeLaungage)!);
  const [selectedLanguage, setSelectedLanguage] = useState<CodeLanguageType>(
    availableLanguages[0]
  );
  const [program, setProgram] = useRecoilState(programAtom);
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

  const handleSubmit = () => {
    console.log("Submitting code");
  };

  const handleTest = () => {
    console.log("Testing code");
  };

  useEffect(() => {
    setProgram((prevVal) => ({
      ...prevVal,
      code: problem.problemStatement?.programs!.find(
        (pGram) => pGram.codeLaungageId === selectedLanguage.id
      )!.boilerPlateCode!,
    }));
  }, []);

  return (
    <div className="relative h-screen overflow-hidden bg-background text-foreground">
      <div className="flex h-full overflow-auto pb-12">
        <div className="h-full bg-card" style={{ width: `${leftWidth}%` }}>
          <div className="h-full overflow-y-auto pr-4">
            <RenderNotion recordMap={recordMap} fullPage={true} />
          </div>
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
                    console.log(testcases);
                    
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
        <div className="flex">
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
            className={
              " w-1/2 bg-input text-foreground border-2 rounded-md transition-all duration-200"
            }
          >
            {availableLanguages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
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
