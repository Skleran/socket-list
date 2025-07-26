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

type Props = {
  listId: Id<"lists">;
};

export default function AnimatedListToolbox({ listId }: Props) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  // const [isHidden, setIsHidden] = useState<boolean>(true);
  const iconRef = useRef<HTMLButtonElement>(null);
  const [toolboxPosition, setToolboxPosition] = useState({ top: 0, left: 0 });
  const motionDivRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const deleteList = useMutation(api.lists.deleteList);
  const [shouldRender, setShouldRender] = useState(false);

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
      width: "0px",
      height: "0px",
      zIndex: -1,
      borderRadius: "9px",
      padding: "0px",
      overflow: "hidden",
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

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => setHasMounted(true), []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isExpanded && iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      setToolboxPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
      });

      setShouldRender(true);
      setTimeout(() => setIsExpanded(true), 10);
    } else {
      setIsExpanded(false);
    }
  };

  // const handleAnimationComplete = (definition: string) => {
  //   if (definition === "initial") {
  //     // setIsHidden(true);
  //   }
  // };

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
      <Button
        ref={iconRef}
        variant="ghost"
        size="icon"
        className={`hover:cursor-pointer -m-1.5 transition-all h-10 w-10 rounded-full relative`}
        onClick={handleClick}
      >
        {isExpanded ? (
          <X className="size-5" />
        ) : (
          <MoreVertical className="size-5" />
        )}
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
          >
            {" "}
            <motion.div
              animate={isExpanded ? "expanded" : "initial"}
              initial="initial"
              variants={boxVariants}
              transition={transition}
              onAnimationComplete={(definition) => {
                if (definition === "initial") {
                  setShouldRender(false); // unmount AFTER collapse animation finishes
                }
              }}
              className={`absolute top-0 right-0 bg-card z-auto ${isExpanded ? "border" : "border-transparent"}`}
            >
              <Button
                // ref={iconRef}
                variant="ghost"
                size="icon"
                className={`hover:cursor-pointer transition-all h-10 w-10 rounded-full relative ${
                  isExpanded
                    ? "hover:bg-accent opacity-100"
                    : "-m-1.5 bg-transparent opacity-0"
                }`}
                onClick={handleClick}
              >
                <X className="size-5" />
              </Button>

              <motion.div
                ref={motionDivRef}
                animate={isExpanded ? "expanded" : "initial"}
                initial="initial"
                variants={innerBoxVariants}
                transition={transition}
                // onAnimationComplete={handleAnimationComplete}
                className={`w-full h-[141px] rounded-2xl p-1 flex flex-col items-center gap-1 overflow-hidden bg-accent-foreground/5`}
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
          </div>,
          document.body
        )}
    </>
  );
}
