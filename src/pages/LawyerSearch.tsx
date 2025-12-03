import { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Send, 
  Bot, 
  User, 
  Loader2,
  Scale,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useLawyerSearchChat } from '@/hooks/useApi';
import { LawyerSearchCard } from '@/components/LawyerSearchCard';
import type { LawyerSearchResult } from '@/lib/api';

interface SearchMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  lawyers?: LawyerSearchResult[];
  followUpQuestions?: string[];
}

const INITIAL_MESSAGE: SearchMessage = {
  id: '1',
  role: 'assistant',
  content: "👋 Hi! I'm here to help you find the perfect lawyer for your needs.\n\nTell me about your legal situation, and I'll recommend lawyers who can help. For example:\n\n• \"I need a lawyer for a property dispute in Lahore\"\n• \"Looking for a divorce lawyer who speaks Urdu\"\n• \"Help me find a criminal defense attorney\"",
  timestamp: new Date(),
  followUpQuestions: [
    "Property dispute",
    "Divorce / Family matter",
    "Criminal case",
    "Business / Contract issue",
  ]
};

const LawyerSearch = () => {
  const [messages, setMessages] = useState<SearchMessage[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const lawyerSearch = useLawyerSearchChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text) return;

    const userMessage: SearchMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await lawyerSearch.mutateAsync({
        message: text,
        sessionId: sessionId || undefined
      });
      
      if (response.session_id) {
        setSessionId(response.session_id);
      }
      
      const assistantMessage: SearchMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        lawyers: response.lawyers,
        followUpQuestions: response.follow_up_questions,
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: SearchMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error while searching. Please try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
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

  const handleQuickReply = (question: string) => {
    handleSend(question);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Scale className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-heading font-bold">Find Your Lawyer</h1>
              <p className="text-sm text-muted-foreground">AI-powered lawyer matching</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 pb-32">
        <div className="py-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-4",
                message.role === 'user' ? "flex-row-reverse" : ""
              )}
            >
              {/* Avatar */}
              <div 
                className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0",
                  message.role === 'user' 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-primary/10 text-primary"
                )}
              >
                {message.role === 'user' ? (
                  <User className="h-5 w-5" />
                ) : (
                  <Bot className="h-5 w-5" />
                )}
              </div>
              
              {/* Message Content */}
              <div className={cn(
                "flex-1 max-w-[85%]",
                message.role === 'user' ? "flex flex-col items-end" : ""
              )}>
                <div 
                  className={cn(
                    "rounded-2xl px-5 py-3",
                    message.role === 'user' 
                      ? "bg-primary text-primary-foreground rounded-tr-sm" 
                      : "bg-muted rounded-tl-sm"
                  )}
                >
                  <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
                </div>
                
                {/* Lawyer Cards */}
                {message.role === 'assistant' && message.lawyers && Array.isArray(message.lawyers) && message.lawyers.length > 0 && (
                  <div className="mt-4 space-y-3 w-full">
                    {message.lawyers.map((lawyer) => (
                      <LawyerSearchCard 
                        key={lawyer.id} 
                        lawyer={lawyer}
                      />
                    ))}
                  </div>
                )}
                
                {/* Quick Reply Chips */}
                {message.role === 'assistant' && message.followUpQuestions && Array.isArray(message.followUpQuestions) && message.followUpQuestions.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {message.followUpQuestions.map((question, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        className="h-auto py-2 px-3 text-sm font-normal hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => handleQuickReply(question)}
                      >
                        {question}
                        <ArrowRight className="h-3 w-3 ml-1.5" />
                      </Button>
                    ))}
                  </div>
                )}
                
                {/* Timestamp */}
                <p className={cn(
                  "text-xs mt-2",
                  message.role === 'user' ? "text-right" : "",
                  "text-muted-foreground"
                )}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div className="bg-muted rounded-2xl rounded-tl-sm px-5 py-4">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Fixed Input Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your legal needs..."
                className="pl-12 pr-4 py-6 text-base rounded-xl"
                disabled={isTyping}
              />
            </div>
            <Button 
              onClick={() => handleSend()} 
              disabled={!inputValue.trim() || isTyping}
              size="lg"
              className="gradient-primary px-6 rounded-xl"
            >
              {isTyping ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-2">
            <Sparkles className="h-3 w-3 inline mr-1" />
            AI-powered matching finds the best lawyers for your specific needs
          </p>
        </div>
      </div>
    </div>
  );
};

export default LawyerSearch;
