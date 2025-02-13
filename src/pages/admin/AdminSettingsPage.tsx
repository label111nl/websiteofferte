import React from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import toast from 'react-hot-toast';

interface Settings {
  lead_matching: {
    min_score: number;
    max_matches_per_lead: number;
    consider_portfolio: boolean;
    consider_expertise: boolean;
    consider_budget: boolean;
    [key: string]: number | boolean;
  };
  ai_verification: {
    enabled: boolean;
    min_confidence: number;
    check_spam: boolean;
    check_quality: boolean;
    [key: string]: number | boolean;
  };
  platform: {
    maintenance_mode: boolean;
    max_portfolio_items: number;
    max_images_per_portfolio: number;
  };
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = React.useState<Settings | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*');

      if (error) throw error;

      const settingsMap = data.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as any);

      setSettings(settingsMap);
    } catch (error) {
      toast.error('Error loading settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (key: string, value: any) => {
    try {
      const { error } = await supabase
        .from('admin_settings')
        .update({ value })
        .eq('key', key);

      if (error) throw error;
      
      toast.success('Settings updated successfully');
      fetchSettings();
    } catch (error) {
      toast.error('Error updating settings');
    }
  };

  const handleSettingChange = (
    key: keyof Settings,
    subKey: string,
    value: number | boolean
  ) => {
    if (!settings) return;
    
    setSettings((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [key]: {
          ...prev[key],
          [subKey]: value
        }
      };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>

      <Tabs defaultValue="matching">
        <TabsList>
          <TabsTrigger value="matching">Lead Matching</TabsTrigger>
          <TabsTrigger value="ai">AI Verification</TabsTrigger>
          <TabsTrigger value="platform">Platform</TabsTrigger>
        </TabsList>

        <TabsContent value="matching">
          <Card>
            <CardHeader>
              <CardTitle>Lead Matching Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="min_score">Minimum Match Score</Label>
                <Input
                  id="min_score"
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={String(settings.lead_matching.min_score)}
                  onChange={(e) => handleSettingChange('lead_matching', 'min_score', Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="max_matches">Maximum Matches Per Lead</Label>
                <Input
                  id="max_matches"
                  type="number"
                  min="1"
                  value={String(settings.lead_matching.max_matches_per_lead)}
                  onChange={(e) => handleSettingChange('lead_matching', 'max_matches_per_lead', Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Matching Criteria</Label>
                <div className="space-y-1">
                  {Object.entries({
                    consider_portfolio: 'Consider Portfolio',
                    consider_expertise: 'Consider Expertise',
                    consider_budget: 'Consider Budget'
                  }).map(([key, label]) => (
                    <div key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        id={key}
                        checked={Boolean(settings.lead_matching[key])}
                        onChange={(e) => handleSettingChange('lead_matching', key, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <label htmlFor={key} className="ml-2 text-sm text-gray-700">
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle>AI Verification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="ai_enabled"
                  checked={Boolean(settings.ai_verification.enabled)}
                  onChange={(e) => handleSettingChange('ai_verification', 'enabled', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <Label htmlFor="ai_enabled">Enable AI Verification</Label>
              </div>
              <div>
                <Label htmlFor="min_confidence">Minimum Confidence Score</Label>
                <Input
                  id="min_confidence"
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={String(settings.ai_verification.min_confidence)}
                  onChange={(e) => handleSettingChange('ai_verification', 'min_confidence', Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Verification Checks</Label>
                <div className="space-y-1">
                  {Object.entries({
                    check_spam: 'Check for Spam',
                    check_quality: 'Check Lead Quality'
                  }).map(([key, label]) => (
                    <div key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        id={key}
                        checked={Boolean(settings.ai_verification[key])}
                        onChange={(e) => handleSettingChange('ai_verification', key, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <label htmlFor={key} className="ml-2 text-sm text-gray-700">
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platform">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="maintenance_mode"
                  checked={settings.platform.maintenance_mode}
                  onChange={(e) => {
                    const newSettings = {
                      ...settings.platform,
                      maintenance_mode: e.target.checked
                    };
                    updateSettings('platform', newSettings);
                  }}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <Label htmlFor="maintenance_mode">Maintenance Mode</Label>
              </div>
              <div>
                <Label htmlFor="max_portfolio">Maximum Portfolio Items</Label>
                <Input
                  id="max_portfolio"
                  type="number"
                  min="1"
                  value={settings.platform.max_portfolio_items}
                  onChange={(e) => {
                    const newSettings = {
                      ...settings.platform,
                      max_portfolio_items: parseInt(e.target.value)
                    };
                    updateSettings('platform', newSettings);
                  }}
                />
              </div>
              <div>
                <Label htmlFor="max_images">Maximum Images per Portfolio</Label>
                <Input
                  id="max_images"
                  type="number"
                  min="1"
                  value={settings.platform.max_images_per_portfolio}
                  onChange={(e) => {
                    const newSettings = {
                      ...settings.platform,
                      max_images_per_portfolio: parseInt(e.target.value)
                    };
                    updateSettings('platform', newSettings);
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}