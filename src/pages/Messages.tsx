import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Loader2 } from 'lucide-react';
import { useConversations } from '@/hooks/useApi';
import { LawyerChat } from '@/components/LawyerChat';

interface Conversation {
  user_id: number;
  user_name: string;
  user_email: string;
  user_avatar: string | null;
  user_role: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const { data: conversations = [], isLoading } = useConversations();
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };
  
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground mt-2">Your conversations with lawyers and clients</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Conversations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No conversations yet</p>
              <p className="text-sm">Start a conversation by messaging a lawyer from the directory!</p>
            </div>
          ) : (
            <ScrollArea className="h-[500px]">
              <div className="space-y-2">
                {conversations.map((conversation: Conversation) => (
                  <div
                    key={conversation.user_id}
                    className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={conversation.user_avatar || undefined} alt={conversation.user_name} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(conversation.user_name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">{conversation.user_name}</span>
                          <Badge className="text-xs bg-secondary text-secondary-foreground">
                            {conversation.user_role === 'LAWYER' ? 'Lawyer' : 'Client'}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(conversation.last_message_time)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-muted-foreground truncate max-w-[300px]">
                          {conversation.last_message}
                        </p>
                        {conversation.unread_count > 0 && (
                          <Badge className="ml-2 bg-primary text-primary-foreground">
                            {conversation.unread_count}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
      
      {selectedConversation && (
        <LawyerChat
          recipientId={selectedConversation.user_id}
          recipientName={selectedConversation.user_name}
          recipientAvatar={selectedConversation.user_avatar || undefined}
          onClose={() => setSelectedConversation(null)}
        />
      )}
    </div>
  );
};

export default Messages;
