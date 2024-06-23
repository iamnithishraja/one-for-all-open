"use client";
import { Button, Input, Label, TextArea } from "@repo/ui";
import SemCourseForm from "../../../components/SemCourseForm";
import { useRecoilState } from "recoil";
import { createTrackAtom } from "../../../atoms/adminAtoms";
import { CreateTrackSchema } from "../../../actions/track/schema";
import { createTrack } from "../../../actions/track";
import { useAction } from "../../../hooks/useAction";
import { useRouter } from "next/navigation";

export default () => {
  const [trackValue, setTrack] = useRecoilState(createTrackAtom);
  const router = useRouter();
  const { execute, fieldErrors } = useAction(createTrack, {
    onSuccess: () => {
      // TODO: show success tost
      setTrack({});
      router.push("/");
    },
    onError: (error) => {
      // TODO: show failure tost
    },
  });
  function addTrack() {
    try {
      CreateTrackSchema.parse(trackValue);
      execute(trackValue);
    } catch (e) {
      // TODO: show tost fill all required feilds
      console.log(e);
    }
  }
  return (
    <div className="w-screen h-screen flex justify-center">
      <div className="w-3/4">
        <h1 className="text-center m-4 text-3xl">create new track</h1>
        <div className="my-4">
          <Label className="text-xl my-2">Title</Label>
          <Input
            className="px-3 rounded-md"
            placeholder="enter title"
            onChange={(e) =>
              setTrack((prevData: any) => ({
                ...prevData,
                title: e.target.value,
              }))
            }
          />
        </div>
        <div className="my-4">
          <Label className="text-xl my-2">Description</Label>
          <TextArea
            className="px-3 rounded-md w-full"
            placeholder="enter description"
            onChange={(e) =>
              setTrack((prevData: any) => ({
                ...prevData,
                description: e.target.value,
              }))
            }
            rows={4}
          />
        </div>
        <div className="my-4">
          <Label className="text-xl my-2">Image</Label>
          <Input
            className="px-3 rounded-md"
            placeholder="enter image url"
            onChange={(e) =>
              setTrack((prevData: any) => ({
                ...prevData,
                image: e.target.value,
              }))
            }
          />
        </div>
        <div className="w-1/2 my-4">
          <Label className="text-xl my-2">Subject</Label>
          <Input
            className="px-3 rounded-md"
            placeholder="subject name"
            onChange={(e) => {
              setTrack((prevTrack: any) => ({
                ...prevTrack,
                subject: e.target.value,
              }));
            }}
          />
        </div>
        <SemCourseForm />
        <Button
          className="bg-white text-black"
          variant={"outline"}
          onClick={addTrack}
        >
          Create Track
        </Button>
      </div>
    </div>
  );
};
