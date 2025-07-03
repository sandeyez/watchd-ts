import { cn } from "@/lib/tailwind";
import { SignInButton, UserButton, useUser } from "@clerk/tanstack-react-start";
import { CSSProperties, PropsWithChildren, ReactNode } from "react";

type PageProps = PropsWithChildren<{
  leftElement?: ReactNode;
  fullWidth?: boolean;
}>;

export function Page({ children, leftElement, fullWidth = false }: PageProps) {
  const { user } = useUser();
  return (
    <div
      className="relative md:[&>*]:px-[var(--page-padding)] [&>*]:px-[calc(var(--page-padding)/2)] h-full flex flex-col"
      style={
        {
          "--page-padding": "calc(var(--spacing)*8)",
        } as CSSProperties
      }
    >
      <nav
        className="min-h-[var(--page-nav-height)] h-[var(--page-nav-height)] w-full flex justify-between gap-4 items-center"
        style={
          {
            "--page-nav-height": "calc(var(--spacing)*16)",
          } as CSSProperties
        }
      >
        {leftElement ?? <div />}
        {user ? <UserButton /> : <SignInButton mode="modal" />}
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
          }
        )}
      >
        {children}
      </div>
    </div>
  );
}
