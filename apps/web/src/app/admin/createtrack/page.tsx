"use client";
import { Input, Label } from "@repo/ui";
export default () => {
  // select semister, course, subject
  return (
    <div className="w-screen h-screen flex justify-center">
      <div className="w-3/4">
        <h1 className="text-center m-4 text-3xl">create new track</h1>
        <div className="my-4">
          <Label className="text-xl my-2">Title</Label>
          <Input className="px-3 rounded-md" placeholder="enter title" />
        </div>
        <div className="my-4">
          <Label className="text-xl my-2">Description</Label>
          <textarea
            className="px-3 rounded-md w-full"
            placeholder="enter description"
            rows={4}
          />
        </div>
        
      </div>
    </div>
  );
};
