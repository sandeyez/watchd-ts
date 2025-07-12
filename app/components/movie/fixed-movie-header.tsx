import { useOnScroll } from "@/hooks/use-on-scroll";
import { cn } from "@/lib/tailwind";
import { useCallback, useEffect, useState } from "react";

interface FixedMovieHeaderProps {
  title: string;
  originalTitleRef: React.RefObject<HTMLElement | null>;
}

export function FixedMovieHeader({
  title,
  originalTitleRef,
}: FixedMovieHeaderProps) {
  const [shouldShow, setShouldShow] = useState(false);

  const updateVisibility = useCallback(() => {
    const element = originalTitleRef.current;
    if (element) {
      const rect = element.getBoundingClientRect();
      setShouldShow(rect.bottom < 0);
    }
  }, [originalTitleRef]);

  useOnScroll(updateVisibility);

  useEffect(() => {
    updateVisibility();
    window.addEventListener("resize", updateVisibility);

    return () => {
      window.removeEventListener("resize", updateVisibility);
    };
  }, [originalTitleRef]);

  return (
    <div
      className={cn(
        "fixed top-0 z-50 w-full bg-background/90 backdrop-blur-sm border-b transition-all duration-300 ease-in-out",
        {
          "translate-y-0": shouldShow,
          "-translate-y-full": !shouldShow,
        }
      )}
    >
      <div className="py-3">
        <span className="text-lg font-semibold truncate">{title}</span>
      </div>
    </div>
  );
}
