import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = React.useState(false);
  const [settings, setSettings] = React.useState({
    email_notifications: true,
    company_name: user?.company_name || '',
    company_kvk: user?.company_kvk || '',
    phone: user?.phone || '',
  });

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          company_name: settings.company_name,
          company_kvk: settings.company_kvk,
          phone: settings.phone,
        })
        .eq('id', user.id);

      if (error) throw error;

      const { error: prefError } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          email_notifications: settings.email_notifications,
        });

      if (prefError) throw prefError;

      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="company_name">Company Name</Label>
            <Input
              id="company_name"
              value={settings.company_name}
              onChange={(e) => setSettings(s => ({ ...s, company_name: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="company_kvk">KVK Number</Label>
            <Input
              id="company_kvk"
              value={settings.company_kvk}
              onChange={(e) => setSettings(s => ({ ...s, company_kvk: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={settings.phone}
              onChange={(e) => setSettings(s => ({ ...s, phone: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email_notifications">Email Notifications</Label>
            <Switch
              id="email_notifications"
              checked={settings.email_notifications}
              onCheckedChange={(checked) => setSettings(s => ({ ...s, email_notifications: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={handleSave}
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Saving...' : 'Save Settings'}
      </Button>
    </div>
  );
} 