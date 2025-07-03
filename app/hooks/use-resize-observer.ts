import { useCallback, useLayoutEffect, useRef, useState } from "react";

/**
 * useResizeObserver
 *
 * Observe size changes of a DOM element using ResizeObserver.
 * You can use it in two ways:
 * 1. Controlled: Pass a callback to handle size changes.
 * 2. Uncontrolled: Get the size as state, and attach the returned ref to your element.
 *
 * @param callback - (optional) Function called with the new contentRect on resize.
 * @returns [ref, size] - ref to attach to the element, and the current size (or undefined if not measured yet).
 *
 * @example
 * // Uncontrolled (state)
 * const [ref, size] = useResizeObserver<HTMLDivElement>();
 * <div ref={ref}>{size?.width}</div>
 *
 * // Controlled (callback)
 * useResizeObserver<HTMLDivElement>(rect => { ... });
 */
export function useResizeObserver<T extends Element>(
  callback?: (rect: DOMRectReadOnly) => void
): [(node: T | null) => void, DOMRectReadOnly | undefined] {
  // Store the latest size in state if no callback is provided
  const [rect, setRect] = useState<DOMRectReadOnly>();
  // Store the observed node
  const nodeRef = useRef<T | null>(null);
  // Store the latest callback in a ref to avoid effect re-runs
  const callbackRef = useRef<typeof callback>(callback);

  // Stable ref callback for React
  const refCallback = useCallback((node: T | null) => {
    nodeRef.current = node;
  }, []);

  useLayoutEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    // Create the observer
    const observer = new window.ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const contentRect = entry.contentRect;

      // If a callback is provided, call it
      if (callbackRef.current) {
        callbackRef.current(contentRect);
      } else {
        // Otherwise, update state
        setRect(contentRect);
      }
    });

    observer.observe(node);

    // Initial measure (in case the observer doesn't fire immediately)
    if (!callbackRef.current && node) {
      setRect(node.getBoundingClientRect());
    }

    // Cleanup
    return () => {
      observer.disconnect();
    };
    // Only re-run if the node changes
  }, [callback, nodeRef.current]);

  return [refCallback, rect];
}
