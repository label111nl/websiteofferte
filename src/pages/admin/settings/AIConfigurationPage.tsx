import React from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import toast from 'react-hot-toast';

interface AISettings {
  enabled: boolean;
  min_confidence: number;
  check_spam: boolean;
  check_quality: boolean;
  quality_threshold: number;
  spam_threshold: number;
  max_processing_time: number;
  auto_approve_threshold: number;
  auto_reject_threshold: number;
  language_check: boolean;
  sentiment_analysis: boolean;
}

export default function AIConfigurationPage() {
  const [settings, setSettings] = React.useState<AISettings>({
    enabled: true,
    min_confidence: 0.8,
    check_spam: true,
    check_quality: true,
    quality_threshold: 0.7,
    spam_threshold: 0.9,
    max_processing_time: 30,
    auto_approve_threshold: 0.95,
    auto_reject_threshold: 0.2,
    language_check: true,
    sentiment_analysis: true,
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .eq('key', 'ai_verification')
        .single();

      if (error) throw error;
      if (data?.value) {
        setSettings(data.value);
      }
    } catch (error) {
      toast.error('Error loading AI settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    // Validatie: Controleer of waarden binnen bereik zijn
    if (settings.max_processing_time < 1 || settings.max_processing_time > 120) {
      toast.error('Max processing time must be between 1 and 120 seconds');
      setLoading(false);
      return;
    }
  
    try {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({
          key: 'ai_verification',
          value: settings,
          description: 'AI verification configuration',
        });
  
      if (error) throw error;
  
      toast.success('AI settings updated successfully');
    } catch (error) {
      toast.error(`Error updating settings: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">AI Configuration</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="thresholds">Thresholds</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="enabled"
                    checked={settings.enabled}
                    onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="enabled">Enable AI Verification</Label>
                </div>

                <div>
                  <Label>Minimum Confidence Score</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      value={[settings.min_confidence * 100]}
                      onValueChange={(value) => setSettings({ ...settings, min_confidence: value[0] / 100 })}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="w-12 text-sm">{(settings.min_confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="max_processing_time">Maximum Processing Time (seconds)</Label>
                  <Input
                    id="max_processing_time"
                    type="number"
                    min="1"
                    max="120"
                    value={settings.max_processing_time}
                    onChange={(e) => setSettings({ ...settings, max_processing_time: parseInt(e.target.value) })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="thresholds">
            <Card>
              <CardHeader>
                <CardTitle>Threshold Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Quality Threshold</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      value={[settings.quality_threshold * 100]}
                      onValueChange={(value) => setSettings({ ...settings, quality_threshold: value[0] / 100 })}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="w-12 text-sm">{(settings.quality_threshold * 100).toFixed(0)}%</span>
                  </div>
                </div>

                <div>
                  <Label>Spam Threshold</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      value={[settings.spam_threshold * 100]}
                      onValueChange={(value) => setSettings({ ...settings, spam_threshold: value[0] / 100 })}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="w-12 text-sm">{(settings.spam_threshold * 100).toFixed(0)}%</span>
                  </div>
                </div>

                <div>
                  <Label>Auto-Approve Threshold</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      value={[settings.auto_approve_threshold * 100]}
                      onValueChange={(value) => setSettings({ ...settings, auto_approve_threshold: value[0] / 100 })}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="w-12 text-sm">{(settings.auto_approve_threshold * 100).toFixed(0)}%</span>
                  </div>
                </div>

                <div>
                  <Label>Auto-Reject Threshold</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      value={[settings.auto_reject_threshold * 100]}
                      onValueChange={(value) => setSettings({ ...settings, auto_reject_threshold: value[0] / 100 })}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="w-12 text-sm">{(settings.auto_reject_threshold * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle>Feature Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="check_spam"
                      checked={settings.check_spam}
                      onChange={(e) => setSettings({ ...settings, check_spam: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="check_spam">Enable Spam Detection</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="check_quality"
                      checked={settings.check_quality}
                      onChange={(e) => setSettings({ ...settings, check_quality: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="check_quality">Enable Quality Check</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="language_check"
                      checked={settings.language_check}
                      onChange={(e) => setSettings({ ...settings, language_check: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="language_check">Enable Language Check</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="sentiment_analysis"
                      checked={settings.sentiment_analysis}
                      onChange={(e) => setSettings({ ...settings, sentiment_analysis: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="sentiment_analysis">Enable Sentiment Analysis</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </form>
    </div>
  );
}