"use Client";
import { Editor } from "@monaco-editor/react";
import React from "react";
import { programAtom } from "../atoms/userAtoms";
import { useRecoilState } from "recoil";

const CodeEditor = ({ lang }: { lang: string }) => {
  const [program, setProgram] = useRecoilState(programAtom);
  return (
    <div>
      <Editor
        height={"55vh"}
        value={program.code}
        theme="vs-dark"
        options={{
          fontSize: 14,
          scrollBeyondLastLine: false,
        }}
        language={lang.toLowerCase()}
        onChange={(value?: string) => {
          if (!value) return;
          setProgram((prev) => ({
            ...prev,
            code: value,
          }));
        }}
      />
    </div>
  );
};

export default CodeEditor;
