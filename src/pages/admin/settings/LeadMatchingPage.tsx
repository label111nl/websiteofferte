import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import toast from 'react-hot-toast';

interface LeadMatchingSettings {
  min_score: number;
  max_matches_per_lead: number;
  consider_portfolio: boolean;
  consider_expertise: boolean;
  consider_budget: boolean;
  expertise_weight: number;
  portfolio_weight: number;
  budget_weight: number;
  location_weight: number;
}

export default function LeadMatchingPage() {
  const [settings, setSettings] = React.useState<LeadMatchingSettings>({
    min_score: 0.6,
    max_matches_per_lead: 5,
    consider_portfolio: true,
    consider_expertise: true,
    consider_budget: true,
    expertise_weight: 0.4,
    portfolio_weight: 0.3,
    budget_weight: 0.2,
    location_weight: 0.1,
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
        .eq('key', 'lead_matching')
        .single();

      if (error) throw error;
      if (data?.value) {
        setSettings(data.value);
      }
    } catch (error) {
      toast.error('Error loading lead matching settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({
          key: 'lead_matching',
          value: settings,
          description: 'Lead matching algorithm configuration'
        });

      if (error) throw error;
      toast.success('Lead matching settings updated successfully');
    } catch (error) {
      toast.error('Error updating lead matching settings');
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
        <h1 className="text-2xl font-bold text-gray-900">Lead Matching Settings</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Matching Algorithm Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Minimum Match Score</Label>
              <div className="flex items-center space-x-4">
                <Slider
                  value={[settings.min_score * 100]}
                  onValueChange={(value) => setSettings({ ...settings, min_score: value[0] / 100 })}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="w-12 text-sm">{(settings.min_score * 100).toFixed(0)}%</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Minimum score required for a match to be considered valid
              </p>
            </div>

            <div>
              <Label htmlFor="max_matches">Maximum Matches Per Lead</Label>
              <Input
                id="max_matches"
                type="number"
                min="1"
                max="20"
                value={settings.max_matches_per_lead}
                onChange={(e) => setSettings({ ...settings, max_matches_per_lead: parseInt(e.target.value) })}
              />
              <p className="text-sm text-gray-500 mt-1">
                Maximum number of marketers that can be matched to a single lead
              </p>
            </div>

            <div className="space-y-4">
              <Label>Matching Criteria</Label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.consider_portfolio}
                    onChange={(e) => setSettings({ ...settings, consider_portfolio: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span>Consider Portfolio</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.consider_expertise}
                    onChange={(e) => setSettings({ ...settings, consider_expertise: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span>Consider Expertise</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.consider_budget}
                    onChange={(e) => setSettings({ ...settings, consider_budget: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span>Consider Budget</span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Matching Weights</Label>
              <div className="space-y-4">
                <div>
                  <Label>Expertise Weight</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      value={[settings.expertise_weight * 100]}
                      onValueChange={(value) => setSettings({ ...settings, expertise_weight: value[0] / 100 })}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="w-12 text-sm">{(settings.expertise_weight * 100).toFixed(0)}%</span>
                  </div>
                </div>

                <div>
                  <Label>Portfolio Weight</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      value={[settings.portfolio_weight * 100]}
                      onValueChange={(value) => setSettings({ ...settings, portfolio_weight: value[0] / 100 })}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="w-12 text-sm">{(settings.portfolio_weight * 100).toFixed(0)}%</span>
                  </div>
                </div>

                <div>
                  <Label>Budget Weight</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      value={[settings.budget_weight * 100]}
                      onValueChange={(value) => setSettings({ ...settings, budget_weight: value[0] / 100 })}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="w-12 text-sm">{(settings.budget_weight * 100).toFixed(0)}%</span>
                  </div>
                </div>

                <div>
                  <Label>Location Weight</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      value={[settings.location_weight * 100]}
                      onValueChange={(value) => setSettings({ ...settings, location_weight: value[0] / 100 })}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="w-12 text-sm">{(settings.location_weight * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </form>
    </div>
  );
}