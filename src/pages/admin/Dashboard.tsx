import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Briefcase, 
  Newspaper,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    fetch(`${API_BASE_URL}/admin-portal/dashboard/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats?.total_users ?? '-',
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      change: stats?.new_users_this_week ? `+${stats.new_users_this_week} this week` : null,
    },
    {
      title: "Total Lawyers",
      value: stats?.total_lawyers ?? '-',
      icon: Briefcase,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      change: stats?.new_lawyers_this_week ? `+${stats.new_lawyers_this_week} this week` : null,
    },
    {
      title: "Pending Applications",
      value: stats?.pending_applications ?? '-',
      icon: Clock,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      link: '/admin-portal/lawyers?status=PENDING',
    },
    {
      title: "Verified Lawyers",
      value: stats?.verified_lawyers ?? '-',
      icon: CheckCircle2,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Rejected Applications",
      value: stats?.rejected_applications ?? '-',
      icon: XCircle,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
    },
    {
      title: "Legal Updates",
      value: stats?.total_legal_updates ?? '-',
      icon: Newspaper,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      link: '/admin-portal/legal-updates',
    },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white">Admin Dashboard</h1>
          <p className="text-slate-400 mt-1">Monitor and manage your platform</p>
        </div>
        <Link to="/admin-portal/lawyers">
          <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium">
            <Briefcase className="h-4 w-4 mr-2" />
            Manage Applications
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, index) => (
            <Card 
              key={index} 
              className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 transition-all duration-200 hover:border-slate-600"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-heading font-bold text-white">{stat.value}</div>
                {stat.change && (
                  <p className="text-xs text-green-400 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.change}
                  </p>
                )}
                {stat.link && (
                  <Link 
                    to={stat.link} 
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center mt-2"
                  >
                    View all
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Applications Card */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white font-heading flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-400" />
              Quick Actions
            </CardTitle>
            <CardDescription className="text-slate-400">
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/admin-portal/lawyers?status=PENDING" className="block">
              <Button 
                variant="outline" 
                className="w-full justify-between border-slate-600 text-white hover:bg-slate-700 hover:text-white"
              >
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-amber-400" />
                  Review Pending Applications
                </span>
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                  {stats?.pending_applications ?? 0}
                </Badge>
              </Button>
            </Link>
            <Link to="/admin-portal/legal-updates/new" className="block">
              <Button 
                variant="outline" 
                className="w-full justify-start border-slate-600 text-white hover:bg-slate-700 hover:text-white"
              >
                <Newspaper className="h-4 w-4 mr-2 text-cyan-400" />
                Post New Legal Update
              </Button>
            </Link>
            <Link to="/admin-portal/users" className="block">
              <Button 
                variant="outline" 
                className="w-full justify-start border-slate-600 text-white hover:bg-slate-700 hover:text-white"
              >
                <Users className="h-4 w-4 mr-2 text-blue-400" />
                Manage All Users
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Platform Overview */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white font-heading flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              Platform Overview
            </CardTitle>
            <CardDescription className="text-slate-400">
              Current platform status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-slate-700">
              <span className="text-slate-400">Total Documents</span>
              <span className="text-white font-medium">{stats?.total_documents ?? '-'}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-700">
              <span className="text-slate-400">Verified Lawyers</span>
              <span className="text-green-400 font-medium">{stats?.verified_lawyers ?? '-'}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-700">
              <span className="text-slate-400">Pending Review</span>
              <span className="text-amber-400 font-medium">{stats?.pending_applications ?? '-'}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-400">Rejected</span>
              <span className="text-red-400 font-medium">{stats?.rejected_applications ?? '-'}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
