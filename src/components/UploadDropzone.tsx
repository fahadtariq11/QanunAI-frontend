import { useState, useRef } from 'react';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface UploadDropzoneProps {
  onClose?: () => void;
}

export const UploadDropzone = ({ onClose }: UploadDropzoneProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setIsCompleted(true);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isCompleted) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-accent" />
        </div>
        <h3 className="text-xl font-heading font-semibold mb-2">Upload Successful!</h3>
        <p className="text-foreground-muted mb-6">
          Your document "{uploadedFile?.name}" has been uploaded and analysis has started.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={onClose}>
            View Documents
          </Button>
          <Button variant="outline" onClick={() => {
            setIsCompleted(false);
            setUploadedFile(null);
            setUploadProgress(0);
          }}>
            Upload Another
          </Button>
        </div>
      </div>
    );
  }

  if (isUploading && uploadedFile) {
    return (
      <div className="py-8 animate-fade-in">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-heading font-semibold mb-1">Uploading Document</h3>
          <p className="text-sm text-foreground-muted">{uploadedFile.name}</p>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-foreground-muted">Size:</span>
              <span className="ml-2 font-medium">{formatFileSize(uploadedFile.size)}</span>
            </div>
            <div>
              <span className="text-foreground-muted">Type:</span>
              <span className="ml-2 font-medium">{uploadedFile.type || 'PDF'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <div
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer",
          isDragOver 
            ? "border-primary bg-primary/5 scale-105" 
            : "border-border hover:border-primary/50 hover:bg-primary/5"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Upload className="h-8 w-8 text-primary" />
        </div>
        
        <h3 className="text-lg font-heading font-semibold mb-2">
          Drop your legal document here
        </h3>
        <p className="text-foreground-muted mb-4">
          or click to browse files
        </p>
        
        <div className="text-sm text-foreground-muted">
          Supports: PDF, DOC, DOCX • Max size: 10MB
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Additional Options */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-foreground-muted">Analysis Options:</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <label className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
            <input type="checkbox" defaultChecked className="rounded" />
            <span className="text-sm">Risk Assessment</span>
          </label>
          <label className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
            <input type="checkbox" defaultChecked className="rounded" />
            <span className="text-sm">Compliance Check</span>
          </label>
          <label className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
            <input type="checkbox" className="rounded" />
            <span className="text-sm">Generate Summary</span>
          </label>
          <label className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
            <input type="checkbox" className="rounded" />
            <span className="text-sm">Extract Key Terms</span>
          </label>
        </div>
      </div>
    </div>
  );
};