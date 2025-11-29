import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Upload, MapPin, DollarSign, Briefcase, Globe, Star } from "lucide-react";

const LawyerProfile = () => {
  const [formData, setFormData] = useState({
    fullName: "Dr. Jennifer Martinez",
    email: "jennifer.martinez@lawfirm.com",
    specializations: ["Contract Law", "Employment Law", "Intellectual Property"],
    experience: "12",
    jurisdiction: "California, USA",
    hourlyRate: "350",
    bio: "Experienced corporate attorney specializing in contract negotiations, employment disputes, and intellectual property protection. Over 12 years of practice with Fortune 500 companies and startups.",
    languages: ["English", "Spanish"],
  });

  const allSpecializations = [
    "Contract Law",
    "Employment Law",
    "Intellectual Property",
    "Corporate Law",
    "Real Estate Law",
    "Family Law",
    "Criminal Law",
    "Tax Law",
  ];

  const allLanguages = ["English", "Spanish", "French", "German", "Mandarin", "Arabic", "Portuguese"];

  const toggleSelection = (array: string[], item: string) => {
    return array.includes(item) ? array.filter((i) => i !== item) : [...array, item];
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your professional information and public profile</p>
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
                  <AvatarImage src="" alt={formData.fullName} />
                  <AvatarFallback className="text-lg">JM</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">JPG or PNG, max 2MB</p>
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@lawfirm.com"
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
                      onClick={() =>
                        setFormData({
                          ...formData,
                          specializations: toggleSelection(formData.specializations, spec),
                        })
                      }
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
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    placeholder="12"
                    className="max-w-[120px]"
                  />
                  <span className="text-sm text-muted-foreground">years</span>
                </div>
              </div>

              {/* Jurisdiction */}
              <div className="space-y-2">
                <Label htmlFor="jurisdiction">Jurisdiction / Region</Label>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="jurisdiction"
                    value={formData.jurisdiction}
                    onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
                    placeholder="e.g., California, USA"
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Hourly Rate */}
              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Hourly Rate (USD)</Label>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="hourlyRate"
                    type="number"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                    placeholder="350"
                    className="max-w-[150px]"
                  />
                  <span className="text-sm text-muted-foreground">per hour</span>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio / About</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell clients about your experience and expertise..."
                  className="min-h-[120px]"
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
                      onClick={() =>
                        setFormData({
                          ...formData,
                          languages: toggleSelection(formData.languages, lang),
                        })
                      }
                    >
                      <Globe className="h-3 w-3 mr-1" />
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button className="w-full">Save Profile</Button>
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
                  <AvatarImage src="" alt={formData.fullName} />
                  <AvatarFallback className="text-2xl">JM</AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-lg">{formData.fullName}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                  <MapPin className="h-3 w-3" />
                  {formData.jurisdiction}
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                  <DollarSign className="h-3 w-3" />
                  ${formData.hourlyRate}/hr
                </div>
              </div>

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

              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">EXPERIENCE</p>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{formData.experience} years</span>
                </div>
              </div>

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

              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">ABOUT</p>
                <p className="text-sm text-muted-foreground">{formData.bio}</p>
              </div>

              <div className="pt-2">
                <Button className="w-full" variant="outline">
                  View Public Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LawyerProfile;
