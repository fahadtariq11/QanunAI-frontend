import { 
  Star, 
  MapPin, 
  Clock, 
  DollarSign, 
  MessageCircle, 
  Phone, 
  Mail,
  Award,
  Languages,
  Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Lawyer {
  id: number;
  name: string;
  title: string;
  firm: string;
  location: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  responseTime: string;
  experience: number;
  languages: string[];
  avatar: string;
  verified: boolean;
  bio: string;
}

interface LawyerCardProps {
  lawyer: Lawyer;
}

export const LawyerCard = ({ lawyer }: LawyerCardProps) => {
  const formatSpecialty = (specialty: string) => {
    return specialty.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <Card className="hover-lift transition-smooth">
      <CardHeader className="pb-4">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <Avatar className="h-16 w-16">
              <AvatarImage src={lawyer.avatar} alt={lawyer.name} />
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                {getInitials(lawyer.name)}
              </AvatarFallback>
            </Avatar>
            {lawyer.verified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                <Award className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <CardTitle className="font-heading text-lg truncate">
                {lawyer.name}
              </CardTitle>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <span className="text-sm font-medium">{lawyer.rating}</span>
                <span className="text-xs text-foreground-muted">({lawyer.reviewCount})</span>
              </div>
            </div>
            
            <p className="text-sm text-foreground-muted">{lawyer.title}</p>
            
            <div className="flex items-center space-x-4 mt-2 text-xs text-foreground-muted">
              <span className="flex items-center">
                <Building className="h-3 w-3 mr-1" />
                {lawyer.firm}
              </span>
              <span className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {lawyer.location}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Specialties */}
        <div>
          <div className="flex flex-wrap gap-1">
            {lawyer.specialties.slice(0, 3).map((specialty) => (
              <Badge key={specialty} variant="secondary" className="text-xs">
                {formatSpecialty(specialty)}
              </Badge>
            ))}
            {lawyer.specialties.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{lawyer.specialties.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Bio */}
        <CardDescription className="text-sm leading-relaxed line-clamp-2">
          {lawyer.bio}
        </CardDescription>

        {/* Key Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center text-foreground-muted">
              <DollarSign className="h-4 w-4 mr-2" />
              <span>${lawyer.hourlyRate}/hour</span>
            </div>
            <div className="flex items-center text-foreground-muted">
              <Clock className="h-4 w-4 mr-2" />
              <span>{lawyer.responseTime} response</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-foreground-muted">
              <Award className="h-4 w-4 mr-2" />
              <span>{lawyer.experience} years exp.</span>
            </div>
            <div className="flex items-center text-foreground-muted">
              <Languages className="h-4 w-4 mr-2" />
              <span>{lawyer.languages.join(', ')}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button className="flex-1 gradient-primary">
            <MessageCircle className="mr-2 h-4 w-4" />
            Contact
          </Button>
          <Button variant="outline" size="icon">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Mail className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};