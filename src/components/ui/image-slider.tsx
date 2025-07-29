"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

const images = [
  {
    srcLight: "/media/img1Light.png",
    srcDark: "/media/img1Dark.png",
    idx: 1,
  },
  {
    srcLight: "/media/img2Light.png",
    srcDark: "/media/img2Dark.png",
    idx: 2,
  },
  {
    srcLight: "/media/img3Light.png",
    srcDark: "/media/img3Dark.png",
    idx: 3,
  },
];

export default function ImageSlider() {
  const { theme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.offsetWidth;
    const newIndex = Math.round(scrollLeft / width);
    setActiveIndex(newIndex);
  };

  const scrollToIndex = (index: number) => {
    if (!sliderRef.current) return;
    const slider = sliderRef.current;
    const slide = slider.children[index] as HTMLElement;
    slider.scrollTo({
      left: slide.offsetLeft - slider.offsetLeft,
      behavior: "smooth",
    });
  };

  return (
    <div className="sm:hidden -mx-6 mt-4">
      <div
        ref={sliderRef}
        className="flex overflow-x-auto overflow-y-visible snap-x snap-mandatory no-scrollbar scroll-smooth pb-5"
        onScroll={handleScroll}
      >
        {images.map((image) => (
          <div
            id={`slide-${image.idx}`}
            key={image.idx}
            className="flex-shrink-0 w-[85%] max-w-[400px] snap-center px-2"
          >
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={theme === "light" ? image.srcLight : image.srcDark}
                alt={`Slide ${image.idx}`}
                width={800}
                height={600}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2">
        {images.map((image, i) => (
          <button
            key={image.idx}
            onClick={() => scrollToIndex(i)}
            className={`h-2 rounded-full transition-all ${
              activeIndex === i
                ? "w-6 bg-foreground"
                : "w-2 bg-muted-foreground"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
