import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Calendar, User, Settings, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const LawyerLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/lawyer/dashboard" },
    { icon: Calendar, label: "Consultations", path: "/lawyer/consultations" },
    { icon: User, label: "My Profile", path: "/lawyer/profile" },
    { icon: Settings, label: "Settings", path: "/lawyer/settings" },
  ];

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const NavContent = () => (
    <nav className="space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 border-r bg-card">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-primary">Lawyer Portal</h1>
          <p className="text-sm text-muted-foreground mt-1">Legal Professional</p>
        </div>
        <div className="flex-1 p-4">
          <NavContent />
        </div>
        <div className="p-4 border-t space-y-2">
          <div className="px-3 py-2 text-sm text-muted-foreground">
            {user?.email || 'Lawyer'}
          </div>
          <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Top Bar + Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Top Bar */}
        <header className="lg:hidden sticky top-0 z-50 bg-card border-b">
          <div className="flex items-center justify-between px-4 py-3">
            <h1 className="text-xl font-bold text-primary">Lawyer Portal</h1>
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-primary">Lawyer Portal</h2>
                  <p className="text-sm text-muted-foreground">Legal Professional</p>
                </div>
                <NavContent />
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LawyerLayout;
