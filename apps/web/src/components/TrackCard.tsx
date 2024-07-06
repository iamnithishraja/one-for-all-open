"use client";
import { Button } from "@repo/ui";
import {
  ArrowRightIcon,
  ChevronRightIcon,
  Pencil1Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { useState } from "react";
import { TrackPreview } from "./TrackPreview";
import Link from "next/link";
import { TracksType } from "../types/userTypes";
import { useSession } from "next-auth/react";
import { user } from "../types/userTypes";
import { useSetRecoilState } from "recoil";
import { trackAtom } from "../atoms/adminAtoms";
import { useRouter } from "next/navigation";
import { useAction } from "../hooks/useAction";
import { deleteTrack } from "../actions/track";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { currentTrackDetails } from "../atoms/userAtoms";

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: Boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-background border border-border p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-foreground">
          Confirm Deletion
        </h2>
        <p className="mb-6 text-muted-foreground">
          Are you sure you want to delete this track? This action cannot be
          undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors duration-200"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors duration-200"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export function TrackCard({ track }: { track: TracksType }) {
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const setTrack = useSetRecoilState(trackAtom);
  const session = useSession();
  const router = useRouter();
  const setCurrentTrack = useSetRecoilState(currentTrackDetails);
  const user = session.data?.user as unknown as user;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { execute, fieldErrors } = useAction(deleteTrack, {
    onSuccess: () => {
      // TODO: show success tost
      setTrack({});
      router.push("/");
    },
    onError: (error) => {
      // TODO: show failure tost
    },
  });

  return (
    <>
      <div
        className="max-w-screen-md w-full cursor-pointer transition-all duration-300 
                   hover:border-primary hover:shadow-xl dark:hover:shadow-primary/20
                   border-2 border-primary/20 rounded-lg p-6 mb-6 bg-secondary/10"
        onClick={() => setShowPreview(true)}
      >
        <div className="flex flex-col sm:flex-row gap-6">
          <img
            src={track.image}
            className="h-40 w-full sm:w-40 object-cover rounded-lg shadow-md"
            alt={`${track.title} image`}
          />
          <div className="flex flex-col justify-between flex-grow">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">
                {track.title}
              </h2>
              <p className="text-sm text-foreground/80 mb-3">
                {track.description.slice(0, 180) +
                  (track.description.length > 180 ? "..." : "")}
              </p>
              <p className="text-sm font-medium text-primary/80">
                {track.subject.name}
              </p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-foreground/70">
                  {track.Problems.length} Lessons
                </h3>
                {track.autherId === user?.id && (
                  <div className="flex gap-2">
                    <button
                      className="p-2 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTrack({ ...track, isUpdating: true });
                        router.push("/admin/track");
                      }}
                    >
                      <Pencil1Icon className="h-4 w-4 text-white" />
                    </button>
                    <button
                      className="p-2 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteModal(true);
                      }}
                    >
                      <TrashIcon className="h-4 w-4 text-white" />
                    </button>
                    <button
                      className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/admin/problem/${track.id}`);
                      }}
                    >
                      <PlusCircledIcon className="h-4 w-4 text-white" />
                    </button>
                  </div>
                )}
              </div>
              <Link
                href={
                  track.Problems.length
                    ? `/tracks/${track.id}/${track.Problems[0]?.id}`
                    : "#"
                }
                onClick={(e) => {
                  setCurrentTrack(track);
                  e.stopPropagation();
                }}
              >
                <Button
                  size={"lg"}
                  className="flex items-center justify-center group bg-primary text-primary-foreground 
                             hover:bg-primary/90 transition-all duration-300 px-4 py-2 rounded-full"
                >
                  Get Started
                  <ChevronRightIcon className="ml-2 h-5 w-5 group-hover:hidden transition-all duration-300" />
                  <ArrowRightIcon className="ml-2 h-5 w-5 hidden group-hover:block transition-all duration-300" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <TrackPreview
        showPreview={showPreview}
        setShowPreview={setShowPreview}
        track={track}
      />
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          execute({ id: track.id });
          router.push("/");
          setShowDeleteModal(false);
        }}
      />
    </>
  );
}
