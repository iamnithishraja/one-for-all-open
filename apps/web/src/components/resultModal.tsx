import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react"; // Assuming you're using lucide-react for icons

const ResultModal = ({
  isSuccess,
  totalTestCases,
  passedTestCases,
  onClose,
}: {
  isSuccess: Boolean;
  totalTestCases: number;
  passedTestCases: number;
  onClose: () => void;
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
        <p className="text-foreground">
          {isSuccess
            ? "Congratulations! All test cases passed."
            : `${totalTestCases - passedTestCases} test case(s) failed. Please review your code and try again.`}
        </p>
      </div>
    </div>
  );
};

export default ResultModal;
