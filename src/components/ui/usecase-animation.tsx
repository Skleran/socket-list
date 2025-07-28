import React from "react";
import {
  // AnimatePresence,
  easeOut,
  motion,
  Transition,
  Variants,
} from "motion/react";

const animationVariants: Variants = {
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
    left: 12,
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
    left: 12,
    top: 124,
    rotate: 0,
    // transition: { animationTransitions },
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
    left: 12,
    top: 236,
    rotate: 0,
    // transition: { animationTransitions },
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
    left: 12,
    top: 348,
    rotate: 0,
    // transition: { animationTransitions },
  },
};

export default function UsecaseAnimation() {
  return (
    <motion.div className="w-full h-[700px] mb-20 flex flex-col items-center justify-between overflow-visible">
      <div className="flex flex-col gap-1 items-center">
        <h2 className="text-3xl font-semibold tracking-tight">
          Why shared lists?
        </h2>
        <p>Managing tasks together shouldn't be a hassle.</p>
      </div>
      <motion.div
        variants={animationVariants}
        transition={animationTransitions}
        initial={"hidden"}
        whileHover={"visible"}
        // onAnimationComplete={}
        key={"landing-list-animation"}
        className="h-[600px] w-[500px] p-3 border-1 border-destructive relative"
      >
        <motion.div
          variants={msg1Variants}
          transition={animationTransitions}
          className="w-[400px] border-1 border-destructive h-25 absolute flex flex-col"
        >
          <p className="font-semibold text-xl underline">Mom</p>
          <p>Buy some chicken and bread!</p>
        </motion.div>
        <motion.div
          variants={msg2Variants}
          transition={animationTransitions}
          className="w-[400px] border-1 border-destructive h-25 absolute flex flex-col"
        >
          <p className="font-semibold text-xl underline">Dad</p>
          <p>Buy some chicken and bread!</p>
        </motion.div>
        <motion.div
          variants={msg3Variants}
          transition={animationTransitions}
          className="w-[400px] border-1 border-destructive h-25 absolute flex flex-col"
        >
          <p className="font-semibold text-xl underline">Brother</p>
          <p>Buy some chicken and bread!</p>
        </motion.div>
        <motion.div
          variants={msg4Variants}
          transition={animationTransitions}
          className="w-[400px] border-1 border-destructive h-25 absolute  flex flex-col"
        >
          <p className="font-semibold text-xl underline">Sister</p>
          <p>Buy some chicken and bread!</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
