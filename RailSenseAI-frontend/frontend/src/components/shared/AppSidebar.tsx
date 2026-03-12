import { LayoutDashboard, Train, AlertTriangle, Map, Bot, BarChart3, Ticket, Settings, Shield } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Network Map", url: "/dashboard/network", icon: Map },
  { title: "Delay Monitor", url: "/dashboard/delays", icon: AlertTriangle },
  { title: "Train Routes", url: "/dashboard/routes", icon: Train },
];

const analyticsItems = [
  { title: "Congestion", url: "/dashboard/congestion", icon: BarChart3 },
  { title: "Ticket Insights", url: "/dashboard/tickets", icon: Ticket },
  { title: "AI Assistant", url: "/dashboard/ai-assistant", icon: Bot },
];

const systemItems = [
  { title: "Resilience", url: "/dashboard/resilience", icon: Shield },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

const AppSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const renderGroup = (label: string, items: typeof mainItems) => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/60">
        {!collapsed && label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={isActive(item.url)}>
                <NavLink to={item.url} end className="hover:bg-muted/50" activeClassName="bg-primary/10 text-primary font-medium">
                  <item.icon className="mr-2 h-4 w-4" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <Train className="h-6 w-6 text-primary flex-shrink-0" />
          {!collapsed && <span className="text-lg font-bold gradient-text">RailSenseAI</span>}
        </div>
      </SidebarHeader>

      <SidebarContent className="scrollbar-thin">
        {renderGroup("Operations", mainItems)}
        {renderGroup("Analytics", analyticsItems)}
        {renderGroup("System", systemItems)}
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-sidebar-border">
        {!collapsed && (
          <div className="text-xs text-muted-foreground/50 text-center">
            Railway Intelligence v1.0
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
