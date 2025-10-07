import { createFileRoute } from "@tanstack/react-router";

import { Page } from "@/components/page";
import { useUser } from "@/hooks/use-user";

export const Route = createFileRoute("/_app/home")({
  component: RouteComponent,
});

function RouteComponent() {
  const user = useUser();

  return (
    <Page>
      <h1>{user ? `Welcome back, ${user.name}` : "Welcome back"}</h1>
    </Page>
  );
}
