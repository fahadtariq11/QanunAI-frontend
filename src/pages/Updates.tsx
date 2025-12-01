import { useState } from 'react';
import { 
  Clock, 
  ExternalLink, 
  Filter, 
  Search, 
  BookOpen,
  AlertCircle,
  TrendingUp,
  Calendar,
  Globe,
  Tag,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LegalUpdateCard } from '@/components/LegalUpdateCard';
import { useLegalUpdates } from '@/hooks/useApi';

const Updates = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const { data: updates = [], isLoading, error } = useLegalUpdates();

  const categories = [
    'all',
    'corporate',
    'employment',
    'intellectual-property',
    'data-privacy',
    'compliance',
    'litigation',
    'regulatory'
  ];

  const filteredUpdates = updates.filter((update: any) => {
    const matchesSearch = update.headline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         update.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         update.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         update.content?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
                           update.category?.toLowerCase() === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const formatCategory = (category: string) => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high':
        return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'medium':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'low':
        return 'text-accent bg-accent/10 border-accent/20';
      default:
        return 'text-foreground-muted bg-muted';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Legal Updates</h1>
          <p className="text-foreground-muted">Stay informed with the latest legal developments</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-foreground-muted">
          <TrendingUp className="h-4 w-4" />
          <span>Updated daily</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground-muted" />
          <Input
            placeholder="Search legal updates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground-muted">Category:</span>
          <div className="flex flex-wrap gap-1">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="text-xs h-8"
              >
                {formatCategory(category)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-sm font-medium">High Priority</p>
                <p className="text-2xl font-bold">{updates.filter((u: any) => u.importance === 'high').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Total Updates</p>
                <p className="text-2xl font-bold">{updates.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm font-medium">Categories</p>
                <p className="text-2xl font-bold">{categories.length - 1}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-foreground-muted">
          Showing {filteredUpdates.length} update{filteredUpdates.length !== 1 ? 's' : ''}
        </p>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Advanced Filters
        </Button>
      </div>

      {/* Updates List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading updates...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUpdates.map((update: any) => (
            <LegalUpdateCard key={update.id} update={update} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredUpdates.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="h-12 w-12 text-foreground-muted mx-auto mb-4" />
            <h3 className="text-lg font-heading font-semibold mb-2">No updates found</h3>
            <p className="text-foreground-muted mb-4">
              Try adjusting your search terms or category filters
            </p>
            <Button variant="outline" onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Updates;