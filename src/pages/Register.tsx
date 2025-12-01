import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scale, User, Briefcase, ArrowRight, Phone, MapPin, Award, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const SPECIALIZATIONS = [
  { value: 'Criminal Law', label: 'Criminal Law' },
  { value: 'Civil Law', label: 'Civil Law' },
  { value: 'Corporate Law', label: 'Corporate Law' },
  { value: 'Family Law', label: 'Family Law' },
  { value: 'Property Law', label: 'Property Law' },
  { value: 'Tax Law', label: 'Tax Law' },
  { value: 'Labor Law', label: 'Labor Law' },
  { value: 'Intellectual Property', label: 'Intellectual Property' },
  { value: 'Immigration Law', label: 'Immigration Law' },
  { value: 'Constitutional Law', label: 'Constitutional Law' },
  { value: 'Banking & Finance', label: 'Banking & Finance' },
  { value: 'Environmental Law', label: 'Environmental Law' },
  { value: 'Other', label: 'Other' },
];

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<'user' | 'lawyer'>('user');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Lawyer-specific fields
    phone: '',
    city: '',
    address: '',
    primary_specialization: '',
    bar_council_number: '',
    experience_years: '',
    firm: '',
    bio: '',
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    // Check for common password patterns
    const commonPasswords = ['password', '12345678', 'qwerty', 'abc123'];
    if (commonPasswords.some(p => formData.password.toLowerCase().includes(p)) || /^\d+$/.test(formData.password)) {
      toast({
        title: "Password too weak",
        description: "Password cannot be entirely numeric or too common. Include letters and numbers.",
        variant: "destructive",
      });
      return;
    }

    // Validate lawyer fields
    if (userType === 'lawyer') {
      if (!formData.phone) {
        toast({
          title: "Phone required",
          description: "Please provide your phone number.",
          variant: "destructive",
        });
        return;
      }
      if (!formData.city) {
        toast({
          title: "City required",
          description: "Please provide your city.",
          variant: "destructive",
        });
        return;
      }
      if (!formData.primary_specialization) {
        toast({
          title: "Specialization required",
          description: "Please select your primary specialization.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsLoading(true);

    try {
      const selectedRole = userType === 'user' ? 'USER' : 'LAWYER';
      
      // Build lawyer data if applicable
      const lawyerData = userType === 'lawyer' ? {
        phone: formData.phone,
        city: formData.city,
        address: formData.address,
        primary_specialization: formData.primary_specialization,
        bar_council_number: formData.bar_council_number,
        experience_years: formData.experience_years ? parseInt(formData.experience_years) : 0,
        firm: formData.firm,
        bio: formData.bio,
      } : {};
      
      const result = await register(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        selectedRole,
        lawyerData
      );

      // Different message for lawyers
      if (selectedRole === 'LAWYER') {
        toast({
          title: "Application submitted!",
          description: "Your lawyer application is pending approval. Please verify your email.",
        });
      } else {
        toast({
          title: "Account created!",
          description: "Please verify your email to continue.",
        });
      }

      // Always redirect to verification page after registration
      if (result.requiresVerification) {
        navigate('/verify-email');
      } else {
        if (selectedRole === "USER") {
          navigate('/app/dashboard');
        } else {
          navigate('/lawyer/pending');
        }
      }
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-light to-primary-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
          <div className="p-2 bg-white rounded-lg">
            <Scale className="h-8 w-8 text-primary" />
          </div>
          <div className="text-white">
            <h1 className="font-heading font-bold text-2xl">QanunAI</h1>
            <p className="text-sm text-white/80">Document Analyzer</p>
          </div>
        </Link>

        <Card className="shadow-elegant">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-heading text-center">Create Account</CardTitle>
            <CardDescription className="text-center">
              {userType === 'lawyer' 
                ? 'Register as a lawyer and get verified to offer consultations'
                : 'Choose your account type and fill in your details'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              {/* User Type Selection */}
              <div className="space-y-3">
                <Label className="text-base font-medium">I am a</Label>
                <RadioGroup
                  value={userType}
                  onValueChange={(value) => setUserType(value as 'user' | 'lawyer')}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="relative">
                    <RadioGroupItem
                      value="user"
                      id="user"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="user"
                      className="flex flex-col items-center justify-center gap-3 p-4 border-2 border-border rounded-lg cursor-pointer transition-all hover:bg-accent/5 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                    >
                      <User className="h-8 w-8 text-primary" />
                      <span className="font-medium">Standard User</span>
                    </Label>
                  </div>
                  <div className="relative">
                    <RadioGroupItem
                      value="lawyer"
                      id="lawyer"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="lawyer"
                      className="flex flex-col items-center justify-center gap-3 p-4 border-2 border-border rounded-lg cursor-pointer transition-all hover:bg-accent/5 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                    >
                      <Briefcase className="h-8 w-8 text-primary" />
                      <span className="font-medium">Lawyer</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Basic Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Lawyer-Specific Fields */}
              {userType === 'lawyer' && (
                <div className="space-y-4 pt-2 border-t">
                  <p className="text-sm text-muted-foreground font-medium">Professional Information</p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        <Phone className="h-3.5 w-3.5 inline mr-1" />
                        Phone *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+92 300 1234567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">
                        <MapPin className="h-3.5 w-3.5 inline mr-1" />
                        City *
                      </Label>
                      <Input
                        id="city"
                        type="text"
                        placeholder="Lahore"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialization">
                      <Award className="h-3.5 w-3.5 inline mr-1" />
                      Primary Specialization *
                    </Label>
                    <Select
                      value={formData.primary_specialization}
                      onValueChange={(value) => setFormData({ ...formData, primary_specialization: value })}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        {SPECIALIZATIONS.map((spec) => (
                          <SelectItem key={spec.value} value={spec.value}>
                            {spec.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="bar_council_number">Bar Council #</Label>
                      <Input
                        id="bar_council_number"
                        type="text"
                        placeholder="PBC/12345"
                        value={formData.bar_council_number}
                        onChange={(e) => setFormData({ ...formData, bar_council_number: e.target.value })}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience_years">Experience (years)</Label>
                      <Input
                        id="experience_years"
                        type="number"
                        min="0"
                        placeholder="5"
                        value={formData.experience_years}
                        onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="firm">
                      <Building2 className="h-3.5 w-3.5 inline mr-1" />
                      Law Firm / Organization
                    </Label>
                    <Input
                      id="firm"
                      type="text"
                      placeholder="ABC Law Associates"
                      value={formData.firm}
                      onChange={(e) => setFormData({ ...formData, firm: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Full Address</Label>
                    <Input
                      id="address"
                      type="text"
                      placeholder="123 Main Street, Block A"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Brief Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about your experience and expertise..."
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      disabled={isLoading}
                      rows={3}
                      maxLength={500}
                    />
                    <p className="text-xs text-muted-foreground">{formData.bio.length}/500</p>
                  </div>
                </div>
              )}

              {/* Password Fields */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Lawyer notice */}
              {userType === 'lawyer' && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-sm text-amber-800">
                    <strong>Note:</strong> Lawyer accounts require admin verification before you can access the platform. You'll be notified once your application is reviewed.
                  </p>
                </div>
              )}

              {/* Register Button */}
              <Button
                type="submit"
                className="w-full gradient-primary"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : userType === 'lawyer' ? "Submit Application" : "Create Account"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Already have an account?
                  </span>
                </div>
              </div>

              {/* Sign In CTA */}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                size="lg"
                asChild
              >
                <Link to="/auth">
                  Sign In
                </Link>
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-white/80 hover:text-white text-sm transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
