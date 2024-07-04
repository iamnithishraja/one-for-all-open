"use client";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { useState } from "react";

export function ModeToggle() {
  const { setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={toggleDropdown}
        className="p-2 border rounded-full border-border bg-background text-foreground"
      >
        <SunIcon className="h-[1.2rem] w-[1.2rem] transition-all dark:hidden" />
        <MoonIcon className="hidden h-[1.2rem] w-[1.2rem] transition-all dark:block" />
        <span className="sr-only">Toggle theme</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[8rem] bg-background border border-border rounded-lg shadow-lg z-10">
          <button
            onClick={() => {
              setTheme("light");
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-accent text-foreground"
          >
            Light
          </button>
          <button
            onClick={() => {
              setTheme("dark");
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-accent text-foreground"
          >
            Dark
          </button>
          <button
            onClick={() => {
              setTheme("system");
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-accent text-foreground"
          >
            System
          </button>
        </div>
      )}
    </div>
  );
}
