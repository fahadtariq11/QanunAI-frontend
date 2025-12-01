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
  Building,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LawyerCard } from '@/components/LawyerCard';
import { useLawyers } from '@/hooks/useApi';

const Lawyers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  
  const { data: lawyers = [], isLoading, error } = useLawyers();

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

  const filteredLawyers = lawyers.filter((lawyer: any) => {
    const name = lawyer.full_name || lawyer.name || '';
    const firm = lawyer.firm || '';
    const specializations = lawyer.specializations || lawyer.specialties || [];
    const jurisdiction = lawyer.jurisdiction || lawyer.location || '';
    
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         firm.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         specializations.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSpecialty = selectedSpecialty === 'all' || 
                            specializations.some((s: string) => s.toLowerCase().includes(selectedSpecialty.replace('-', ' ')));
    
    const matchesLocation = selectedLocation === 'all' || 
                           jurisdiction.toLowerCase().includes(selectedLocation.replace('-', ' '));
    
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
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading lawyers...</span>
        </div>
      ) : error ? (
        <Card className="text-center py-12">
          <CardContent>
            <User className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-heading font-semibold mb-2">Failed to load lawyers</h3>
            <p className="text-foreground-muted mb-4">
              Please try again later.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredLawyers.map((lawyer: any) => (
            <LawyerCard key={lawyer.id} lawyer={lawyer} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredLawyers.length === 0 && (
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