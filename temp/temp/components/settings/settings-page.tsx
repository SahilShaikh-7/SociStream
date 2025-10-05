import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Save, Bell, Globe, Lock, User } from "lucide-react";

export default function SettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    name: "sahil shaikh",
    email: "sahil@socialflow.com",
    timezone: "UTC",
    language: "en",
    emailNotifications: true,
    pushNotifications: false,
    weeklyReport: true,
    autoPublish: false,
    defaultPlatforms: ["facebook", "instagram"],
  });

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account settings and preferences</p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </CardTitle>
            <CardDescription>Update your personal information and contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                data-testid="input-name"
                value={settings.name}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                data-testid="input-email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Localization Settings */}
        <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Localization
            </CardTitle>
            <CardDescription>Set your timezone and language preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select 
                value={settings.timezone} 
                onValueChange={(value) => setSettings({ ...settings, timezone: value })}
              >
                <SelectTrigger id="timezone" data-testid="select-timezone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                  <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                  <SelectItem value="Europe/London">London (GMT)</SelectItem>
                  <SelectItem value="Asia/Kolkata">India Standard Time (IST)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select 
                value={settings.language} 
                onValueChange={(value) => setSettings({ ...settings, language: value })}
              >
                <SelectTrigger id="language" data-testid="select-language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
            <CardDescription>Configure how you want to receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive email updates about your posts and analytics
                </p>
              </div>
              <Switch
                id="email-notifications"
                data-testid="switch-email-notifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, emailNotifications: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Get push notifications for important updates
                </p>
              </div>
              <Switch
                id="push-notifications"
                data-testid="switch-push-notifications"
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, pushNotifications: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="weekly-report">Weekly Analytics Report</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive a weekly summary of your social media performance
                </p>
              </div>
              <Switch
                id="weekly-report"
                data-testid="switch-weekly-report"
                checked={settings.weeklyReport}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, weeklyReport: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Publishing Settings */}
        <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Publishing Preferences
            </CardTitle>
            <CardDescription>Configure default settings for post publishing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-publish">Auto-publish Scheduled Posts</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Automatically publish posts when scheduled time arrives
                </p>
              </div>
              <Switch
                id="auto-publish"
                data-testid="switch-auto-publish"
                checked={settings.autoPublish}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, autoPublish: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSave}
            data-testid="button-save-settings"
            className="bg-primary text-white hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
