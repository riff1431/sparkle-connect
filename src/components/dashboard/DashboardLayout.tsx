import { useEffect } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { Loader2, MessageSquare, User, Search, LayoutGrid } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import DashboardSidebar from "./DashboardSidebar";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import NotificationBell from "@/components/NotificationBell";

const DashboardLayout = () => {
  const { user, loading, role, roleLoading } = useAuth();
  const unreadCount = useUnreadMessages();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!roleLoading && role === "cleaner") {
      navigate("/cleaner/dashboard", { replace: true });
    }
  }, [role, roleLoading, navigate]);

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || role === "cleaner") {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/40">
        <DashboardSidebar />
        <SidebarInset className="flex-1">
          {/* MaterialM-style Header */}
          <header className="sticky top-0 z-40 flex h-[60px] items-center justify-between border-b border-border/30 bg-card px-3 md:px-5">
            <div className="flex items-center gap-1">
              <SidebarTrigger className="p-2.5 rounded-full text-foreground/60 hover:text-foreground hover:bg-muted/60 transition-colors" />
              <button className="p-2.5 rounded-full text-foreground/60 hover:text-foreground hover:bg-muted/60 transition-colors hidden md:flex" title="Apps">
                <LayoutGrid className="h-[18px] w-[18px]" />
              </button>
              <button className="p-2.5 rounded-full text-foreground/60 hover:text-foreground hover:bg-muted/60 transition-colors" title="Search">
                <Search className="h-[18px] w-[18px]" />
              </button>
            </div>

            <div className="flex items-center gap-0.5">
              <Link
                to="/dashboard/messages"
                className="relative p-2.5 rounded-full text-foreground/50 hover:text-foreground hover:bg-muted/60 transition-colors"
                title="Messages"
              >
                <MessageSquare className="h-[18px] w-[18px]" />
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground ring-2 ring-card">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
              <NotificationBell />
              <Link
                to="/dashboard/profile"
                className="ml-1 p-0.5 rounded-full hover:ring-2 hover:ring-primary/20 transition-all"
                title="Profile"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center ring-2 ring-card">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
              </Link>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-5 md:p-7">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
