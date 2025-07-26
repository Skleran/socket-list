"use client";

import React, { forwardRef, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type HoldToDeleteButtonProps = {
  onHoldComplete: () => void;
  className?: string;
  buttonClass?: string;
  fillerClass?: string;
  tabIndex?: number;
  role?: string;
};

export const HoldToDeleteButton = forwardRef<
  HTMLButtonElement,
  HoldToDeleteButtonProps
>(
  (
    {
      className,
      buttonClass,
      fillerClass,
      onHoldComplete,
      tabIndex,
      role,
      ...props
    },
    ref
  ) => {
    const holdTimeout = useRef<NodeJS.Timeout | null>(null);
    const deleteTimeout = useRef<NodeJS.Timeout | null>(null);
    const [isHolding, setIsHolding] = useState(false);
    const [hasTriggered, setHasTriggered] = useState(false);
    const [isKeyDown, setIsKeyDown] = useState(false);

    const handleHoldStart = () => {
      if (hasTriggered) return; // Prevent multiple triggers

      setIsHolding(true);
      holdTimeout.current = setTimeout(() => {
        triggerDelete();
      }, 1000); // hold duration
    };

    const handleHoldEnd = () => {
      setIsHolding(false);
      if (holdTimeout.current && !hasTriggered) {
        clearTimeout(holdTimeout.current);
        holdTimeout.current = null;
      }
    };

    const triggerDelete = () => {
      if (hasTriggered) return; // Prevent multiple calls
      setHasTriggered(true);

      setHasTriggered(true);
      setIsHolding(false);

      // Clear the hold timeout
      if (holdTimeout.current) {
        clearTimeout(holdTimeout.current);
        holdTimeout.current = null;
      }

      onHoldComplete();
    };

    // Handle keyboard interactions
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if ((e.key === "Enter" || e.key === " ") && !isKeyDown && !hasTriggered) {
        e.preventDefault();
        setIsKeyDown(true);
        handleHoldStart();
      }
    };

    const handleKeyUp = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setIsKeyDown(false);
        handleHoldEnd();
      }
    };

    useEffect(() => {
      return () => {
        if (holdTimeout.current) clearTimeout(holdTimeout.current);
        if (deleteTimeout.current) clearTimeout(deleteTimeout.current);
        setIsKeyDown(false);
      };
    }, []);

    return (
      <button
        ref={ref}
        onMouseDown={handleHoldStart}
        onMouseUp={handleHoldEnd}
        onMouseLeave={handleHoldEnd}
        onTouchStart={handleHoldStart}
        onTouchEnd={handleHoldEnd}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        tabIndex={tabIndex}
        role={role}
        aria-label="Hold to delete list"
        aria-pressed={isHolding}
        disabled={hasTriggered}
        className={cn(
          "relative hover:cursor-pointer text-sm flex h-10 items-center justify-center gap-2 rounded-full bg-gray-100 px-6 font-medium text-gray-900 select-none transition-transform duration-150 ease-out active:scale-[0.97] group focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2",
          hasTriggered && "opacity-50 cursor-not-allowed",
          className,
          buttonClass
        )}
        {...props}
      >
        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-0 flex items-center justify-center gap-2 rounded-full bg-red-100 text-red-600 transition-all duration-200 ease-out group-active:transition-all group-active:duration-[1000ms] group-active:ease-linear [clip-path:inset(0px_100%_0px_0px)] group-active:[clip-path:inset(0px_0px_0px_0px)]",
            isHolding &&
              "[clip-path:inset(0px_0px_0px_0px)] transition-all duration-[1000ms] ease-linear",
            hasTriggered && "opacity-0",
            className,
            fillerClass
          )}
        >
          <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6.75 2.75C6.75 2.05964 7.30964 1.5 8 1.5C8.69036 1.5 9.25 2.05964 9.25 2.75V3H6.75V2.75ZM5.25 3V2.75C5.25 1.23122 6.48122 0 8 0C9.51878 0 10.75 1.23122 10.75 2.75V3H12.92H14.25H15V4.5H14.25H13.8846L13.1776 13.6917C13.0774 14.9942 11.9913 16 10.6849 16H5.31508C4.00874 16 2.92263 14.9942 2.82244 13.6917L2.11538 4.5H1.75H1V3H1.75H3.08H5.25ZM4.31802 13.5767L3.61982 4.5H12.3802L11.682 13.5767C11.6419 14.0977 11.2075 14.5 10.6849 14.5H5.31508C4.79254 14.5 4.3581 14.0977 4.31802 13.5767Z"
            />
          </svg>
          {hasTriggered ? "Deleted" : "Hold to Delete"}
        </div>
        <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.75 2.75C6.75 2.05964 7.30964 1.5 8 1.5C8.69036 1.5 9.25 2.05964 9.25 2.75V3H6.75V2.75ZM5.25 3V2.75C5.25 1.23122 6.48122 0 8 0C9.51878 0 10.75 1.23122 10.75 2.75V3H12.92H14.25H15V4.5H14.25H13.8846L13.1776 13.6917C13.0774 14.9942 11.9913 16 10.6849 16H5.31508C4.00874 16 2.92263 14.9942 2.82244 13.6917L2.11538 4.5H1.75H1V3H1.75H3.08H5.25ZM4.31802 13.5767L3.61982 4.5H12.3802L11.682 13.5767C11.6419 14.0977 11.2075 14.5 10.6849 14.5H5.31508C4.79254 14.5 4.3581 14.0977 4.31802 13.5767Z"
          />
        </svg>
        {hasTriggered ? "Deleted" : "Hold to Delete"}
      </button>
    );
  }
);
