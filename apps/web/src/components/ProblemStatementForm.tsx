import { useRecoilState, useRecoilValue } from "recoil";
import { programs, programsAtom } from "../atoms/adminAtoms";
import { Label, TextArea } from "@repo/ui";
import { useEffect } from "react";

const ProblemStatementForm = ({ id }: { id: number }) => {
  const [program, setProgram] = useRecoilState(
    programsAtom({ languageId: id })
  );
  const prog = useRecoilValue(programs);
  useEffect(() => {
    if (!program) {
      setProgram({ codeLaungageId: id });
    }
  }, []);

  useEffect(() => {
    console.log(program);
    console.log(prog);
  }, [program]);

  return (
    <div>
      <div className="py-4">
        <Label
          htmlFor="boilerPlateCode"
          className="text-lg font-medium text-foreground"
        >
          Boiler PlateCode (this is the code that user sees on the screen)
        </Label>
        <TextArea
          id="boilerPlateCode"
          className="w-full mt-1 bg-background/50 text-foreground border border-foreground p-1"
          placeholder={"def add(a, b):"}
          value={program?.boilerPlateCode}
          onChange={(e) =>
            setProgram((prevValue) => ({
              ...prevValue,
              boilerPlateCode: e.target.value,
            }))
          }
          rows={5}
        />
      </div>
      <div className="py-4">
        <Label
          htmlFor="mainCode"
          className="text-lg font-medium text-foreground"
        >
          Main Code (assume you get test case as a string named input)
        </Label>
        <TextArea
          id="mainCode"
          className="w-full mt-1 bg-background/50 text-foreground border border-foreground p-1"
          placeholder={
            "# variable input is automatically injected to your code and will always be of type string like: input = '10 20' \nx = input.split(' ')\nnum1,num2 = int(x[0]), int(x[1])\nadd(num1, num2)"
          }
          value={program?.mainCode}
          onChange={(e) =>
            setProgram((prevValue) => ({
              ...prevValue,
              mainCode: e.target.value,
            }))
          }
          rows={5}
        />
      </div>
      <div className="py-4">
        <Label
          htmlFor="correctCode"
          className="text-lg font-medium text-foreground"
        >
          Correct Code (add solved version boiler plate code)
        </Label>
        <TextArea
          id="correctCode"
          className="w-full mt-1 bg-background/50 text-foreground border border-foreground p-1"
          placeholder={"def add(a, b):\n    return a+b"}
          value={program?.correctCode}
          onChange={(e) =>
            setProgram((prevValue) => ({
              ...prevValue,
              correctCode: e.target.value,
            }))
          }
          rows={5}
        />
      </div>
    </div>
  );
};

export default ProblemStatementForm;
