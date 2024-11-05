"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Button } from "./ui/button";

interface CarouselProps {
  ariaLabel: string;
  children: ReactNode;
}

// Move a faixa por uma viewport e exibe controles quando ha mais itens.
const Carousel = ({ ariaLabel, children }: CarouselProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollBackward, setCanScrollBackward] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const updateControls = () => {
      const maxScrollLeft = track.scrollWidth - track.clientWidth;
      setCanScrollBackward(track.scrollLeft > 1);
      setCanScrollForward(track.scrollLeft < maxScrollLeft - 1);
    };

    updateControls();
    track.addEventListener("scroll", updateControls, { passive: true });
    const resizeObserver = new ResizeObserver(updateControls);
    resizeObserver.observe(track);

    return () => {
      track.removeEventListener("scroll", updateControls);
      resizeObserver.disconnect();
    };
  }, [children]);

  const scroll = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;

    track.scrollBy({
      left: direction * Math.max(track.clientWidth, 1),
      behavior: "smooth",
    });
  };

  return (
    <div className="mx-5">
      <div className="mb-2 flex h-9 justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Mostrar itens anteriores"
          className="h-9 w-9 rounded-full bg-white shadow-md disabled:invisible"
          disabled={!canScrollBackward}
          onClick={() => scroll(-1)}
        >
          <ChevronLeftIcon aria-hidden="true" size={18} />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Mostrar próximos itens"
          className="h-9 w-9 rounded-full bg-white shadow-md disabled:invisible"
          disabled={!canScrollForward}
          onClick={() => scroll(1)}
        >
          <ChevronRightIcon aria-hidden="true" size={18} />
        </Button>
      </div>
      <div
        ref={trackRef}
        aria-label={ariaLabel}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="region"
        tabIndex={0}
      >
        {children}
      </div>
    </div>
  );
};

export default Carousel;
