import { useEffect } from "react";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminDashboardSidebar from "./AdminDashboardSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Shield, User, Search, LayoutGrid } from "lucide-react";
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
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-destructive/10 mr-1">
                <Shield className="h-3.5 w-3.5 text-destructive" />
                <span className="text-[10px] font-semibold text-destructive hidden md:inline">Admin</span>
              </div>
              <NotificationBell />
              <div className="ml-1 p-0.5 rounded-full hover:ring-2 hover:ring-destructive/20 transition-all cursor-pointer">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-destructive to-destructive/70 flex items-center justify-center ring-2 ring-card">
                  <User className="h-4 w-4 text-destructive-foreground" />
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
