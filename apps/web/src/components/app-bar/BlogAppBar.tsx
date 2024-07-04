"use client";
import Link from "next/link";
import { Button } from "@repo/ui";
import { ModeToggle } from "../ModeToggle";
import { useSession } from "next-auth/react";
import UserAccountDropDown from "../UserAccountDropDown";
import {
  ArrowTopRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { currentTrackDetails } from "../../atoms/userAtoms";
import { ProblemWithRelations, TracksType } from "../../types/userTypes";

export const BlogAppbar = ({
  problem,
  track,
}: {
  problem: ProblemWithRelations;
  track: TracksType;
}) => {
  const router = useRouter();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [scrollingDown, setScrollingDown] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const problemIndex =
    track?.Problems.findIndex((p) => p.id === problem.id) ?? -1;
  const { trackIds }: { trackIds: string[] } = useParams();
  const currentTrack = Array(trackIds).join("/");

  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedHandleScroll = debounce(() => {
    const currentScrollPos = window.scrollY;
    setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 50);
    setScrollingDown(prevScrollPos < currentScrollPos);
    setPrevScrollPos(currentScrollPos);
  }, 90);

  useEffect(() => {
    window.addEventListener("scroll", debouncedHandleScroll);
    return () => window.removeEventListener("scroll", debouncedHandleScroll);
  }, [prevScrollPos, debouncedHandleScroll]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (
        event.key === "ArrowRight" &&
        problemIndex < track!.Problems.length - 1
      ) {
        router.push(
          `/tracks/${track!.id}/${track!.Problems[problemIndex + 1].id}`
        );
      } else if (event.key === "ArrowLeft" && problemIndex > 0) {
        router.push(
          `/tracks/${track!.id}/${track!.Problems[problemIndex - 1].id}`
        );
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [track, problemIndex, router]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  return (
    <div
      className={`bg-background border-b border-border sticky top-0 z-50 transition-transform duration-300 ${
        !visible && scrollingDown ? "transform -translate-y-full" : ""
      }`}
      style={{ transform: !visible && !scrollingDown ? "translateY(0)" : "" }}
    >
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <div className="text-foreground text-2xl font-semibold">
            One For All
          </div>
        </Link>
        <p className="text-foreground mr-4 hidden md:block">
          {track?.title} ({problemIndex + 1} / {track?.Problems.length})
        </p>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Button
              variant="outline"
              onClick={toggleDropdown}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-2 py-1 text-sm flex h-10"
            >
              Jump To
              <ArrowTopRightIcon className="ml-1 h-4 w-4" />
            </Button>
            {isDropdownOpen && track?.Problems && (
              <div className="absolute top-full right-0 mt-1 bg-popover border border-border rounded shadow-lg max-h-80 overflow-y-auto z-50 w-48">
                {track.Problems.map((p, index) => (
                  <Link
                    key={p.id}
                    href={`/tracks/${track.id}/${p.id}`}
                    className={`block px-4 py-2 hover:bg-accent hover:text-accent-foreground text-popover-foreground text-sm ${
                      currentTrack === `${track.id}/${p.id}`
                        ? "bg-accent text-accent-foreground"
                        : ""
                    }`}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    {index + 1} - {p.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href={
              problemIndex !== 0 && track?.Problems[problemIndex - 1]
                ? `/tracks/${track.id}/${track.Problems[problemIndex - 1].id}`
                : ``
            }
            className={`${problemIndex === 0 ? "pointer-events-none opacity-50" : ""}`}
          >
            <Button
              variant="outline"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-2 py-1 text-sm flex h-10"
              disabled={problemIndex === 0}
            >
              <ChevronLeftIcon className="h-4 w-4" />
              <span className="hidden md:inline ml-1">Prev</span>
            </Button>
          </Link>

          <Link
            href={
              problemIndex + 1 < (track?.Problems.length ?? 0) &&
              track?.Problems[problemIndex + 1]
                ? `/tracks/${track.id}/${track.Problems[problemIndex + 1].id}`
                : ``
            }
            className={`${problemIndex + 1 >= (track?.Problems.length ?? 0) ? "pointer-events-none opacity-50" : ""}`}
          >
            <Button
              variant="outline"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-2 py-1 text-sm flex h-10"
              disabled={problemIndex + 1 >= (track?.Problems.length ?? 0)}
            >
              <span className="hidden md:inline mr-1">Next</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </Link>

          <ModeToggle />
          <UserAccountDropDown />
        </div>
      </div>
    </div>
  );
};
