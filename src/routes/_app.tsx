import {
  Outlet,
  createFileRoute,
  useChildMatches,
} from "@tanstack/react-router";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar/sidebar-context";

export const SCROLL_CONTAINER_ID = "scroll-container";

declare module "@tanstack/react-router" {
  interface StaticDataRouteOption {
    hideSidebar?: boolean;
  }
}

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
});

function RouteComponent() {
  const routes = useChildMatches();
  const hideSidebar = routes.some((route) => route.staticData.hideSidebar);

  return (
    <div className="h-screen w-screen max-w-screen flex overflow-x-clip">
      <SidebarProvider open={!hideSidebar}>
        <AppSidebar />
        <main
          className="size-full flex-1 overflow-y-auto relative"
          id={SCROLL_CONTAINER_ID}
        >
          <Outlet />
        </main>
      </SidebarProvider>
    </div>
  );
}
