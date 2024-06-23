"use client";
import { useSetRecoilState } from "recoil";
import { createTrackAtom } from "../atoms/adminAtoms";
import { ProblemT, ProblemType } from "@repo/db/client";
import { useState } from "react";
import { Label, Input, TextArea } from "@repo/ui";

interface problemSchema extends Partial<ProblemT> {
  score?: number;
}

const CreateProblemForm = () => {
  const [problem, setProblem] = useState<problemSchema>({
    problemType: ProblemType.Blog,
  });
  const setTrack = useSetRecoilState(createTrackAtom);
  const ProblemTypes = [ProblemType.Blog, ProblemType.Code, ProblemType.MCQ];

  return (
    <div>
      <div className="flex items-end">
        {ProblemTypes.map((prob: ProblemType) => (
          <div
            className={
              problem.problemType === prob
                ? "w-1/12 h-12 p-2 flex justify-center items-center bg-input border-4 border-blue-700 cursor-pointer rounded-lg"
                : "w-1/14 h-10 p-2 flex justify-center items-center bg-input  rounded-lg border border-blue-100 cursor-pointer"
            }
            onClick={() => {
              setProblem((prevVal) => ({
                ...prevVal,
                problemType: prob,
                score: undefined,
              }));
            }}
          >
            {prob}
          </div>
        ))}
      </div>
      <div className="p-2 bg-input rounded-md">
        {problem.problemType === ProblemType.Blog ? (
          <div>
            <div className="my-4">
              <Label className="text-xl my-2">Title</Label>
              <Input
                className="px-3 rounded-md"
                placeholder="enter title"
                value={problem.title}
                onChange={(e) =>
                  setProblem((prevVal) => ({
                    ...prevVal,
                    title: e.target.value,
                  }))
                }
              />
            </div>
            <div className="my-4">
              <Label className="text-xl my-2">Description</Label>
              <TextArea
                className="px-3 rounded-md w-full"
                placeholder="enter description"
                value={problem.description}
                onChange={(e) =>
                  setProblem((prevData: any) => ({
                    ...prevData,
                    description: e.target.value,
                  }))
                }
                rows={4}
              />
            </div>
            <div className="my-4">
              <Label className="text-xl my-2">Notion DocId</Label>
              <Input
                className="px-3 rounded-md"
                value={problem.notionDocId}
                placeholder="enter notion doc id"
                onChange={(e) =>
                  setProblem((prevVal) => ({
                    ...prevVal,
                    notionDocId: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        ) : problem.problemType === ProblemType.Code ? (
          <div>
            <div className="my-4">
              <Label className="text-xl my-2">Title</Label>
              <Input
                className="px-3 rounded-md"
                placeholder="enter title"
                value={problem.title}
                onChange={(e) =>
                  setProblem((prevVal) => ({
                    ...prevVal,
                    title: e.target.value,
                  }))
                }
              />
            </div>
            <div className="my-4">
              <Label className="text-xl my-2">Description</Label>
              <TextArea
                className="px-3 rounded-md w-full"
                placeholder="enter description"
                value={problem.description}
                onChange={(e) =>
                  setProblem((prevData: any) => ({
                    ...prevData,
                    description: e.target.value,
                  }))
                }
                rows={4}
              />
            </div>
            <div className="my-4">
              <Label className="text-xl my-2">Notion DocId</Label>
              <Input
                className="px-3 rounded-md"
                value={problem.notionDocId}
                placeholder="enter notion doc id"
                onChange={(e) =>
                  setProblem((prevVal) => ({
                    ...prevVal,
                    notionDocId: e.target.value,
                  }))
                }
              />
            </div>
            <div className="my-4">
              <Label className="text-xl my-2">Score</Label>
              <Input
                className="px-3 rounded-md w-1/2"
                value={problem.score}
                placeholder="score to give for a user"
                onChange={(e) =>
                  setProblem((prevVal) => ({
                    ...prevVal,
                    score: parseInt(e.target.value),
                  }))
                }
              />
            </div>
          </div>
        ) : (
          <div>
            <div className="my-4">
              <Label className="text-xl my-2">Title</Label>
              <Input
                className="px-3 rounded-md"
                placeholder="enter title"
                value={problem.title}
                onChange={(e) =>
                  setProblem((prevVal) => ({
                    ...prevVal,
                    title: e.target.value,
                  }))
                }
              />
            </div>
            <div className="my-4">
              <Label className="text-xl my-2">Description</Label>
              <TextArea
                className="px-3 rounded-md w-full"
                placeholder="enter description"
                value={problem.description}
                onChange={(e) =>
                  setProblem((prevData: any) => ({
                    ...prevData,
                    description: e.target.value,
                  }))
                }
                rows={4}
              />
            </div>
            <div className="my-4">
              <Label className="text-xl my-2">Notion DocId</Label>
              <Input
                className="px-3 rounded-md"
                value={problem.notionDocId}
                placeholder="enter notion doc id"
                onChange={(e) =>
                  setProblem((prevVal) => ({
                    ...prevVal,
                    notionDocId: e.target.value,
                  }))
                }
              />
            </div>
            <div className="my-4">
              <Label className="text-xl my-2">Score</Label>
              <Input
                className="px-3 rounded-md w-1/2"
                value={problem.score}
                placeholder="score to give for a user"
                onChange={(e) =>
                  setProblem((prevVal) => ({
                    ...prevVal,
                    score: parseInt(e.target.value),
                  }))
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateProblemForm;
