import { SignUp } from "@clerk/tanstack-react-start";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sign-up/$")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-screen h-screen grid place-items-center">
      <SignUp />
    </div>
  );
}
