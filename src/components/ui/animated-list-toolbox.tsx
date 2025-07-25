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

type Props = {
  listId: Id<"lists">;
};

export default function AnimatedListToolbox({ listId }: Props) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isHidden, setIsHidden] = useState<boolean>(true);
  const motionDivRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const deleteList = useMutation(api.lists.deleteList);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleClose = () => {
      if (isExpanded) {
        setIsExpanded(false);
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

  const boxVariants: Variants = {
    initial: {
      width: "28px",
      height: "28px",
      zIndex: 0,
      borderRadius: "9px",
      padding: "0px",
    },
    expanded: {
      width: "180px",
      height: "191px",
      zIndex: 3,
      borderRadius: "20px",
      padding: "4px",
    },
  };

  const innerBoxVariants: Variants = {
    initial: {
      scale: 0.3,
      opacity: 0,
      y: "-58px",
      filter: "blur(5px)",
    },
    expanded: {
      scale: 1,
      opacity: 1,
      y: "0px",
      filter: "blur(0px)",
    },
  };

  // const backdropVariants: Variants = {
  //   hidden: {
  //     opacity: 0,
  //   },
  //   visible: {
  //     opacity: 1,
  //   },
  // };

  const transition: Transition = {
    duration: 0.3,
    type: "spring",
    stiffness: 50,
    ease: easeOut,
  };
  // const backdropTransition: Transition = { duration: 0.2, ease: "easeInOut" };

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

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

  // const handleClose = () => {
  //   if (isExpanded) {
  //     setIsExpanded(false);
  //   }
  // };

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

  return (
    <>
      <div
        ref={containerRef}
        className="w-fit h-fit flex items-baseline justify-end relative z-15 translate-x-[4px] translate-y-[-15px]"
      >
        {" "}
        <motion.div
          animate={isExpanded ? "expanded" : "initial"}
          initial="initial"
          variants={boxVariants}
          transition={transition}
          className={`absolute top-0 right-0 bg-card z-auto ${isExpanded ? "border" : "border-transparent"}`}
        >
          <Button
            variant="ghost"
            size="icon"
            className={`hover:cursor-pointer transition-all h-10 w-10 rounded-full relative ${
              isExpanded ? "bg-accent" : "-m-1.5 bg-transparent"
            }`}
            onClick={handleClick}
          >
            {isExpanded ? (
              <X className="size-5" />
            ) : (
              <MoreVertical className="size-5" />
            )}
          </Button>

          <motion.div
            ref={motionDivRef}
            animate={isExpanded ? "expanded" : "initial"}
            initial="initial"
            variants={innerBoxVariants}
            transition={transition}
            onAnimationComplete={handleAnimationComplete}
            className={`w-full h-[141px] rounded-2xl p-1 flex flex-col items-center gap-1 overflow-hidden bg-accent-foreground/5 ${
              isHidden ? "hidden" : ""
            }`}
          >
            <Button
              onClick={handleCopy}
              className={`w-full rounded-t-xl h-10 transition-all ${copied ? "bg-green-400 hover:bg-green-400 dark:bg-green-500 hover:dark:bg-green-500" : ""}`}
            >
              {copied ? (
                <>Copied!</>
              ) : (
                <>
                  <Copy />
                  Copy List Link
                </>
              )}
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full rounded-b-xl h-10">
                  <QrCode />
                  Display QR Code
                </Button>
              </DialogTrigger>
              <DialogContent className="flex flex-col items-center justify-center gap-4 w-fit">
                <DialogTitle className="text-lg font-medium">
                  Scan to Open List
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
            {/* <Button variant={"destructive"} className="w-full rounded-xl h-10">
              Delete List
            </Button> */}
            <HoldToDeleteButton
              onHoldComplete={() => {
                void deleteList({ listId });
              }}
              // key={"delete"}
              className="rounded-xl h-10 text-nowrap"
              buttonClass="bg-destructive text-white hover:bg-destructive/90 dark:bg-destructive/60"
            />
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
