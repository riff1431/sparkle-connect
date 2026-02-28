import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, LayoutGrid, MessageSquare, User, X, Home, Briefcase, CalendarDays, FileText, Settings, Shield } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import NotificationBell from "@/components/NotificationBell";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderBarProps {
  variant?: "customer" | "cleaner" | "admin";
  messagesPath?: string;
  profilePath?: string;
}

const quickLinks = {
  customer: [
    { label: "Home", href: "/", icon: Home },
    { label: "Find Cleaners", href: "/search", icon: Search },
    { label: "My Jobs", href: "/dashboard/my-jobs", icon: Briefcase },
    { label: "Bookings", href: "/dashboard/upcoming", icon: CalendarDays },
    { label: "Invoices", href: "/dashboard/invoices", icon: FileText },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ],
  cleaner: [
    { label: "Home", href: "/", icon: Home },
    { label: "My Services", href: "/cleaner/services", icon: Briefcase },
    { label: "Bookings", href: "/cleaner/bookings", icon: CalendarDays },
    { label: "Earnings", href: "/cleaner/earnings", icon: FileText },
    { label: "Schedule", href: "/cleaner/schedule", icon: CalendarDays },
    { label: "Settings", href: "/cleaner/settings", icon: Settings },
  ],
  admin: [
    { label: "Home", href: "/", icon: Home },
    { label: "Users", href: "/admin/users", icon: User },
    { label: "Cleaners", href: "/admin/cleaners", icon: Briefcase },
    { label: "Bookings", href: "/admin/bookings", icon: CalendarDays },
    { label: "Payments", href: "/admin/payment-verification", icon: FileText },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ],
};

const DashboardHeaderBar = ({
  variant = "customer",
  messagesPath = "/dashboard/messages",
  profilePath = "/dashboard/profile",
}: DashboardHeaderBarProps) => {
  const { user } = useAuth();
  const unreadCount = useUnreadMessages();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) { setAvatarUrl(null); return; }
    supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.avatar_url) setAvatarUrl(data.avatar_url);
      });
  }, [user]);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const getInitials = () => {
    if (!user) return "U";
    const name = user.user_metadata?.full_name;
    if (name) return name.charAt(0).toUpperCase();
    return (user.email?.charAt(0) || "U").toUpperCase();
  };

  const isAdmin = variant === "admin";
  const accentColor = isAdmin ? "destructive" : "primary";
  const links = quickLinks[variant];

  return (
    <header className="sticky top-0 z-40 flex h-[60px] items-center justify-between border-b border-border/30 bg-card px-3 md:px-5">
      {/* Left side */}
      <div className="flex items-center gap-0.5">
        <SidebarTrigger className="p-2.5 rounded-full text-foreground/60 hover:text-foreground hover:bg-muted/60 transition-colors" />

        {/* Apps Grid Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2.5 rounded-full text-foreground/60 hover:text-foreground hover:bg-muted/60 transition-colors hidden md:flex" title="Quick Links">
              <LayoutGrid className="h-[18px] w-[18px]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52 p-1.5">
            <div className="grid grid-cols-3 gap-1">
              {links.map((link) => (
                <DropdownMenuItem key={link.href} asChild className="flex-col items-center gap-1.5 p-3 rounded-lg cursor-pointer">
                  <Link to={link.href}>
                    <div className={`p-2 rounded-lg ${isAdmin ? "bg-destructive/10" : "bg-primary/10"}`}>
                      <link.icon className={`h-4 w-4 ${isAdmin ? "text-destructive" : "text-primary"}`} />
                    </div>
                    <span className="text-[10px] font-medium text-foreground/70 text-center leading-tight">{link.label}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Search */}
        {searchOpen ? (
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-1 ml-1">
            <div className="flex items-center gap-1.5 bg-muted/60 rounded-full px-3 py-1.5">
              <Search className="h-4 w-4 text-foreground/40 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cleaners, services..."
                className="bg-transparent text-sm text-foreground placeholder:text-foreground/40 outline-none w-40 md:w-56"
              />
              <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(""); }} className="p-0.5 rounded-full hover:bg-foreground/10">
                <X className="h-3.5 w-3.5 text-foreground/50" />
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2.5 rounded-full text-foreground/60 hover:text-foreground hover:bg-muted/60 transition-colors"
            title="Search"
          >
            <Search className="h-[18px] w-[18px]" />
          </button>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-0.5">
        {isAdmin && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-destructive/10 mr-1.5">
            <Shield className="h-3.5 w-3.5 text-destructive" />
            <span className="text-[10px] font-semibold text-destructive hidden md:inline">Admin</span>
          </div>
        )}

        {/* Messages */}
        <Link
          to={messagesPath}
          className="relative p-2.5 rounded-full text-foreground/50 hover:text-foreground hover:bg-muted/60 transition-colors"
          title="Messages"
        >
          <MessageSquare className="h-[18px] w-[18px]" />
          {unreadCount > 0 && (
            <span className={`absolute top-0.5 right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-${accentColor} px-1 text-[9px] font-bold text-${accentColor}-foreground ring-2 ring-card`}>
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Link>

        {/* Notifications */}
        <NotificationBell />

        {/* Profile Avatar */}
        <Link
          to={profilePath}
          className="ml-1 p-0.5 rounded-full hover:ring-2 hover:ring-primary/20 transition-all"
          title="Profile"
        >
          <Avatar className={`h-8 w-8 ring-2 ring-card`}>
            {avatarUrl && <AvatarImage src={avatarUrl} alt="Profile" />}
            <AvatarFallback className={`bg-gradient-to-br ${isAdmin ? "from-destructive to-destructive/70" : "from-primary to-secondary"} text-primary-foreground text-xs font-semibold`}>
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
};

export default DashboardHeaderBar;
