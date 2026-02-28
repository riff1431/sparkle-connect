import { useEffect } from "react";
import { Outlet, Navigate, useNavigate, Link } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import CleanerDashboardSidebar from "./CleanerDashboardSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, MessageSquare, User } from "lucide-react";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import NotificationBell from "@/components/NotificationBell";

const CleanerDashboardLayout = () => {
  const { user, loading, role, roleLoading } = useAuth();
  const navigate = useNavigate();
  const unreadCount = useUnreadMessages();

  useEffect(() => {
    if (!roleLoading && role && role !== "cleaner") {
      navigate("/dashboard", { replace: true });
    }
  }, [role, roleLoading, navigate]);

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (role && role !== "cleaner") {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/40">
        <CleanerDashboardSidebar />
        <div className="flex-1 flex flex-col">
          {/* MaterialM-style Header */}
          <header className="sticky top-0 z-40 h-[60px] border-b border-border/30 flex items-center justify-between px-4 md:px-6 bg-card shadow-sm">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="-ml-1 text-foreground/60 hover:text-foreground" />
            </div>
            <div className="flex items-center gap-1">
              <Link to="/cleaner/messages" className="relative p-2.5 rounded-full hover:bg-muted transition-colors" title="Messages">
                <MessageSquare className="h-[18px] w-[18px] text-foreground/60" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
              <NotificationBell />
              <Link to="/cleaner/profile" className="p-2.5 rounded-full hover:bg-muted transition-colors" title="Profile">
                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
              </Link>
            </div>
          </header>
          <main className="flex-1 p-5 md:p-7 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CleanerDashboardLayout;
