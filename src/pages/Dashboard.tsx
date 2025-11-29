import { useState } from 'react';
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
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import heroImage from '@/assets/hero-legal.jpg';

const Dashboard = () => {
  const [uploadProgress, setUploadProgress] = useState(0);

  // Mock data
  const stats = [
    {
      title: "Total Documents",
      value: "247",
      change: "+12%",
      icon: FileText,
      color: "text-primary"
    },
    {
      title: "High Risk Items",
      value: "23",
      change: "-8%",
      icon: AlertTriangle,
      color: "text-warning"
    },
    {
      title: "Lawyers Connected",
      value: "156",
      change: "+24%",
      icon: Users,
      color: "text-accent"
    },
    {
      title: "Risk Score",
      value: "7.2/10",
      change: "+0.3",
      icon: Shield,
      color: "text-secondary"
    }
  ];

  const recentDocuments = [
    {
      id: 1,
      name: "Employment Agreement - Tech Corp",
      status: "analyzed",
      riskLevel: "medium",
      uploadDate: "2024-01-15",
      riskCount: 3
    },
    {
      id: 2,
      name: "Service Contract - Marketing Agency",
      status: "processing",
      riskLevel: "high",
      uploadDate: "2024-01-14",
      riskCount: 7
    },
    {
      id: 3,
      name: "Non-Disclosure Agreement",
      status: "analyzed",
      riskLevel: "low",
      uploadDate: "2024-01-13",
      riskCount: 1
    }
  ];

  const handleFileUpload = () => {
    // Simulate file upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
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
              >
                View Demo
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
                        variant={doc.status === 'analyzed' ? 'default' : 'secondary'}
                        className="capitalize"
                      >
                        {doc.status === 'analyzed' ? <FileCheck className="mr-1 h-3 w-3" /> : <Clock className="mr-1 h-3 w-3" />}
                        {doc.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
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
              <Button className="w-full justify-start gradient-primary">
                <Upload className="mr-2 h-4 w-4" />
                Upload New Document
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Search className="mr-2 h-4 w-4" />
                Find Lawyer
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Analytics
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
                  <span>23</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center">
                    <div className="w-3 h-3 bg-warning rounded-full mr-2"></div>
                    Medium Risk
                  </span>
                  <span>67</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center">
                    <div className="w-3 h-3 bg-accent rounded-full mr-2"></div>
                    Low Risk
                  </span>
                  <span>157</span>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="text-2xl font-bold font-heading">7.2/10</div>
                <p className="text-sm text-foreground-muted">Average Risk Score</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;