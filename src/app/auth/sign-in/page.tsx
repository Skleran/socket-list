"use client";
import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";

export default function SignIn() {
  const { signIn } = useAuthActions();
  const [isLoadingGitHub, setIsLoadingGitHub] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);

  return (
    <div className="flex flex-col items-center justify-between font-mono py-24 text-center">
      <p className="pb-12 text-xl">welcome back</p>
      <div className="flex flex-col items-center gap-4">
        <p>login with your github account</p>
        <Button
          onClick={() => {
            setIsLoadingGitHub(true);
            void signIn("github", {
              redirectTo: "/",
            });
          }}
        >
          <p className={`animate-spin ${isLoadingGitHub ? "" : "hidden"}`}>|</p>
          login with github
        </Button>
      </div>
      <div className="flex flex-col items-center gap-4 pt-12">
        <p>login with your google account</p>
        <Button
          onClick={() => {
            setIsLoadingGoogle(true);
            void signIn("google", {
              redirectTo: "/",
            });
          }}
        >
          <p className={`animate-spin ${isLoadingGoogle ? "" : "hidden"}`}>|</p>
          login with google
        </Button>
      </div>
    </div>
  );
}
