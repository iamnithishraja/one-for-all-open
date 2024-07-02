import { useRecoilState } from "recoil";
import { testCasesAtom } from "../atoms/adminAtoms";
import { Label, TextArea, Checkbox } from "@repo/ui";

const TestCaseForm = ({ id }: { id: string }) => {
  const [testCase, setTestCase] = useRecoilState(testCasesAtom({ id }));

  const handleInputChange = (value: string) => {
    setTestCase((prev) => ({ ...prev, input: value }));
  };

  const handleOutputChange = (value: string) => {
    setTestCase((prev) => ({ ...prev, expectedOutput: value }));
  };

  const handleHiddenToggle = (checked: boolean) => {
    setTestCase((prev) => ({ ...prev, hidden: checked }));
  };

  return (
    <div className="space-y-4 p-4 bg-secondary rounded-lg">
      <div>
        <Label
          htmlFor={`testcase-input-${id}`}
          className="text-lg font-medium text-foreground"
        >
          Input
        </Label>
        <TextArea
          id={`testcase-input-${id}`}
          className="w-full mt-1 bg-background/50 text-foreground"
          placeholder="Enter test case input"
          value={testCase?.input || ""}
          onChange={(e) => handleInputChange(e.target.value)}
          rows={3}
        />
      </div>
      <div>
        <Label
          htmlFor={`testcase-output-${id}`}
          className="text-lg font-medium text-foreground"
        >
          Output
        </Label>
        <TextArea
          id={`testcase-output-${id}`}
          className="w-full mt-1 bg-background/50 text-foreground"
          placeholder="Enter expected output"
          value={testCase?.expectedOutput || ""}
          onChange={(e) => handleOutputChange(e.target.value)}
          rows={3}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`testcase-hidden-${id}`}
          checked={testCase?.hidden || false}
          onCheckedChange={handleHiddenToggle}
        />
        <Label htmlFor={`testcase-hidden-${id}`} className="text-foreground">
          Hidden Test Case (turn this off if you want this testcase to be visible to user)
        </Label>
      </div>
    </div>
  );
};

export default TestCaseForm;