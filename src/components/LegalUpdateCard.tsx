import { 
  Clock, 
  ExternalLink, 
  AlertCircle,
  Calendar,
  Globe,
  Tag,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Update {
  id: number;
  headline: string;
  summary: string;
  source: string;
  publishDate: string;
  category: string;
  importance: string;
  readTime?: string;
  url?: string;
  tags?: string[];
}

interface LegalUpdateCardProps {
  update: Update;
}

export const LegalUpdateCard = ({ update }: LegalUpdateCardProps) => {
  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high':
        return 'risk-high';
      case 'medium':
        return 'risk-medium';
      case 'low':
        return 'risk-low';
      default:
        return 'bg-muted text-foreground-muted';
    }
  };

  const getImportanceIcon = (importance: string) => {
    switch (importance) {
      case 'high':
        return <AlertCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const formatCategory = (category: string) => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <Card className="hover-lift transition-smooth">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge 
                className={cn("text-xs", getImportanceColor(update.importance))}
              >
                {getImportanceIcon(update.importance)}
                <span className={cn(getImportanceIcon(update.importance) && "ml-1")}>
                  {update.importance.charAt(0).toUpperCase() + update.importance.slice(1)} Priority
                </span>
              </Badge>
              
              <Badge variant="outline" className="text-xs">
                {formatCategory(update.category)}
              </Badge>
            </div>
            
            <CardTitle className="font-heading text-lg leading-tight">
              {update.headline}
            </CardTitle>
            
            <div className="flex items-center gap-4 mt-2 text-xs text-foreground-muted">
              <span className="flex items-center">
                <Globe className="h-3 w-3 mr-1" />
                {update.source}
              </span>
              <span className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(update.publishDate)}
              </span>
              {update.readTime && (
                <span className="flex items-center">
                  <BookOpen className="h-3 w-3 mr-1" />
                  {update.readTime} read
                </span>
              )}
            </div>
          </div>
          
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Summary */}
        <CardDescription className="text-sm leading-relaxed">
          {update.summary}
        </CardDescription>

        {/* Tags */}
        {update.tags && update.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {update.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                <Tag className="h-2 w-2 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Action */}
        <div className="flex items-center justify-end pt-2 border-t">
          <Button variant="ghost" size="sm" className="text-primary">
            Read Full Article
            <ExternalLink className="ml-2 h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};