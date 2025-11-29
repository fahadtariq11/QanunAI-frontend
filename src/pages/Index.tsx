import { ArrowRight, Shield, FileText, Users, Zap, CheckCircle, Scale, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import heroImage from '@/assets/hero-legal.jpg';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Footer from '@/components/Footer';

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: FileText,
      title: "Document Analysis",
      description: "AI-powered analysis of legal documents with clause-by-clause risk assessment"
    },
    {
      icon: Shield,
      title: "Risk Detection",
      description: "Identify potential legal risks and problematic clauses before signing"
    },
    {
      icon: Users,
      title: "Lawyer Directory",
      description: "Connect with verified legal professionals specializing in your domain"
    },
    {
      icon: Zap,
      title: "Instant Processing",
      description: "Get results in minutes, not hours with our advanced OCR and parsing"
    }
  ];

  const benefits = [
    "Save time on document review",
    "Reduce legal risks and exposure",
    "Access expert legal guidance",
    "Simplified contract summaries",
    "Real-time compliance checking"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary rounded-lg">
                <Scale className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-heading font-bold text-lg">QanunAI</h1>
                <p className="text-xs text-foreground-muted">Document Analyzer</p>
              </div>
            </div>


            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Get Started</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <div className="space-y-2">
                <Button variant="ghost" className="w-full" asChild>
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary min-h-[90vh] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light/95 to-primary-dark/90" />
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              AI-Powered Legal Technology
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-heading font-bold text-white leading-tight">
              Legal Document
              <span className="block text-accent-light">Analyzer & Risk</span>
              <span className="block">Assessment Platform</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Upload your legal documents and get instant AI-powered analysis, risk assessment, 
              and simplified summaries. Connect with expert lawyers when you need human expertise.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 h-auto"
                asChild
              >
                <Link to="/register">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 h-auto"
              >
                Watch Demo
              </Button>
            </div>
            
            <div className="pt-12 text-white/80">
              <p className="text-sm mb-4">Trusted by legal professionals worldwide</p>
              <div className="flex justify-center items-center space-x-8 opacity-60">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-2xl font-bold">10K+</div>
                <div className="text-2xl font-bold">99.9%</div>
              </div>
              <div className="flex justify-center items-center space-x-8 text-xs">
                <span>Law Firms</span>
                <span>Documents Analyzed</span>
                <span>Accuracy Rate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-surface">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold">
              Powerful Features for Legal Professionals
            </h2>
            <p className="text-xl text-foreground-muted max-w-2xl mx-auto">
              Everything you need to analyze, understand, and manage legal documents efficiently
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover-lift text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="font-heading">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-accent/10 text-accent border-accent/20">
                  Why Choose Our Platform
                </Badge>
                <h2 className="text-4xl md:text-5xl font-heading font-bold">
                  Streamline Your Legal Workflow
                </h2>
                <p className="text-xl text-foreground-muted">
                  Transform how you handle legal documents with AI-powered insights and expert legal guidance at your fingertips.
                </p>
              </div>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-accent flex-shrink-0" />
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-6">
                <Button size="lg" className="gradient-primary" asChild>
                  <Link to="/register">
                    Start Analyzing Documents
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 rounded-3xl p-8">
                <div className="w-full h-full bg-white rounded-2xl shadow-elegant p-6 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Shield className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-heading font-bold">Enterprise Security</h3>
                    <p className="text-foreground-muted">
                      Bank-level encryption and compliance standards
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-5"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white">
              Ready to Transform Your Legal Workflow?
            </h2>
            <p className="text-xl text-white/90">
              Join thousands of legal professionals who trust our platform for document analysis and risk assessment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 h-auto"
                asChild
              >
                <Link to="/register">
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-6 h-auto"
                asChild
              >
                <Link to="/app/lawyers">
                  Find Legal Experts
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
