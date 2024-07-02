"use client";
import React, { useState } from "react";
import { Checkbox } from "@repo/ui";

const TestSwitch = () => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div>
      <Checkbox
        checked={isChecked}
        onCheckedChange={(e) => setIsChecked(!isChecked)}
      />
      <p>Switch is {isChecked ? "ON" : "OFF"}</p>
    </div>
  );
};

export default TestSwitch;
