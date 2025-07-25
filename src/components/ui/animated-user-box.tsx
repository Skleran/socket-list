"use client";

import { UserRound, X } from "lucide-react";
import { Button } from "../ui/button";
import { easeOut, motion, Variants, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
// import { LogoutButton } from "../ui/logout-button";
import ReactDOM from "react-dom";
import ChangeThemeTabs from "../ui/theme-selector";
// import { useAuth } from "../auth-context";
// import { jwtDecode } from "jwt-decode";
// import Link from "next/link";
import SignOut from "../sign-out";
import { useQuery } from "convex-helpers/react/cache/hooks";
import { api } from "../../../convex/_generated/api";
import Image from "next/image";

import type { Transition } from "framer-motion";
import ListLayoutSelector from "./list-layout-selector";

export default function UserBox() {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isHidden, setIsHidden] = useState<boolean>(true);
  const motionDivRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const user = useQuery(api.users.currentUser, {});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        isExpanded
      ) {
        handleClose();
      }
    };

    const handleScroll = () => {
      if (isExpanded) {
        handleClose();
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll, true);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isExpanded]);

  if (user === null) return null;

  const boxVariants: Variants = {
    initial: {
      width: "28px",
      height: "28px",
      zIndex: 0,
      borderRadius: "9px",
      padding: "0px",
    },
    expanded: {
      width: "270px",
      height: "250px",
      zIndex: 3,
      borderRadius: "20px",
      padding: "4px",
    },
  };

  const innerBoxVariants: Variants = {
    initial: {
      scale: 0.3,
      opacity: 0,
      y: "-15px",
      filter: "blur(5px)",
    },
    expanded: {
      scale: 1,
      opacity: 1,
      y: "0px",
      filter: "blur(0px)",
    },
  };

  const backdropVariants: Variants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
  };

  const transition: Transition = {
    duration: 0.3,
    type: "spring",
    stiffness: 50,
    ease: easeOut,
  };
  const backdropTransition: Transition = { duration: 0.2, ease: "easeInOut" };

  const handleClick = () => {
    if (!isExpanded) {
      setIsHidden(false);
      setTimeout(() => setIsExpanded(true), 10);
    } else {
      setIsExpanded(false);
    }
  };

  const handleAnimationComplete = (definition: string) => {
    if (definition === "initial") {
      setIsHidden(true);
    }
  };

  const handleClose = () => {
    if (isExpanded) {
      setIsExpanded(false);
    }
  };

  const renderBackdrop = () => {
    if (typeof document !== "undefined") {
      return ReactDOM.createPortal(
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="fixed inset-0 bg-black/15 backdrop-blur-xs z-9"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={backdropVariants}
              transition={backdropTransition}
              onClick={handleClose}
            />
          )}
        </AnimatePresence>,
        document.body
      );
    }
    return null;
  };

  return (
    <>
      {renderBackdrop()}
      <div
        ref={containerRef}
        className="w-fit h-fit flex items-baseline justify-end relative z-15 translate-x-[-14px]"
      >
        <motion.div
          animate={isExpanded ? "expanded" : "initial"}
          initial="initial"
          variants={boxVariants}
          transition={transition}
          className="absolute -m-3.5 -mr-2 border top-0 right-0 bg-card"
        >
          <Button
            variant="ghost"
            size="icon"
            className={`hover:cursor-pointer transition-all h-10 w-10 rounded-full bg-accent relative ${
              isExpanded ? "" : "-m-1.5"
            }`}
            onClick={handleClick}
          >
            {user?.image?.trim() ? (
              <div className="relative size-9.5">
                <Image
                  src={user.image}
                  alt="user profile image"
                  width={38}
                  height={38}
                  draggable={false}
                  className={`rounded-full absolute inset-0 m-auto size-9.5 transition-opacity duration-400 z-1 ${isExpanded ? "opacity-0" : "opacity-100"}`}
                />
                <X className="size-4.5 absolute inset-0 m-auto" />
              </div>
            ) : (
              // <UserRound className="size-4.5" />
              <UserRound className="size-4.5" />
            )}
          </Button>

          <motion.div
            ref={motionDivRef}
            animate={isExpanded ? "expanded" : "initial"}
            initial="initial"
            variants={innerBoxVariants}
            transition={transition}
            onAnimationComplete={handleAnimationComplete}
            className={`w-full h-[calc(100%-45px)] rounded-2xl p-2 flex flex-col items-center justify-between overflow-hidden bg-accent-foreground/5 ${
              isHidden ? "hidden" : ""
            }`}
          >
            <div className="w-full text-center h-fit flex flex-col">
              <p className="text-sm leading-4">{user?.name}</p>
            </div>
            <div>
              <ListLayoutSelector />
            </div>

            <div className="w-full h-fit flex flex-col items-center gap-4 justify-between">
              <ChangeThemeTabs animationKey="change-theme" />
              <SignOut />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
