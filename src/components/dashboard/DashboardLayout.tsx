import { useEffect } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { Loader2, MessageSquare, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import DashboardSidebar from "./DashboardSidebar";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import NotificationBell from "@/components/NotificationBell";
import logo from "@/assets/logo.jpeg";

const DashboardLayout = () => {
  const { user, loading, role, roleLoading } = useAuth();
  const unreadCount = useUnreadMessages();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Redirect cleaners to their dashboard
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
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        <SidebarInset className="flex-1">
          {/* Dashboard Header */}
          <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-border bg-background px-4 md:px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="-ml-1" />
              <Link to="/" className="flex items-center gap-2">
                <img src={logo} alt="The Cleaning Network" className="h-8 w-auto rounded" />
                <span className="font-heading font-semibold text-foreground hidden sm:inline">
                  The Cleaning Network
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-1">
              <Link
                to="/dashboard/messages"
                className="relative p-2 rounded-md hover:bg-muted transition-colors"
                title="Messages"
              >
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
              <NotificationBell />
              <Link
                to="/dashboard/profile"
                className="p-2 rounded-md hover:bg-muted transition-colors"
                title="Profile"
              >
                <User className="h-5 w-5 text-muted-foreground" />
              </Link>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-4 md:p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
