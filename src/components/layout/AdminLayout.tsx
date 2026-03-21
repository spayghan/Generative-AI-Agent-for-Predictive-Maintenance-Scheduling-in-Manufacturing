import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { useLocation } from "react-router-dom";

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/upload": "Submit Log",
  "/admin/chat": "AI Assistant",
  "/admin/schedule": "Schedule",
  "/admin/equipment": "Equipment",
  "/admin/analytics": "Analytics",
  "/admin/reports": "Reported Issues",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || "Admin Portal";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <span className="text-sm font-semibold">{pageTitle}</span>
            </div>
          </header>
          <main className="flex-1 p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
