import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Bell, CreditCard, Lock, Trash2 } from "lucide-react";

const LawyerSettings = () => {
  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account preferences and security</p>
      </div>

      {/* Security Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            <CardTitle>Security</CardTitle>
          </div>
          <CardDescription>Manage your password and two-factor authentication</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Change Password */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Change Password</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" placeholder="Enter current password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" placeholder="Enter new password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
              </div>
              <Button>Update Password</Button>
            </div>
          </div>

          <Separator />

          {/* Two-Factor Authentication */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Two-Factor Authentication</h3>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm">Enable 2FA</p>
                <p className="text-xs text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Switch />
            </div>
            <Button variant="outline" disabled>
              Configure 2FA
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription>Manage how you receive consultation alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">New Consultation Requests</p>
              <p className="text-xs text-muted-foreground">Get notified when a client requests your consultation</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Consultation Updates</p>
              <p className="text-xs text-muted-foreground">
                Get notified about updates to ongoing consultations
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Email Notifications</p>
              <p className="text-xs text-muted-foreground">Receive notifications via email</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">SMS Notifications</p>
              <p className="text-xs text-muted-foreground">Receive urgent notifications via SMS</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Billing Section (Placeholder) */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            <CardTitle>Billing & Payments</CardTitle>
          </div>
          <CardDescription>Manage your payment methods and billing information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Billing integration coming soon</p>
            <p className="text-xs text-muted-foreground mt-1">
              You'll be able to manage payment methods and view invoices here
            </p>
          </div>
          <Button variant="outline" disabled>
            Add Payment Method
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
          </div>
          <CardDescription>Irreversible actions for your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Delete Account</h3>
            <p className="text-sm text-muted-foreground">
              Once you delete your account, there is no going back. All your data, consultations, and profile
              information will be permanently deleted.
            </p>
            <Button variant="destructive" className="mt-2">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete My Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LawyerSettings;
