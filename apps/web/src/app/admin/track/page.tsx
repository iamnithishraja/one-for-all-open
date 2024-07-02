"use client";
import { Button, Input, Label, TextArea } from "@repo/ui";
import SemCourseForm from "../../../components/SemCourseForm";
import { useRecoilState } from "recoil";
import { trackAtom } from "../../../atoms/adminAtoms";
import {
  CreateTrackSchema,
  UpdateTrackSchema,
} from "../../../actions/track/schema";
import { createTrack, updateTrack } from "../../../actions/track";
import { useAction } from "../../../hooks/useAction";
import { useRouter } from "next/navigation";

export default () => {
  const [trackValue, setTrack] = useRecoilState(trackAtom);
  const router = useRouter();
  const { execute: executeCreate, fieldErrors: fieldErrorsCreate } = useAction(
    createTrack,
    {
      onSuccess: () => {
        // TODO: show success toast
        setTrack({});
        router.push("/");
      },
      onError: (error) => {
        // TODO: show failure toast
      },
    }
  );
  const { execute: executeUpdate, fieldErrors: fieldErrorsUpdate } = useAction(
    updateTrack,
    {
      onSuccess: () => {
        // TODO: show success toast
        setTrack({});
        router.push("/");
      },
      onError: (error) => {
        // TODO: show failure toast
      },
    }
  );

  function addTrack() {
    try {
      CreateTrackSchema.parse(trackValue);
      executeCreate(trackValue);
    } catch (e) {
      // TODO: show toast fill all required fields
      console.log(e);
    }
  }

  function editTrack() {
    try {
      UpdateTrackSchema.parse(trackValue);
      executeUpdate(trackValue);
    } catch (e) {
      // TODO: show toast fill all required fields
      console.log(e);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          {trackValue.isUpdating ? "Edit Track" : "Create New Track"}
        </h1>
        <div className="bg-secondary p-6 rounded-lg shadow-md space-y-6">
          <div>
            <Label htmlFor="title" className="text-lg font-medium block mb-2">
              Title
            </Label>
            <Input
              id="title"
              className="w-full bg-input text-foreground"
              placeholder="Enter title"
              value={trackValue.title}
              onChange={(e) =>
                setTrack((prevData:any) => ({
                  ...prevData,
                  title: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <Label htmlFor="description" className="text-lg font-medium block mb-2">
              Description
            </Label>
            <TextArea
              id="description"
              className="w-full bg-input text-foreground"
              placeholder="Enter description"
              value={trackValue.description}
              onChange={(e) =>
                setTrack((prevData:any) => ({
                  ...prevData,
                  description: e.target.value,
                }))
              }
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="image" className="text-lg font-medium block mb-2">
              Image URL
            </Label>
            <Input
              id="image"
              className="w-full bg-input text-foreground"
              placeholder="Enter image URL"
              value={trackValue.image}
              onChange={(e) =>
                setTrack((prevData:any) => ({
                  ...prevData,
                  image: e.target.value,
                }))
              }
            />
          </div>
          <SemCourseForm />
          <div className="pt-4">
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={trackValue.isUpdating ? editTrack : addTrack}
            >
              {trackValue.isUpdating ? "Update Track" : "Create Track"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};