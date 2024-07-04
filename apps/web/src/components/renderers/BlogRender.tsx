"use client";
import { RenderNotion } from "./RendeNotion";

export default ({
  recordMap,
}: {
  recordMap: any;
}) => {
  return (
    <div>
      <RenderNotion recordMap={recordMap} fullPage={true}/>
    </div>
  );
};
