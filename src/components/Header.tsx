import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Search, User, LogOut, LayoutDashboard, Briefcase, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import logo from "@/assets/logo-new.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut, loading, role } = useAuth();

  const navLinks = [
    { label: "Find Cleaners", href: "/search" },
    { label: "Post a Job", href: "/for-cleaners" },
    { label: "My Bookings", href: "/dashboard/upcoming-bookings" },
    { label: "Reviews", href: "/#how-it-works" },
  ];

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  const getUserName = () => {
    if (!user) return "";
    const name = user.user_metadata?.full_name;
    if (name) return name;
    return user.email?.split("@")[0] || "User";
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between lg:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <img src={logo} alt="The Cleaning Network" className="h-10 w-auto lg:h-12" />
          </Link>

          {/* Center Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-2">
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-2">
                    {role === "admin" && (
                      <Button variant="ghost" size="sm" asChild className="text-destructive">
                        <Link to="/admin/dashboard">
                          <Shield className="h-4 w-4 mr-1" />
                          Admin
                        </Link>
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-muted transition-colors">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                              {getInitials(user.email || "U")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium text-foreground">{getUserName()}</span>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem asChild>
                          <Link to="/dashboard" className="flex items-center gap-2">
                            <LayoutDashboard className="h-4 w-4" />
                            My Dashboard
                          </Link>
                        </DropdownMenuItem>
                        {role === "cleaner" && (
                          <DropdownMenuItem asChild>
                            <Link to="/cleaner/dashboard" className="flex items-center gap-2">
                              <Briefcase className="h-4 w-4" />
                              Cleaner Portal
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem asChild>
                          <Link to="/dashboard/profile" className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={signOut} className="flex items-center gap-2 text-destructive">
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" asChild className="text-sm">
                      <Link to="/auth">Log in</Link>
                    </Button>
                    <span className="text-muted-foreground text-sm">·</span>
                    <Button variant="ghost" size="sm" asChild className="text-primary text-sm font-semibold">
                      <Link to="/auth">Sign Up</Link>
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="px-4 py-3 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {!loading && (
                <div className="flex flex-col gap-2 mt-4 px-4">
                  {user ? (
                    <>
                      <Button variant="outline" className="w-full" asChild>
                        <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                          <LayoutDashboard className="h-4 w-4 mr-2" />
                          Dashboard
                        </Link>
                      </Button>
                      <Button variant="ghost" className="w-full" onClick={() => { signOut(); setIsMenuOpen(false); }}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" className="w-full" asChild>
                        <Link to="/auth" onClick={() => setIsMenuOpen(false)}>Log In</Link>
                      </Button>
                      <Button variant="cta" className="w-full" asChild>
                        <Link to="/auth" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
                      </Button>
                    </>
                  )}
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
