import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { mcqAtom } from "../atoms/adminAtoms";
import { Label, Input, Button } from "@repo/ui";
import { Plus, Trash2 } from "lucide-react";

const INITIAL_OPTIONS_COUNT = 4;

const Mcq = () => {
  const [mcqProblem, setMcqProblem] = useRecoilState(mcqAtom);

  useEffect(() => {
    if (
      !mcqProblem.options ||
      mcqProblem.options.length === 0
    ) {
      const initialOptions = Array(INITIAL_OPTIONS_COUNT).fill("");
      updateMcqQuestion("options", initialOptions);
    }
  }, []);

  const updateMcqQuestion = (field: string, value: string | string[]) => {
    setMcqProblem((prevProblem: any) => ({
      ...prevProblem,
        [field]: value,
    }));
  };

  const addOption = () => {
    updateMcqQuestion("options", [...(mcqProblem.options || []), ""]);
  };

  const removeOption = (index: number) => {
    const newOptions =
      mcqProblem.options?.filter(
        (_: string, i: number) => i !== index
      ) || [];
    updateMcqQuestion("options", newOptions);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label
          htmlFor="question"
          className="text-lg font-medium text-foreground"
        >
          Question
        </Label>
        <Input
          id="question"
          className="w-full mt-1 bg-input text-foreground"
          placeholder="Enter the question"
          value={mcqProblem.question || ""}
          onChange={(e) => updateMcqQuestion("question", e.target.value)}
        />
      </div>

      <div>
        <Label className="text-lg font-medium text-foreground">Options</Label>
        <ul className="mt-2 space-y-2">
          {mcqProblem.options?.map(
            (option: string, index: number) => (
              <li key={index} className="flex items-center space-x-2">
                <Input
                  value={option}
                  onChange={(e) => {
                    const newOptions = [
                      ...(mcqProblem.options || []),
                    ];
                    newOptions[index] = e.target.value;
                    updateMcqQuestion("options", newOptions);
                  }}
                  className="flex-grow bg-input text-foreground"
                  placeholder={`Option ${index + 1}`}
                />
                <Button
                  onClick={() => removeOption(index)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  <Trash2 size={16} />
                </Button>
              </li>
            )
          )}
        </ul>
        <div className="flex justify-center mt-4">
          <Button
            onClick={addOption}
            className="bg-accent text-accent-foreground hover:bg-accent/90 flex items-center"
          >
            <Plus size={16} className="mr-2" /> Add Option
          </Button>
        </div>
      </div>

      <div>
        <Label
          htmlFor="correctOption"
          className="text-lg font-medium text-foreground"
        >
          Correct Option
        </Label>
        <select
          id="correctOption"
          className="w-full mt-1 p-2 bg-input text-foreground rounded-md"
          value={mcqProblem.correctOption || ""}
          onChange={(e) => updateMcqQuestion("correctOption", e.target.value)}
        >
          <option value="">Select correct option</option>
          {mcqProblem.options?.map(
            (option: string, index: number) => (
              <option key={index} value={option}>
                {option || `Option ${index + 1}`}
              </option>
            )
          )}
        </select>
      </div>
    </div>
  );
};

export default Mcq;
