import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="h-screen w-screen bg-red-500">
      <Outlet />
    </div>
  );
}
