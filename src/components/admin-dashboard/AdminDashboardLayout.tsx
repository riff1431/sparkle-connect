import { useEffect } from "react";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminDashboardSidebar from "./AdminDashboardSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Shield, User } from "lucide-react";
import NotificationBell from "@/components/NotificationBell";

const AdminDashboardLayout = () => {
  const { user, loading, role, roleLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!roleLoading && role && role !== "admin") {
      if (role === "cleaner") {
        navigate("/cleaner/dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [role, roleLoading, navigate]);

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-destructive" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (role && role !== "admin") {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/40">
        <AdminDashboardSidebar />
        <div className="flex-1 flex flex-col">
          {/* MaterialM-style Header */}
          <header className="sticky top-0 z-40 h-[60px] border-b border-border/30 flex items-center justify-between px-4 md:px-6 bg-card shadow-sm">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="-ml-1 text-foreground/60 hover:text-foreground" />
              <div className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-destructive" />
                <span className="text-xs font-semibold text-destructive">Admin Panel</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <NotificationBell />
              <div className="p-2.5 rounded-full hover:bg-muted transition-colors cursor-pointer">
                <div className="h-7 w-7 rounded-full bg-destructive/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-destructive" />
                </div>
              </div>
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

export default AdminDashboardLayout;
