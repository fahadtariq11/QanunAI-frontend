import { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Edit,
  Save,
  X,
  CreditCard,
  Briefcase,
  FileText,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useCurrentUser, useUpdateProfile } from '@/hooks/useApi';
import { useAuth } from '@/contexts/AuthContext';

const Profile = () => {
  const { toast } = useToast();
  const { user: authUser } = useAuth();
  const { data: userData, isLoading } = useCurrentUser();
  const updateProfileMutation = useUpdateProfile();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    location: '',
    jobTitle: '',
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    riskNotifications: true,
    weeklyReports: false,
    marketingEmails: false
  });

  // Update local state when API data loads
  useEffect(() => {
    if (userData) {
      // Parse full_name into firstName and lastName
      const nameParts = (userData.full_name || '').split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      setProfile({
        firstName: firstName,
        lastName: lastName,
        email: userData.email || '',
        phone: userData.phone || '',
        company: userData.company || '',
        location: userData.location || '',
        jobTitle: userData.job_title || '',
      });
    } else if (authUser) {
      setProfile(prev => ({
        ...prev,
        email: authUser.email || '',
        firstName: authUser.firstName || '',
        lastName: authUser.lastName || '',
      }));
    }
  }, [userData, authUser]);

  const handleSave = async () => {
    try {
      const fullName = `${profile.firstName} ${profile.lastName}`.trim();
      await updateProfileMutation.mutateAsync({
        full_name: fullName,
        phone: profile.phone,
        company: profile.company,
        location: profile.location,
        job_title: profile.jobTitle,
      });
      
      toast({
        title: "Profile updated",
        description: "Your changes have been saved successfully.",
      });
      setIsEditing(false);
    } catch (err: any) {
      toast({
        title: "Update failed",
        description: err.message || "Failed to update profile.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (userData) {
      // Parse full_name into firstName and lastName
      const nameParts = (userData.full_name || '').split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      setProfile({
        firstName: firstName,
        lastName: lastName,
        email: userData.email || '',
        phone: userData.phone || '',
        company: userData.company || '',
        location: userData.location || '',
        jobTitle: userData.job_title || '',
      });
    }
  };

  const fullName = `${profile.firstName} ${profile.lastName}`.trim() || 'User';
  const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Profile</h1>
          <p className="text-muted-foreground">Manage your personal details and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-heading">Personal Information</CardTitle>
                {!isEditing ? (
                  <Button size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={handleSave}
                      disabled={updateProfileMutation.isPending}
                    >
                      {updateProfileMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancel}>
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button variant="outline" size="sm">
                    Change Photo
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  {isEditing ? (
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                    />
                  ) : (
                    <div className="flex items-center p-2 text-sm">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      {profile.firstName || '-'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  {isEditing ? (
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                    />
                  ) : (
                    <div className="flex items-center p-2 text-sm">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      {profile.lastName || '-'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex items-center p-2 text-sm">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    {profile.email}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      placeholder="+1 (555) 123-4567"
                    />
                  ) : (
                    <div className="flex items-center p-2 text-sm">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      {profile.phone || '-'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title / Role</Label>
                  {isEditing ? (
                    <Input
                      id="jobTitle"
                      value={profile.jobTitle}
                      onChange={(e) => setProfile({...profile, jobTitle: e.target.value})}
                      placeholder="Legal Counsel"
                    />
                  ) : (
                    <div className="flex items-center p-2 text-sm">
                      <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                      {profile.jobTitle || '-'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company <span className="text-muted-foreground">(optional)</span></Label>
                  {isEditing ? (
                    <Input
                      id="company"
                      value={profile.company}
                      onChange={(e) => setProfile({...profile, company: e.target.value})}
                      placeholder="Company Name"
                    />
                  ) : (
                    <div className="flex items-center p-2 text-sm">
                      <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                      {profile.company || '-'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  {isEditing ? (
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => setProfile({...profile, location: e.target.value})}
                      placeholder="City, Country"
                    />
                  ) : (
                    <div className="flex items-center p-2 text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      {profile.location || '-'}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to receive updates and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive important security and risk alerts
                  </p>
                </div>
                <Switch
                  checked={notifications.emailAlerts}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, emailAlerts: checked})
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Risk Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when high-risk clauses are detected
                  </p>
                </div>
                <Switch
                  checked={notifications.riskNotifications}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, riskNotifications: checked})
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive weekly summaries of your document analysis
                  </p>
                </div>
                <Switch
                  checked={notifications.weeklyReports}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, weeklyReports: checked})
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Product updates and legal insights
                  </p>
                </div>
                <Switch
                  checked={notifications.marketingEmails}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, marketingEmails: checked})
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Usage / Status */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Account Info</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b">
                <span className="text-sm font-medium">Role</span>
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                  {authUser?.role || 'USER'}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <FileText className="h-4 w-4 mr-2" />
                    Documents Analyzed
                  </div>
                  <span className="text-lg font-semibold">-</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Risk Items Found
                  </div>
                  <span className="text-lg font-semibold">-</span>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button className="w-full" variant="outline">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Manage Billing
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;