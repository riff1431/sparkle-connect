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
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { Badge } from "@/components/ui/badge";

const mainMenuItems = [
  { title: "Overview", url: "/cleaner/dashboard", icon: LayoutDashboard },
  { title: "My Profile", url: "/cleaner/profile", icon: User },
];

const serviceMenuItems = [
  { title: "My Services", url: "/cleaner/services", icon: ShoppingBag },
  { title: "Booking Requests", url: "/cleaner/bookings", icon: ClipboardList },
  { title: "Quote Requests", url: "/cleaner/quotes", icon: FileQuestion },
  { title: "Messages", url: "/cleaner/messages", icon: MessageSquare },
  { title: "My Schedule", url: "/cleaner/schedule", icon: Calendar },
];

const financeMenuItems = [
  { title: "Invoices", url: "/cleaner/invoices", icon: FileText },
  { title: "Wallet", url: "/cleaner/wallet", icon: Wallet },
  { title: "Earnings", url: "/cleaner/earnings", icon: DollarSign },
];

const upgradeMenuItems = [
  { title: "Membership", url: "/cleaner/subscription", icon: Crown },
  { title: "Sponsored Spotlight", url: "/cleaner/sponsorship", icon: Zap },
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

  const renderMenuItems = (items: typeof mainMenuItems) => (
    <SidebarMenu className="space-y-0.5">
      {items.map((item) => {
        const active = isActive(item.url);
        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              isActive={active}
              tooltip={item.title}
              className={`
                rounded-lg px-3 py-2.5 transition-all duration-200 font-medium
                ${active
                  ? "bg-primary/10 text-primary border-l-[3px] border-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }
              `}
            >
              <NavLink
                to={item.url}
                end={item.url === "/cleaner/dashboard"}
                className="flex items-center gap-3"
                activeClassName=""
              >
                <item.icon className={`h-[18px] w-[18px] shrink-0 ${active ? "text-primary" : ""}`} />
                <span className="text-[13px]">{item.title}</span>
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
  );

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border/50 [&_[data-sidebar=sidebar]]:!bg-card"
    >
      <SidebarContent className="pt-4 px-2" style={{ background: "transparent" }}>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-1">
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>{renderMenuItems(mainMenuItems)}</SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-2">
          <SidebarGroupLabel className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-1">
            Services
          </SidebarGroupLabel>
          <SidebarGroupContent>{renderMenuItems(serviceMenuItems)}</SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-2">
          <SidebarGroupLabel className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-1">
            Finance
          </SidebarGroupLabel>
          <SidebarGroupContent>{renderMenuItems(financeMenuItems)}</SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-2">
          <SidebarGroupLabel className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-1">
            Upgrade & Settings
          </SidebarGroupLabel>
          <SidebarGroupContent>{renderMenuItems(upgradeMenuItems)}</SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter
        className="p-3 border-t border-border/50"
        style={{ background: "transparent" }}
      >
        <button
          onClick={signOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors text-[13px] font-medium"
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default CleanerDashboardSidebar;
