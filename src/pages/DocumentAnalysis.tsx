import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { 
  ArrowLeft, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Download,
  Share2,
  Calendar,
  HardDrive,
  TrendingUp,
  Shield,
  Scale,
  Clock,
  Send,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

// Message type for chat
type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  type: string;
  source: string;
};

// Mock analysis data structure
const analysisData: Record<string, any> = {
  "1": {
    id: 1,
    name: "Employment Agreement - Tech Corp.pdf",
    uploadDate: "2024-01-15",
    status: "analyzed",
    riskLevel: "medium",
    riskCount: 3,
    fileSize: "2.4 MB",
    pages: 12,
    summary: "Standard employment contract with moderate risk clauses around termination and intellectual property.",
    overallRiskScore: 6.5,
    keyFindings: [
      {
        title: "Intellectual Property Assignment",
        severity: "medium",
        description: "Broad intellectual property assignment clause may extend beyond work scope.",
        recommendation: "Consider negotiating limitations to work-related IP only.",
        clause: "Section 4.2"
      },
      {
        title: "Non-Compete Duration",
        severity: "medium",
        description: "12-month non-compete period may be excessive depending on jurisdiction.",
        recommendation: "Review local enforceability and negotiate shorter period if possible.",
        clause: "Section 7.1"
      },
      {
        title: "At-Will Employment Terms",
        severity: "low",
        description: "Standard at-will employment language with limited termination notice.",
        recommendation: "Request additional notice period or severance terms.",
        clause: "Section 3.3"
      }
    ],
    documentMetrics: {
      clarity: 8.2,
      fairness: 7.5,
      completeness: 9.1,
      complexity: 6.8
    },
    keyTerms: [
      { term: "Base Salary", value: "$120,000 annually" },
      { term: "Notice Period", value: "30 days" },
      { term: "Non-Compete Duration", value: "12 months" },
      { term: "Benefits Start", value: "First day of employment" }
    ]
  },
  "3": {
    id: 3,
    name: "Non-Disclosure Agreement.pdf",
    uploadDate: "2024-01-13",
    status: "analyzed",
    riskLevel: "low",
    riskCount: 1,
    fileSize: "856 KB",
    pages: 3,
    summary: "Standard NDA with minimal risk factors.",
    overallRiskScore: 2.8,
    keyFindings: [
      {
        title: "Confidentiality Term Duration",
        severity: "low",
        description: "5-year confidentiality term is standard for this type of agreement.",
        recommendation: "Term is reasonable and industry-standard.",
        clause: "Section 2.1"
      }
    ],
    documentMetrics: {
      clarity: 9.5,
      fairness: 9.2,
      completeness: 8.8,
      complexity: 3.2
    },
    keyTerms: [
      { term: "Confidentiality Period", value: "5 years" },
      { term: "Permitted Disclosures", value: "Legal requirements only" },
      { term: "Remedies", value: "Injunctive relief + damages" },
      { term: "Governing Law", value: "State of Delaware" }
    ]
  },
  "4": {
    id: 4,
    name: "Lease Agreement - Office Space.pdf",
    uploadDate: "2024-01-12",
    status: "analyzed",
    riskLevel: "medium",
    riskCount: 4,
    fileSize: "3.2 MB",
    pages: 15,
    summary: "Commercial lease with moderate risk clauses in maintenance and termination sections.",
    overallRiskScore: 6.8,
    keyFindings: [
      {
        title: "Triple Net Lease Structure",
        severity: "medium",
        description: "Tenant responsible for all operating expenses including property taxes, insurance, and maintenance.",
        recommendation: "Request cap on annual expense increases and detailed breakdown of common area charges.",
        clause: "Section 5.1-5.3"
      },
      {
        title: "Personal Guarantee Required",
        severity: "high",
        description: "Unlimited personal guarantee from business owners required for lease obligations.",
        recommendation: "Negotiate limited guarantee or phase-out after 12-24 months of timely payments.",
        clause: "Section 12.4"
      },
      {
        title: "Maintenance Responsibilities",
        severity: "medium",
        description: "Tenant responsible for all repairs including structural elements typically covered by landlord.",
        recommendation: "Negotiate to limit tenant responsibility to non-structural interior maintenance only.",
        clause: "Section 8.2"
      },
      {
        title: "Early Termination Penalty",
        severity: "medium",
        description: "Significant penalty (12 months rent) for early termination without force majeure exception.",
        recommendation: "Add force majeure clause and negotiate lower penalty after initial term.",
        clause: "Section 11.6"
      }
    ],
    documentMetrics: {
      clarity: 7.8,
      fairness: 6.5,
      completeness: 8.9,
      complexity: 7.5
    },
    keyTerms: [
      { term: "Monthly Base Rent", value: "$8,500 + operating expenses" },
      { term: "Lease Term", value: "5 years with 5-year option" },
      { term: "Security Deposit", value: "3 months rent ($25,500)" },
      { term: "Permitted Use", value: "General office purposes" }
    ]
  }
};

const DocumentAnalysis = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messageInput, setMessageInput] = useState('');
  
  const analysis = id ? analysisData[id] : null;

  // Mock chat messages for the assistant
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'ve analyzed this document and I\'m ready to answer any questions. How can I help you understand this contract better?',
      type: 'General QA',
      source: 'Document'
    }
  ]);

  const suggestionChips = [
    'Give me a summary',
    'What are the main risks?',
    'Explain the termination clause',
    'Is this agreement safe for me?'
  ];

  // TODO: Replace this with actual API call to /documents/:id/chat
  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: messageInput,
      type: 'User Query',
      source: 'User'
    };

    // Add user message
    setMessages(prev => [...prev, userMessage]);
    setMessageInput('');

    // Simulate API response delay
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: 'This is a placeholder response from the assistant. In production, this will be replaced with real AI analysis of your document.',
        type: 'General QA',
        source: 'Document'
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 500);
  };

  if (!analysis) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/app/documents')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Documents
        </Button>
        <Card className="text-center py-12">
          <CardContent>
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-heading font-semibold mb-2">Analysis Not Found</h3>
            <p className="text-foreground-muted mb-4">
              This document hasn't been analyzed yet or doesn't exist.
            </p>
            <Button onClick={() => navigate('/app/documents')}>
              Back to Documents
            </Button>
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
            <Button variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column - Analysis Tabs */}
        <div className="flex-1 lg:w-[65%]">
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
          
          <div className="flex items-center gap-6 p-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <div className={cn("text-3xl font-bold", getMetricColor(10 - analysis.overallRiskScore))}>
                {analysis.overallRiskScore}/10
              </div>
              <div className="text-xs text-foreground-muted mt-1">Overall Risk</div>
            </div>
            <Separator orientation="vertical" className="h-12" />
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <div className={cn("text-xl font-semibold", getMetricColor(analysis.documentMetrics.clarity))}>
                  {analysis.documentMetrics.clarity}
                </div>
                <div className="text-xs text-foreground-muted">Clarity</div>
              </div>
              <div>
                <div className={cn("text-xl font-semibold", getMetricColor(analysis.documentMetrics.fairness))}>
                  {analysis.documentMetrics.fairness}
                </div>
                <div className="text-xs text-foreground-muted">Fairness</div>
              </div>
              <div>
                <div className={cn("text-xl font-semibold", getMetricColor(analysis.documentMetrics.completeness))}>
                  {analysis.documentMetrics.completeness}
                </div>
                <div className="text-xs text-foreground-muted">Complete</div>
              </div>
              <div>
                <div className={cn("text-xl font-semibold", getMetricColor(10 - analysis.documentMetrics.complexity))}>
                  {10 - analysis.documentMetrics.complexity}
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
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-heading font-semibold">{finding.title}</h4>
                    <Badge className={cn("text-xs", getSeverityBadgeClass(finding.severity))}>
                      {finding.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground-muted mb-2">{finding.description}</p>
                </div>
                <Badge variant="outline" className="text-xs whitespace-nowrap">
                  {finding.clause}
                </Badge>
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
                <div className="font-semibold">{item.value}</div>
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
        <div className="hidden lg:block lg:w-[35%]">
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
