import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import type { ReactNode } from "react";
import { cn } from "@/lib/tailwind";

interface HorizontalScrollProps {
  children: ReactNode;
  gap?: number;
  showScrollButtons?: boolean;
  showDots?: boolean;
  className?: string;
  scrollButtonClassName?: string;
}

/**
 * A horizontal scrolling container that can handle any type of children elements
 * @param children - React nodes to be displayed in the horizontal scroll
 * @param gap - Gap between items in pixels
 * @param showScrollButtons - Whether to show left/right scroll buttons
 * @param showDots - Whether to show pagination dots
 * @param className - Additional CSS classes for the container
 * @param scrollButtonClassName - Additional CSS classes for the scroll buttons
 */
function HorizontalScroll({
  children,
  gap = 16,
  showScrollButtons = true,
  showDots = true,
  className = "",
  scrollButtonClassName = "",
}: HorizontalScrollProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const [visibleItems, setVisibleItems] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [calculatedItemWidth, setCalculatedItemWidth] = useState(0);

  // Convert children to array for easier manipulation
  const childrenArray = Array.isArray(children)
    ? children
    : children
      ? [children]
      : [];

  const totalPages = Math.ceil(childrenArray.length / visibleItems);

  /**
   * Calculate how many items can fit in the visible area
   */
  const calculateVisibleItems = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const containerWidth = container.clientWidth;

    // Auto-calculate based on first child's width.
    // It is assumed that all children have the same width.
    const firstChild = container.firstElementChild as HTMLElement | null;

    if (firstChild) {
      const childWidth = firstChild.offsetWidth;
      const itemWidthWithGap = childWidth + gap;
      const itemsPerView = Math.floor(containerWidth / itemWidthWithGap);
      setVisibleItems(Math.max(1, itemsPerView));
      setCalculatedItemWidth(childWidth);
    }
  }, [gap]);

  /**
   * Update the current page based on scroll position
   */
  const updateCurrentPage = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const scrollLeft = scrollContainerRef.current.scrollLeft;
    const pageWidth = (calculatedItemWidth + gap) * visibleItems;

    const newPage = Math.round(scrollLeft / pageWidth + 0.05);
    setCurrentPage(Math.min(newPage, totalPages - 1));
  }, [calculatedItemWidth, gap, visibleItems, totalPages]);

  /**
   * Check if scroll buttons should be enabled/disabled
   */
  const checkScrollButtons = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    updateCurrentPage();
  }, [updateCurrentPage]);

  // Setup resize observer and initial calculations
  useEffect(() => {
    calculateVisibleItems();
    checkScrollButtons();

    const handleResize = () => {
      calculateVisibleItems();
      checkScrollButtons();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [calculateVisibleItems, checkScrollButtons]);

  /**
   * Scroll the container left or right by one page
   */
  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current || isScrolling) return;

    setIsScrolling(true);
    const scrollAmount = (calculatedItemWidth + gap) * visibleItems;
    const newScrollLeft =
      scrollContainerRef.current.scrollLeft +
      (direction === "left" ? -scrollAmount : scrollAmount);

    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });

    // Reset scrolling state after animation
    setTimeout(() => setIsScrolling(false), 300);
  };

  /**
   * Scroll to a specific page
   */
  const scrollToPage = (pageIndex: number) => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = (calculatedItemWidth + gap) * visibleItems * pageIndex;
    scrollContainerRef.current.scrollTo({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className={`relative group w-full ${className}`}>
      {/* Left Scroll Button */}
      {showScrollButtons && (
        <Button
          size={"icon"}
          variant={"secondary"}
          onClick={() => scroll("left")}
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 z-10 aspect-square rounded-full transition-all duration-200",
            {
              "[pointer:coarse]:opacity-0 group-hover:opacity-100":
                canScrollLeft,
              "opacity-0 pointer-events-none": !canScrollLeft,
            },
            scrollButtonClassName
          )}
          aria-label="Scroll left to see previous items"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      )}
      {/* Right Scroll Button */}
      {showScrollButtons && (
        <Button
          size={"icon"}
          variant={"secondary"}
          onClick={() => scroll("right")}
          className={cn(
            "absolute right-0 top-1/2 -translate-y-1/2 z-10 aspect-square rounded-full transition-all duration-200",
            {
              "[pointer:coarse]:opacity-0 group-hover:opacity-100":
                canScrollRight,
              "opacity-0 pointer-events-none": !canScrollRight,
            },
            scrollButtonClassName
          )}
          aria-label="Scroll right to see more items"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      )}
      {/* Fade Gradients */}
      {showScrollButtons && (
        <>
          <div
            className={`absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-background to-transparent z-[5] pointer-events-none transition-opacity duration-200 ${
              canScrollLeft ? "opacity-100" : "opacity-0"
            }`}
          />
          <div
            className={`absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-background to-transparent z-[5] pointer-events-none transition-opacity duration-200 ${
              canScrollRight ? "opacity-100" : "opacity-0"
            }`}
          />
        </>
      )}
      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScrollButtons}
        className="flex w-full overflow-x-auto scrollbar-hide scroll-smooth *:snap-start"
        style={{
          gap: `${gap}px`,
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        role="region"
        aria-label="Horizontal scroll container"
      >
        {childrenArray}
      </div>
      {showDots && totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={cn(
                "size-2 cursor-pointer rounded-full transition-all duration-200",
                {
                  "bg-foreground/20 hover:bg-foreground/40":
                    index !== currentPage,
                  "bg-foreground scale-125": index === currentPage,
                }
              )}
              aria-label={`Go to page ${index + 1} of ${totalPages}`}
              onClick={() => scrollToPage(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default HorizontalScroll;
