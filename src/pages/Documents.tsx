import { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Search, 
  Filter, 
  MoreVertical,
  Download,
  Trash2,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileCheck,
  X,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UploadDropzone } from '@/components/UploadDropzone';
import { DocumentCard } from '@/components/DocumentCard';
import { useDocuments } from '@/hooks/useApi';

const Documents = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showUpload, setShowUpload] = useState(false);
  
  const { data: documents = [], isLoading, error, refetch } = useDocuments();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'analyzed':
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-accent" />;
      case 'processing':
      case 'pending':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'analyzed':
      case 'completed':
        return 'bg-accent/10 text-accent border-accent/20';
      case 'processing':
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'failed':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-foreground-muted';
    }
  };

  const filteredDocuments = documents.filter((doc: any) => {
    const matchesSearch = doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || doc.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleUploadSuccess = () => {
    setShowUpload(false);
    refetch();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Document Library</h1>
          <p className="text-foreground-muted">Manage and analyze your legal documents</p>
        </div>
        <Button 
          onClick={() => setShowUpload(true)}
          className="gradient-primary"
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-heading font-bold">Upload Legal Document</h2>
              <Button variant="ghost" onClick={() => setShowUpload(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <UploadDropzone onClose={handleUploadSuccess} />
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground-muted" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('all')}
            size="sm"
          >
            All
          </Button>
          <Button
            variant={filterStatus === 'analyzed' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('analyzed')}
            size="sm"
          >
            Analyzed
          </Button>
          <Button
            variant={filterStatus === 'processing' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('processing')}
            size="sm"
          >
            Processing
          </Button>
          <Button
            variant={filterStatus === 'failed' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('failed')}
            size="sm"
          >
            Failed
          </Button>
        </div>
      </div>

      {/* Documents Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading documents...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDocuments.map((document: any) => (
            <DocumentCard key={document.id} document={document} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredDocuments.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="h-12 w-12 text-foreground-muted mx-auto mb-4" />
            <h3 className="text-lg font-heading font-semibold mb-2">No documents found</h3>
            <p className="text-foreground-muted mb-4">
              {searchQuery ? 'Try adjusting your search terms' : 'Upload your first legal document to get started'}
            </p>
            <Button onClick={() => setShowUpload(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Documents;