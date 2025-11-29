import { 
  FileText, 
  MoreVertical,
  Download,
  Trash2,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  HardDrive
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface Document {
  id: number;
  name: string;
  uploadDate: string;
  status: string;
  riskLevel: string;
  riskCount: number;
  fileSize: string;
  pages: number;
  summary: string;
}

interface DocumentCardProps {
  document: Document;
}

export const DocumentCard = ({ document }: DocumentCardProps) => {
  const navigate = useNavigate();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'analyzed':
        return <CheckCircle className="h-4 w-4 text-accent" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-warning animate-spin" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'analyzed':
        return 'bg-accent/10 text-accent border-accent/20';
      case 'processing':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'failed':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-foreground-muted';
    }
  };

  const getRiskBadgeClass = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return 'risk-high';
      case 'medium':
        return 'risk-medium';
      case 'low':
        return 'risk-low';
      default:
        return 'bg-muted text-foreground-muted';
    }
  };

  return (
    <Card className="hover-lift transition-smooth">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="font-heading text-base truncate">
                {document.name}
              </CardTitle>
              <div className="flex items-center space-x-4 text-xs text-foreground-muted mt-1">
                <span className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {document.uploadDate}
                </span>
                <span className="flex items-center">
                  <HardDrive className="h-3 w-3 mr-1" />
                  {document.fileSize}
                </span>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View Document
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Status and Risk Badges */}
        <div className="flex items-center justify-between">
          <Badge className={cn("text-xs", getStatusColor(document.status))}>
            {getStatusIcon(document.status)}
            <span className="ml-1 capitalize">{document.status}</span>
          </Badge>
          
          {document.status === 'analyzed' && (
            <Badge className={cn("text-xs", getRiskBadgeClass(document.riskLevel))}>
              {document.riskCount} risks
            </Badge>
          )}
        </div>

        {/* Document Info */}
        {document.pages > 0 && (
          <div className="text-sm text-foreground-muted">
            {document.pages} pages
          </div>
        )}

        {/* Summary */}
        <CardDescription className="text-sm leading-relaxed">
          {document.summary}
        </CardDescription>

        {/* Action Button */}
        <div className="pt-2">
          {document.status === 'analyzed' ? (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => navigate(`/app/documents/${document.id}`)}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Analysis
            </Button>
          ) : document.status === 'processing' ? (
            <Button variant="outline" size="sm" className="w-full" disabled>
              <Clock className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </Button>
          ) : document.status === 'failed' ? (
            <Button variant="outline" size="sm" className="w-full">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Retry Analysis
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="w-full">
              <FileText className="mr-2 h-4 w-4" />
              View Document
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};