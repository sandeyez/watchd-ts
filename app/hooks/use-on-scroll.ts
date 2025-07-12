import { useEffect } from "react";

export function useOnScroll(callback: () => void) {
  useEffect(() => {
    const mainElement = document.querySelector("main");

    if (!mainElement) return;

    mainElement.addEventListener("scroll", callback);
    return () => mainElement.removeEventListener("scroll", callback);
  }, [callback]);
}
