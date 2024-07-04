"use client";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { LogOut, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import UserImage from "./UserImage";
import { useState } from "react";

const dropDownData = [
  {
    name: "Profile",
    icon: <UserRound size={15} />,
    href: "/profile",
  },
];

export default function UserAccountDropDown() {
  const session = useSession();
  const user = session.data?.user;
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };
  return (
    <>
      {user && (
        <div className="relative inline-block">
          <button
            onClick={toggleDropdown}
            className="w-[2rem] flex items-center p-[0.2rem] justify-center h-[2rem]"
          >
            {!user.image ? <UserRound /> : <UserImage image={user.image} />}
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-[15rem] bg-background border border-border rounded-lg shadow-lg z-10">
              <div className="flex gap-4 items-center p-4">
                <div className="w-[2rem] flex items-center justify-center h-[2rem]">
                  {!user.image ? (
                    <UserRound />
                  ) : (
                    <UserImage image={user.image} />
                  )}
                </div>

                <div className="flex flex-col">
                  <span className="max-w-[200px]">{user?.name}</span>
                  <span className="text-[0.8rem] max-w-[200px] text-muted-foreground">
                    {user?.email}
                  </span>
                </div>
              </div>
              <hr className="border-border" />

              {dropDownData.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    router.push(item.href);
                    setIsOpen(false);
                  }}
                  className="w-full text-left flex items-center gap-2 p-4 hover:bg-accent text-foreground"
                >
                  {item.icon}
                  {item.name}
                </button>
              ))}
              <hr className="border-border" />
              <button
                onClick={handleSignOut}
                className="w-full text-left flex items-center gap-2 p-4 hover:bg-destructive hover:text-destructive-foreground"
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
