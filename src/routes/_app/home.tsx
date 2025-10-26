import { createFileRoute } from "@tanstack/react-router";

import { Page } from "@/components/page";
import { useUser } from "@/hooks/use-user";
import { GradientText } from "@/components/gradient-text";

export const Route = createFileRoute("/_app/home")({
  component: RouteComponent,
});

function RouteComponent() {
  const user = useUser();

  return (
    <Page>
      <h1>
        {user ? (
          `Welcome back, ${user.firstName}`
        ) : (
          <span className="inline-flex gap-1.5">
            Welcome to{" "}
            <GradientText>
              <span className="font-black">watchd.</span>
            </GradientText>
          </span>
        )}
      </h1>
    </Page>
  );
}
