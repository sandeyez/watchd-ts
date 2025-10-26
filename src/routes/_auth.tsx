import {
  Link,
  Outlet,
  createFileRoute,
  redirect,
} from "@tanstack/react-router";

import { GradientText } from "@/components/gradient-text";

export const Route = createFileRoute("/_auth")({
  beforeLoad: ({ context }) => {
    const { user } = context;

    if (user) throw redirect({ to: "/" });

    return null;
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex size-full items-center justify-center">
      <img
        src="/images/login-backdrop.png"
        className="size-[calc(100%+2rem)] object-cover blur-xs fixed -inset-4 -z-30 -rotate-y-12 skew-y-6 rotate-x-12 scale-125"
      />
      <div className="size-full absolute inset-0 -z-10 bg-gradient-to-br from-background/75 to-background/50"></div>
      <Link className="absolute top-4 left-4 " to="/">
        <GradientText>
          <span className="text-2xl font-black ">watchd.</span>
        </GradientText>
      </Link>
      <Outlet />
    </div>
  );
}
