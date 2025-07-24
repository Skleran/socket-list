import Image from "next/image";
import React from "react";
import { easeOut, motion } from "motion/react";

export default function HeroImages() {
  const images = {
    img1Dark: "/media/img1Dark.png",
    img2Dark: "/media/img2Dark.png",
    img3Dark: "/media/img3Dark.png",
    img1Light: "/media/img1Light.png",
    img2Light: "/media/img2Light.png",
    img3Light: "/media/img3Light.png",
  };

  const animationVariants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: 2,
        staggerChildren: 0.55,
        duration: 1,
        easing: easeOut,
      },
    },
  };

  const childVariants = {
    hidden: {
      opacity: 0,
      scale: 0.6,
      filter: "blur(10px)",
      transform: "translateY(20%)",
    },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transform: "translateY(0%)",
      transition: { duration: 1, easing: easeOut },
    },
  };

  return (
    <motion.div
      variants={animationVariants}
      initial={"hidden"}
      animate={"visible"}
      key={"qwe"}
      className="flex flex-col items-center gap-8 sm:relative mt-10 mb-8"
    >
      <motion.div
        variants={childVariants}
        className="bg-background hover:scale-105 hover:z-15 transition-all duration-400 ease-out sm:absolute left-[50%] max-w-screen size-[350px] sm:-translate-x-[50%] ring ring-accent-foreground/5 rounded-xl shadow-accent-foreground/15 dark:shadow-accent-foreground/7 shadow-2xl overflow-hidden z-10"
      >
        <Image
          src={images.img1Dark}
          alt="..."
          fill
          className="hidden dark:inline object-contain"
        />
        <Image
          src={images.img1Light}
          alt="..."
          fill
          className="inline dark:hidden object-contain"
        />
      </motion.div>
      <motion.div
        variants={childVariants}
        className="bg-background hover:scale-105 hover:-rotate-3 hover:-translate-x-5 hover:z-15 transition-all duration-400 ease-out sm:absolute left-0 top-10 ring ring-accent-foreground/5 rounded-xl shadow-accent-foreground/15 dark:shadow-accent-foreground/7 shadow-2xl overflow-hidden max-w-screen size-[350px] z-5"
      >
        <Image
          src={images.img2Dark}
          alt="..."
          fill
          className="hidden dark:inline object-contain"
        />
        <Image
          src={images.img2Light}
          alt="..."
          fill
          className="inline dark:hidden object-contain"
        />
      </motion.div>
      <motion.div
        variants={childVariants}
        className="bg-background hover:scale-105 hover:rotate-3 hover:translate-x-5 hover:z-15 transition-all duration-400 ease-out sm:absolute right-0 top-10 ring ring-accent-foreground/5 rounded-xl shadow-accent-foreground/15 dark:shadow-accent-foreground/7 shadow-2xl overflow-hidden max-w-screen size-[350px] z-5"
      >
        <Image
          src={images.img3Dark}
          alt="..."
          fill
          className="hidden dark:inline object-contain"
        />
        <Image
          src={images.img3Light}
          alt="..."
          fill
          className="inline dark:hidden object-contain"
        />
      </motion.div>
    </motion.div>
  );
}
