import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar/sidebar-context";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="h-screen w-screen flex max-w-screen overflow-x-clip">
      <SidebarProvider>
        <AppSidebar />
        <main className="size-full flex-1">
          <Outlet />
        </main>
      </SidebarProvider>
    </div>
  );
}
