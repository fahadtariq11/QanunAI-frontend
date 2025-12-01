import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const RejectLawyer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    fetch(`${API_BASE_URL}/admin-portal/lawyers/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setProfile)
      .catch(console.error);
  }, [id]);

  const handleReject = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_BASE_URL}/admin-portal/lawyers/${id}/reject/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ reason }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to reject');
      }
      
      toast({ 
        title: 'Application Rejected', 
        description: 'The lawyer application has been rejected.' 
      });
      navigate('/admin-portal/lawyers');
    } catch (e: any) {
      toast({ 
        title: 'Error', 
        description: e.message || 'Failed to reject', 
        variant: 'destructive' 
      });
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to={`/admin-portal/lawyers/${id}`}>
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-700">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-heading font-bold text-white">Reject Application</h1>
          <p className="text-slate-400 mt-1">
            {profile ? `Rejecting application for ${profile.full_name}` : 'Loading...'}
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        {/* Warning Card */}
        <Card className="bg-red-500/10 border-red-500/30 mb-6">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 font-medium">This action cannot be undone</p>
              <p className="text-red-400/70 text-sm mt-1">
                The lawyer will be notified of this rejection and will not be able to access the platform as a verified lawyer.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Rejection Form */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white font-heading flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-400" />
              Rejection Details
            </CardTitle>
            <CardDescription className="text-slate-400">
              Provide a reason for rejecting this application (optional but recommended)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-slate-300">Reason for Rejection</Label>
              <Textarea 
                id="reason"
                value={reason} 
                onChange={(e) => setReason(e.target.value)} 
                rows={6} 
                placeholder="Please provide a reason for rejection. This will help the applicant understand why their application was not approved..."
                className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 resize-none"
              />
              <p className="text-xs text-slate-500">
                This reason may be shared with the applicant.
              </p>
            </div>
            
            <div className="flex gap-3 pt-4 border-t border-slate-700">
              <Button 
                variant="destructive"
                onClick={handleReject} 
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <XCircle className="h-4 w-4 mr-2" />
                )}
                {loading ? 'Rejecting...' : 'Reject Application'}
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate(`/admin-portal/lawyers/${id}`)}
                className="text-slate-400 hover:text-white hover:bg-slate-700"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RejectLawyer;