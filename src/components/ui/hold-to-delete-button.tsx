"use client";

import React, { useRef } from "react";

import { cn } from "@/lib/utils";

type HoldToDeleteButtonProps = {
  onHoldComplete: () => void;
  className?: string;
  buttonClass?: string;
  fillerClass?: string;
};

export function HoldToDeleteButton({
  className,
  buttonClass,
  fillerClass,
  onHoldComplete,
}: HoldToDeleteButtonProps) {
  const holdTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleHoldStart = () => {
    holdTimeout.current = setTimeout(() => {
      onHoldComplete();
    }, 1000); // hold duration
  };

  const handleHoldEnd = () => {
    if (holdTimeout.current) {
      clearTimeout(holdTimeout.current);
      holdTimeout.current = null;
    }
  };

  return (
    <button
      onMouseDown={handleHoldStart}
      onMouseUp={handleHoldEnd}
      onMouseLeave={handleHoldEnd}
      onTouchStart={handleHoldStart}
      onTouchEnd={handleHoldEnd}
      className={cn(
        "relative hover:cursor-pointer text-sm flex h-10 items-center justify-center gap-2 rounded-full bg-gray-100 px-6 font-medium text-gray-900 select-none transition-transform duration-150 ease-out active:scale-[0.97] group",
        className,
        buttonClass
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 flex items-center justify-center gap-2 rounded-full bg-red-100 text-red-600 transition-all duration-200 ease-out group-active:transition-all group-active:duration-[1000ms] group-active:ease-linear [clip-path:inset(0px_100%_0px_0px)] group-active:[clip-path:inset(0px_0px_0px_0px)]",
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
        Hold to Delete
      </div>
      <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6.75 2.75C6.75 2.05964 7.30964 1.5 8 1.5C8.69036 1.5 9.25 2.05964 9.25 2.75V3H6.75V2.75ZM5.25 3V2.75C5.25 1.23122 6.48122 0 8 0C9.51878 0 10.75 1.23122 10.75 2.75V3H12.92H14.25H15V4.5H14.25H13.8846L13.1776 13.6917C13.0774 14.9942 11.9913 16 10.6849 16H5.31508C4.00874 16 2.92263 14.9942 2.82244 13.6917L2.11538 4.5H1.75H1V3H1.75H3.08H5.25ZM4.31802 13.5767L3.61982 4.5H12.3802L11.682 13.5767C11.6419 14.0977 11.2075 14.5 10.6849 14.5H5.31508C4.79254 14.5 4.3581 14.0977 4.31802 13.5767Z"
        />
      </svg>
      Hold to Delete
    </button>
  );
}
