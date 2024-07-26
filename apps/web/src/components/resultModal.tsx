import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react"; 

const ResultModal = ({
  isSuccess,
  totalTestCases,
  passedTestCases,
  onClose,
  input,
  expectedOutput,
  yourOutput,
}: {
  isSuccess: boolean;
  totalTestCases: number;
  passedTestCases: number;
  onClose: () => void;
  input?: string;
  expectedOutput?: string;
  yourOutput?: string;
}) => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-8 shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2
            className={`text-2xl font-bold ${isSuccess ? "text-green-500" : "text-red-500"}`}
          >
            {isSuccess ? "Success!" : "Failed"}
          </h2>
          <button
            onClick={onClose}
            className="text-foreground hover:text-primary"
          >
            <X size={24} />
          </button>
        </div>
        <div className="mb-4">
          <p className="text-foreground text-lg mb-2">Test Cases:</p>
          <div className="flex items-center">
            <span
              className={`text-3xl font-bold ${isSuccess ? "text-green-500" : "text-red-500"}`}
            >
              {passedTestCases}
            </span>
            <span className="text-foreground text-xl mx-2">/</span>
            <span className="text-foreground text-3xl font-bold">
              {totalTestCases}
            </span>
          </div>
        </div>
        <p className="text-foreground mb-4">
          {isSuccess
            ? "Congratulations! All test cases passed."
            : `${totalTestCases - passedTestCases} test case(s) failed. Please review your code and try again.`}
        </p>
        {!isSuccess && (
          <div className="space-y-4">
            <div>
              <h3 className="text-foreground font-semibold mb-1">For Input:</h3>
              <pre className="bg-background text-foreground p-2 rounded overflow-x-auto">
                {input}
              </pre>
            </div>
            <div>
              <h3 className="text-foreground font-semibold mb-1">Expected Output:</h3>
              <pre className="bg-background text-foreground p-2 rounded overflow-x-auto">
                {expectedOutput}
              </pre>
            </div>
            <div>
              <h3 className="text-foreground font-semibold mb-1">Your Output:</h3>
              <pre className="bg-background text-foreground p-2 rounded overflow-x-auto">
                {yourOutput}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultModal;
