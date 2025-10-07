import { cn } from "@/lib/tailwind";

import type { CSSProperties, PropsWithChildren, ReactNode } from "react";

type PageProps = PropsWithChildren<{
  leftElement?: ReactNode;
  beforeContent?: ReactNode;
  fullWidth?: boolean;
  className?: string;
}>;

export function Page({
  children,
  leftElement,
  beforeContent,
  fullWidth = false,
  className,
}: PageProps) {
  return (
    <div
      className="relative md:*:px-[var(--page-padding)] *:px-[calc(var(--page-padding)/2)] h-full flex flex-col"
      style={
        {
          "--page-padding": "calc(var(--spacing)*8)",
        } as CSSProperties
      }
    >
      {beforeContent}
      <nav
        className="min-h-[var(--page-nav-height)] h-[var(--page-nav-height)] w-full flex justify-between gap-4 items-center"
        style={
          {
            "--page-nav-height": "calc(var(--spacing)*16)",
          } as CSSProperties
        }
      >
        {leftElement ?? <div />}
        SIGN IN
      </nav>
      <div
        style={
          {
            "--page-max-width": fullWidth ? "100%" : "var(--container-4xl)",
          } as CSSProperties
        }
        className={cn(
          "max-w-[var(--page-max-width)] w-full grow py-4 mx-auto",
          {
            "max-w-full mx-0": fullWidth,
          },
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
