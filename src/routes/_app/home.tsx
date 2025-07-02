import { Page } from "@/components/page";
import { SignedIn, useUser } from "@clerk/tanstack-react-start";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/home")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useUser();
  return (
    <Page>
      <h1>{user ? `Welcome back, ${user.firstName}` : "Welcome back"}</h1>
    </Page>
  );
}
