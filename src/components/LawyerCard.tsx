import { useState } from 'react';
import { 
  Star, 
  MapPin, 
  Clock, 
  DollarSign, 
  MessageCircle, 
  Award,
  Languages,
  Building,
  CalendarPlus,
  Loader2,
  Paperclip,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateConsultation, useDocuments } from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

interface Lawyer {
  id: number;
  email?: string;
  full_name?: string;
  name?: string;
  title?: string;
  firm?: string;
  jurisdiction?: string;
  location?: string;
  specializations?: string[];
  specialties?: string[];
  rating?: number;
  review_count?: number;
  reviewCount?: number;
  hourly_rate?: number;
  hourlyRate?: number;
  response_time?: string;
  responseTime?: string;
  experience_years?: number;
  experience?: number;
  languages?: string[];
  profile_image?: string;
  avatar?: string;
  verified?: boolean;
  bio?: string;
}

interface LawyerCardProps {
  lawyer: Lawyer;
}

export const LawyerCard = ({ lawyer }: LawyerCardProps) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingSubject, setBookingSubject] = useState('');
  const [bookingDescription, setBookingDescription] = useState('');
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>('');
  const { toast } = useToast();
  const createConsultation = useCreateConsultation();
  const { data: userDocuments = [] } = useDocuments();
  
  // Normalize field names to handle both API and legacy data formats
  const name = lawyer.full_name || lawyer.name || 'Unknown Lawyer';
  const email = lawyer.email || '';
  const specialties = lawyer.specializations || lawyer.specialties || [];
  const location = lawyer.jurisdiction || lawyer.location || '';
  const rating = lawyer.rating || 0;
  const reviewCount = lawyer.review_count || lawyer.reviewCount || 0;
  const hourlyRate = lawyer.hourly_rate || lawyer.hourlyRate || 0;
  const responseTime = lawyer.response_time || lawyer.responseTime || 'N/A';
  const experience = lawyer.experience_years || lawyer.experience || 0;
  const languages = lawyer.languages || [];
  const avatar = lawyer.profile_image || lawyer.avatar || '';
  const verified = lawyer.verified ?? true;
  const title = lawyer.title || 'Legal Professional';
  const firm = lawyer.firm || '';
  const bio = lawyer.bio || 'No bio available.';

  const formatSpecialty = (specialty: string) => {
    return specialty.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getInitials = (fullName: string) => {
    return fullName.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  const handleEmailClick = () => {
    if (email) {
      window.location.href = `mailto:${email}?subject=Legal Consultation Request`;
    }
  };

  const handleBookConsultation = async () => {
    if (!bookingSubject.trim()) {
      toast({
        title: 'Subject Required',
        description: 'Please enter a subject for your consultation request.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createConsultation.mutateAsync({
        lawyerId: lawyer.id,
        subject: bookingSubject.trim(),
        description: bookingDescription.trim(),
        documentId: selectedDocumentId ? parseInt(selectedDocumentId) : undefined,
      });
      toast({
        title: 'Consultation Requested! 📅',
        description: `Your consultation request has been sent to ${name}. They will respond soon.`,
      });
      setIsBookingOpen(false);
      setBookingSubject('');
      setBookingDescription('');
      setSelectedDocumentId('');
    } catch (error: any) {
      toast({
        title: 'Request Failed',
        description: error.message || 'Failed to send consultation request. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Card className="hover-lift transition-smooth">
      <CardHeader className="pb-4">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <Avatar className="h-16 w-16">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>
            {verified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                <Award className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <CardTitle className="font-heading text-lg truncate">
                {name}
              </CardTitle>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <span className="text-sm font-medium">{Number(rating).toFixed(1)}</span>
                <span className="text-xs text-foreground-muted">({reviewCount})</span>
              </div>
            </div>
            
            <p className="text-sm text-foreground-muted">{title}</p>
            
            <div className="flex items-center space-x-4 mt-2 text-xs text-foreground-muted">
              {firm && (
                <span className="flex items-center">
                  <Building className="h-3 w-3 mr-1" />
                  {firm}
                </span>
              )}
              {location && (
                <span className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {location}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Specialties */}
        {specialties.length > 0 && (
          <div>
            <div className="flex flex-wrap gap-1">
              {specialties.slice(0, 3).map((specialty: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {formatSpecialty(specialty)}
                </Badge>
              ))}
              {specialties.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{specialties.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Bio */}
        <CardDescription className="text-sm leading-relaxed line-clamp-2">
          {bio}
        </CardDescription>

        {/* Key Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center text-foreground-muted">
              <DollarSign className="h-4 w-4 mr-2" />
              <span>${Number(hourlyRate).toFixed(0)}/hour</span>
            </div>
            <div className="flex items-center text-foreground-muted">
              <Clock className="h-4 w-4 mr-2" />
              <span>{responseTime} response</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-foreground-muted">
              <Award className="h-4 w-4 mr-2" />
              <span>{experience} years exp.</span>
            </div>
            {languages.length > 0 && (
              <div className="flex items-center text-foreground-muted">
                <Languages className="h-4 w-4 mr-2" />
                <span>{languages.slice(0, 2).join(', ')}{languages.length > 2 ? '...' : ''}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            className="flex-1" 
            onClick={() => setIsBookingOpen(true)}
          >
            <CalendarPlus className="mr-2 h-4 w-4" />
            Book Consultation
          </Button>
          <Button className="flex-1 gradient-primary" onClick={() => setIsChatOpen(true)}>
            <MessageCircle className="mr-2 h-4 w-4" />
            Message
          </Button>
        </div>
      </CardContent>
    </Card>
    
    {isChatOpen && (
      <LawyerChat
        recipientId={lawyer.id}
        recipientName={name}
        recipientAvatar={avatar}
        recipientTitle={title}
        onClose={() => setIsChatOpen(false)}
      />
    )}

    {/* Book Consultation Dialog */}
    <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Book Consultation with {name}</DialogTitle>
          <DialogDescription>
            Describe your legal issue briefly. You can also attach a document for review.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              placeholder="e.g., Property dispute, Contract review, Legal advice"
              value={bookingSubject}
              onChange={(e) => setBookingSubject(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Briefly describe your situation and what kind of help you need..."
              rows={4}
              value={bookingDescription}
              onChange={(e) => setBookingDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="document">Attach Document (Optional)</Label>
            {userDocuments.length > 0 ? (
              <Select value={selectedDocumentId} onValueChange={setSelectedDocumentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a document to attach" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No document</SelectItem>
                  {userDocuments.map((doc: any) => (
                    <SelectItem key={doc.id} value={doc.id.toString()}>
                      <div className="flex items-center gap-2">
                        <Paperclip className="h-3 w-3" />
                        {doc.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm text-muted-foreground">
                No documents uploaded yet. You can upload documents from the Documents page.
              </p>
            )}
            {selectedDocumentId && selectedDocumentId !== 'none' && (
              <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                <Paperclip className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm flex-1">
                  {userDocuments.find((d: any) => d.id.toString() === selectedDocumentId)?.name}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0"
                  onClick={() => setSelectedDocumentId('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setIsBookingOpen(false)}
            disabled={createConsultation.isPending}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleBookConsultation}
            disabled={createConsultation.isPending || !bookingSubject.trim()}
            className="gradient-primary"
          >
            {createConsultation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Request'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
};