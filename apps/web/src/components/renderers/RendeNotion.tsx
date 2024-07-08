// @ts-nocheck
"use client";
import { NotionRenderer } from "react-notion-x";
import "react-notion-x/src/styles.css";
import "../../app/page.css";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import "prismjs/themes/prism-tomorrow.css";
import("prismjs/components/prism-python");
import("prismjs/components/prism-c");
import("prismjs/components/prism-csharp");
import("prismjs/components/prism-java");
import("prismjs/components/prism-jsx");
import("prismjs/components/prism-javascript");
import("prismjs/components/prism-rust");
import("prismjs/components/prism-ruby");
import("prismjs/components/prism-typescript");
import("prismjs/components/prism-bash");

import dynamic from "next/dynamic";
import { Code } from "react-notion-x/build/third-party/code";

const Pdf = dynamic(
  () => import("react-notion-x/build/third-party/pdf").then((m) => m.Pdf),
  {
    ssr: false,
  }
);

const Modal = dynamic(
  () =>
    import("react-notion-x/build/third-party/modal").then((m) => {
      m.Modal.setAppElement(".notion-viewport");
      return m.Modal;
    }),
  {
    ssr: false,
  }
);

const Collection = dynamic(() =>
  import("react-notion-x/build/third-party/collection").then(
    (m) => m.Collection
  )
);
const Equation = dynamic(() =>
  import("react-notion-x/build/third-party/equation").then((m) => m.Equation)
);

export const RenderNotion = ({
  recordMap,
  fullPage = true,
}: {
  recordMap: any;
  fullPage: Boolean;
}) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("dark");

  useEffect(() => {
    setMounted(true);
    setCurrentTheme(resolvedTheme || "dark");
  }, [resolvedTheme]);

  return (
    <div>
      {mounted && (
        <style>
          {currentTheme === "dark"
            ? `
           .notion-page-scroller{
              background-color: hsl(240, 10%, 3.9%) !important;
            }
          `
            : `
            .notion-page-scroller{
              background-color: hsl(0, 0%, 100%) !important;
            }
            `}
        </style>
      )}
      <NotionRenderer
        recordMap={recordMap}
        darkMode={currentTheme === "dark"}
        fullPage={fullPage}
        components={{
          Code,
          Collection,
          Equation,
          Pdf,
          Modal,
        }}
        mapPageUrl={(pageId) => `/notion/${pageId}`}
        linkTarget="_blank"
      />
    </div>
  );
};
