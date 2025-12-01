import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  Upload, 
  Search,
  Filter,
  MoreVertical,
  FileCheck,
  Clock,
  Shield,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import heroImage from '@/assets/hero-legal.jpg';
import { useDocuments, useLawyers } from '@/hooks/useApi';

const Dashboard = () => {
  const navigate = useNavigate();
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const { data: documents = [], isLoading: docsLoading } = useDocuments();
  const { data: lawyers = [], isLoading: lawyersLoading } = useLawyers();

  // Calculate stats from real data
  const stats = [
    {
      title: "Total Documents",
      value: docsLoading ? "-" : documents.length.toString(),
      change: "+12%",
      icon: FileText,
      color: "text-primary"
    },
    {
      title: "High Risk Items",
      value: docsLoading ? "-" : documents.filter((d: any) => d.risk_level === 'high').length.toString(),
      change: "-8%",
      icon: AlertTriangle,
      color: "text-warning"
    },
    {
      title: "Lawyers Available",
      value: lawyersLoading ? "-" : lawyers.length.toString(),
      change: "+24%",
      icon: Users,
      color: "text-accent"
    },
    {
      title: "Analyzed",
      value: docsLoading ? "-" : documents.filter((d: any) => d.status === 'completed' || d.status === 'analyzed').length.toString(),
      change: "+0.3",
      icon: Shield,
      color: "text-secondary"
    }
  ];

  // Get recent documents (last 3)
  const recentDocuments = documents.slice(0, 3).map((doc: any) => ({
    id: doc.id,
    name: doc.title || doc.name || 'Untitled Document',
    status: doc.status || 'pending',
    riskLevel: doc.risk_level || 'unknown',
    uploadDate: doc.created_at ? new Date(doc.created_at).toLocaleDateString() : '-',
    riskCount: doc.risk_count || 0
  }));

  const handleFileUpload = () => {
    navigate('/app/documents');
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-primary h-64">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-light/90" />
        <div className="relative p-8 h-full flex items-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-heading font-bold text-primary-foreground">
              Legal Document Analyzer
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-2xl">
              AI-powered legal document analysis with risk assessment and compliance checking
            </p>
            <div className="flex gap-4">
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90"
                onClick={handleFileUpload}
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload Document
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary"
                onClick={() => navigate('/app/lawyers')}
              >
                Find Lawyers
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <Card className="animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Uploading document...</span>
              <span className="text-sm text-foreground-muted">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground-muted">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-heading font-bold">{stat.value}</div>
              <p className="text-xs text-foreground-muted">
                <span className={stat.change.startsWith('+') ? 'text-accent' : 'text-destructive'}>
                  {stat.change}
                </span>
                {" "}from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Documents */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-heading">Recent Documents</CardTitle>
                  <CardDescription>
                    Latest uploaded legal documents and their analysis status
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {docsLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : recentDocuments.length === 0 ? (
                <div className="text-center py-8 text-foreground-muted">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No documents yet. Upload your first document to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-surface-alt transition-smooth">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium font-heading">{doc.name}</h4>
                          <div className="flex items-center space-x-2 text-sm text-foreground-muted">
                            <Clock className="h-3 w-3" />
                            <span>{doc.uploadDate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge 
                          className={`risk-${doc.riskLevel} border-0`}
                        >
                          {doc.riskCount} risks
                        </Badge>
                        <Badge 
                          variant={doc.status === 'analyzed' || doc.status === 'completed' ? 'default' : 'secondary'}
                          className="capitalize"
                        >
                          {doc.status === 'analyzed' || doc.status === 'completed' ? <FileCheck className="mr-1 h-3 w-3" /> : <Clock className="mr-1 h-3 w-3" />}
                          {doc.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Risk Summary */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start gradient-primary" onClick={() => navigate('/app/documents')}>
                <Upload className="mr-2 h-4 w-4" />
                Upload New Document
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/app/lawyers')}>
                <Search className="mr-2 h-4 w-4" />
                Find Lawyer
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/app/updates')}>
                <TrendingUp className="mr-2 h-4 w-4" />
                View Legal Updates
              </Button>
            </CardContent>
          </Card>

          {/* Risk Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Risk Overview</CardTitle>
              <CardDescription>Document risk distribution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center">
                    <div className="w-3 h-3 bg-destructive rounded-full mr-2"></div>
                    High Risk
                  </span>
                  <span>{docsLoading ? '-' : documents.filter((d: any) => d.risk_level === 'high').length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center">
                    <div className="w-3 h-3 bg-warning rounded-full mr-2"></div>
                    Medium Risk
                  </span>
                  <span>{docsLoading ? '-' : documents.filter((d: any) => d.risk_level === 'medium').length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center">
                    <div className="w-3 h-3 bg-accent rounded-full mr-2"></div>
                    Low Risk
                  </span>
                  <span>{docsLoading ? '-' : documents.filter((d: any) => d.risk_level === 'low').length}</span>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="text-2xl font-bold font-heading">{documents.length}</div>
                <p className="text-sm text-foreground-muted">Total Documents</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;