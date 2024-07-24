import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@repo/ui";
import { formatDistanceToNow } from "date-fns";
import { getAllSubmissions, getTestCasesLengthAndLabel } from "../actions/code";
import { SubmissionType } from "@repo/db/client";
import SyntaxHighlighter from "react-syntax-highlighter";
import { githubGist } from "react-syntax-highlighter/dist/esm/styles/hljs";

export const SubmissionTab = ({ problemId }: { problemId: string }) => {
  const [submissions, setSubmissions] = useState<SubmissionType[]>([]);
  const [selectedSubmission, setSelectedSubmission] =
    useState<null | SubmissionType>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fetchSubmissions = async () => {
    try {
      const response = await getAllSubmissions(problemId);
      console.log(response);

      if (!response.data) {
        return;
      }
      setSubmissions(response.data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [problemId]);

  const handleSubmissionClick = (submission: SubmissionType) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSubmission(null);
  };

  return (
    <div className="bg-card p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Your Submissions</h2>
      <div className="space-y-2">
        {submissions.map((submission) => (
          <div
            key={submission.id}
            className="flex items-center justify-between p-2 bg-secondary rounded cursor-pointer hover:bg-secondary/80"
            onClick={() => handleSubmissionClick(submission)}
          >
            <div>
              <span
                className={`font-semibold ${submission.statusDesc == "Accepted" ? "text-green-500" : "text-red-500"}`}
              >
                {submission.statusDesc}
              </span>
              <span className="ml-2 text-sm text-foreground/70">
                {formatDistanceToNow(new Date(submission.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <div className="text-sm">
              <span className="mr-2">Runtime: {submission.runtime}ms</span>
              <span>
                Memory: {(submission.memoryUsage / 1024).toFixed(2)}KB
              </span>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && selectedSubmission && (
        <SubmissionModal submission={selectedSubmission} onClose={closeModal} />
      )}
    </div>
  );
};

const SubmissionModal = ({
  submission,
  onClose,
}: {
  submission: SubmissionType;
  onClose: () => void;
}) => {
  const [info, setInfo] = useState<
    undefined | { length: number; languageLabel: string | undefined }
  >(undefined);

  useEffect(() => {
    getTestCasesLengthAndLabel(
      submission.problemStatementId,
      submission.codeLanguageId
    ).then((data: any) => {
      setInfo(data.data);
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-card rounded-lg p-6 shadow-xl max-w-4xl w-full"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Submission Details</h2>
          <Button onClick={onClose} variant="ghost" size="icon">
            <X size={24} />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Status</h3>
            <p
              className={`${submission.statusDesc == "Accepted" ? "text-green-500" : "text-red-500"}`}
            >
              {submission.statusDesc}
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Language</h3>
            <p>{info?.languageLabel}</p>
          </div>
          <div>
            <h3 className="font-semibold">Runtime</h3>
            <p>{submission.runtime} ms</p>
          </div>
          <div>
            <h3 className="font-semibold">Memory Usage</h3>
            <p>{(submission.memoryUsage / 1024).toFixed(2)} KB</p>
          </div>
          <div>
            <h3 className="font-semibold">Test Cases Passed</h3>
            <p>
              {submission.testCasesPassed} / {info?.length}
            </p>
          </div>
          {submission.errorMessage && (
            <div>
              <h3 className="font-semibold">Error Message</h3>
              <p className="text-red-500">{submission.errorMessage}</p>
            </div>
          )}
        </div>
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Code</h3>
          <SyntaxHighlighter
            language={info?.languageLabel?.toLowerCase() || "javascript"}
            style={githubGist}
            customStyle={{
              backgroundColor: "var(--secondary)",
              padding: "1rem",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
            }}
          >
            {submission.code}
          </SyntaxHighlighter>
        </div>
      </motion.div>
    </motion.div>
  );
};
