"use client";
import { Button } from "@repo/ui";
import { Pencil, Trash2 } from "lucide-react";
import { useSetRecoilState } from "recoil";
import {
  currentCodeLanguagesAtom,
  mcqAtom,
  problemAtom,
  programs,
} from "../atoms/adminAtoms";
import { ProblemWithRelations } from "../types/userTypes";
import { ProblemType } from "@repo/db/client";
import { useState } from "react";
import { deleteProblem } from "../actions/problem";
import { useRouter } from "next/navigation";
import { useAction } from "../hooks/useAction";

const DeleteButton = ({ id, trackId }: { id: string; trackId: string }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();
  const { execute, fieldErrors } = useAction(deleteProblem, {
    onSuccess: () => {
      // TODO: show success toast
      router.push("/");
    },
    onError: (error) => {
      // TODO: show failure toast
    },
  });

  return (
    <>
      <button
        className="rounded-full bg-background shadow-lg p-3 hover:bg-accent transition-colors duration-200"
        onClick={() => setShowDeleteModal(true)}
      >
        <Trash2 className="h-4 w-4 text-foreground" />
      </button>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-background border border-border p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-foreground">
              Confirm Deletion
            </h2>
            <p className="mb-6 text-muted-foreground">
              Are you sure you want to delete this item? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors duration-200"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors duration-200"
                onClick={() => {
                  execute({ id, trackId });
                  setShowDeleteModal(false);
                  router.push("/");
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const FloatingButtons = ({ problem }: { problem: ProblemWithRelations }) => {
  const setProblemAtom = useSetRecoilState(problemAtom);
  const setProgramsAtom = useSetRecoilState(programs);
  const setCurrentCodeLanguagesAtom = useSetRecoilState(
    currentCodeLanguagesAtom
  );
  const setMcqAtom = useSetRecoilState(mcqAtom);
  const router = useRouter();
  return (
    <div className="fixed bottom-8 right-8 flex flex-col gap-4">
      <Button
        variant="outline"
        size="icon"
        className="rounded-full bg-background shadow-lg p-3"
        onClick={() => {
          setProblemAtom({
            id: problem.id,
            title: problem.title,
            description: problem.description,
            notionDocId: problem.notionDocId,
            type: problem.problemType,
            sortingOrder: problem.sortingOrder,
            trackId: problem.trackId,
            problemStatementId: problem.problemStatement?.id,
            score: problem.QuizScore?.score,
            isUpdating: true,
          });
          if (problem.problemType == ProblemType.Code) {
            setProgramsAtom(
              problem.problemStatement?.programs.map((program) => ({
                id: program.id,
                codeLaungageId: program.codeLaungageId,
                boilerPlateCode: program.boilerPlateCode,
                correctCode: program.correctCode,
                mainCode: program.mainCode,
              })) ?? []
            );
            setCurrentCodeLanguagesAtom(
              problem.problemStatement?.programs.map((program) => ({
                id: program.codeLaungage.id,
                label: program.codeLaungage.label,
                value: program.codeLaungage.value,
              })) ?? []
            );
          } else if (problem.problemType == ProblemType.MCQ) {
            setMcqAtom({
              correctOption: problem.MCQQuestion?.correctOption,
              options: problem.MCQQuestion?.options,
              question: problem.MCQQuestion?.question,
              id: problem.id,
            });
          }
          router.push(`/admin/problem/${problem.trackId}`);
        }}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <DeleteButton id={problem.id} trackId={problem.trackId!} />
    </div>
  );
};

export default FloatingButtons;
