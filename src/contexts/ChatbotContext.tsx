import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface DocumentContext {
  id: number;
  name: string;
  summary?: string;
  riskLevel?: string;
  riskCount?: number;
}

interface Citation {
  source: 'documents' | 'laws';
  id: string | number;
  chunk_index?: number;
  snippet: string;
  score: number;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  citations?: Citation[];
}

interface ChatbotContextType {
  isOpen: boolean;
  isMinimized: boolean;
  documentContext: DocumentContext | null;
  messages: ChatMessage[];
  openChatbot: () => void;
  closeChatbot: () => void;
  toggleMinimize: () => void;
  setDocumentContext: (doc: DocumentContext | null) => void;
  openWithDocument: (doc: DocumentContext) => void;
  clearDocumentContext: () => void;
  addMessage: (message: ChatMessage) => void;
  resetChat: () => void;
}

const DEFAULT_MESSAGE: ChatMessage = {
  id: '1',
  role: 'assistant',
  content: "Hello! I'm QanunAI, your legal document assistant. How can I help you today?",
  timestamp: new Date()
};

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const ChatbotProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [documentContext, setDocumentContextState] = useState<DocumentContext | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([DEFAULT_MESSAGE]);

  const resetChat = useCallback(() => {
    setMessages([{
      ...DEFAULT_MESSAGE,
      id: Date.now().toString(),
      timestamp: new Date()
    }]);
  }, []);

  const openChatbot = useCallback(() => {
    // When opening the global chatbot, clear any document context and reset chat
    if (documentContext) {
      setDocumentContextState(null);
      resetChat();
    }
    setIsOpen(true);
    setIsMinimized(false);
  }, [documentContext, resetChat]);

  const closeChatbot = () => {
    setIsOpen(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const setDocumentContext = (doc: DocumentContext | null) => {
    setDocumentContextState(doc);
  };

  const openWithDocument = useCallback((doc: DocumentContext) => {
    // Starting a new document chat - reset messages and set new context
    const docMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `I'm now focused on "${doc.name}". ${
        doc.riskLevel 
          ? `This document has been analyzed and rated as ${doc.riskLevel.toUpperCase()} risk with ${doc.riskCount || 0} issues found.`
          : 'This document is being analyzed.'
      }\n\nHow can I help you understand this document?`,
      timestamp: new Date()
    };
    
    setDocumentContextState(doc);
    setMessages([docMessage]);
    setIsOpen(true);
    setIsMinimized(false);
  }, []);

  const clearDocumentContext = useCallback(() => {
    setDocumentContextState(null);
    resetChat();
  }, [resetChat]);

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  }, []);

  return (
    <ChatbotContext.Provider value={{
      isOpen,
      isMinimized,
      documentContext,
      messages,
      openChatbot,
      closeChatbot,
      toggleMinimize,
      setDocumentContext,
      openWithDocument,
      clearDocumentContext,
      addMessage,
      resetChat,
    }}>
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};

export type { ChatMessage, Citation };
