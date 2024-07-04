"use client";

import React, { useState } from "react";
import { ProblemWithRelations } from "../../types/userTypes";
import { motion } from "framer-motion";
import { RenderNotion } from "./RendeNotion";

interface MCQQuizProps {
  mcq: ProblemWithRelations["MCQQuestion"];
}

const MCQQuiz: React.FC<MCQQuizProps> = ({ mcq }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setIsCorrect(null);
  };

  const handleSubmit = () => {
    if (selectedOption) {
      setIsCorrect(selectedOption === mcq?.correctOption);
    }
  };

  return (
    <div className="p-6 bg-card text-card-foreground rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">{mcq?.question}</h2>
      <div className="space-y-4">
        {mcq?.options.map((option, index) => (
          <motion.button
            key={index}
            className={`w-full p-4 text-left rounded-lg transition-all duration-300 ${
              selectedOption === option
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
            onClick={() => handleOptionSelect(option)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {option}
          </motion.button>
        ))}
      </div>
      <motion.button
        className="mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-lg shadow-md hover:bg-primary/90 transition-colors duration-300"
        onClick={handleSubmit}
        disabled={!selectedOption}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Submit
      </motion.button>
      {isCorrect !== null && (
        <motion.p
          className={`mt-4 text-lg font-semibold ${isCorrect ? "text-green-500" : "text-destructive"}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {isCorrect ? "✅ Correct!" : "❌ Incorrect. Try again."}
        </motion.p>
      )}
    </div>
  );
};

export default ({
  recordMap,
  problem,
}: {
  recordMap: any;
  problem: ProblemWithRelations;
}) => {
  return (
    <div className="w- w-full h-full flex overflow-hidden bg-background text-foreground">
      <div className="w-1/3 h-full p-6 border-r border-border">
        <div className="h-full overflow-hidden rounded-lg shadow-lg bg-card">
          <RenderNotion recordMap={recordMap} fullPage={false}/>
        </div>
      </div>
      <div className="w-2/3 h-full p-6 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          {problem.MCQQuestion && <MCQQuiz mcq={problem.MCQQuestion} />}
        </div>
      </div>
    </div>
  );
};
