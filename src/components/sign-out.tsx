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
      <div className="grid grid-cols-[auto_1fr_auto] gap-3">
        <p
          className={`animate-spin transition-opacity ${isLoading ? "opacity-100" : "opacity-0"}`}
        >
          |
        </p>
        <p>sign out</p>
        <p
          className={`animate-spin transition-opacity ${isLoading ? "opacity-0" : "opacity-0"}`}
        >
          |
        </p>
      </div>
    </Button>
  );
}
