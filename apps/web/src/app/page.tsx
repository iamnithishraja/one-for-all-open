"use client";
import { useSession } from "next-auth/react";

export default function Page(): JSX.Element {
  const session = useSession();
  //@ts-ignore
  console.log(session.data?.user);

  return <div>{!!session.data?.user?.email}</div>;
}
