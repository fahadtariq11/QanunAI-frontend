import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  Building,
  FileText,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const LawyerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    fetch(`${API_BASE_URL}/admin-portal/lawyers/${id}/`, { 
      headers: { Authorization: `Bearer ${token}` } 
    })
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleApprove = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    setProcessing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin-portal/lawyers/${id}/approve/`, { 
        method: 'POST', 
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        } 
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to approve');
      }

      toast({
        title: 'Lawyer Approved',
        description: 'The lawyer has been verified successfully.',
      });
      navigate('/admin-portal/lawyers');
    } catch (e: any) {
      toast({
        title: 'Error',
        description: e.message || 'Failed to approve lawyer',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
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
            Pending Review
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 lg:p-8">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-12 text-center">
            <p className="text-slate-400">Application not found</p>
            <Link to="/admin-portal/lawyers">
              <Button variant="outline" className="mt-4 border-slate-600 text-white hover:bg-slate-700">
                Back to Applications
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/admin-portal/lawyers">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-700">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-heading font-bold text-white">Lawyer Application</h1>
            <p className="text-slate-400 mt-1">Review application details</p>
          </div>
        </div>
        {getStatusBadge(profile.verification_status)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white font-heading">Personal Information</CardTitle>
              <CardDescription className="text-slate-400">Basic profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Full Name</label>
                  <p className="text-white font-medium">{profile.full_name}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Email</label>
                  <p className="text-white flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-slate-500" />
                    {profile.email}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Phone</label>
                  <p className="text-white flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-slate-500" />
                    {profile.phone || 'Not provided'}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">City</label>
                  <p className="text-white flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-slate-500" />
                    {profile.city || 'Not provided'}
                  </p>
                </div>
              </div>
              
              {profile.address && (
                <div className="space-y-1 pt-2 border-t border-slate-700">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Address</label>
                  <p className="text-white">{profile.address}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white font-heading">Professional Information</CardTitle>
              <CardDescription className="text-slate-400">Credentials and experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Primary Specialization</label>
                  <p className="text-white flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-amber-500" />
                    {profile.primary_specialization || 'Not specified'}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Experience</label>
                  <p className="text-white flex items-center">
                    <Award className="h-4 w-4 mr-2 text-slate-500" />
                    {profile.experience_years ? `${profile.experience_years} years` : 'Not specified'}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Bar Council Number</label>
                  <p className="text-white flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-slate-500" />
                    {profile.bar_council_number || 'Not provided'}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Firm</label>
                  <p className="text-white flex items-center">
                    <Building className="h-4 w-4 mr-2 text-slate-500" />
                    {profile.firm || 'Independent'}
                  </p>
                </div>
              </div>
              
              {profile.bio && (
                <div className="space-y-1 pt-2 border-t border-slate-700">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Bio</label>
                  <p className="text-slate-300">{profile.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions Card */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white font-heading">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {profile.verification_status === 'PENDING' ? (
                <>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleApprove}
                    disabled={processing}
                  >
                    {processing ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                    )}
                    Approve Application
                  </Button>
                  <Link to={`/admin-portal/lawyers/${id}/reject`} className="block">
                    <Button variant="destructive" className="w-full">
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Application
                    </Button>
                  </Link>
                </>
              ) : profile.verification_status === 'VERIFIED' ? (
                <div className="text-center py-4">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-500" />
                  <p className="text-green-400 font-medium">Application Approved</p>
                  {profile.verified_at && (
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(profile.verified_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <XCircle className="h-12 w-12 mx-auto mb-2 text-red-500" />
                  <p className="text-red-400 font-medium">Application Rejected</p>
                  {profile.rejection_reason && (
                    <p className="text-xs text-slate-400 mt-2">
                      Reason: {profile.rejection_reason}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Application Info */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white font-heading text-sm">Application Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Applied</span>
                <span className="text-white">
                  {new Date(profile.applied_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status</span>
                <span className={`${
                  profile.verification_status === 'VERIFIED' ? 'text-green-400' :
                  profile.verification_status === 'REJECTED' ? 'text-red-400' :
                  'text-amber-400'
                }`}>
                  {profile.verification_status}
                </span>
              </div>
              {profile.verified_by_name && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Reviewed by</span>
                  <span className="text-white">{profile.verified_by_name}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LawyerDetail;