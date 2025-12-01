import { Link } from 'react-router-dom';
import { Scale, Clock, CheckCircle2, XCircle, LogOut, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const PendingApproval = () => {
  const { user, lawyerStatus, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const getStatusContent = () => {
    switch (lawyerStatus) {
      case 'VERIFIED':
        return {
          icon: <CheckCircle2 className="h-16 w-16 text-green-500" />,
          title: 'Application Approved! 🎉',
          description: 'Congratulations! Your lawyer account has been verified. You now have full access to the platform.',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          action: (
            <Button asChild className="gradient-primary" size="lg">
              <Link to="/lawyer/dashboard">Go to Dashboard</Link>
            </Button>
          ),
        };
      case 'REJECTED':
        return {
          icon: <XCircle className="h-16 w-16 text-red-500" />,
          title: 'Application Not Approved',
          description: 'Unfortunately, your application was not approved. Please contact support for more information or to resubmit your application.',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          action: (
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <a href="mailto:support@qanunai.com">
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Support
                </a>
              </Button>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          ),
        };
      default: // PENDING
        return {
          icon: <Clock className="h-16 w-16 text-amber-500" />,
          title: 'Application Under Review',
          description: 'Thank you for registering as a lawyer on QanunAI. Our team is reviewing your application and will notify you via email once it\'s processed.',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          action: (
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => window.location.reload()}>
                Check Status
              </Button>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          ),
        };
    }
  };

  const status = getStatusContent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-light to-primary-dark flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
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
          <CardHeader className="space-y-1 text-center">
            <div className={`mx-auto mb-4 p-4 rounded-full ${status.bgColor} ${status.borderColor} border`}>
              {status.icon}
            </div>
            <CardTitle className="text-2xl font-heading">{status.title}</CardTitle>
            <CardDescription className="text-base">
              {status.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* User Info */}
            <div className={`p-4 rounded-lg ${status.bgColor} ${status.borderColor} border`}>
              <div className="text-sm text-muted-foreground mb-1">Registered as</div>
              <div className="font-medium">{user?.full_name}</div>
              <div className="text-sm text-muted-foreground">{user?.email}</div>
            </div>

            {/* What happens next - only for pending */}
            {lawyerStatus === 'PENDING' && (
              <div className="space-y-3">
                <h4 className="font-medium">What happens next?</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
                    <span>Our team reviews your professional credentials and bar council registration.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                    <span>You'll receive an email notification about your application status.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
                    <span>Once approved, you can start receiving consultation requests from users.</span>
                  </li>
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-center">
              {status.action}
            </div>

            {/* Estimated time - only for pending */}
            {lawyerStatus === 'PENDING' && (
              <p className="text-xs text-center text-muted-foreground">
                Applications are typically reviewed within 24-48 hours.
              </p>
            )}
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

export default PendingApproval;
