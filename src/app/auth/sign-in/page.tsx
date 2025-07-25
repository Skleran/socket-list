"use client";
import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { AnimatePresence, easeOut, motion } from "motion/react";
import HeroImages from "@/components/ui/hero-images";
import BackgroundGradient from "@/components/ui/bg-gradient";

export default function SignIn() {
  const { signIn } = useAuthActions();
  const [isLoadingGitHub, setIsLoadingGitHub] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);

  const animationVariants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: 0.4,
        staggerChildren: 0.04,
        duration: 1,
        easing: easeOut,
      },
    },
  };

  const childVariants = {
    hidden: {
      opacity: 0,
      filter: "blur(10px)",
      transform: "translateY(20%)",
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      transform: "translateY(0%)",
      transition: { duration: 1, easing: easeOut },
    },
  };

  return (
    <AnimatePresence>
      <BackgroundGradient key={"bg"} />
      <motion.div
        variants={animationVariants}
        initial={"hidden"}
        animate={"visible"}
        className="flex flex-col items-center justify-between gap-6 font-mono py-24 text-center"
      >
        <motion.div
          variants={childVariants}
          className="bg-accent-foreground text-accent py-1.5 px-3 rounded-4xl hover:bg-background hover:shadow-xl hover:shadow-accent-foreground/20 dark:hover:shadow-accent-foreground/15 hover:text-accent-foreground transition-all duration-400"
        >
          {/* <p className="">one list, everyone&#8217;s updates</p> */}
          <p className="">shared lists, made simple</p>
        </motion.div>
        <div className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 mb-2 sm:mb-3 sm:text-5xl">
          <h1 className="">
            {"Lists shouldn’t be lonely.".split(" ").map((word, idx, arr) => (
              <motion.span
                key={idx}
                variants={childVariants}
                className="inline-block hover:font-extrabold transition-all duration-300"
              >
                {word}
                {idx < arr.length - 1 ? "\u00A0" : ""}
              </motion.span>
            ))}
          </h1>
          <h1 className="">
            {"Share yours with anyone instantly."
              .split(" ")
              .map((word, idx, arr) => (
                <motion.span
                  key={idx}
                  variants={childVariants}
                  className="inline-block hover:font-extrabold transition-all duration-300"
                >
                  {word}
                  {idx < arr.length - 1 ? "\u00A0" : ""}
                </motion.span>
              ))}
          </h1>
        </div>

        <div className="w-full px-10 flex flex-col gap-3">
          <motion.p
            key={"button-text"}
            variants={childVariants}
            className="text-muted-foreground"
          >
            Make a list, send the link.
          </motion.p>
          <div className="w-full flex justify-center items-center flex-col sm:flex-row gap-3">
            <motion.div
              key={"button-github"}
              variants={childVariants}
              className="sm:w-[40%]"
            >
              <Button
                className="py-5"
                onClick={() => {
                  setIsLoadingGitHub(true);
                  void signIn("github", {
                    redirectTo: "/",
                  });
                }}
              >
                <div className="grid grid-cols-[1fr_1fr_1fr] gap-3">
                  <div className="w-full flex justify-end">
                    {" "}
                    <p
                      className={`animate-spin transition-opacity ${isLoadingGitHub ? "opacity-100" : "opacity-0"}`}
                    >
                      |
                    </p>
                  </div>

                  <p className="flex gap-1 items-center">
                    login with{" "}
                    <svg
                      width="1024"
                      height="1024"
                      viewBox="0 0 1024 1024"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        className="fill-accent"
                        d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
                        transform="scale(64)"
                      />
                    </svg>
                    github
                  </p>
                  <div></div>
                </div>
              </Button>
            </motion.div>

            <motion.p
              key={"or"}
              variants={childVariants}
              className="hidden sm:inline"
            >
              or
            </motion.p>

            <motion.div
              key={"button-google"}
              variants={childVariants}
              className="sm:w-[40%]"
            >
              {" "}
              <Button
                className="py-5"
                onClick={() => {
                  setIsLoadingGoogle(true);
                  void signIn("google", {
                    redirectTo: "/",
                  });
                }}
              >
                <div className="grid grid-cols-[1fr_1fr_1fr] gap-3">
                  <div className="w-full flex justify-end">
                    {" "}
                    <p
                      className={`animate-spin transition-opacity ${isLoadingGoogle ? "opacity-100" : "opacity-0"}`}
                    >
                      |
                    </p>
                  </div>

                  <p className="flex gap-1 items-center">
                    login with{" "}
                    <svg
                      width="256"
                      height="262"
                      viewBox="0 0 256 262"
                      xmlns="http://www.w3.org/2000/svg"
                      preserveAspectRatio="xMidYMid"
                      className="fill-accent"
                    >
                      <path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" />
                      <path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" />
                      <path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" />
                      <path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" />
                    </svg>
                    google
                  </p>
                  <div></div>
                </div>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
      <HeroImages key={"images"} />
    </AnimatePresence>
  );
}
