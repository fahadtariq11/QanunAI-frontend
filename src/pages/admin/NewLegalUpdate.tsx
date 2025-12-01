import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Newspaper, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const CATEGORIES = [
  'Constitutional Law',
  'Criminal Law',
  'Civil Law',
  'Corporate Law',
  'Tax Law',
  'Labor Law',
  'Property Law',
  'Family Law',
  'Banking & Finance',
  'Regulatory Updates',
  'Court Decisions',
  'Legislative Changes',
  'Other',
];

const NewLegalUpdate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    headline: '',
    summary: '',
    source: '',
    publish_date: new Date().toISOString().split('T')[0],
    category: '',
    importance: 'medium',
    read_time: '5 min',
    url: '',
    tags: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('adminToken');
    
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      };

      const res = await fetch(`${API_BASE_URL}/admin/legal-updates/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Failed to create update');
      }

      toast({ title: 'Success', description: 'Legal update created successfully.' });
      navigate('/admin-portal/legal-updates');
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/admin-portal/legal-updates">
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-700">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-heading font-bold text-white">New Legal Update</h1>
          <p className="text-slate-400 mt-1">Create a new legal announcement</p>
        </div>
      </div>

      <Card className="bg-slate-800/50 border-slate-700 max-w-3xl">
        <CardHeader>
          <CardTitle className="text-white font-heading flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-amber-500" />
            Update Details
          </CardTitle>
          <CardDescription className="text-slate-400">
            Fill in the details for the legal update
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="headline" className="text-slate-200">Headline *</Label>
              <Input
                id="headline"
                value={formData.headline}
                onChange={e => setFormData({ ...formData, headline: e.target.value })}
                required
                className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                placeholder="Supreme Court rules on..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary" className="text-slate-200">Summary *</Label>
              <Textarea
                id="summary"
                value={formData.summary}
                onChange={e => setFormData({ ...formData, summary: e.target.value })}
                required
                rows={4}
                className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 resize-none"
                placeholder="Brief summary of the legal update..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-200">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={v => setFormData({ ...formData, category: v })}
                  required
                >
                  <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat} className="text-white hover:bg-slate-700">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-200">Importance</Label>
                <Select
                  value={formData.importance}
                  onValueChange={v => setFormData({ ...formData, importance: v })}
                >
                  <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="low" className="text-white hover:bg-slate-700">Low</SelectItem>
                    <SelectItem value="medium" className="text-white hover:bg-slate-700">Medium</SelectItem>
                    <SelectItem value="high" className="text-white hover:bg-slate-700">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source" className="text-slate-200">Source *</Label>
                <Input
                  id="source"
                  value={formData.source}
                  onChange={e => setFormData({ ...formData, source: e.target.value })}
                  required
                  className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                  placeholder="Supreme Court of Pakistan"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="publish_date" className="text-slate-200">Publish Date *</Label>
                <Input
                  id="publish_date"
                  type="date"
                  value={formData.publish_date}
                  onChange={e => setFormData({ ...formData, publish_date: e.target.value })}
                  required
                  className="bg-slate-900/50 border-slate-600 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="read_time" className="text-slate-200">Read Time</Label>
                <Input
                  id="read_time"
                  value={formData.read_time}
                  onChange={e => setFormData({ ...formData, read_time: e.target.value })}
                  className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                  placeholder="5 min"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="url" className="text-slate-200">Source URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={e => setFormData({ ...formData, url: e.target.value })}
                  className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags" className="text-slate-200">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={e => setFormData({ ...formData, tags: e.target.value })}
                className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                placeholder="property, inheritance, civil"
              />
              <p className="text-xs text-slate-500">Separate tags with commas</p>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-700">
              <Button
                type="submit"
                disabled={loading}
                className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Update'
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/admin-portal/legal-updates')}
                className="text-slate-400 hover:text-white hover:bg-slate-700"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewLegalUpdate;
