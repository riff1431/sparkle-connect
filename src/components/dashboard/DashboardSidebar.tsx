import { useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  History,
  MapPin,
  User,
  Settings,
  LogOut,
  Crown,
  Briefcase,
  FileQuestion,
  MessageSquare,
  FileText,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const menuItems = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Upcoming", url: "/dashboard/upcoming", icon: CalendarDays },
  { title: "Booking History", url: "/dashboard/history", icon: History },
  { title: "My Jobs", url: "/dashboard/my-jobs", icon: Briefcase },
  { title: "My Quotes", url: "/dashboard/quotes", icon: FileQuestion },
  { title: "Messages", url: "/dashboard/messages", icon: MessageSquare },
  { title: "Invoices", url: "/dashboard/invoices", icon: FileText },
  { title: "Addresses", url: "/dashboard/addresses", icon: MapPin },
  { title: "Membership", url: "/dashboard/subscription", icon: Crown },
  { title: "Profile", url: "/dashboard/profile", icon: User },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

const DashboardSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { signOut } = useAuth();
  const unreadCount = useUnreadMessages();

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Customer Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className="flex items-center gap-3"
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1">{item.title}</span>
                      {item.title === "Messages" && unreadCount > 0 && (
                        <Badge variant="destructive" className="ml-auto h-5 min-w-5 px-1.5 text-[10px] justify-center">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </Badge>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={signOut}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
