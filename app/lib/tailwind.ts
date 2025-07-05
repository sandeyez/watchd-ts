import {  clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type {ClassValue} from "clsx";

export function cn(...inputs: Array<ClassValue>) {
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
