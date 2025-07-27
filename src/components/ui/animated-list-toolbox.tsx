"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import QRCode from "react-qr-code";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { easeOut, motion, Variants } from "framer-motion";
import type { Transition } from "framer-motion";
import { Copy, MoreVertical, QrCode, X } from "lucide-react";
import { Separator } from "./separator";
import { Id } from "../../../convex/_generated/dataModel";
import { HoldToDeleteButton } from "./hold-to-delete-button";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";

type Props = {
  listId: Id<"lists">;
};

export default function AnimatedListToolbox({ listId }: Props) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const iconRef = useRef<HTMLButtonElement>(null);
  const [toolboxPosition, setToolboxPosition] = useState({ top: 0, left: 0 });
  const motionDivRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const deleteList = useMutation(api.lists.deleteList);
  const [shouldRender, setShouldRender] = useState(false);
  const [openedWithKeyboard, setOpenedWithKeyboard] = useState(false);
  const t = useTranslations();
  // const [isListDeleted, setIsListDeleted] = useState(false);

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const copyButtonRef = useRef<HTMLButtonElement>(null);
  const qrButtonRef = useRef<HTMLButtonElement>(null);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);

  const [copied, setCopied] = useState(false);

  // focus management when opening
  useEffect(() => {
    if (isExpanded && openedWithKeyboard) {
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
    }
  }, [isExpanded, openedWithKeyboard]);

  // trap focus in the box
  useEffect(() => {
    if (!isExpanded) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsExpanded(false);
        iconRef.current?.focus();
        return;
      }

      if (e.key === "Tab") {
        const focusableElements = [
          closeButtonRef.current,
          copyButtonRef.current,
          qrButtonRef.current,
          deleteButtonRef.current,
        ].filter(Boolean);

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const currentIndex = focusableElements.indexOf(
          document.activeElement as HTMLButtonElement
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

  useEffect(() => {
    const handleClose = () => {
      if (isExpanded) {
        setIsExpanded(false);

        iconRef.current?.focus();
      }
    };

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
  }, [isExpanded]);

  // useEffect(() => {
  //   if (isListDeleted) {
  //     // maybe add opacity or other visual changes here
  //   }
  // }, [isListDeleted]);

  const boxVariants: Variants = {
    initial: {
      width: "0px",
      height: "0px",
      zIndex: -1,
      borderRadius: "9px",
      padding: "0px",
      overflow: "hidden",
      opacity: 0,
    },
    expanded: {
      width: "180px",
      height: "191px",
      zIndex: 3,
      borderRadius: "20px",
      padding: "4px",
      opacity: 1,
    },
  };

  const innerBoxVariants: Variants = {
    initial: {
      scale: 0.3,
      y: "-58px",
      filter: "blur(5px)",
    },
    expanded: {
      scale: 1,
      y: "0px",
      filter: "blur(0px)",
    },
  };

  const transition: Transition = {
    duration: 0.3,
    type: "spring",
    stiffness: 50,
    ease: easeOut,
  };

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => setHasMounted(true), []);

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

  const handleCopy = async () => {
    const url = `${window.location.origin}/${listId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleClose = () => {
    setIsExpanded(false);
    iconRef.current?.focus();
  };

  return (
    <>
      <Button
        ref={iconRef}
        variant="ghost"
        size="icon"
        className={`hover:cursor-pointer -m-1.5 transition-all h-10 w-10 rounded-full relative`}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleClick(e);
          }
        }}
        aria-expanded={isExpanded}
        aria-haspopup="menu"
        aria-label="List options menu"
      >
        <MoreVertical
          className={`size-5 transition-opacity ${isExpanded ? "opacity-0" : "opacity-100"}`}
        />
      </Button>

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
            aria-label="List options"
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
                className={`w-full h-[141px] rounded-2xl p-1 flex flex-col items-center gap-1 overflow-hidden bg-accent-foreground/5`}
              >
                <Button
                  ref={copyButtonRef}
                  onClick={handleCopy}
                  className={`w-full rounded-t-xl h-10 transition-all ${copied ? "bg-green-400 hover:bg-green-400 dark:bg-green-500 hover:dark:bg-green-500" : ""}`}
                  tabIndex={isExpanded ? 0 : -1}
                  role="menuitem"
                >
                  {copied ? (
                    <>{t("List_Toolbox.copied")}</>
                  ) : (
                    <>
                      <Copy />
                      {t("List_Toolbox.copy")}
                    </>
                  )}
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      ref={qrButtonRef}
                      className="w-full rounded-b-xl h-10"
                      tabIndex={isExpanded ? 0 : -1}
                      role="menuitem"
                    >
                      <QrCode />
                      {t("List_Toolbox.qr")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="flex flex-col items-center justify-center gap-4 w-fit">
                    <DialogTitle className="text-lg font-medium text-center">
                      {t("List_Toolbox.qr_dialog")}
                    </DialogTitle>
                    <QRCode
                      value={`${window.location.origin}/${listId}`}
                      size={180}
                      bgColor="transparent"
                      className="rounded-md dark:bg-accent-foreground p-4"
                    />
                  </DialogContent>
                </Dialog>

                <Separator className="bg-accent-foreground/30" />
                <HoldToDeleteButton
                  ref={deleteButtonRef}
                  onHoldComplete={() => {
                    void deleteList({ listId });
                    setIsExpanded(false);
                  }}
                  holdText={t("List_Toolbox.delete")}
                  triggeredText={t("List_Toolbox.deleted")}
                  className="rounded-xl h-10 text-nowrap"
                  buttonClass="bg-destructive text-white hover:bg-destructive/90 dark:bg-destructive/60"
                  tabIndex={isExpanded ? 0 : -1}
                  role="menuitem"
                />
              </motion.div>
            </motion.div>
          </div>,
          document.body
        )}
    </>
  );
}
