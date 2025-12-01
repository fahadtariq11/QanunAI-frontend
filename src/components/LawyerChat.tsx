import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Loader2, 
  X, 
  Minimize2, 
  Maximize2,
  MessageCircle 
} from 'lucide-react';
import { useMessages, useSendMessage } from '@/hooks/useApi';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface LawyerChatProps {
  recipientId: number;
  recipientName: string;
  recipientAvatar?: string;
  recipientTitle?: string;
  onClose: () => void;
}

export const LawyerChat = ({
  recipientId,
  recipientName,
  recipientAvatar,
  recipientTitle,
  onClose
}: LawyerChatProps) => {
  const [messageInput, setMessageInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  const { data: messages = [], isLoading } = useMessages(recipientId);
  const sendMessage = useSendMessage();
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current && !isMinimized) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isMinimized]);
  
  const handleSend = async () => {
    if (!messageInput.trim()) return;
    
    try {
      await sendMessage.mutateAsync({
        receiverId: recipientId,
        content: messageInput.trim()
      });
      setMessageInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + 
           date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Minimized state - just show a small bar
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-24 z-[60]">
        <div 
          className="flex items-center gap-3 bg-primary text-primary-foreground px-4 py-3 rounded-lg shadow-lg cursor-pointer hover:bg-primary/90 transition-colors"
          onClick={() => setIsMinimized(false)}
        >
          <Avatar className="h-8 w-8 border-2 border-primary-foreground/20">
            <AvatarImage src={recipientAvatar} alt={recipientName} />
            <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground text-xs">
              {getInitials(recipientName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <span className="font-medium text-sm">{recipientName}</span>
          </div>
          <Maximize2 className="h-4 w-4" />
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 hover:bg-primary-foreground/20 text-primary-foreground"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Full chat window
  return (
    <div className="fixed bottom-4 right-24 z-[60] w-[380px] h-[500px] bg-background border rounded-lg shadow-xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-primary text-primary-foreground">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border-2 border-primary-foreground/20">
            <AvatarImage src={recipientAvatar} alt={recipientName} />
            <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground text-sm">
              {getInitials(recipientName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm leading-tight">{recipientName}</p>
            {recipientTitle && (
              <p className="text-xs text-primary-foreground/70">{recipientTitle}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 hover:bg-primary-foreground/20 text-primary-foreground"
            onClick={() => setIsMinimized(true)}
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 hover:bg-primary-foreground/20 text-primary-foreground"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Messages */}
      <ScrollArea className="flex-1 p-3" ref={scrollRef}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
            <MessageCircle className="h-10 w-10 mb-3 opacity-50" />
            <p className="font-medium">No messages yet</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message: any) => {
              const isMine = message.is_mine || message.sender === user?.id;
              return (
                <div
                  key={message.id}
                  className={cn("flex", isMine ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-lg px-3 py-2",
                      isMine
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                    <p className={cn(
                      "text-[10px] mt-1",
                      isMine ? "text-primary-foreground/60" : "text-muted-foreground"
                    )}>
                      {formatTime(message.created_at)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
      
      {/* Input */}
      <div className="p-3 border-t bg-background">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sendMessage.isPending}
            className="flex-1 text-sm"
          />
          <Button 
            onClick={handleSend} 
            disabled={!messageInput.trim() || sendMessage.isPending}
            size="icon"
            className="shrink-0"
          >
            {sendMessage.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LawyerChat;
