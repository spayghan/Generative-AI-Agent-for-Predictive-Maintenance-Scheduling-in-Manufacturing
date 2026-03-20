import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useLocation } from "react-router-dom";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/upload": "Submit Log",
  "/chat": "AI Assistant",
  "/schedule": "Schedule",
  "/equipment": "Equipment",
  "/analytics": "Analytics",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || "MaintainIQ";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
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
