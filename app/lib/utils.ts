import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Function that can be used to tell tailwind you'll be using classes.
 *
 * NOTE: Template string arguments are not inserted, use the `cn` function for complex behavior.
 */
export function tw(strings: TemplateStringsArray): string {
  return strings.join(" ").trim();
}
