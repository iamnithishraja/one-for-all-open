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
        className="p-2 border rounded-full border-white dark:border-gray-700"
      >
        <SunIcon className="h-[1.2rem] w-[1.2rem] transition-all dark:hidden" />
        <MoonIcon className="hidden h-[1.2rem] w-[1.2rem] transition-all dark:block" />
        <span className="sr-only">Toggle theme</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[8rem] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
          <button
            onClick={() => {
              setTheme("light");
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Light
          </button>
          <button
            onClick={() => {
              setTheme("dark");
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Dark
          </button>
          <button
            onClick={() => {
              setTheme("system");
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            System
          </button>
        </div>
      )}
    </div>
  );
}
