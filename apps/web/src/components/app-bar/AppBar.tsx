"use client";
import Link from "next/link";
import { Button } from "@repo/ui";
import { ModeToggle } from "../ModeToggle";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import UserAccountDropDown from "../UserAccountDropDown";
import { PlusCircledIcon } from "@radix-ui/react-icons";

export const Appbar = () => {
  const session = useSession();
  const user = session.data?.user;

  return (
    <div className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href={"/"}>
          <div className="text-foreground text-2xl font-semibold">
            One For All
          </div>
        </Link>
        <div className="flex items-center gap-4">
          {!user && (
            <Button
              variant="ghost"
              onClick={async () => {
                await signIn();
              }}
            >
              Login
            </Button>
          )}
          {(user?.role === "professor" || user?.role === "admin") && (
            <Link href="/admin/track">
              <PlusCircledIcon className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
            </Link>
          )}
          <ModeToggle />
          <UserAccountDropDown />
        </div>
      </div>
    </div>
  );
};
