import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Newspaper, 
  ArrowLeft,
  Globe,
  Calendar,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const AdminLegalUpdates = () => {
  const { toast } = useToast();
  const [updates, setUpdates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUpdates = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/admin/legal-updates/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUpdates(data.results || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this update?')) return;

    const token = localStorage.getItem('adminToken');
    try {
      await fetch(`${API_BASE_URL}/admin/legal-updates/${id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({ title: 'Deleted', description: 'Legal update has been deleted.' });
      fetchUpdates();
    } catch (e: any) {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case 'high':
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            <AlertTriangle className="h-3 w-3 mr-1" />
            High Priority
          </Badge>
        );
      case 'medium':
        return (
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
            Medium
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">
            Low
          </Badge>
        );
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/admin-portal/dashboard">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-700">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-heading font-bold text-white">Legal Updates</h1>
            <p className="text-slate-400 mt-1">Manage legal news and announcements</p>
          </div>
        </div>
        <Link to="/admin-portal/legal-updates/new">
          <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium">
            <Plus className="h-4 w-4 mr-2" />
            Add Update
          </Button>
        </Link>
      </div>

      {/* Updates List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      ) : updates.length === 0 ? (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-12 text-center">
            <Newspaper className="h-12 w-12 mx-auto mb-4 text-slate-600" />
            <p className="text-slate-400 mb-4">No legal updates yet</p>
            <Link to="/admin-portal/legal-updates/new">
              <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900">
                <Plus className="h-4 w-4 mr-2" />
                Create your first update
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {updates.map(update => (
            <Card key={update.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getImportanceBadge(update.importance)}
                      <Badge variant="outline" className="border-slate-600 text-slate-400">
                        {update.category}
                      </Badge>
                    </div>
                    
                    <h3 className="text-lg font-heading font-semibold text-white mb-2">
                      {update.headline}
                    </h3>
                    
                    <p className="text-sm text-slate-400 line-clamp-2 mb-3">
                      {update.summary}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center">
                        <Globe className="h-3 w-3 mr-1" />
                        {update.source}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(update.publish_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Link to={`/admin-portal/legal-updates/${update.id}/edit`}>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-slate-600 text-slate-400 hover:text-white hover:bg-slate-700"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={() => handleDelete(update.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Stats */}
      {!loading && updates.length > 0 && (
        <div className="text-sm text-slate-500 text-right">
          {updates.length} legal update{updates.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default AdminLegalUpdates;
