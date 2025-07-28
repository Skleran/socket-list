import React, { useEffect, useState } from "react";
import {
  AnimatePresence,
  easeOut,
  motion,
  Transition,
  Variants,
} from "motion/react";
import { Dot } from "lucide-react";
import { Button } from "./button";

const hoverAnimationVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.2,
      // duration: 1,
      // type: "spring",
      // stiffness: 50,
      // easing: easeOut,
    },
  },
};

const animationTransitions: Transition = {
  duration: 0.4,
  // type: "spring",
  // stiffness: 60,
  // mass: 0.75,
  ease: easeOut,
};

const msg1Variants = {
  hidden: {
    opacity: 1,
    left: "calc(100% * -1)",
    top: -40,
    rotate: -30,
  },
  visible: {
    opacity: 1,
    left: 40,
    top: 12,
    rotate: 0,
    // transition: { animationTransitions },
  },
  exit: {
    opacity: 0,
  },
};

const msg2Variants = {
  hidden: {
    opacity: 1,
    right: "calc(90% * -1)",
    top: 0,
    rotate: 20,
  },
  visible: {
    opacity: 1,
    left: 40,
    top: 124,
    rotate: 0,
    // transition: { animationTransitions },
  },
  exit: {
    opacity: 0,
    filter: "blur(5px)",
    transform: "translateY(10%)",
  },
};

const msg3Variants = {
  hidden: {
    opacity: 1,
    left: "calc(80% * -1)",
    top: 400,
    rotate: 20,
  },
  visible: {
    opacity: 1,
    left: 40,
    top: 236,
    rotate: 0,
    // transition: { animationTransitions },
  },
  exit: {
    opacity: 0,
    filter: "blur(5px)",
    transform: "translateY(10%)",
  },
};

const msg4Variants = {
  hidden: {
    opacity: 1,
    right: "calc(70% * -1)",
    bottom: 0,
    rotate: -30,
  },
  visible: {
    opacity: 1,
    left: 40,
    top: 348,
    rotate: 0,
    // transition: { animationTransitions },
  },
  exit: {
    opacity: 0,
    filter: "blur(5px)",
    transform: "translateY(10%)",
  },
};

export default function UsecaseAnimation() {
  function useIsMobile(breakpoint = 640) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const check = () => setIsMobile(window.innerWidth < breakpoint);
      check();
      window.addEventListener("resize", check);
      return () => window.removeEventListener("resize", check);
    }, [breakpoint]);

    return isMobile;
  }

  const isMobile = useIsMobile();

  const [hoverAnimationComplete, setHoverAnimationComplete] = useState(
    isMobile ? true : false
  );

  return (
    <motion.div className="w-full max-w-[90vw] sm:max-w-[500px] h-[700px] mx-auto mb-20 flex flex-col items-center justify-between overflow-visible">
      <div className="flex flex-col gap-1 items-center">
        <h2 className="text-3xl font-semibold tracking-tight">
          Why shared lists?
        </h2>
        <p>Managing tasks together shouldn&apos;t be a hassle.</p>
        {isMobile && (
          <Button
            onClick={() => setHoverAnimationComplete((prev) => !prev)}
            className="mt-4 px-4 py-2 bg-black text-white rounded"
          >
            {hoverAnimationComplete ? "Hide List" : "Show as List"}
          </Button>
        )}
      </div>
      <motion.div
        variants={hoverAnimationVariants}
        transition={animationTransitions}
        initial={isMobile ? "visible" : "hidden"}
        key="landing-list-animation"
        animate={
          isMobile
            ? hoverAnimationComplete
              ? "visible"
              : "visible"
            : undefined
        }
        {...(!isMobile && {
          whileHover: "visible",
          onHoverEnd: () => setHoverAnimationComplete(false),
          onAnimationComplete: () => setHoverAnimationComplete(true),
        })}
        className="max-sm:h-fit h-[600px] max-sm:flex max-sm:flex-col max-sm:gap-4 w-full sm:w-[500px] p-4 ring-1 ring-accent-foreground/5 shadow-md shadow-accent-foreground/10 rounded-4xl relative"
      >
        <motion.div
          variants={msg1Variants}
          transition={animationTransitions}
          className="w-full sm:w-[400px] sm:absolute flex flex-col items-center"
        >
          <AnimatePresence mode="wait">
            {hoverAnimationComplete ? (
              <motion.ul
                key="list1"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
                transition={{ duration: 0.5, ease: easeOut }}
                className="w-full flex flex-col gap-3 list-disc text-lg"
              >
                <li className="w-full grid grid-cols-[auto_1fr_auto_20%_auto_1fr_auto] items-center gap-0">
                  <Dot className="size-7" />
                  Chicken
                  <p className="text-center text-muted-foreground">|</p>
                  <p className="text-center">Market</p>
                  <p className="text-center text-muted-foreground">|</p>
                  <p className="text-end pr-6">1</p>
                </li>
                <li className="w-full grid grid-cols-[auto_1fr_auto_20%_auto_1fr_auto] items-center gap-0">
                  <Dot className="size-7" />
                  Get Bread
                  <p className="text-center text-muted-foreground">|</p>
                  <p className="text-center">Bakery</p>
                  <p className="text-center text-muted-foreground">|</p>
                  <p className="text-end pr-6">2</p>
                </li>
              </motion.ul>
            ) : (
              <motion.div
                key="message1"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, filter: "blur(5px)", y: 10 }}
                transition={{ duration: 0.5, ease: easeOut }}
                className="bg-background w-full ring-1 ring-accent-foreground/10 dark:ring-accent-foreground/5 rounded-2xl py-2 px-3 shadow-lg shadow-accent/50 h-25"
              >
                <p className="font-semibold text-xl underline underline-offset-3">
                  Mom
                </p>
                <p>Buy some chicken and bread!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        <motion.div
          variants={msg2Variants}
          transition={animationTransitions}
          className="w-full sm:w-[400px] sm:absolute flex flex-col"
        >
          <AnimatePresence mode="wait">
            {hoverAnimationComplete ? (
              <motion.ul
                key="list2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
                transition={{ duration: 0.5, ease: easeOut }}
                className={`w-full flex flex-col gap-3 list-disc text-lg ${hoverAnimationComplete ? "-translate-y-8" : ""}`}
              >
                <li className="w-full grid grid-cols-[auto_1fr_auto_20%_auto_1fr_auto] items-center gap-0">
                  <Dot className="size-7" />
                  Chicken
                  <p className="text-center text-muted-foreground">|</p>
                  <p className="text-center">Market</p>
                  <p className="text-center text-muted-foreground">|</p>
                  <p className="text-end pr-6">1</p>
                </li>
                <li className="w-full grid grid-cols-[auto_1fr_auto_20%_auto_1fr_auto] items-center gap-0">
                  <Dot className="size-7" />
                  Get Bread
                  <p className="text-center text-muted-foreground">|</p>
                  <p className="text-center">Bakery</p>
                  <p className="text-center text-muted-foreground">|</p>
                  <p className="text-end pr-6">2</p>
                </li>
              </motion.ul>
            ) : (
              <motion.div
                key="message2"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, filter: "blur(5px)", y: 10 }}
                transition={{ duration: 0.5, ease: easeOut, delay: 0.2 }}
                className={
                  "bg-background ring-1 ring-accent-foreground/10 dark:ring-accent-foreground/5 rounded-2xl py-2 px-3 shadow-lg shadow-accent/50 h-25"
                }
              >
                <p className="font-semibold text-xl underline">Mom</p>
                <p>Buy some chicken and bread!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        <motion.div
          variants={msg3Variants}
          transition={animationTransitions}
          className="w-full sm:w-[400px] sm:absolute flex flex-col"
        >
          <AnimatePresence mode="wait">
            {hoverAnimationComplete ? (
              <motion.ul
                key="list3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
                transition={{ duration: 0.5, ease: easeOut }}
                className={`w-full flex flex-col gap-3 list-disc text-lg ${hoverAnimationComplete ? "-translate-y-16" : ""}`}
              >
                <li className="w-full grid grid-cols-[auto_1fr_auto_20%_auto_1fr_auto] items-center gap-0">
                  <Dot className="size-7" />
                  Chicken
                  <p className="text-center text-muted-foreground">|</p>
                  <p className="text-center">Market</p>
                  <p className="text-center text-muted-foreground">|</p>
                  <p className="text-end pr-6">1</p>
                </li>
                <li className="w-full grid grid-cols-[auto_1fr_auto_20%_auto_1fr_auto] items-center gap-0">
                  <Dot className="size-7" />
                  Get Bread
                  <p className="text-center text-muted-foreground">|</p>
                  <p className="text-center">Bakery</p>
                  <p className="text-center text-muted-foreground">|</p>
                  <p className="text-end pr-6">2</p>
                </li>
              </motion.ul>
            ) : (
              <motion.div
                key="message3"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, filter: "blur(5px)", y: 10 }}
                transition={{ duration: 0.5, ease: easeOut, delay: 0.4 }}
                className="bg-background ring-1 ring-accent-foreground/10 dark:ring-accent-foreground/5 rounded-2xl py-2 px-3 shadow-lg shadow-accent/50 h-25"
              >
                <p className="font-semibold text-xl underline">Mom</p>
                <p>Buy some chicken and bread!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        <motion.div
          variants={msg4Variants}
          transition={animationTransitions}
          className="w-full sm:w-[400px] sm:absolute  flex flex-col"
        >
          <AnimatePresence mode="wait">
            {hoverAnimationComplete ? (
              <motion.ul
                key="list4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
                transition={{ duration: 0.5, ease: easeOut }}
                className={`w-full flex flex-col gap-3 list-disc text-lg ${hoverAnimationComplete ? "-translate-y-24" : ""}`}
              >
                <li className="w-full grid grid-cols-[auto_1fr_auto_20%_auto_1fr_auto] items-center gap-0">
                  <Dot className="size-7" />
                  Chicken
                  <p className="text-center text-muted-foreground">|</p>
                  <p className="text-center">Market</p>
                  <p className="text-center text-muted-foreground">|</p>
                  <p className="text-end pr-6">1</p>
                </li>
                <li className="w-full grid grid-cols-[auto_1fr_auto_20%_auto_1fr_auto] items-center gap-0">
                  <Dot className="size-7" />
                  Get Bread
                  <p className="text-center text-muted-foreground">|</p>
                  <p className="text-center">Bakery</p>
                  <p className="text-center text-muted-foreground">|</p>
                  <p className="text-end pr-6">2</p>
                </li>
              </motion.ul>
            ) : (
              <motion.div
                key="message4"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, filter: "blur(5px)", y: 10 }}
                transition={{ duration: 0.5, ease: easeOut, delay: 0.6 }}
                className="bg-background ring-1 ring-accent-foreground/10 dark:ring-accent-foreground/5 rounded-2xl py-2 px-3 shadow-lg shadow-accent/50 h-25"
              >
                <p className="font-semibold text-xl underline">Mom</p>
                <p>Buy some chicken and bread!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
