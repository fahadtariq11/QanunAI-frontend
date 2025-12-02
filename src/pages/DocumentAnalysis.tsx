import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Download,
  Calendar,
  HardDrive,
  Shield,
  Scale,
  Clock,
  Send,
  Sparkles,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useDocument, useDocumentAnalysis, useChatAboutDocument, useAnalyzeDocumentAI } from '@/hooks/useApi';

// Message type for chat
type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  type: string;
  source: string;
};

const DocumentAnalysis = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messageInput, setMessageInput] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  // Fetch document and analysis data
  const documentId = id ? parseInt(id) : 0;
  const { data: document, isLoading: docLoading } = useDocument(documentId);
  const { data: analysisData, isLoading: analysisLoading, error: analysisError, refetch: refetchAnalysis } = useDocumentAnalysis(documentId);
  const chatMutation = useChatAboutDocument();
  const analyzeMutation = useAnalyzeDocumentAI();
  
  const isLoading = docLoading || analysisLoading;
  
  // Transform API data to match the UI format
// Transform API data to match the UI format
const analysis = analysisData ? {
  id: analysisData.id,
  name: document?.name || document?.title || 'Document',
  uploadDate: document?.uploaded_at ? new Date(document.uploaded_at).toLocaleDateString() : 'N/A',
  status: 'analyzed',
  riskLevel: analysisData.risk_level,
  riskCount: Array.isArray(analysisData.key_findings)
    ? analysisData.key_findings.length
    : (analysisData.risk_count ?? 0),
  // Backend already provides a human-readable size like "1.5 MB"
  fileSize: document?.file_size || 'N/A',
  // Backend uses `pages`
  pages: document?.pages ?? 'N/A',
  summary: analysisData.summary,
  // Backend field is `overall_risk_score` (0–100, often as string). Normalize to 0–10.
  overallRiskScore: analysisData.overall_risk_score != null
    ? Number(analysisData.overall_risk_score) / 10
    : null,
  keyFindings: analysisData.key_findings ?? [],
  // Coerce metrics to numbers (backend typically 0–100)
  documentMetrics: {
    clarity: Number(analysisData.document_metrics?.clarity ?? 0),
    fairness: Number(analysisData.document_metrics?.fairness ?? 0),
    completeness: Number(analysisData.document_metrics?.completeness ?? 0),
    complexity: Number(analysisData.document_metrics?.complexity ?? 0),
  },
  keyTerms: analysisData.key_terms ?? []
} : null;

  // Chat messages for the assistant - context-aware initial message
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  // Set initial message when document loads
  useEffect(() => {
    if (analysis) {
      setMessages([{
        role: 'assistant',
        content: `Hello! I've analyzed "${analysis.name}" and found it has a ${analysis.riskLevel.toUpperCase()} risk level with ${analysis.riskCount} potential issues. I can help you understand any part of this document. What would you like to know?`,
        type: 'Document QA',
        source: 'Document'
      }]);
    }
  }, [analysis?.name, analysis?.riskLevel, analysis?.riskCount]);

  const suggestionChips = [
    'Give me a summary',
    'What are the main risks?',
    'Explain the key clauses',
    'Is this agreement safe for me?'
  ];

  // Real API call to chat about the document
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !documentId) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: messageInput,
      type: 'User Query',
      source: 'User'
    };

    // Add user message
    setMessages(prev => [...prev, userMessage]);
    const currentMessage = messageInput;
    setMessageInput('');

    try {
      const response = await chatMutation.mutateAsync({
        documentId,
        message: currentMessage,
        sessionId: sessionId || undefined
      });
      
      // Store session ID for conversation continuity
      if (response.session_id) {
        setSessionId(response.session_id);
      }
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.content,
        type: response.type || 'General QA',
        source: response.source || 'Document'
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        type: 'Error',
        source: 'System'
      };
      setMessages(prev => [...prev, assistantMessage]);
    }
  };

  const handleReanalyze = async () => {
    if (!documentId) return;
    try {
      await analyzeMutation.mutateAsync({ documentId, force: true });
      refetchAnalysis();
    } catch (error) {
      console.error('Re-analysis failed:', error);
    }
  };

  const handleStartAnalysis = async () => {
    if (!documentId) return;
    try {
      await analyzeMutation.mutateAsync({ documentId, force: false });
      refetchAnalysis();
    } catch (error) {
      console.error('Analysis failed:', error);
    }
  };

  const handleExportPDF = () => {
    if (!analysis) return;
    
    // Create a printable HTML content
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Document Analysis Report - ${analysis.name}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
          h1 { color: #1a1a2e; border-bottom: 2px solid #4361ee; padding-bottom: 10px; }
          h2 { color: #4361ee; margin-top: 30px; }
          .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .meta { color: #666; font-size: 14px; }
          .risk-badge { display: inline-block; padding: 4px 12px; border-radius: 4px; font-weight: bold; }
          .risk-high { background: #fee2e2; color: #dc2626; }
          .risk-medium { background: #fef3c7; color: #d97706; }
          .risk-low { background: #d1fae5; color: #059669; }
          .summary { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .finding { border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; margin: 10px 0; }
          .finding-title { font-weight: bold; margin-bottom: 5px; }
          .finding-severity { font-size: 12px; padding: 2px 8px; border-radius: 4px; }
          .recommendation { background: #eff6ff; padding: 10px; border-left: 3px solid #4361ee; margin-top: 10px; }
          .metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 20px 0; }
          .metric { text-align: center; padding: 15px; background: #f8fafc; border-radius: 8px; }
          .metric-value { font-size: 24px; font-weight: bold; color: #4361ee; }
          .metric-label { font-size: 12px; color: #666; }
          .key-terms { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .term { background: #f8fafc; padding: 10px; border-radius: 4px; }
          .term-label { font-size: 12px; color: #666; }
          .term-value { font-weight: bold; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #666; font-size: 12px; text-align: center; }
        </style>
      </head>
      <body>
        <h1>📄 Document Analysis Report</h1>
        <div class="header">
          <div>
            <strong>${analysis.name}</strong><br>
            <span class="meta">Analyzed on: ${new Date().toLocaleDateString()}</span>
          </div>
          <div>
            <span class="risk-badge risk-${analysis.riskLevel}">${analysis.riskLevel.toUpperCase()} RISK</span>
          </div>
        </div>

        <h2>📊 Summary</h2>
        <div class="summary">
          <p>${analysis.summary}</p>
        </div>

        <h2>📈 Document Metrics</h2>
        <div class="metrics">
          <div class="metric">
            <div class="metric-value">${analysis.overallRiskScore}/10</div>
            <div class="metric-label">Risk Score</div>
          </div>
          <div class="metric">
            <div class="metric-value">${Math.round(analysis.documentMetrics.clarity * 10)}/10</div>
            <div class="metric-label">Clarity</div>
          </div>
          <div class="metric">
            <div class="metric-value">${Math.round(analysis.documentMetrics.fairness * 10)}/10</div>
            <div class="metric-label">Fairness</div>
          </div>
          <div class="metric">
            <div class="metric-value">${Math.round(analysis.documentMetrics.completeness * 10)}/10</div>
            <div class="metric-label">Completeness</div>
          </div>
        </div>

        <h2>⚠️ Key Findings (${analysis.keyFindings.length})</h2>
        ${analysis.keyFindings.map((f: any) => `
          <div class="finding">
            <div class="finding-title">
              ${f.title}
              <span class="finding-severity risk-${f.severity.toLowerCase()}">${f.severity}</span>
            </div>
            <p>${f.description}</p>
            <div class="recommendation">
              <strong>💡 Recommendation:</strong> ${f.recommendation}
            </div>
          </div>
        `).join('')}

        <h2>📋 Key Terms</h2>
        <div class="key-terms">
          ${analysis.keyTerms.map((t: any) => `
            <div class="term">
              <div class="term-label">${t.term}</div>
              <div class="term-value">${t.value}</div>
            </div>
          `).join('')}
        </div>

        <div class="footer">
          Generated by QanunAI - Legal Document Analysis Platform<br>
          ${new Date().toLocaleString()}
        </div>
      </body>
      </html>
    `;

    // Open print dialog
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/app/documents')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Documents
        </Button>
        <Card className="text-center py-12">
          <CardContent>
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <h3 className="text-lg font-heading font-semibold mb-2">Loading Analysis...</h3>
            <p className="text-foreground-muted">
              Please wait while we load the document analysis.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error or not found state
  if (!analysis || analysisError) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/app/documents')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Documents
        </Button>
        <Card className="text-center py-12">
          <CardContent>
            <AlertTriangle className="h-12 w-12 text-warning mx-auto mb-4" />
            <h3 className="text-lg font-heading font-semibold mb-2">
              {document ? 'Analysis Not Ready' : 'Document Not Found'}
            </h3>
            <p className="text-foreground-muted mb-4">
              {document 
                ? 'This document hasn\'t been analyzed yet. Click below to start AI analysis.'
                : 'This document doesn\'t exist or you don\'t have access to it.'
              }
            </p>
            {document ? (
              <Button 
                onClick={handleStartAnalysis}
                disabled={analyzeMutation.isPending}
              >
                {analyzeMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Start AI Analysis
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={() => navigate('/app/documents')}>
                Back to Documents
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

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

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
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

  const getMetricColor = (score: number) => {
    if (score >= 8) return 'text-accent';
    if (score >= 6) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Button variant="ghost" onClick={() => navigate('/app/documents')} className="w-fit">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Documents
        </Button>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold">{analysis.name}</h1>
                <div className="flex items-center gap-4 text-sm text-foreground-muted mt-1">
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {analysis.uploadDate}
                  </span>
                  <span className="flex items-center">
                    <HardDrive className="h-3 w-3 mr-1" />
                    {analysis.fileSize}
                  </span>
                  <span>{analysis.pages} pages</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={handleReanalyze}
              disabled={analyzeMutation.isPending}
            >
              {analyzeMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Re-analyze
            </Button>
            <Button variant="outline" onClick={handleExportPDF}>
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column - Analysis Tabs */}
        <div className="w-full lg:flex-1 lg:max-w-[65%] min-w-0">
          <Tabs defaultValue="analysis" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="assistant" className="lg:hidden">
                <Sparkles className="h-4 w-4 mr-2" />
                Assistant
              </TabsTrigger>
            </TabsList>

            {/* Analysis Tab */}
            <TabsContent value="analysis" className="space-y-6 mt-6">
          {/* Summary Section */}
          <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Analysis Overview</span>
            <Badge className={cn("text-sm", getRiskBadgeClass(analysis.riskLevel))}>
              {analysis.riskCount} risks identified
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground-muted leading-relaxed">{analysis.summary}</p>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 bg-muted/50 rounded-lg">
            <div className="text-center flex-shrink-0">
              <div className={cn(
                "text-3xl font-bold",
                typeof analysis.overallRiskScore === 'number'
                  ? getMetricColor(10 - analysis.overallRiskScore)
                  : 'text-foreground-muted'
              )}>
                {typeof analysis.overallRiskScore === 'number' ? `${analysis.overallRiskScore}/10` : 'N/A'}
              </div>
              <div className="text-xs text-foreground-muted mt-1">Overall Risk</div>
            </div>
            <Separator orientation="vertical" className="h-12 hidden sm:block" />
            <Separator orientation="horizontal" className="w-full sm:hidden" />
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
              <div>
                <div className={cn(
                  "text-xl font-semibold",
                  typeof analysis.documentMetrics?.clarity === 'number'
                    ? getMetricColor(analysis.documentMetrics.clarity)
                    : 'text-foreground-muted'
                )}>
                  {typeof analysis.documentMetrics?.clarity === 'number' ? analysis.documentMetrics.clarity : '—'}
                </div>
                <div className="text-xs text-foreground-muted">Clarity</div>
              </div>
              <div>
                <div className={cn(
                  "text-xl font-semibold",
                  typeof analysis.documentMetrics?.fairness === 'number'
                    ? getMetricColor(analysis.documentMetrics.fairness)
                    : 'text-foreground-muted'
                )}>
                  {typeof analysis.documentMetrics?.fairness === 'number' ? analysis.documentMetrics.fairness : '—'}
                </div>
                <div className="text-xs text-foreground-muted">Fairness</div>
              </div>
              <div>
                <div className={cn(
                  "text-xl font-semibold",
                  typeof analysis.documentMetrics?.completeness === 'number'
                    ? getMetricColor(analysis.documentMetrics.completeness)
                    : 'text-foreground-muted'
                )}>
                  {typeof analysis.documentMetrics?.completeness === 'number' ? analysis.documentMetrics.completeness : '—'}
                </div>
                <div className="text-xs text-foreground-muted">Complete</div>
              </div>
              <div>
                <div className={cn(
                  "text-xl font-semibold",
                  typeof analysis.documentMetrics?.complexity === 'number'
                    ? getMetricColor(10 - analysis.documentMetrics.complexity)
                    : 'text-foreground-muted'
                )}>
                  {typeof analysis.documentMetrics?.complexity === 'number' ? 10 - analysis.documentMetrics.complexity : '—'}
                </div>
                <div className="text-xs text-foreground-muted">Simplicity</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Findings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Key Findings & Recommendations
          </CardTitle>
          <CardDescription>
            Critical clauses and potential risk areas identified in the document
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {analysis.keyFindings.map((finding: any, index: number) => (
            <div key={index} className="p-4 border border-border rounded-lg space-y-3 hover-lift transition-smooth">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-heading font-semibold">{finding.title}</h4>
                  <Badge className={cn("text-xs", getSeverityBadgeClass(finding.severity))}>
                    {finding.severity}
                  </Badge>
                </div>
                <p className="text-sm text-foreground-muted">{finding.description}</p>
              </div>
              
              <div className="pl-4 border-l-2 border-accent">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-accent mb-1">Recommendation</div>
                    <p className="text-sm">{finding.recommendation}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Key Terms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            Key Terms & Conditions
          </CardTitle>
          <CardDescription>
            Important terms and provisions extracted from the document
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {analysis.keyTerms.map((item: any, index: number) => (
              <div key={index} className="p-4 bg-muted/50 rounded-lg">
                <div className="text-xs text-foreground-muted mb-1">{item.term}</div>
                <div className="font-semibold break-words">{item.value}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-accent" />
                Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <div className="p-1 bg-accent/10 rounded mt-0.5">
                    <Shield className="h-3 w-3 text-accent" />
                  </div>
                  <span className="text-sm">Review all identified risk areas with your legal counsel</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="p-1 bg-accent/10 rounded mt-0.5">
                    <Scale className="h-3 w-3 text-accent" />
                  </div>
                  <span className="text-sm">Consider negotiating terms flagged as medium or high severity</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="p-1 bg-accent/10 rounded mt-0.5">
                    <Clock className="h-3 w-3 text-accent" />
                  </div>
                  <span className="text-sm">Request clarification on any ambiguous clauses before signing</span>
                </li>
              </ul>
            </CardContent>
          </Card>
            </TabsContent>

            {/* Assistant Tab (Mobile Only) */}
            <TabsContent value="assistant" className="mt-6 lg:hidden">
          <div className="flex flex-col h-[calc(100vh-280px)]">
            {/* Header */}
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Ask About This Contract
                </CardTitle>
                <CardDescription>
                  The assistant knows this document's clauses, risks and legal references. Ask in simple language.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Suggestion Chips */}
                <div className="flex flex-wrap gap-2">
                  {suggestionChips.map((chip, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-sm"
                      onClick={() => {
                        setMessageInput(chip);
                        // Auto-send after setting the chip message
                        setTimeout(() => {
                          handleSendMessage();
                        }, 100);
                      }}
                    >
                      {chip}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Chat Messages */}
            <Card className="flex-1 flex flex-col mb-4">
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex",
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      <Card
                        className={cn(
                          "max-w-[80%]",
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        )}
                      >
                        {message.role === 'assistant' && (
                          <CardHeader className="pb-2">
                            <Badge variant="outline" className="w-fit text-xs">
                              {message.type}
                            </Badge>
                          </CardHeader>
                        )}
                        <CardContent className={cn(message.role === 'assistant' ? 'pt-2' : 'p-4')}>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          {message.role === 'assistant' && (
                            <div className="mt-3 pt-3 border-t border-border">
                              <p className="text-xs text-foreground-muted">
                                Source: {message.source}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>

            {/* Input Bar */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Ask anything about this contract…"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="min-h-[60px] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button 
                    size="icon" 
                    className="h-[60px] w-[60px] flex-shrink-0"
                    onClick={handleSendMessage}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Compact Assistant Panel (Desktop Only) */}
        <div className="hidden lg:block lg:w-[35%] lg:max-w-[400px] flex-shrink-0">
          <Card className="sticky top-6 flex flex-col h-[calc(100vh-200px)]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Assistant
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    Ask quick questions about this document
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const tabTrigger = document.querySelector('[value="assistant"]') as HTMLElement;
                    tabTrigger?.click();
                  }}
                  className="text-xs"
                >
                  Open full →
                </Button>
              </div>
            </CardHeader>

            <Separator />

            {/* Recent Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {messages.slice(-3).map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex",
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[90%] rounded-lg p-3 text-xs",
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      )}
                    >
                      {message.role === 'assistant' && (
                        <Badge variant="outline" className="mb-2 text-[10px] h-5">
                          {message.type}
                        </Badge>
                      )}
                      <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <Separator />

            {/* Quick Input */}
            <CardContent className="p-3">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Ask a quick question..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="min-h-[50px] text-sm resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button 
                  size="icon" 
                  className="h-[50px] w-[50px] flex-shrink-0"
                  onClick={handleSendMessage}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DocumentAnalysis;
