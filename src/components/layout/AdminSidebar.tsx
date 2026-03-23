import { LayoutDashboard, Upload, CalendarClock, MessageSquare, Settings, BarChart3, LogOut, AlertCircle, Activity, Lightbulb, Brain, Grid3X3 } from "lucide-react";
import { NavLink } from "@/components/shared/NavLink";
import { useAuthStore } from "@/lib/auth-store";
import { useNavigate } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { useReportsStore } from "@/lib/reports-store";
import { useRecommendationsStore } from "@/lib/recommendations-store";

const items = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Submit Log", url: "/admin/upload", icon: Upload },
  { title: "AI Assistant", url: "/admin/chat", icon: MessageSquare },
  { title: "Schedule", url: "/admin/schedule", icon: CalendarClock },
  { title: "Equipment", url: "/admin/equipment", icon: Settings },
  { title: "Maintenance Matrix", url: "/admin/matrix", icon: Grid3X3 },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Reported Issues", url: "/admin/reports", icon: AlertCircle },
  { title: "Recommendations", url: "/admin/recommendations", icon: Lightbulb },
  { title: "Agent Tracing", url: "/admin/tracing", icon: Brain },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const openReports = useReportsStore((s) => s.reports.filter((r) => r.status === "Open").length);
  const pendingRecs = useRecommendationsStore((s) => s.recommendations.filter((r) => r.status === "Pending").length);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="flex items-center gap-2.5 px-4 py-5">
          <Activity className="h-6 w-6 shrink-0 text-primary" />
          {!collapsed && <span className="text-sm font-bold tracking-tight font-display text-primary">MaintainIQ</span>}
          {!collapsed && <Badge variant="secondary" className="ml-auto text-[10px]">Admin</Badge>}
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.url === "/admin"} className="hover:bg-sidebar-accent/20" activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                      {!collapsed && item.title === "Reported Issues" && openReports > 0 && (
                        <Badge className="ml-auto h-5 min-w-5 justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">{openReports}</Badge>
                      )}
                      {!collapsed && item.title === "Recommendations" && pendingRecs > 0 && (
                        <Badge className="ml-auto h-5 min-w-5 justify-center rounded-full bg-[hsl(var(--risk-medium))] text-[10px] text-white">{pendingRecs}</Badge>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
              <LogOut className="mr-2 h-4 w-4" />
              {!collapsed && <span>Logout</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
