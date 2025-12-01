import { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Scale, LayoutDashboard, Users, Briefcase, FileText, LogOut, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    
    if (!token || !user) {
      navigate('/admin-portal/login');
      return;
    }
    
    setAdmin(JSON.parse(user));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRefreshToken');
    localStorage.removeItem('adminUser');
    navigate('/admin-portal/login');
  };

  const navItems = [
    { path: '/admin-portal/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin-portal/lawyers', label: 'Lawyer Applications', icon: Briefcase },
    { path: '/admin-portal/users', label: 'Users', icon: Users },
    { path: '/admin-portal/legal-updates', label: 'Legal Updates', icon: Newspaper },
  ];

  if (!admin) return null;

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-slate-700">
          <Link to="/admin-portal/dashboard" className="flex items-center space-x-2">
            <div className="p-1.5 bg-amber-500 rounded">
              <Scale className="h-5 w-5 text-slate-900" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-white">QanunAI</h1>
              <p className="text-xs text-slate-400">Admin Portal</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-500'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Admin info & logout */}
        <div className="p-4 border-t border-slate-700">
          <div className="mb-3">
            <p className="text-sm font-medium text-white">{admin.full_name || admin.email}</p>
            <p className="text-xs text-slate-400">Administrator</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="min-h-full bg-slate-900 text-white">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
