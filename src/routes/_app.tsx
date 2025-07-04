import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar/sidebar-context";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="h-screen w-screen max-w-screen flex overflow-x-clip">
      <SidebarProvider>
        <AppSidebar />
        <main className="size-full flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </SidebarProvider>
    </div>
  );
}
