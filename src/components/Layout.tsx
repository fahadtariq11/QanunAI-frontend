import { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Newspaper, 
  User, 
  Settings,
  Menu,
  X,
  Scale,
  Shield,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/app', icon: LayoutDashboard },
    { name: 'Documents', href: '/app/documents', icon: FileText },
    { name: 'Lawyers', href: '/app/lawyers', icon: Users },
    { name: 'Legal Updates', href: '/app/updates', icon: Newspaper },
    { name: 'Profile', href: '/app/profile', icon: User },
    { name: 'Settings', href: '/app/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/app') {
      return location.pathname === '/app' || location.pathname === '/app/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background-alt flex w-full">
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-surface border-r border-border transition-all duration-300",
          sidebarOpen ? "w-64" : "w-16"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {sidebarOpen && (
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary rounded-lg">
                <Scale className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-heading font-bold text-lg">QanunAI</h1>
                <p className="text-xs text-foreground-muted">Document Analyzer</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto"
          >
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-smooth",
                isActive(item.href)
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground-muted hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", sidebarOpen ? "mr-3" : "mx-auto")} />
              {sidebarOpen && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border space-y-2">
          {sidebarOpen ? (
            <>
              <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Shield className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user?.email || 'User'}
                  </p>
                  <p className="text-xs text-foreground-muted truncate">
                    Standard User
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-3" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-4 w-4 text-primary-foreground" />
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                className="w-8 h-8 mx-auto text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div 
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          sidebarOpen ? "ml-64" : "ml-16"
        )}
      >
        {/* Top Header */}
        <header className="bg-surface border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-heading font-bold text-foreground">
                {navigation.find(item => isActive(item.href))?.name || 'Dashboard'}
              </h2>
              <p className="text-sm text-foreground-muted">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                New Analysis
              </Button>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Layout;