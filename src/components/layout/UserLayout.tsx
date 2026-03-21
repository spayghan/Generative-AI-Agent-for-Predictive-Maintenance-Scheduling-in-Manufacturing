import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserSidebar } from "./UserSidebar";
import { useLocation } from "react-router-dom";

const pageTitles: Record<string, string> = {
  "/user": "Dashboard",
  "/user/chat": "AI Assistant",
  "/user/report": "Report Issue",
};

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || "Employee Portal";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <UserSidebar />
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
