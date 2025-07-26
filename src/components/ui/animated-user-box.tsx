"use client";

import { UserRound, X } from "lucide-react";
import { Button } from "../ui/button";
import { easeOut, motion, Variants, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ChangeThemeTabs from "../ui/theme-selector";
import SignOut from "../sign-out";
import { useQuery } from "convex-helpers/react/cache/hooks";
import { api } from "../../../convex/_generated/api";
import Image from "next/image";
import type { Transition } from "framer-motion";
import ListLayoutSelector from "./list-layout-selector";

export default function UserBox() {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [openedWithKeyboard, setOpenedWithKeyboard] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [toolboxPosition, setToolboxPosition] = useState({ top: 0, left: 0 });

  const iconRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const motionDivRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const user = useQuery(api.users.currentUser, {});

  useEffect(() => setHasMounted(true), []);

  // Focus management when opening
  useEffect(() => {
    if (isExpanded && openedWithKeyboard) {
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
    }
  }, [isExpanded, openedWithKeyboard]);

  // Trap focus in the box
  useEffect(() => {
    if (!isExpanded) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsExpanded(false);
        iconRef.current?.focus();
        return;
      }

      if (e.key === "Tab") {
        // Get all focusable elements inside the expanded box
        const focusableElements = Array.from(
          containerRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ) || []
        ).filter(
          (el) =>
            !el.hasAttribute("tabindex") || el.getAttribute("tabindex") !== "-1"
        ) as HTMLElement[];

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const currentIndex = focusableElements.indexOf(
          document.activeElement as HTMLElement
        );

        if (e.shiftKey) {
          if (document.activeElement === firstElement || currentIndex === -1) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement || currentIndex === -1) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isExpanded]);

  const handleClose = useCallback(() => {
    if (isExpanded) {
      setIsExpanded(false);
      iconRef.current?.focus();
    }
  }, [isExpanded]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        isExpanded
      ) {
        event.preventDefault();
        event.stopPropagation();
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
  }, [isExpanded, handleClose]);

  if (user === null) return null;

  const boxVariants: Variants = {
    initial: {
      width: "28px",
      height: "28px",
      zIndex: -1,
      borderRadius: "9px",
      padding: "0px",
      overflow: "hidden",
      opacity: 0,
    },
    expanded: {
      width: "270px",
      height: "250px",
      zIndex: 3,
      borderRadius: "20px",
      padding: "4px",
      opacity: 1,
    },
  };

  const innerBoxVariants: Variants = {
    initial: {
      scale: 0.3,
      y: "-15px",
      filter: "blur(5px)",
    },
    expanded: {
      scale: 1,
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

  const handleClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const wasKeyboard = "key" in e ? e.key === "Enter" || e.key === " " : false;

    if (!isExpanded && iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      setToolboxPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
      });

      setOpenedWithKeyboard(wasKeyboard);
      setShouldRender(true);
      setTimeout(() => setIsExpanded(true), 10);
    } else {
      setIsExpanded(false);
      if (wasKeyboard) {
        iconRef.current?.focus();
      }
    }
  };

  const renderBackdrop = () => {
    if (!hasMounted) return null;

    return createPortal(
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="fixed inset-0 bg-black/25 backdrop-blur-[2px] z-9"
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
  };

  return (
    <>
      <Button
        ref={iconRef}
        variant="ghost"
        size="icon"
        className={`hover:cursor-pointer transition-all h-10 w-10 rounded-full bg-accent relative -m-1.5`}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleClick(e);
          }
        }}
        aria-expanded={isExpanded}
        aria-haspopup="menu"
        aria-label="User menu"
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
          </div>
        ) : (
          <UserRound className="size-4.5" />
        )}
      </Button>

      {renderBackdrop()}

      {hasMounted &&
        shouldRender &&
        createPortal(
          <div
            ref={containerRef}
            className="absolute w-fit h-fit flex items-baseline justify-end z-50 translate-x-[40px] translate-y-[0px]"
            style={{
              position: "absolute",
              top: toolboxPosition.top,
              left: toolboxPosition.left,
            }}
            role="menu"
            aria-label="User options"
          >
            <motion.div
              animate={isExpanded ? "expanded" : "initial"}
              initial="initial"
              variants={boxVariants}
              transition={transition}
              onAnimationComplete={(definition) => {
                if (definition === "initial") {
                  setShouldRender(false);
                }
              }}
              className={`absolute top-0 right-0 bg-card z-auto ${isExpanded ? "border" : "border-transparent"}`}
            >
              <Button
                ref={closeButtonRef}
                variant="ghost"
                size="icon"
                className={`hover:cursor-pointer transition-all h-10 w-10 rounded-full relative ${
                  isExpanded
                    ? "hover:bg-accent opacity-100"
                    : "-m-1.5 bg-transparent opacity-0"
                }`}
                onClick={handleClose}
                aria-label="Close menu"
                tabIndex={isExpanded ? 0 : -1}
              >
                <X className="size-5" />
              </Button>

              <motion.div
                ref={motionDivRef}
                animate={isExpanded ? "expanded" : "initial"}
                initial="initial"
                variants={innerBoxVariants}
                transition={transition}
                className={`w-full h-[calc(100%-45px)] rounded-2xl p-2 flex flex-col items-center justify-between overflow-hidden bg-accent-foreground/5`}
              >
                <div className="w-full text-center h-fit flex flex-col">
                  <p className="text-sm leading-4">{user?.name}</p>
                </div>
                <div className="flex gap-3 items-center text-center">
                  <p className=" leading-4.5">
                    Home
                    <br /> Layout:
                  </p>
                  <ListLayoutSelector />
                </div>

                <div className="w-full h-fit flex flex-col items-center gap-4 justify-between">
                  <ChangeThemeTabs animationKey="change-theme" />
                  <SignOut />
                </div>
              </motion.div>
            </motion.div>
          </div>,
          document.body
        )}
    </>
  );
}
