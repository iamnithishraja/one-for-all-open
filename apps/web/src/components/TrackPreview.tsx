"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@repo/ui";
import { EnterIcon } from "@radix-ui/react-icons";
import { getAllProblems } from "../actions/problem";
import { TracksType } from "../types/userTypes";

type TrackPreviewProps = {
  showPreview: boolean;
  setShowPreview: (val: boolean) => void;
  track: TracksType;
};

const truncateDescription = (text: string, wordLimit: number) => {
  const words = text.split(" ");
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(" ") + " ...";
  }
  return text;
};

export function TrackPreview({
  showPreview,
  setShowPreview,
  track,
}: TrackPreviewProps) {
  const [isMediumOrLarger, setIsMediumOrLarger] = useState(false);

  const updateScreenSize = () => {
    setIsMediumOrLarger(window.innerWidth >= 768);
  };

  useEffect(() => {
    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => {
      window.removeEventListener("resize", updateScreenSize);
    };
  }, []);

  const truncatedDescription = isMediumOrLarger
    ? track.description
    : truncateDescription(track.description, 15);

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center transition-opacity duration-300 ${
        showPreview ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={() => setShowPreview(false)}
    >
      <div
        className="bg-background rounded-2xl max-w-2xl w-11/12 md:w-full h-max flex flex-col p-6 border-2 border-primary/30 shadow-2xl transform transition-all duration-300 scale-95 hover:scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative mb-8">
          <img
            src={track.image}
            className="h-48 w-full object-cover rounded-xl shadow-md"
            alt={`${track.title} image`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent rounded-xl"></div>
          <h2 className="text-2xl md:text-3xl font-bold absolute bottom-4 left-4 right-4 text-primary-foreground drop-shadow-lg">
            {track.title}
          </h2>
        </div>

        <p className="text-sm font-semibold text-primary/80 mb-3">
          {track.subject.name}
        </p>

        <p className="text-foreground/80 mb-6">{truncatedDescription}</p>

        <hr className="border-primary/20 mb-6" />

        <h3 className="font-bold text-xl mb-4 text-primary">Contents</h3>
        <div className="max-h-[40vh] overflow-y-auto pr-2 mb-6 space-y-2">
          {track.Problems.length === 0 ? (
            <p className="text-muted-foreground italic">No topics found</p>
          ) : (
            track.Problems.map((topic: any, idx: number) => (
              <Link
                key={topic.id}
                href={`/tracks/${track.id}/${track.Problems[idx]?.id}`}
              >
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-primary/10 transition-all duration-300">
                  <span className="text-foreground">{topic.title}</span>
                  <EnterIcon className="text-primary" />
                </div>
              </Link>
            ))
          )}
        </div>

        <div className="flex justify-center">
          <Link
            href={
              track.Problems?.length
                ? `/tracks/${track.id}/${track.Problems[0]?.id}`
                : "#"
            }
          >
            <Button
              size={"lg"}
              className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 px-8 py-3 rounded-full text-lg font-semibold"
              onClick={(e) => e.stopPropagation()}
            >
              Start Course
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
