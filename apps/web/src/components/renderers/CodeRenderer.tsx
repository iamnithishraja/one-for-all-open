"use client";

import React, { useState } from "react";
import { ProblemWithRelations } from "../../types/userTypes";
import { RenderNotion } from "./RendeNotion";
import { motion, useDragControls } from "framer-motion";
import { Button } from "@repo/ui";
import ExcalidrawEmbed from "../utils/Excelidraw";



export default ({
  recordMap,
  problem,
}: {
  recordMap: any;
  problem: ProblemWithRelations;
}) => {
  const [leftWidth, setLeftWidth] = useState(50);
  const dragControls = useDragControls();
  const [isExcalidrawOpen, setIsExcalidrawOpen] = useState(false);
  const [isExcalidrawMaximized, setIsExcalidrawMaximized] = useState(false);

  const handleDrag = (event: any, info: any) => {
    const newWidth = (info.point.x / window.innerWidth) * 100;
    setLeftWidth(Math.max(20, Math.min(80, newWidth)));
  };

  const toggleExcalidraw = () => {
    setIsExcalidrawOpen(!isExcalidrawOpen);
    if (isExcalidrawMaximized) {
      setIsExcalidrawMaximized(false);
    }
  };

  const closeExcalidraw = () => {
    setIsExcalidrawOpen(false);
  };

  const toggleExcalidrawMaximize = () => {
    setIsExcalidrawMaximized(!isExcalidrawMaximized);
  };

  const handleSubmit = () => {
    console.log("Submitting code");
  };

  const handleTest = () => {
    console.log("Testing code");
  };

  return (
    <div className="relative h-screen overflow-hidden bg-background text-foreground">
      <div className="flex h-full overflow-auto pb-12">
        <div className="h-full bg-card" style={{ width: `${leftWidth}%` }}>
          <div className="h-full overflow-y-auto pr-4">
            <RenderNotion recordMap={recordMap} fullPage={true} />
          </div>
        </div>

        <motion.div
          drag="x"
          dragControls={dragControls}
          dragMomentum={false}
          dragElastic={0}
          onDrag={handleDrag}
          className="w-1 bg-border cursor-col-resize hover:bg-primary flex-shrink-0"
        />

        <div
          className="h-full bg-card"
          style={{ width: `${100 - leftWidth}%` }}
        >
          <div className="h-full overflow-hidden pl-4">
            <div className="p-4">
              <h2 className="text-xl font-bold">Coding Area</h2>
              <p>This area will be used for the code editor in the future.</p>
              {[...Array(50)].map((_, i) => (
                <p key={i}>Line {i + 1}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ExcalidrawEmbed
        isOpen={isExcalidrawOpen}
        onClose={closeExcalidraw}
        isMaximized={isExcalidrawMaximized}
        onToggleMaximize={toggleExcalidrawMaximize}
      />

      <div className="absolute bottom-0 left-0 right-0 h-12 bg-card border-t border-border flex items-center justify-between px-4">
        <Button
          onClick={toggleExcalidraw}
          className="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-3 py-1 rounded text-sm"
        >
          {isExcalidrawOpen ? "Close Excalidraw" : "Excalidraw"}
        </Button>
        <div>
          <Button
            onClick={handleTest}
            className="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-3 py-1 rounded text-sm mr-2"
          >
            Test
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary/80 text-primary-foreground px-3 py-1 rounded text-sm"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};
