import { SignInButton, UserButton, useUser } from "@clerk/tanstack-react-start";
import { PropsWithChildren, ReactNode } from "react";

type PageProps = PropsWithChildren<{
  leftElement?: ReactNode;
}>;

export function Page({ children, leftElement }: PageProps) {
  const { user } = useUser();
  return (
    <div className="[&>*]:px-8">
      <nav className="min-h-16 h-16 w-full flex justify-between items-center">
        {leftElement ?? <div />}
        {user ? <UserButton /> : <SignInButton mode="modal" />}
      </nav>
      <div className="max-w-6xl mx-auto py-8 ">{children}</div>
    </div>
  );
}
