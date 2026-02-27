import { 
  LayoutDashboard, 
  Calendar, 
  User, 
  DollarSign, 
  Settings, 
  ClipboardList,
  LogOut,
  Crown,
  Zap,
  ShoppingBag,
  FileQuestion,
  FileText,
  MessageSquare,
  Wallet,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
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
import { useAuth } from "@/contexts/AuthContext";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { Badge } from "@/components/ui/badge";

const menuItems = [
  { title: "Overview", url: "/cleaner/dashboard", icon: LayoutDashboard },
  { title: "My Services", url: "/cleaner/services", icon: ShoppingBag },
  { title: "Booking Requests", url: "/cleaner/bookings", icon: ClipboardList },
  { title: "Quote Requests", url: "/cleaner/quotes", icon: FileQuestion },
  { title: "Messages", url: "/cleaner/messages", icon: MessageSquare },
  { title: "My Schedule", url: "/cleaner/schedule", icon: Calendar },
  { title: "Membership", url: "/cleaner/subscription", icon: Crown },
  { title: "Sponsored Spotlight", url: "/cleaner/sponsorship", icon: Zap },
  { title: "My Profile", url: "/cleaner/profile", icon: User },
  { title: "Invoices", url: "/cleaner/invoices", icon: FileText },
  { title: "Wallet", url: "/cleaner/wallet", icon: Wallet },
  { title: "Earnings", url: "/cleaner/earnings", icon: DollarSign },
  { title: "Settings", url: "/cleaner/settings", icon: Settings },
];

const CleanerDashboardSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { signOut } = useAuth();
  const unreadCount = useUnreadMessages();

  const isActive = (path: string) => {
    if (path === "/cleaner/dashboard") {
      return location.pathname === "/cleaner/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r-0"
      style={{
        background: "linear-gradient(180deg, hsl(210 60% 92%) 0%, hsl(210 70% 82%) 50%, hsl(210 65% 72%) 100%)",
      }}
    >
      <SidebarContent
        className="pt-6 px-2"
        style={{ background: "transparent" }}
      >
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
                          ? "bg-white/30 backdrop-blur-sm text-white font-semibold shadow-sm"
                          : "text-white/80 hover:bg-white/15 hover:text-white"
                        }
                      `}
                    >
                      <NavLink
                        to={item.url}
                        end={item.url === "/cleaner/dashboard"}
                        className="flex items-center gap-3"
                        activeClassName=""
                      >
                        <item.icon className={`h-[18px] w-[18px] shrink-0 ${active ? "text-white" : "text-white/80"}`} />
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

      <SidebarFooter
        className="p-3 border-t border-white/20"
        style={{ background: "transparent" }}
      >
        <button
          onClick={signOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/15 transition-colors text-[14px]"
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default CleanerDashboardSidebar;
