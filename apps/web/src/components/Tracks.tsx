"use client";
import { TrackCard } from "./TrackCard";
import { selectedSubjectAtom } from "../atoms/userAtoms";
import { useRecoilValue } from "recoil";
import { useMemo, useState, useCallback } from "react";
import { TracksType } from "../types/userTypes";

export const Tracks = ({ tracks }: { tracks: TracksType[] }) => {
  const selectedSubject = useRecoilValue(selectedSubjectAtom);
  const [sortBy, setSortBy] = useState<string>("");

  const filteredAndSortedTracks = useMemo(() => {
    let result = tracks;

    if (selectedSubject) {
      result = result.filter(
        (t) =>
          t.subject.name === selectedSubject ||
          selectedSubject == "All Subjects"
      );
    }

    switch (sortBy) {
      case "ascending":
        return result.sort((a, b) => a.title.localeCompare(b.title));
      case "descending":
        return result.sort((a, b) => b.title.localeCompare(a.title));
      case "new":
        return result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "old":
        return result.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      default:
        return result;
    }
  }, [tracks, selectedSubject, sortBy]);

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSortBy(e.target.value);
    },
    []
  );

  return (
    <div className="bg-background text-foreground">
      <div className="relative w-full max-w-xs mx-auto mt-6">
        <select
          className="block appearance-none w-full bg-background border border-input hover:border-accent px-4 py-1 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
          onChange={handleSortChange}
          value={sortBy}
        >
          <option value="" disabled>
            Sort by
          </option>
          <option value="ascending">Ascending (A to Z)</option>
          <option value="descending">Descending (Z to A)</option>
          <option value="new">Newest first</option>
          <option value="old">Oldest first</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M7 10l5 5 5-5H7z" />
          </svg>
        </div>
      </div>
      <ul className="p-8 md:p-20 grid grid-cols-1 gap-x-6 gap-y-8 place-items-center lg:grid-cols-2 w-full">
        {filteredAndSortedTracks.map((t) => (
          <li key={t.id} className="max-w-screen-md w-full">
            <TrackCard track={t} />
          </li>
        ))}
      </ul>
    </div>
  );
};
