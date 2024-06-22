"use client";
import Link from "next/link";
import { Button } from "@repo/ui";
import { ModeToggle } from "./ModeToggle";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import UserAccountDropDown from "./UserAccountDropDown";
import { PlusCircledIcon } from "@radix-ui/react-icons";

export const Appbar = () => {
  const session = useSession();
  const user = session.data?.user;

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 p-3 flex justify-center shadow-md sticky top-0 z-50">
      <div className="max-w-screen-xl flex justify-between w-full">
        <Link href={"/"}>
          <div className="dark:text-zinc-100 text-zinc-950 text-2xl font-semibold">
            One For All
          </div>
        </Link>
        <div className="flex items-center gap-2">
          {!user ? (
            <Button
              variant={"link"}
              onClick={async () => {
                await signIn();
              }}
            >
              Login
            </Button>
          ) : (
            ""
          )}
          {user?.role == "professor" || user?.role == "admin" ? (
            <Link href={"/admin/createtrack"}>
              <PlusCircledIcon className="h-[2rem] w-[2rem] ml-1 text-gray-500" />
            </Link>
          ) : null}
          <ModeToggle />
          <UserAccountDropDown />
        </div>
      </div>
    </div>
  );
};
