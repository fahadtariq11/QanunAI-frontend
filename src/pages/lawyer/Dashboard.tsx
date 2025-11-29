import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CheckCircle, AlertTriangle } from "lucide-react";

const LawyerDashboard = () => {
  const stats = [
    {
      title: "Pending Consultations",
      value: "8",
      icon: Clock,
      description: "Awaiting your response",
      color: "text-yellow-600",
    },
    {
      title: "Upcoming Consultations",
      value: "5",
      icon: Calendar,
      description: "Scheduled this week",
      color: "text-blue-600",
    },
    {
      title: "Completed Consultations",
      value: "42",
      icon: CheckCircle,
      description: "This month",
      color: "text-green-600",
    },
  ];

  const recentRequests = [
    {
      id: "1",
      userName: "Sarah Johnson",
      documentTitle: "Employment Agreement",
      riskLevel: "high",
      requestedDate: "2024-01-20",
      status: "pending",
    },
    {
      id: "2",
      userName: "Michael Chen",
      documentTitle: "NDA Contract",
      riskLevel: "medium",
      requestedDate: "2024-01-19",
      status: "pending",
    },
    {
      id: "3",
      userName: "Emily Rodriguez",
      documentTitle: "Partnership Agreement",
      riskLevel: "high",
      requestedDate: "2024-01-18",
      status: "in-progress",
    },
    {
      id: "4",
      userName: "David Kim",
      documentTitle: "Service Agreement",
      riskLevel: "low",
      requestedDate: "2024-01-17",
      status: "completed",
    },
    {
      id: "5",
      userName: "Lisa Thompson",
      documentTitle: "Lease Agreement",
      riskLevel: "medium",
      requestedDate: "2024-01-16",
      status: "completed",
    },
  ];

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

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back! Here's your consultation overview.</p>
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
              {recentRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.userName}</TableCell>
                  <TableCell>{request.documentTitle}</TableCell>
                  <TableCell>{getRiskBadge(request.riskLevel)}</TableCell>
                  <TableCell>{new Date(request.requestedDate).toLocaleDateString()}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default LawyerDashboard;
