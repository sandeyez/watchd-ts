import { useClerk, useUser } from "@clerk/tanstack-react-start";
import type { PropsWithChildren } from "react";

export function RequireSignIn({ children }: PropsWithChildren) {
  const { user } = useUser();
  const clerk = useClerk();

  if (user) return <>{children}</>;

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();

        clerk.openSignIn();
      }}
    >
      {children}
    </div>
  );
}
