import { useEffect } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { Loader2, MessageSquare, User, Search } from "lucide-react";
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
          <header className="sticky top-0 z-40 flex h-[60px] items-center justify-between gap-4 border-b border-border/30 bg-card px-4 md:px-6 shadow-sm">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="-ml-1 text-foreground/60 hover:text-foreground" />
            </div>

            <div className="flex items-center gap-1">
              <Link
                to="/dashboard/messages"
                className="relative p-2.5 rounded-full hover:bg-muted transition-colors"
                title="Messages"
              >
                <MessageSquare className="h-[18px] w-[18px] text-foreground/60" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
              <NotificationBell />
              <Link
                to="/dashboard/profile"
                className="p-2.5 rounded-full hover:bg-muted transition-colors"
                title="Profile"
              >
                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
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
