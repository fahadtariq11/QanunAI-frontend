import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CheckCircle, AlertTriangle, Loader2, UserX } from "lucide-react";
import { useLawyerConsultations, useMyLawyerProfile } from "@/hooks/useApi";
import { useNavigate } from "react-router-dom";

const LawyerDashboard = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading, error: profileError } = useMyLawyerProfile();
  const { data: consultations = [], isLoading: consultationsLoading } = useLawyerConsultations();

  // Calculate stats from real data
  const pendingCount = consultations.filter((c: any) => c.status === 'pending').length;
  const inProgressCount = consultations.filter((c: any) => c.status === 'in-progress').length;
  const completedCount = consultations.filter((c: any) => c.status === 'completed').length;

  const stats = [
    {
      title: "Pending Consultations",
      value: consultationsLoading ? "-" : pendingCount.toString(),
      icon: Clock,
      description: "Awaiting your response",
      color: "text-yellow-600",
    },
    {
      title: "In Progress",
      value: consultationsLoading ? "-" : inProgressCount.toString(),
      icon: Calendar,
      description: "Currently active",
      color: "text-blue-600",
    },
    {
      title: "Completed Consultations",
      value: consultationsLoading ? "-" : completedCount.toString(),
      icon: CheckCircle,
      description: "All time",
      color: "text-green-600",
    },
  ];

  // Get recent consultation requests (last 5)
  const recentRequests = consultations.slice(0, 5).map((c: any) => ({
    id: c.id,
    userName: c.user_name || c.user?.full_name || 'Unknown User',
    documentTitle: c.document_title || 'No document',
    riskLevel: c.risk_level || 'medium',
    requestedDate: c.requested_at || c.created_at,
    status: c.status,
  }));

  const getRiskBadge = (risk: string) => {
    const variants: Record<string, { variant: "destructive" | "default" | "secondary"; label: string }> = {
      high: { variant: "destructive", label: "High Risk" },
      medium: { variant: "default", label: "Medium Risk" },
      low: { variant: "secondary", label: "Low Risk" },
    };
    const config = variants[risk] || variants.medium;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; label: string }> = {
      pending: { className: "bg-yellow-100 text-yellow-800", label: "Pending" },
      "in-progress": { className: "bg-blue-100 text-blue-800", label: "In Progress" },
      completed: { className: "bg-green-100 text-green-800", label: "Completed" },
    };
    const config = variants[status] || variants.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  // If profile doesn't exist, show setup prompt
  if (!profileLoading && profileError) {
    return (
      <div className="p-6 space-y-6">
        <Card className="text-center py-12">
          <CardContent>
            <UserX className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Complete Your Profile</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              You haven't set up your lawyer profile yet. Complete your profile to appear in the lawyer directory and receive consultation requests.
            </p>
            <Button onClick={() => navigate('/lawyer/profile')} size="lg">
              Set Up Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (profileLoading || consultationsLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}! Here's your consultation overview.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Consultation Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Consultation Requests</CardTitle>
          <CardDescription>Latest requests from clients needing your expertise</CardDescription>
        </CardHeader>
        <CardContent>
          {recentRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No consultation requests yet.</p>
              <p className="text-sm">They will appear here when clients request your services.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Name</TableHead>
                  <TableHead>Document Title</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Requested Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentRequests.map((request: any) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.userName}</TableCell>
                    <TableCell>{request.documentTitle}</TableCell>
                    <TableCell>{getRiskBadge(request.riskLevel)}</TableCell>
                    <TableCell>{new Date(request.requestedDate).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => navigate('/lawyer/consultations')}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LawyerDashboard;
