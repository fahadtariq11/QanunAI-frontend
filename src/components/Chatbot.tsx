import { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2,
  Maximize2,
  Loader2,
  FileText,
  XCircle,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Scale
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useChatbot, type ChatMessage, type Citation } from '@/contexts/ChatbotContext';
import { useChatWithAI, useChatAboutDocument, useLawyerSearchChat } from '@/hooks/useApi';
import { LawyerSearchCard } from '@/components/LawyerSearchCard';
import type { LawyerSearchResult } from '@/lib/api';

// Simulated AI responses for the chatbot
const SIMULATED_RESPONSES = [
  {
    keywords: ['contract', 'agreement', 'document'],
    response: "I can help you analyze contracts and legal documents. Upload a document through the Documents section, and I'll provide a detailed risk assessment, identify key clauses, and highlight potential issues."
  },
  {
    keywords: ['risk', 'risky', 'dangerous', 'concern'],
    response: "Risk assessment is one of my core capabilities. I analyze documents for high-risk clauses like broad liability limitations, unfair termination terms, IP assignment issues, and non-compete restrictions. Each finding includes severity rating and recommendations."
  },
  {
    keywords: ['lawyer', 'attorney', 'legal help', 'consultation'],
    response: "You can find verified lawyers through the 'Lawyers' section. Filter by specialization, location, and rating. Once you find a suitable lawyer, you can request a consultation directly through the platform."
  },
  {
    keywords: ['upload', 'analyze', 'how to'],
    response: "To analyze a document:\n1. Go to the Documents page\n2. Click 'Upload Document'\n3. Select your PDF, DOC, or DOCX file\n4. Wait ~10 seconds for AI analysis\n5. View the detailed report with risks, key terms, and recommendations."
  },
  {
    keywords: ['price', 'cost', 'free', 'pricing', 'plan'],
    response: "QanunAI offers different plans:\n• Free: 5 documents/month with basic analysis\n• Professional: Unlimited documents with detailed analysis\n• Enterprise: Custom solutions for organizations\n\nVisit Settings to manage your subscription."
  },
  {
    keywords: ['hello', 'hi', 'hey', 'help'],
    response: "Hello! I'm QanunAI, your legal document assistant. I can help you:\n• Analyze legal documents for risks\n• Explain contract clauses\n• Find lawyers for consultation\n• Provide legal updates\n\nHow can I assist you today?"
  },
  {
    keywords: ['thanks', 'thank you', 'appreciate'],
    response: "You're welcome! If you have any more questions about your legal documents or need help navigating QanunAI, feel free to ask."
  },
  {
    keywords: ['clause', 'term', 'provision', 'section'],
    response: "I can identify and explain various contract clauses including:\n• Liability limitations\n• Indemnification provisions\n• Intellectual property rights\n• Termination conditions\n• Confidentiality terms\n• Non-compete clauses\n\nUpload a document and I'll highlight all important clauses."
  }
];

const getSimulatedResponse = (message: string, documentContext?: { name: string; summary?: string; riskLevel?: string; riskCount?: number } | null): string => {
  const lowerMessage = message.toLowerCase();
  
  // If we have document context, check document-specific responses first
  if (documentContext) {
    // Document-specific responses
    if (lowerMessage.includes('summary') || lowerMessage.includes('summarize') || lowerMessage.includes('overview') || lowerMessage.includes('about')) {
      return documentContext.summary 
        ? `Here's a summary of "${documentContext.name}":\n\n${documentContext.summary}`
        : `"${documentContext.name}" is currently being analyzed. Once complete, I'll be able to provide a detailed summary of its contents, key clauses, and risk assessment.`;
    }
    
    if (lowerMessage.includes('risk') || lowerMessage.includes('concern') || lowerMessage.includes('issues') || lowerMessage.includes('problems')) {
      if (!documentContext.riskLevel) {
        return `The risk analysis for "${documentContext.name}" is still in progress. Please check back shortly.`;
      }
      return `"${documentContext.name}" has been assessed as ${documentContext.riskLevel.toUpperCase()} risk with ${documentContext.riskCount || 0} identified issues.\n\nThe main concerns include:\n• Liability limitation clauses\n• Indemnification scope\n• Termination provisions\n\nWould you like me to explain any specific risk in detail?`;
    }
    
    if (lowerMessage.includes('recommend') || lowerMessage.includes('suggestion') || lowerMessage.includes('advice') || lowerMessage.includes('should i')) {
      if (documentContext.riskLevel === 'high') {
        return `Given the HIGH risk level of "${documentContext.name}", I recommend:\n\n1. Consult with a lawyer before signing\n2. Negotiate the liability limitation clause\n3. Request modifications to IP assignment terms\n4. Clarify termination conditions\n\nWould you like me to help you find a lawyer for consultation?`;
      } else if (documentContext.riskLevel === 'medium') {
        return `"${documentContext.name}" has MEDIUM risk. My recommendations:\n\n1. Review the flagged clauses carefully\n2. Consider negotiating 2-3 key terms\n3. Document any verbal agreements\n\nThe document is generally acceptable with minor modifications.`;
      }
      return `"${documentContext.name}" appears to be LOW risk. The terms are generally fair and standard. You can proceed with confidence, but always ensure you understand all obligations before signing.`;
    }
    
    if (lowerMessage.includes('explain') || lowerMessage.includes('what is') || lowerMessage.includes('what does') || lowerMessage.includes('meaning')) {
      return `I'd be happy to explain any part of "${documentContext.name}". Could you specify which clause or section you'd like me to explain? For example:\n• Liability limitations\n• Indemnification terms\n• Confidentiality provisions\n• Termination conditions`;
    }
    
    // Default document context response
    return `I'm here to help you understand "${documentContext.name}". You can ask me about:\n• Document summary and overview\n• Risk assessment and concerns\n• Specific clauses and their meanings\n• Recommendations and next steps\n\nWhat would you like to know?`;
  }
  
  // General responses when no document context
  for (const item of SIMULATED_RESPONSES) {
    if (item.keywords.some(keyword => lowerMessage.includes(keyword))) {
      return item.response;
    }
  }
  
  // Default response
  return "I'm here to help with legal document analysis. You can ask me about:\n• How to upload and analyze documents\n• Understanding risk assessments\n• Finding lawyers for consultations\n• Explaining contract terms\n\nWhat would you like to know?";
};

export const Chatbot = () => {
  const { 
    isOpen, 
    isMinimized, 
    documentContext,
    messages,
    openChatbot, 
    closeChatbot, 
    toggleMinimize,
    clearDocumentContext,
    addMessage,
    resetChat
  } = useChatbot();
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [expandedCitations, setExpandedCitations] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // AI chat mutations
  const chatWithAI = useChatWithAI();
  const chatAboutDoc = useChatAboutDocument();
  const lawyerSearch = useLawyerSearchChat();
  const [lawyerSearchSessionId, setLawyerSearchSessionId] = useState<string | null>(null);

  // Keywords that indicate user wants to find a lawyer
  const isLawyerSearchQuery = (msg: string): boolean => {
    const lowerMsg = msg.toLowerCase();
    const lawyerKeywords = ['find lawyer', 'search lawyer', 'need lawyer', 'looking for lawyer', 
                           'find attorney', 'need attorney', 'recommend lawyer', 'suggest lawyer',
                           'lawyer for', 'attorney for', 'legal help with', 'need legal help'];
    const legalIssues = ['property dispute', 'divorce', 'custody', 'criminal', 'contract', 
                        'business', 'tax', 'immigration', 'employment', 'family law',
                        'civil case', 'lawsuit', 'bail', 'inheritance', 'real estate'];
    
    // Check for explicit lawyer search intent
    if (lawyerKeywords.some(kw => lowerMsg.includes(kw))) return true;
    
    // Check for legal issues combined with help-seeking phrases
    const helpPhrases = ['need help', 'looking for', 'find', 'recommend', 'suggest', 'who can help'];
    if (legalIssues.some(issue => lowerMsg.includes(issue)) && 
        helpPhrases.some(phrase => lowerMsg.includes(phrase))) {
      return true;
    }
    
    return false;
  };

  const toggleCitation = (messageId: string) => {
    setExpandedCitations(prev => {
      const next = new Set(prev);
      if (next.has(messageId)) {
        next.delete(messageId);
      } else {
        next.add(messageId);
      }
      return next;
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  // Reset session when document context changes
  useEffect(() => {
    setSessionId(null);
  }, [documentContext?.id]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    addMessage(userMessage);
    const currentMessage = inputValue.trim();
    setInputValue('');
    setIsTyping(true);

    try {
      let response;
      
      // Check if this is a lawyer search query (and not in document context)
      if (!documentContext && isLawyerSearchQuery(currentMessage)) {
        // Use lawyer search AI
        const searchResponse = await lawyerSearch.mutateAsync({
          message: currentMessage,
          sessionId: lawyerSearchSessionId || undefined
        });
        
        // Store session ID for conversation continuity
        if (searchResponse.session_id) {
          setLawyerSearchSessionId(searchResponse.session_id);
        }
        
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: searchResponse.content,
          timestamp: new Date(),
          citations: [],
          lawyers: searchResponse.lawyers,
          followUpQuestions: searchResponse.follow_up_questions,
          messageType: 'lawyer-search'
        };
        addMessage(assistantMessage);
        
      } else if (documentContext?.id) {
        // Chat about a specific document
        response = await chatAboutDoc.mutateAsync({
          documentId: documentContext.id,
          message: currentMessage,
          sessionId: sessionId || undefined
        });
        
        // Store session ID for conversation continuity
        if (response.session_id) {
          setSessionId(response.session_id);
        }
        
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.content,
          timestamp: new Date(),
          citations: response.citations || []
        };
        addMessage(assistantMessage);
      } else {
        // General AI chat
        response = await chatWithAI.mutateAsync({
          message: currentMessage,
          sessionId: sessionId || undefined
        });
        
        // Store session ID for conversation continuity
        if (response.session_id) {
          setSessionId(response.session_id);
        }
        
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.content,
          timestamp: new Date(),
          citations: response.citations || []
        };
        addMessage(assistantMessage);
      }
    } catch (error) {
      // Fallback to simulated response if API fails
      const fallbackResponse = getSimulatedResponse(currentMessage, documentContext);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fallbackResponse,
        timestamp: new Date(),
        citations: []
      };
      addMessage(assistantMessage);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearContext = () => {
    clearDocumentContext();
    // clearDocumentContext already resets the chat with a default message
  };

  if (!isOpen) {
    return (
      <Button
        onClick={openChatbot}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg gradient-primary hover:scale-105 transition-transform z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div 
      className={cn(
        "fixed bottom-6 right-6 z-50 flex flex-col bg-background border rounded-2xl shadow-2xl transition-all duration-300",
        isMinimized ? "w-80 h-14" : "w-96 h-[520px]"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-2xl">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="p-2 bg-white/20 rounded-full flex-shrink-0">
            <Bot className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-heading font-semibold truncate">QanunAI Assistant</h3>
            {!isMinimized && (
              <p className="text-xs text-primary-foreground/70 truncate max-w-[200px]">
                {documentContext ? `Discussing: ${documentContext.name}` : 'Ask me anything about legal documents'}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 text-primary-foreground hover:bg-white/20"
            onClick={toggleMinimize}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 text-primary-foreground hover:bg-white/20"
            onClick={closeChatbot}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Document Context Banner */}
          {documentContext && (
            <div className="px-4 py-2 bg-primary/10 border-b flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm font-medium truncate max-w-[180px]" title={documentContext.name}>
                  {documentContext.name}
                </span>
                {documentContext.riskLevel && (
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs flex-shrink-0",
                      documentContext.riskLevel === 'high' ? 'border-destructive text-destructive' :
                      documentContext.riskLevel === 'medium' ? 'border-warning text-warning' :
                      'border-accent text-accent'
                    )}
                  >
                    {documentContext.riskLevel}
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-foreground-muted hover:text-foreground flex-shrink-0"
                onClick={handleClearContext}
                title="Clear document context"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === 'user' ? "flex-row-reverse" : ""
                )}
              >
                <div 
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                    message.role === 'user' 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted"
                  )}
                >
                  {message.role === 'user' ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                <div 
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2",
                    message.role === 'user' 
                      ? "bg-primary text-primary-foreground rounded-tr-sm" 
                      : "bg-muted rounded-tl-sm"
                  )}
                >
                  <p className="text-sm whitespace-pre-line break-words">{message.content}</p>
                  
                  {/* Lawyer Search Results */}
                  {message.role === 'assistant' && message.lawyers && message.lawyers.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.lawyers.slice(0, 3).map((lawyer) => (
                        <LawyerSearchCard 
                          key={lawyer.id} 
                          lawyer={lawyer} 
                          compact 
                        />
                      ))}
                      {message.lawyers.length > 3 && (
                        <p className="text-xs text-muted-foreground text-center">
                          +{message.lawyers.length - 3} more lawyers found
                        </p>
                      )}
                    </div>
                  )}
                  
                  {/* Follow-up Question Chips */}
                  {message.role === 'assistant' && message.followUpQuestions && message.followUpQuestions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {message.followUpQuestions.slice(0, 3).map((question, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          className="h-auto py-1 px-2 text-xs font-normal"
                          onClick={() => setInputValue(question)}
                        >
                          {question}
                        </Button>
                      ))}
                    </div>
                  )}
                  
                  {/* Citations Section */}
                  {message.role === 'assistant' && message.citations && message.citations.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-border/50">
                      <button
                        onClick={() => toggleCitation(message.id)}
                        className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                      >
                        <BookOpen className="h-3 w-3" />
                        <span>{message.citations.length} Source{message.citations.length > 1 ? 's' : ''}</span>
                        {expandedCitations.has(message.id) ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )}
                      </button>
                      
                      {expandedCitations.has(message.id) && (
                        <div className="mt-2 space-y-2">
                          {message.citations.map((citation, idx) => (
                            <div 
                              key={idx}
                              className="p-2 bg-background/50 rounded-lg text-xs border border-border/30"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-[10px] px-1 py-0">
                                  {citation.source === 'laws' ? 'Law' : 'Document'}
                                </Badge>
                                <span className="text-foreground-muted">
                                  ID: {citation.id}
                                  {citation.chunk_index !== undefined && ` (Chunk ${citation.chunk_index})`}
                                </span>
                                <span className="text-foreground-muted ml-auto">
                                  {Math.round(citation.score * 100)}% match
                                </span>
                              </div>
                              <p className="text-foreground/70 line-clamp-2 break-words">
                                "{citation.snippet}"
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <p className={cn(
                    "text-xs mt-1",
                    message.role === 'user' ? "text-primary-foreground/70" : "text-foreground-muted"
                  )}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-foreground-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-foreground-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-foreground-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={documentContext ? `Ask about ${documentContext.name}...` : "Type your message..."}
                className="flex-1"
                disabled={isTyping}
              />
              <Button 
                onClick={handleSend} 
                disabled={!inputValue.trim() || isTyping}
                className="gradient-primary"
              >
                {isTyping ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Chatbot;
