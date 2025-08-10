import React, { useEffect, useState } from "react";
import {
  AnimatePresence,
  easeOut,
  motion,
  Transition,
  Variants,
} from "motion/react";
import { Dot, MousePointer2 } from "lucide-react";
import { Button } from "./button";
import { useLocale, useTranslations } from "next-intl";

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
    left: 10,
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
    left: 10,
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
    left: 10,
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
    right: "calc(75% * -1)",
    bottom: 0,
    rotate: -25,
  },
  visible: {
    opacity: 1,
    left: 10,
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
  function useIsMobile(breakpoint = 1280) {
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

  const [hoveredOnce, setHoveredOnce] = useState(false);
  const [hoverAnimationComplete, setHoverAnimationComplete] = useState(
    isMobile ? true : false
  );

  const t = useTranslations();
  const locale = useLocale();

  return (
    <motion.div className="w-[90vw] max-w-[500px] h-[700px] xl:h-[800px] mx-auto mt-20 mb-10 flex flex-col items-center justify-top gap-10 overflow-visible">
      <div className="flex flex-col gap-1 items-center">
        <h2 className="text-3xl font-semibold tracking-tight">
          {t("Landing_Demo.question")}
        </h2>
        <p>{t("Landing_Demo.question_explain")}</p>
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
        className="max-xl:h-fit h-[460px] max-xl:flex max-xl:flex-col max-xl:gap-4 w-full xl:w-[420px] p-4 ring-1 ring-accent-foreground/5 dark:bg-card shadow-md dark:shadow-none shadow-accent-foreground/10 rounded-4xl relative"
      >
        <div
          className="flex w-full h-full transition-opacity duration-500 hover:opacity-0 max-xl:hidden"
          onMouseEnter={() =>
            setTimeout(() => {
              setHoveredOnce(true);
            }, 500)
          }
        >
          {!hoveredOnce && (
            <div className="flex flex-col items-center gap-2 m-auto animate-pulse">
              <MousePointer2 className="size-8" />
              <p className="text-lg">{t("Landing_Demo.hover_indicator")}</p>
            </div>
          )}
        </div>
        <motion.div
          variants={msg1Variants}
          transition={animationTransitions}
          className="w-full xl:w-[400px] xl:absolute flex flex-col items-center"
        >
          <AnimatePresence mode="wait">
            {hoverAnimationComplete ? (
              <motion.ul
                key="list1"
                initial={{ opacity: 0, scale: 0.95, height: "100px" }}
                animate={{ opacity: 1, scale: 1, height: "68px" }}
                exit={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
                transition={{ duration: 0.5, ease: easeOut }}
                className="w-full flex flex-col gap-3 list-disc text-lg"
              >
                <li className="w-full grid grid-cols-[auto_1fr_auto_auto_auto_1fr_auto] items-center gap-0">
                  <Dot className="size-7" />
                  {t("Landing_Demo.text1_item1")}
                  <p className="text-center text-muted-foreground">|</p>
                  <p className="text-center mx-2">
                    {t("Landing_Demo.text1_shop")}
                  </p>
                  <p className="text-center text-muted-foreground">|</p>
                  <p className="text-end pr-6">3</p>
                </li>
                <li className="w-full grid grid-cols-[auto_1fr_auto_auto_auto_1fr_auto] items-center gap-0">
                  <Dot className="size-7" />
                  {t("Landing_Demo.text1_item2")}
                  <p className="text-center text-muted-foreground">|</p>
                  <p className="text-center mx-2">
                    {t("Landing_Demo.text1_shop")}
                  </p>
                  <p className="text-center text-muted-foreground">|</p>
                  <p className="text-end pr-6">1</p>
                </li>
              </motion.ul>
            ) : (
              <motion.div
                key="message1"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, filter: "blur(5px)", y: 10 }}
                transition={{ duration: 0.5, ease: easeOut }}
                className="bg-card dark:bg-accent w-full ring-1 ring-accent-foreground/10 dark:ring-accent-foreground/5 rounded-2xl py-2 px-3 shadow-lg shadow-accent/50 h-25"
              >
                <p className="font-semibold text-xl underline underline-offset-3">
                  {t("Landing_Demo.text1_subject")}
                </p>
                <p>{t("Landing_Demo.text1_text")}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        <motion.div
          variants={msg2Variants}
          transition={animationTransitions}
          className="w-full xl:w-[400px] xl:absolute flex flex-col"
        >
          <AnimatePresence mode="wait">
            {hoverAnimationComplete ? (
              <motion.ul
                key="list2"
                initial={{ opacity: 0, scale: 0.95, height: "100px" }}
                animate={{ opacity: 1, scale: 1, height: "68px" }}
                exit={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
                transition={{ duration: 0.5, ease: easeOut }}
                className={`w-full flex flex-col gap-3 list-disc text-lg ${hoverAnimationComplete ? (isMobile ? "-translate-y-1" : "-translate-y-8") : ""}`}
              >
                <li className="w-full grid grid-cols-[auto_1fr_auto_auto_auto_1fr_auto] items-center gap-0">
                  <Dot className="size-7" />
                  {t("Landing_Demo.text2_item1")}
                  <p className="text-center text-muted-foreground">|</p>
                  <p className="text-center mx-2">
                    {t("Landing_Demo.text2_shop")}
                  </p>
                  <p className="text-center text-muted-foreground">|</p>
                  <p className="text-end pr-6">1</p>
                </li>
                <li className="w-full grid grid-cols-[auto_1fr_auto_auto_auto_1fr_auto] items-center gap-0">
                  <Dot className="size-7" />
                  {t("Landing_Demo.text2_item2")}
                  <p className="text-center text-muted-foreground">|</p>
                  <p className="text-center mx-2">
                    {t("Landing_Demo.text2_shop")}
                  </p>
                  <p className="text-center text-muted-foreground">|</p>
                  <p className="text-end pr-6">3</p>
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
                  "bg-card dark:bg-accent ring-1 ring-accent-foreground/10 dark:ring-accent-foreground/5 rounded-2xl py-2 px-3 shadow-lg shadow-accent/50 h-25"
                }
              >
                <p className="font-semibold text-xl underline underline-offset-3">
                  {t("Landing_Demo.text2_subject")}
                </p>
                <p>{t("Landing_Demo.text2_text")}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        <motion.div
          variants={msg3Variants}
          transition={animationTransitions}
          className="w-full xl:w-[400px] xl:absolute flex flex-col"
        >
          <AnimatePresence mode="wait">
            {hoverAnimationComplete ? (
              <motion.ul
                key="list3"
                initial={{ opacity: 0, scale: 0.95, height: "100px" }}
                animate={{ opacity: 1, scale: 1, height: "68px" }}
                exit={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
                transition={{ duration: 0.5, ease: easeOut }}
                className={`w-full flex flex-col gap-3 list-disc text-lg ${hoverAnimationComplete ? (isMobile ? "-translate-y-2" : "-translate-y-16") : ""}`}
              >
                <li className="w-full grid grid-cols-[auto_1fr_auto_auto_auto_1fr_auto] items-center gap-0">
                  <Dot className="size-7" />
                  {t("Landing_Demo.text3_item1")}
                  <p className="text-center text-muted-foreground">|</p>
                  <p className="text-center mx-2">
                    {t("Landing_Demo.text3_shop")}
                  </p>
                  <p className="text-center text-muted-foreground">|</p>
                  <p className="text-end pr-6">2</p>
                </li>
                <li className="w-full grid grid-cols-[auto_1fr_auto_auto_auto_1fr_auto] items-center gap-0">
                  <Dot className="size-7" />
                  {t("Landing_Demo.text3_item2")}
                  <p className="text-center text-muted-foreground">|</p>
                  <p className="text-center mx-2">
                    {t("Landing_Demo.text3_shop")}
                  </p>
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
                className="bg-card dark:bg-accent ring-1 ring-accent-foreground/10 dark:ring-accent-foreground/5 rounded-2xl py-2 px-3 shadow-lg shadow-accent/50 h-25"
              >
                <p className="font-semibold text-xl underline underline-offset-3">
                  {t("Landing_Demo.text3_subject")}
                </p>
                <p>{t("Landing_Demo.text3_text")}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        <motion.div
          variants={msg4Variants}
          transition={animationTransitions}
          className="w-full xl:w-[400px] xl:absolute flex flex-col"
        >
          <AnimatePresence mode="wait">
            {hoverAnimationComplete ? (
              <motion.ul
                key="list4"
                initial={{ opacity: 0, scale: 0.95, height: "100px" }}
                animate={{ opacity: 1, scale: 1, height: "68px" }}
                exit={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
                transition={{ duration: 0.5, ease: easeOut }}
                className={`w-full flex flex-col gap-3 list-disc text-lg ${hoverAnimationComplete ? (isMobile ? "-translate-y-3" : "-translate-y-24") : ""}`}
              >
                <li className="w-full grid grid-cols-[auto_1fr_auto_auto_auto_1fr_auto] items-center gap-0">
                  <Dot className="size-7" />
                  {t("Landing_Demo.text4_item1")}
                  <p className="text-center text-muted-foreground">|</p>
                  <p className="text-center mx-2">
                    {t("Landing_Demo.text4_shop")}
                  </p>
                  <p className="text-center text-muted-foreground">|</p>
                  <p className="text-end pr-6">5</p>
                </li>
                <li className="w-full grid grid-cols-[auto_1fr_auto_auto_auto_1fr_auto] items-center gap-0 leading-5">
                  <Dot className="size-7" />
                  {t("Landing_Demo.text4_item2")}
                  <p className="text-center text-muted-foreground">|</p>
                  <p className="text-center mx-2">
                    {t("Landing_Demo.text4_shop")}
                  </p>
                  <p className="text-center text-muted-foreground">|</p>
                  <p className="text-end pr-6">20</p>
                </li>
              </motion.ul>
            ) : (
              <motion.div
                key="message4"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, filter: "blur(5px)", y: 10 }}
                transition={{ duration: 0.5, ease: easeOut, delay: 0.6 }}
                className="bg-card dark:bg-accent ring-1 ring-accent-foreground/10 dark:ring-accent-foreground/5 rounded-2xl py-2 px-3 shadow-lg shadow-accent/50 h-25"
              >
                <p className="font-semibold text-xl underline underline-offset-3">
                  {t("Landing_Demo.text4_subject")}
                </p>
                <p>{t("Landing_Demo.text4_text")}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
      {isMobile && (
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-row items-center justify-center gap-2">
            {hoverAnimationComplete ? (
              <p>{t("Landing_Demo.but")}</p>
            ) : (
              <p>{t("Landing_Demo.this")}</p>
            )}
            <Button
              onClick={() => setHoverAnimationComplete((prev) => !prev)}
              className={`px-4 py-2 rounded ${hoverAnimationComplete ? "" : "animate-ring-pulse"}`}
              variant={hoverAnimationComplete ? "secondary" : "default"}
            >
              {hoverAnimationComplete ? (
                <>{t("Landing_Demo.with_sl")}</>
              ) : (
                <>{t("Landing_Demo.without_sl")}</>
              )}
            </Button>
          </div>

          <div
            className={`transition-opacity duration-300 delay-1800 text-center ${hoverAnimationComplete ? "opacity-100" : "opacity-0"}`}
          >
            {t("Landing_Demo.followup_text")}
          </div>
        </div>
      )}

      {!isMobile && (
        <div className="flex flex-col items-center gap-2">
          <div
            className={`transition-opacity ${locale === "tr" ? "w-[300px]" : "w-[270px]"} duration-300 delay-1600 text-center ${hoverAnimationComplete ? "opacity-100" : "opacity-0"}`}
          >
            {t("Landing_Demo.followup_text_alt")}
          </div>
        </div>
      )}
    </motion.div>
  );
}
