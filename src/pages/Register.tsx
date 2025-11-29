import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scale, User, Briefcase, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<'user' | 'lawyer'>('user');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    if (formData.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/app/dashboard`,
          data: {
            full_name: formData.fullName,
            user_type: userType,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });

      navigate('/auth');
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
              Choose your account type and fill in your details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-6">
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

              {/* Full Name Field */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Email Field */}
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

              {/* Password Field */}
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

              {/* Confirm Password Field */}
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

              {/* Register Button */}
              <Button
                type="submit"
                className="w-full gradient-primary"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
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
