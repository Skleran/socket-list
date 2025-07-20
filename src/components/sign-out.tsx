"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function SignOut() {
  const { signOut } = useAuthActions();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  return (
    <Button
      variant={"destructive"}
      className="w-full"
      onClick={async () => {
        setIsLoading(true);
        await signOut();
        router.push("/");
      }}
    >
      <p className={`animate-spin ${isLoading ? "" : "hidden"}`}>|</p>
      sign out
    </Button>
  );
}
