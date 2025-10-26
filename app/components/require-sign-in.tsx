import { useUser } from "@/hooks/use-user";
import { useNavigate } from "@tanstack/react-router";
import type { PropsWithChildren } from "react";

export function RequireSignIn({ children }: PropsWithChildren) {
  const user = useUser();

  const navigate = useNavigate();

  if (user) return <>{children}</>;

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();

        navigate({ to: "/login" });
      }}
      className="contents"
    >
      {children}
    </div>
  );
}
