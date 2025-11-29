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
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LegalUpdateCard } from '@/components/LegalUpdateCard';

const Updates = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

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

  // Mock legal updates data
  const updates = [
    {
      id: 1,
      headline: "New Data Privacy Regulations Impact Contract Requirements",
      summary: "Recent updates to data privacy laws require additional clauses in contracts involving personal data processing. Companies must update their agreements by Q2 2024.",
      source: "Legal Today",
      publishDate: "2024-01-15",
      category: "data-privacy",
      importance: "high",
      readTime: "5 min",
      url: "#",
      tags: ["GDPR", "Data Protection", "Contracts"]
    },
    {
      id: 2,
      headline: "Supreme Court Ruling Affects Employment Arbitration Clauses",
      summary: "A landmark Supreme Court decision has changed how arbitration clauses in employment contracts are enforced, particularly regarding class action waivers.",
      source: "Employment Law Weekly",
      publishDate: "2024-01-14",
      category: "employment",
      importance: "high",
      readTime: "8 min",
      url: "#",
      tags: ["Arbitration", "Employment", "Supreme Court"]
    },
    {
      id: 3,
      headline: "New Corporate Governance Standards for Public Companies",
      summary: "The SEC has introduced new disclosure requirements for executive compensation and board diversity that will affect proxy statements and governance policies.",
      source: "Corporate Counsel",
      publishDate: "2024-01-13",
      category: "corporate",
      importance: "medium",
      readTime: "6 min",
      url: "#",
      tags: ["SEC", "Corporate Governance", "Disclosure"]
    },
    {
      id: 4,
      headline: "AI in Legal Practice: New Ethical Guidelines Released",
      summary: "The American Bar Association has published comprehensive guidelines for the ethical use of artificial intelligence in legal practice and client representation.",
      source: "ABA Journal",
      publishDate: "2024-01-12",
      category: "regulatory",
      importance: "medium",
      readTime: "4 min",
      url: "#",
      tags: ["AI", "Ethics", "Legal Practice"]
    },
    {
      id: 5,
      headline: "Intellectual Property Updates: Patent Filing Changes",
      summary: "New USPTO rules streamline the patent application process while introducing stricter requirements for software and business method patents.",
      source: "IP Law Today",
      publishDate: "2024-01-11",
      category: "intellectual-property",
      importance: "medium",
      readTime: "7 min",
      url: "#",
      tags: ["Patents", "USPTO", "Software"]
    },
    {
      id: 6,
      headline: "Compliance Alert: Anti-Money Laundering Rule Updates",
      summary: "Financial institutions must implement new customer due diligence requirements under updated AML regulations effective March 2024.",
      source: "Compliance Today",
      publishDate: "2024-01-10",
      category: "compliance",
      importance: "high",
      readTime: "6 min",
      url: "#",
      tags: ["AML", "Financial Services", "Compliance"]
    }
  ];

  const filteredUpdates = updates.filter(update => {
    const matchesSearch = update.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         update.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         update.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || update.category === selectedCategory;
    
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
                <p className="text-2xl font-bold">{updates.filter(u => u.importance === 'high').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">This Week</p>
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
                <p className="text-sm font-medium">Read Time</p>
                <p className="text-2xl font-bold">{updates.reduce((acc, update) => acc + parseInt(update.readTime), 0)} min</p>
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
      <div className="space-y-4">
        {filteredUpdates.map((update) => (
          <LegalUpdateCard key={update.id} update={update} />
        ))}
      </div>

      {/* Empty State */}
      {filteredUpdates.length === 0 && (
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