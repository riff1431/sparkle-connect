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
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Main Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Profile", url: "/dashboard/profile", icon: User },
  { title: "My Jobs", url: "/dashboard/my-jobs", icon: Briefcase },
  { title: "My Quotes", url: "/dashboard/quotes", icon: FileQuestion },
  { title: "Upcoming", url: "/dashboard/upcoming", icon: CalendarDays },
  { title: "Booking History", url: "/dashboard/history", icon: History },
  { title: "Messages", url: "/dashboard/messages", icon: MessageSquare },
  { title: "Invoices", url: "/dashboard/invoices", icon: FileText },
  { title: "Addresses", url: "/dashboard/addresses", icon: MapPin },
  { title: "Membership", url: "/dashboard/subscription", icon: Crown },
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
    <Sidebar collapsible="icon" className="border-r-0 bg-white shadow-[2px_0_12px_-4px_rgba(0,0,0,0.08)]">
      <SidebarContent className="pt-6 px-2 bg-white">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {menuItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.title}
                      className={`
                        rounded-lg px-3 py-2.5 transition-all duration-200
                        ${active
                          ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary font-semibold border-l-[3px] border-primary"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground border-l-[3px] border-transparent"
                        }
                      `}
                    >
                      <NavLink
                        to={item.url}
                        end={item.url === "/dashboard"}
                        className="flex items-center gap-3"
                        activeClassName=""
                      >
                        <item.icon className={`h-[18px] w-[18px] shrink-0 ${active ? "text-primary" : "text-muted-foreground"}`} />
                        <span className="text-[14px]">{item.title}</span>
                        {item.title === "Messages" && unreadCount > 0 && (
                          <Badge variant="destructive" className="ml-auto h-5 min-w-5 px-1.5 text-[10px] justify-center">
                            {unreadCount > 99 ? "99+" : unreadCount}
                          </Badge>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 bg-white border-t border-border/50">
        <button
          onClick={signOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors text-[14px]"
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
