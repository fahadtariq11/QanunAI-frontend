import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Upload, MapPin, DollarSign, Briefcase, Globe, Star, Loader2, Save, CheckCircle } from "lucide-react";
import { useMyLawyerProfile, useUpdateLawyerProfile, useCreateLawyerProfile } from "@/hooks/useApi";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const LawyerProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: profile, isLoading, error } = useMyLawyerProfile();
  const updateProfile = useUpdateLawyerProfile();
  const createProfile = useCreateLawyerProfile();
  
  const [formData, setFormData] = useState({
    title: "",
    firm: "",
    specializations: [] as string[],
    experience_years: 0,
    jurisdiction: "",
    hourly_rate: 0,
    bio: "",
    languages: [] as string[],
    response_time: "",
  });

  const [hasChanges, setHasChanges] = useState(false);
  const isNewProfile = error && !profile;

  // Load profile data when available
  useEffect(() => {
    if (profile) {
      setFormData({
        title: profile.title || "",
        firm: profile.firm || "",
        specializations: profile.specializations || [],
        experience_years: profile.experience_years || 0,
        jurisdiction: profile.jurisdiction || "",
        hourly_rate: profile.hourly_rate || 0,
        bio: profile.bio || "",
        languages: profile.languages || [],
        response_time: profile.response_time || "",
      });
    }
  }, [profile]);

  const allSpecializations = [
    "Contract Law",
    "Employment Law",
    "Intellectual Property",
    "Corporate Law",
    "Real Estate Law",
    "Family Law",
    "Criminal Law",
    "Tax Law",
    "Immigration Law",
    "Civil Litigation",
  ];

  const allLanguages = ["English", "Urdu", "Punjabi", "Sindhi", "Pashto", "Arabic", "Hindi"];

  const toggleSelection = (array: string[], item: string) => {
    return array.includes(item) ? array.filter((i) => i !== item) : [...array, item];
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSaveProfile = async () => {
    try {
      const dataToSave = {
        ...formData,
        experience_years: parseInt(formData.experience_years.toString()) || 0,
        hourly_rate: parseFloat(formData.hourly_rate.toString()) || 0,
      };

      if (isNewProfile) {
        await createProfile.mutateAsync(dataToSave);
        toast({
          title: "Profile Created!",
          description: "Your lawyer profile has been created and is now visible in the directory.",
        });
      } else {
        await updateProfile.mutateAsync(dataToSave);
        toast({
          title: "Profile Updated!",
          description: "Your changes have been saved successfully.",
        });
      }
      setHasChanges(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{isNewProfile ? "Create Your Profile" : "My Profile"}</h1>
          <p className="text-muted-foreground mt-2">
            {isNewProfile 
              ? "Set up your professional profile to appear in the lawyer directory" 
              : "Manage your professional information and public profile"}
          </p>
        </div>
        {hasChanges && (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            Unsaved Changes
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
              <CardDescription>Update your professional details visible to clients</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Photo */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile?.avatar} alt={user?.full_name || user?.email} />
                  <AvatarFallback className="text-lg">
                    {getInitials(user?.full_name || user?.email || 'L')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user?.full_name || user?.email}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  {profile?.verified && (
                    <Badge variant="secondary" className="mt-1">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Professional Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  placeholder="e.g., Senior Corporate Lawyer"
                />
              </div>

              {/* Firm */}
              <div className="space-y-2">
                <Label htmlFor="firm">Law Firm / Organization</Label>
                <Input
                  id="firm"
                  value={formData.firm}
                  onChange={(e) => handleFieldChange('firm', e.target.value)}
                  placeholder="e.g., Smith & Associates"
                />
              </div>

              {/* Specializations */}
              <div className="space-y-2">
                <Label>Specializations</Label>
                <p className="text-xs text-muted-foreground mb-2">Select all areas you specialize in</p>
                <div className="flex flex-wrap gap-2">
                  {allSpecializations.map((spec) => (
                    <Badge
                      key={spec}
                      variant={formData.specializations.includes(spec) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleFieldChange('specializations', toggleSelection(formData.specializations, spec))}
                    >
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="experience"
                    type="number"
                    value={formData.experience_years}
                    onChange={(e) => handleFieldChange('experience_years', e.target.value)}
                    placeholder="0"
                    className="max-w-[120px]"
                    min={0}
                  />
                  <span className="text-sm text-muted-foreground">years</span>
                </div>
              </div>

              {/* Jurisdiction */}
              <div className="space-y-2">
                <Label htmlFor="jurisdiction">Jurisdiction / Location</Label>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="jurisdiction"
                    value={formData.jurisdiction}
                    onChange={(e) => handleFieldChange('jurisdiction', e.target.value)}
                    placeholder="e.g., Lahore, Pakistan"
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Hourly Rate */}
              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Hourly Rate (PKR)</Label>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="hourlyRate"
                    type="number"
                    value={formData.hourly_rate}
                    onChange={(e) => handleFieldChange('hourly_rate', e.target.value)}
                    placeholder="5000"
                    className="max-w-[150px]"
                    min={0}
                  />
                  <span className="text-sm text-muted-foreground">per hour</span>
                </div>
              </div>

              {/* Response Time */}
              <div className="space-y-2">
                <Label htmlFor="responseTime">Typical Response Time</Label>
                <Input
                  id="responseTime"
                  value={formData.response_time}
                  onChange={(e) => handleFieldChange('response_time', e.target.value)}
                  placeholder="e.g., Within 24 hours"
                />
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio / About</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleFieldChange('bio', e.target.value)}
                  placeholder="Tell clients about your experience and expertise..."
                  className="min-h-[120px]"
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground">{formData.bio.length} / 500 characters</p>
              </div>

              {/* Languages */}
              <div className="space-y-2">
                <Label>Languages</Label>
                <p className="text-xs text-muted-foreground mb-2">Select all languages you speak</p>
                <div className="flex flex-wrap gap-2">
                  {allLanguages.map((lang) => (
                    <Badge
                      key={lang}
                      variant={formData.languages.includes(lang) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleFieldChange('languages', toggleSelection(formData.languages, lang))}
                    >
                      <Globe className="h-3 w-3 mr-1" />
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button 
                className="w-full" 
                onClick={handleSaveProfile}
                disabled={updateProfile.isPending || createProfile.isPending}
              >
                {(updateProfile.isPending || createProfile.isPending) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isNewProfile ? "Create Profile" : "Save Profile"}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Public Profile Preview */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Public Profile Preview</CardTitle>
              <CardDescription>How clients see your profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-3">
                  <AvatarImage src={profile?.avatar} alt={user?.full_name || user?.email} />
                  <AvatarFallback className="text-2xl">
                    {getInitials(user?.full_name || user?.email || 'L')}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-lg">{user?.full_name || 'Your Name'}</h3>
                {formData.title && (
                  <p className="text-sm text-muted-foreground">{formData.title}</p>
                )}
                {formData.jurisdiction && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <MapPin className="h-3 w-3" />
                    {formData.jurisdiction}
                  </div>
                )}
                {formData.hourly_rate > 0 && (
                  <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                    <DollarSign className="h-3 w-3" />
                    PKR {formData.hourly_rate}/hr
                  </div>
                )}
                {profile?.rating > 0 && (
                  <div className="flex items-center gap-1 text-sm mt-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {profile.rating} ({profile.review_count} reviews)
                  </div>
                )}
              </div>

              {formData.specializations.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">SPECIALIZATIONS</p>
                  <div className="flex flex-wrap gap-1">
                    {formData.specializations.map((spec) => (
                      <Badge key={spec} variant="secondary" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {formData.experience_years > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">EXPERIENCE</p>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formData.experience_years} years</span>
                  </div>
                </div>
              )}

              {formData.languages.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">LANGUAGES</p>
                  <div className="flex flex-wrap gap-1">
                    {formData.languages.map((lang) => (
                      <Badge key={lang} variant="outline" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {formData.bio && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">ABOUT</p>
                  <p className="text-sm text-muted-foreground">{formData.bio}</p>
                </div>
              )}

              {formData.response_time && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">RESPONSE TIME</p>
                  <p className="text-sm">{formData.response_time}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LawyerProfile;
