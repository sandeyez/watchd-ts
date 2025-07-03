import { useCallback, useLayoutEffect, useRef, useState } from "react";

/**
 * useBoundingClientRect
 * Returns a ref and the latest DOMRect of the element, updating on scroll, resize, and optionally on demand.
 *
 * @param deps - Optional array of dependencies to recalculate on (e.g., when layout/content changes)
 * @returns [ref, rect] - ref to attach to the element, and the current DOMRect or null
 * @author Sander van Werkhooven <sander@jojoschool.nl>
 * @author GPT-4.1 (OpenAI)
 */
export function useBoundingClientRect<T extends HTMLElement>(
  deps: unknown[] = []
): [React.RefObject<T | null>, DOMRect | null] {
  const ref = useRef<T>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const updateRect = useCallback(() => {
    if (ref.current) {
      setRect(ref.current.getBoundingClientRect());
    }
  }, []);

  useLayoutEffect(() => {
    updateRect();
    window.addEventListener("scroll", updateRect, { passive: true });
    window.addEventListener("resize", updateRect);

    return () => {
      window.removeEventListener("scroll", updateRect);
      window.removeEventListener("resize", updateRect);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return [ref, rect];
}
