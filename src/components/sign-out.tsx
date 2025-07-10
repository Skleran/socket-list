"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { Button } from "./ui/button";

export default function SignOut() {
  const { signOut } = useAuthActions();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button
      variant={"destructive"}
      className="w-full"
      onClick={() => {
        setIsLoading(true);
        void signOut();
      }}
    >
      <p className={`animate-spin ${isLoading ? "" : "hidden"}`}>|</p>
      sign out
    </Button>
  );
}
