import { useState } from 'react';
import { 
  Star, 
  MapPin, 
  Clock, 
  DollarSign, 
  MessageCircle, 
  Award,
  Sparkles,
  Building,
  CalendarPlus,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LawyerChat } from '@/components/LawyerChat';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCreateConsultation } from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';
import type { LawyerSearchResult } from '@/lib/api';

interface LawyerSearchCardProps {
  lawyer: LawyerSearchResult;
  compact?: boolean;
}

export const LawyerSearchCard = ({ lawyer, compact = false }: LawyerSearchCardProps) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingSubject, setBookingSubject] = useState('');
  const [bookingDescription, setBookingDescription] = useState('');
  const { toast } = useToast();
  const createConsultation = useCreateConsultation();

  const getInitials = (name: string) => 
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  
  const matchPercentage = Math.round(lawyer.similarity_score * 100);

  const handleBookConsultation = async () => {
    if (!bookingSubject.trim()) {
      toast({
        title: "Subject required",
        description: "Please enter a subject for your consultation.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createConsultation.mutateAsync({
        lawyerId: lawyer.id,
        subject: bookingSubject,
        description: bookingDescription,
      });
      
      toast({
        title: "Consultation Requested! 🎉",
        description: `Your consultation request has been sent to ${lawyer.full_name}.`,
      });
      
      setIsBookingOpen(false);
      setBookingSubject('');
      setBookingDescription('');
    } catch (error: any) {
      toast({
        title: "Request Failed",
        description: error.message || "Could not send consultation request.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow border-l-4 border-l-primary/30">
        <CardContent className={compact ? "p-3" : "p-4"}>
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <Avatar className={compact ? "h-10 w-10" : "h-12 w-12"}>
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                {getInitials(lawyer.full_name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              {/* Header with name and match score */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h4 className="font-semibold truncate">{lawyer.full_name}</h4>
                <Badge variant="secondary" className="flex-shrink-0 text-xs bg-primary/10 text-primary">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {matchPercentage}% match
                </Badge>
              </div>
              
              {/* Title and firm */}
              <p className="text-sm text-muted-foreground">
                {lawyer.title}
                {lawyer.firm && <span> at {lawyer.firm}</span>}
              </p>
              
              {/* Match Reason - highlighted prominently */}
              <div className="mt-2 p-2.5 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border-l-3 border-l-primary">
                <p className="text-sm">
                  <Sparkles className="h-3.5 w-3.5 inline mr-1.5 text-primary" />
                  <span className="font-medium text-primary">Why I recommend: </span>
                  <span className="text-foreground">{lawyer.match_reason}</span>
                </p>
              </div>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center">
                  <Star className="h-3.5 w-3.5 mr-1 fill-yellow-400 text-yellow-400" />
                  {lawyer.rating.toFixed(1)} ({lawyer.review_count} reviews)
                </span>
                <span className="flex items-center">
                  <Award className="h-3.5 w-3.5 mr-1" />
                  {lawyer.experience_years} years exp.
                </span>
                {lawyer.city && (
                  <span className="flex items-center">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    {lawyer.city}
                  </span>
                )}
                {lawyer.hourly_rate > 0 && (
                  <span className="flex items-center">
                    <DollarSign className="h-3.5 w-3.5 mr-1" />
                    ${lawyer.hourly_rate}/hr
                  </span>
                )}
                {lawyer.response_time && (
                  <span className="flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    {lawyer.response_time}
                  </span>
                )}
              </div>
              
              {/* Specializations */}
              {lawyer.specializations.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {lawyer.specializations.slice(0, 3).map((spec, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs font-normal">
                      {spec}
                    </Badge>
                  ))}
                  {lawyer.specializations.length > 3 && (
                    <Badge variant="outline" className="text-xs font-normal">
                      +{lawyer.specializations.length - 3} more
                    </Badge>
                  )}
                </div>
              )}
              
              {/* Actions */}
              {!compact && (
                <div className="flex gap-2 mt-4">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setIsBookingOpen(true)}
                  >
                    <CalendarPlus className="h-3.5 w-3.5 mr-1.5" />
                    Book Consultation
                  </Button>
                  <Button 
                    size="sm" 
                    className="gradient-primary"
                    onClick={() => setIsChatOpen(true)}
                  >
                    <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
                    Message
                  </Button>
                </div>
              )}
              
              {/* Compact actions */}
              {compact && (
                <div className="flex gap-2 mt-3">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="h-7 text-xs"
                    onClick={() => setIsBookingOpen(true)}
                  >
                    <CalendarPlus className="h-3 w-3 mr-1" />
                    Book
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="h-7 text-xs text-primary"
                    onClick={() => setIsChatOpen(true)}
                  >
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Chat
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Dialog */}
      {isChatOpen && (
        <LawyerChat
          recipientId={lawyer.id}
          recipientName={lawyer.full_name}
          onClose={() => setIsChatOpen(false)}
        />
      )}

      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Book Consultation</DialogTitle>
            <DialogDescription>
              Request a consultation with {lawyer.full_name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                placeholder="Brief topic of consultation"
                value={bookingSubject}
                onChange={(e) => setBookingSubject(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your legal matter..."
                value={bookingDescription}
                onChange={(e) => setBookingDescription(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBookingOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleBookConsultation}
              disabled={createConsultation.isPending}
              className="gradient-primary"
            >
              {createConsultation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
