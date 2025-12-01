import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Eye,
  Briefcase,
  MapPin,
  Loader2,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const LawyerApplications = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  
  const statusFilter = searchParams.get('status') || '';

  const fetchApplications = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    setLoading(true);
    try {
      const url = statusFilter
        ? `${API_BASE_URL}/admin-portal/lawyers/?status=${statusFilter}`
        : `${API_BASE_URL}/admin-portal/lawyers/`;
      
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setApps(data.results || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const handleApprove = async (id: number) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    setProcessingId(id);
    try {
      const res = await fetch(`${API_BASE_URL}/admin-portal/lawyers/${id}/approve/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to approve');
      }
      
      toast({ 
        title: 'Lawyer Approved', 
        description: 'The lawyer has been verified successfully.' 
      });
      fetchApplications();
    } catch (e: any) {
      toast({ 
        title: 'Error', 
        description: e.message || 'Failed to approve lawyer', 
        variant: 'destructive' 
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  const filterButtons = [
    { value: '', label: 'All' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'VERIFIED', label: 'Verified' },
    { value: 'REJECTED', label: 'Rejected' },
  ];

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
            <h1 className="text-3xl font-heading font-bold text-white">Lawyer Applications</h1>
            <p className="text-slate-400 mt-1">Review and manage lawyer registrations</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-slate-400" />
        <div className="flex gap-2">
          {filterButtons.map(btn => (
            <Button
              key={btn.value}
              variant="ghost"
              size="sm"
              onClick={() => setSearchParams(btn.value ? { status: btn.value } : {})}
              className={`${
                statusFilter === btn.value
                  ? 'bg-amber-500 text-slate-900 hover:bg-amber-600 hover:text-slate-900'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {btn.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      ) : apps.length === 0 ? (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-12 text-center">
            <Briefcase className="h-12 w-12 mx-auto mb-4 text-slate-600" />
            <p className="text-slate-400">No applications found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {apps.map((app) => (
            <Card key={app.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-heading font-semibold text-white">
                        {app.full_name || app.email}
                      </h3>
                      {getStatusBadge(app.verification_status)}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center text-slate-400">
                        <Briefcase className="h-4 w-4 mr-2 text-slate-500" />
                        {app.primary_specialization || 'Not specified'}
                      </div>
                      <div className="flex items-center text-slate-400">
                        <MapPin className="h-4 w-4 mr-2 text-slate-500" />
                        {app.city || 'Not specified'}
                      </div>
                      <div className="flex items-center text-slate-400">
                        <Clock className="h-4 w-4 mr-2 text-slate-500" />
                        {app.experience_years ? `${app.experience_years} years exp.` : 'Experience not specified'}
                      </div>
                    </div>
                    
                    <p className="text-xs text-slate-500 mt-2">
                      Applied: {new Date(app.applied_at).toLocaleDateString('en-US', { 
                        year: 'numeric', month: 'short', day: 'numeric' 
                      })}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Link to={`/admin-portal/lawyers/${app.id}`}>
                      <Button variant="outline" size="sm" className="border-slate-600 text-white hover:bg-slate-700">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                    
                    {app.verification_status === 'PENDING' && (
                      <>
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleApprove(app.id)}
                          disabled={processingId === app.id}
                        >
                          {processingId === app.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Approve
                            </>
                          )}
                        </Button>
                        <Link to={`/admin-portal/lawyers/${app.id}/reject`}>
                          <Button size="sm" variant="destructive">
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LawyerApplications;
