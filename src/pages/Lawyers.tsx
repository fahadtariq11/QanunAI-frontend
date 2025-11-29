import { useState } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Phone, 
  Mail, 
  MessageCircle,
  User,
  Clock,
  DollarSign,
  Award,
  Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LawyerCard } from '@/components/LawyerCard';

const Lawyers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const specialties = [
    'all',
    'corporate',
    'employment',
    'intellectual-property',
    'real-estate',
    'litigation',
    'tax',
    'family',
    'criminal'
  ];

  const locations = [
    'all',
    'new-york',
    'california',
    'texas',
    'florida',
    'illinois',
    'remote'
  ];

  // Mock lawyers data
  const lawyers = [
    {
      id: 1,
      name: "Sarah Johnson",
      title: "Senior Corporate Lawyer",
      firm: "Johnson & Associates",
      location: "New York, NY",
      specialties: ["corporate", "mergers-acquisitions"],
      rating: 4.9,
      reviewCount: 127,
      hourlyRate: 450,
      responseTime: "2 hours",
      experience: 12,
      languages: ["English", "Spanish"],
      avatar: "/api/placeholder/100/100",
      verified: true,
      bio: "Specializing in corporate law and M&A transactions with over 12 years of experience helping businesses navigate complex legal challenges."
    },
    {
      id: 2,
      name: "Michael Chen",
      title: "Employment Law Expert",
      firm: "Chen Legal Group",
      location: "San Francisco, CA",
      specialties: ["employment", "labor-disputes"],
      rating: 4.8,
      reviewCount: 89,
      hourlyRate: 380,
      responseTime: "4 hours",
      experience: 8,
      languages: ["English", "Mandarin"],
      avatar: "/api/placeholder/100/100",
      verified: true,
      bio: "Focused on employment law and workplace rights, helping both employees and employers resolve complex labor issues."
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      title: "IP & Technology Lawyer",
      firm: "TechLaw Partners",
      location: "Austin, TX",
      specialties: ["intellectual-property", "technology"],
      rating: 4.9,
      reviewCount: 156,
      hourlyRate: 420,
      responseTime: "1 hour",
      experience: 10,
      languages: ["English", "Spanish", "Portuguese"],
      avatar: "/api/placeholder/100/100",
      verified: true,
      bio: "Expert in intellectual property and technology law, protecting innovations and digital assets for startups and enterprises."
    },
    {
      id: 4,
      name: "David Thompson",
      title: "Real Estate Attorney",
      firm: "Thompson Real Estate Law",
      location: "Miami, FL",
      specialties: ["real-estate", "property-development"],
      rating: 4.7,
      reviewCount: 94,
      hourlyRate: 320,
      responseTime: "3 hours",
      experience: 15,
      languages: ["English"],
      avatar: "/api/placeholder/100/100",
      verified: true,
      bio: "Comprehensive real estate legal services for residential and commercial properties, including development and investment."
    },
    {
      id: 5,
      name: "Jennifer Kim",
      title: "Litigation Specialist",
      firm: "Kim & Partners",
      location: "Chicago, IL",
      specialties: ["litigation", "dispute-resolution"],
      rating: 4.8,
      reviewCount: 203,
      hourlyRate: 500,
      responseTime: "2 hours",
      experience: 18,
      languages: ["English", "Korean"],
      avatar: "/api/placeholder/100/100",
      verified: true,
      bio: "Experienced litigator specializing in complex commercial disputes and alternative dispute resolution methods."
    },
    {
      id: 6,
      name: "Robert Wilson",
      title: "Tax Law Consultant",
      firm: "Wilson Tax Law",
      location: "Remote",
      specialties: ["tax", "business-planning"],
      rating: 4.6,
      reviewCount: 67,
      hourlyRate: 280,
      responseTime: "6 hours",
      experience: 20,
      languages: ["English"],
      avatar: "/api/placeholder/100/100",
      verified: true,
      bio: "Tax law specialist helping individuals and businesses optimize their tax strategies and ensure compliance."
    }
  ];

  const filteredLawyers = lawyers.filter(lawyer => {
    const matchesSearch = lawyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lawyer.firm.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lawyer.specialties.some(spec => spec.includes(searchQuery.toLowerCase()));
    
    const matchesSpecialty = selectedSpecialty === 'all' || 
                            lawyer.specialties.includes(selectedSpecialty);
    
    const matchesLocation = selectedLocation === 'all' || 
                           lawyer.location.toLowerCase().includes(selectedLocation.replace('-', ' '));
    
    return matchesSearch && matchesSpecialty && matchesLocation;
  });

  const formatSpecialty = (specialty: string) => {
    return specialty.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Lawyer Directory</h1>
          <p className="text-foreground-muted">Connect with qualified legal professionals</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-foreground-muted">
          <Award className="h-4 w-4" />
          <span>All lawyers are verified professionals</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground-muted" />
          <Input
            placeholder="Search lawyers by name, firm, or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground-muted">Specialty:</span>
            <div className="flex flex-wrap gap-1">
              {specialties.map((specialty) => (
                <Button
                  key={specialty}
                  variant={selectedSpecialty === specialty ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSpecialty(specialty)}
                  className="text-xs h-8"
                >
                  {formatSpecialty(specialty)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground-muted">Location:</span>
          <div className="flex flex-wrap gap-1">
            {locations.map((location) => (
              <Button
                key={location}
                variant={selectedLocation === location ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedLocation(location)}
                className="text-xs h-8"
              >
                {formatSpecialty(location)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-foreground-muted">
          Showing {filteredLawyers.length} lawyer{filteredLawyers.length !== 1 ? 's' : ''}
        </p>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          More Filters
        </Button>
      </div>

      {/* Lawyers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredLawyers.map((lawyer) => (
          <LawyerCard key={lawyer.id} lawyer={lawyer} />
        ))}
      </div>

      {/* Empty State */}
      {filteredLawyers.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <User className="h-12 w-12 text-foreground-muted mx-auto mb-4" />
            <h3 className="text-lg font-heading font-semibold mb-2">No lawyers found</h3>
            <p className="text-foreground-muted mb-4">
              Try adjusting your search criteria or filters
            </p>
            <Button variant="outline" onClick={() => {
              setSearchQuery('');
              setSelectedSpecialty('all');
              setSelectedLocation('all');
            }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Lawyers;