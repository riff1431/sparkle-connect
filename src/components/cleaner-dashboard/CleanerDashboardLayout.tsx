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

  // Redirect customers to their dashboard
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

  // Don't render if user is not a cleaner (will redirect via useEffect)
  if (role && role !== "cleaner") {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <CleanerDashboardSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-border flex items-center justify-between px-4 bg-card">
            <div className="flex items-center">
              <SidebarTrigger className="mr-4" />
              <h1 className="font-heading text-lg font-semibold">Cleaner Portal</h1>
            </div>
            <div className="flex items-center gap-1">
              <Link to="/cleaner/messages" className="relative p-2 rounded-md hover:bg-muted transition-colors" title="Messages">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
              <NotificationBell />
              <Link to="/cleaner/profile" className="p-2 rounded-md hover:bg-muted transition-colors" title="Profile">
                <User className="h-5 w-5 text-muted-foreground" />
              </Link>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CleanerDashboardLayout;
