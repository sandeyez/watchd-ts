import { useRouteContext } from "@tanstack/react-router";

export function useUser() {
  const user = useRouteContext({
    from: "__root__",
    select: (context) => context.user,
  });

  return user;
}
