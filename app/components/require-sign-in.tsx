import { useUser } from "@/hooks/use-user";
import type { PropsWithChildren } from "react";

export function RequireSignIn({ children }: PropsWithChildren) {
  const user = useUser();

  if (user) return <>{children}</>;

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();

        console.log("sign in");
      }}
      className="contents"
    >
      {children}
    </div>
  );
}
