import { useState } from 'react';
import {
  Lock,
  Shield,
  Monitor,
  Download,
  Trash2,
  Globe,
  HelpCircle,
  Mail,
  Moon,
  Sun,
  Laptop
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const Settings = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [autoDeleteEnabled, setAutoDeleteEnabled] = useState(false);
  const [theme, setTheme] = useState('system');
  const [language, setLanguage] = useState('en');

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account security, privacy, and application settings</p>
      </div>

      <div className="space-y-6">
        {/* Security Section */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Security
            </CardTitle>
            <CardDescription>
              Manage your account security settings and authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Change Password */}
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <Label className="font-medium">Password</Label>
                <p className="text-sm text-muted-foreground">
                  Change your password to keep your account secure
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Lock className="mr-2 h-4 w-4" />
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                      Password change functionality will be connected to the backend later.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Update Password</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Two-Factor Authentication */}
            <div className="flex items-center justify-between py-3 border-b">
              <div className="space-y-0.5">
                <Label className="font-medium">Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Switch
                checked={twoFactorEnabled}
                onCheckedChange={setTwoFactorEnabled}
              />
            </div>

            {/* Login Sessions */}
            <div className="flex items-center justify-between py-3">
              <div>
                <Label className="font-medium">Active Sessions</Label>
                <p className="text-sm text-muted-foreground">
                  View and manage your active login sessions
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Monitor className="mr-2 h-4 w-4" />
                Manage Sessions
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Data Section */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading flex items-center">
              <Lock className="h-5 w-5 mr-2" />
              Privacy & Data
            </CardTitle>
            <CardDescription>
              Control your data and privacy preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Download Data */}
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <Label className="font-medium">Download Your Data</Label>
                <p className="text-sm text-muted-foreground">
                  Export all your documents and analysis data
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download Data
              </Button>
            </div>

            {/* Auto-Delete Documents */}
            <div className="flex items-center justify-between py-3">
              <div className="space-y-0.5">
                <Label className="font-medium">Auto-Delete Documents</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically delete documents after 90 days
                </p>
              </div>
              <Switch
                checked={autoDeleteEnabled}
                onCheckedChange={setAutoDeleteEnabled}
              />
            </div>
          </CardContent>
        </Card>

        {/* Application Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Application Settings
            </CardTitle>
            <CardDescription>
              Customize your app experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Theme */}
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <Label className="font-medium">Theme</Label>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred color theme
                </p>
              </div>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center">
                      <Sun className="h-4 w-4 mr-2" />
                      Light
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center">
                      <Moon className="h-4 w-4 mr-2" />
                      Dark
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center">
                      <Laptop className="h-4 w-4 mr-2" />
                      System
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Language */}
            <div className="flex items-center justify-between py-3">
              <div>
                <Label className="font-medium">Language</Label>
                <p className="text-sm text-muted-foreground">
                  Select your preferred language
                </p>
              </div>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Support Section */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading flex items-center">
              <HelpCircle className="h-5 w-5 mr-2" />
              Support
            </CardTitle>
            <CardDescription>
              Get help and manage your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <HelpCircle className="mr-2 h-4 w-4" />
              Help Center
            </Button>
            
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="mailto:support@qanunai.com">
                <Mail className="mr-2 h-4 w-4" />
                Contact Support
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="font-heading text-destructive flex items-center">
              <Trash2 className="h-5 w-5 mr-2" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Irreversible actions for your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove all your data including documents, analysis results, and profile information
                    from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;