import { cn } from "@/lib/tailwind";
import { SignInButton, UserButton, useUser } from "@clerk/tanstack-react-start";
import { PropsWithChildren, ReactNode } from "react";

type PageProps = PropsWithChildren<{
  leftElement?: ReactNode;
  fullWidth?: boolean;
}>;

export function Page({ children, leftElement, fullWidth = false }: PageProps) {
  const { user } = useUser();
  return (
    <div className="md:[&>*]:px-8 [&>*]:px-4 h-full flex flex-col ">
      <nav className="min-h-16 h-16 w-full flex justify-between gap-4 items-center">
        {leftElement ?? <div />}
        {user ? <UserButton /> : <SignInButton mode="modal" />}
      </nav>
      <div
        className={cn("max-w-6xl grow py-4", {
          "max-w-none": fullWidth,
        })}
      >
        {children}
      </div>
    </div>
  );
}
