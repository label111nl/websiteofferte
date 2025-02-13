import React from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, DollarSign, Settings, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface PaymentSettings {
  stripe_mode: 'test' | 'live';
  stripe_publishable_key: string;
  stripe_secret_key: string;
  lead_price: number;
  subscription_price: number;
  subscription_trial_days: number;
  payment_currency: string;
  auto_payout: boolean;
  payout_schedule: 'daily' | 'weekly' | 'monthly';
  minimum_payout_amount: number;
}

export default function PaymentSettingsPage() {
  const [settings, setSettings] = React.useState<PaymentSettings>({
    stripe_mode: 'test',
    stripe_publishable_key: '',
    stripe_secret_key: '',
    lead_price: 3500, // €35.00
    subscription_price: 15000, // €150.00
    subscription_trial_days: 0,
    payment_currency: 'eur',
    auto_payout: true,
    payout_schedule: 'weekly',
    minimum_payout_amount: 10000, // €100.00
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
        .eq('key', 'payment_settings')
        .single();

      if (error) throw error;
      if (data?.value) {
        setSettings(data.value);
      }
    } catch (error) {
      toast.error('Error loading payment settings');
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
          key: 'payment_settings',
          value: settings,
          description: 'Stripe and payment configuration'
        });

      if (error) throw error;
      toast.success('Payment settings updated successfully');
    } catch (error) {
      toast.error('Error updating payment settings');
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
        <h1 className="text-2xl font-bold text-gray-900">Payment Settings</h1>
      </div>

      <Tabs defaultValue="stripe">
        <TabsList>
          <TabsTrigger value="stripe">
            <CreditCard className="w-4 h-4 mr-2" />
            Stripe Configuration
          </TabsTrigger>
          <TabsTrigger value="pricing">
            <DollarSign className="w-4 h-4 mr-2" />
            Pricing
          </TabsTrigger>
          <TabsTrigger value="payouts">
            <RefreshCw className="w-4 h-4 mr-2" />
            Payouts
          </TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit}>
          <TabsContent value="stripe">
            <Card>
              <CardHeader>
                <CardTitle>Stripe Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Mode</Label>
                  <div className="flex space-x-4 mt-1">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="stripe_mode"
                        value="test"
                        checked={settings.stripe_mode === 'test'}
                        onChange={(e) => setSettings({ ...settings, stripe_mode: e.target.value as 'test' | 'live' })}
                        className="mr-2"
                      />
                      Test Mode
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="stripe_mode"
                        value="live"
                        checked={settings.stripe_mode === 'live'}
                        onChange={(e) => setSettings({ ...settings, stripe_mode: e.target.value as 'test' | 'live' })}
                        className="mr-2"
                      />
                      Live Mode
                    </label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="publishable_key">Publishable Key</Label>
                  <Input
                    id="publishable_key"
                    value={settings.stripe_publishable_key}
                    onChange={(e) => setSettings({ ...settings, stripe_publishable_key: e.target.value })}
                    placeholder={`${settings.stripe_mode === 'test' ? 'pk_test_' : 'pk_live_'}...`}
                  />
                </div>

                <div>
                  <Label htmlFor="secret_key">Secret Key</Label>
                  <Input
                    id="secret_key"
                    type="password"
                    value={settings.stripe_secret_key}
                    onChange={(e) => setSettings({ ...settings, stripe_secret_key: e.target.value })}
                    placeholder={`${settings.stripe_mode === 'test' ? 'sk_test_' : 'sk_live_'}...`}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing">
            <Card>
              <CardHeader>
                <CardTitle>Pricing Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="lead_price">Lead Price (in cents)</Label>
                  <Input
                    id="lead_price"
                    type="number"
                    value={settings.lead_price}
                    onChange={(e) => setSettings({ ...settings, lead_price: parseInt(e.target.value) })}
                    min="0"
                  />
                  <p className="text-sm text-gray-500 mt-1">Current price: €{(settings.lead_price / 100).toFixed(2)}</p>
                </div>

                <div>
                  <Label htmlFor="subscription_price">Monthly Subscription Price (in cents)</Label>
                  <Input
                    id="subscription_price"
                    type="number"
                    value={settings.subscription_price}
                    onChange={(e) => setSettings({ ...settings, subscription_price: parseInt(e.target.value) })}
                    min="0"
                  />
                  <p className="text-sm text-gray-500 mt-1">Current price: €{(settings.subscription_price / 100).toFixed(2)}</p>
                </div>

                <div>
                  <Label htmlFor="trial_days">Trial Period (days)</Label>
                  <Input
                    id="trial_days"
                    type="number"
                    value={settings.subscription_trial_days}
                    onChange={(e) => setSettings({ ...settings, subscription_trial_days: parseInt(e.target.value) })}
                    min="0"
                  />
                </div>

                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <select
                    id="currency"
                    value={settings.payment_currency}
                    onChange={(e) => setSettings({ ...settings, payment_currency: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="eur">EUR (€)</option>
                    <option value="usd">USD ($)</option>
                    <option value="gbp">GBP (£)</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payouts">
            <Card>
              <CardHeader>
                <CardTitle>Payout Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.auto_payout}
                      onChange={(e) => setSettings({ ...settings, auto_payout: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span>Enable Automatic Payouts</span>
                  </Label>
                </div>

                <div>
                  <Label htmlFor="payout_schedule">Payout Schedule</Label>
                  <select
                    id="payout_schedule"
                    value={settings.payout_schedule}
                    onChange={(e) => setSettings({ 
                      ...settings, 
                      payout_schedule: e.target.value as 'daily' | 'weekly' | 'monthly'
                    })}
                    disabled={!settings.auto_payout}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="minimum_payout">Minimum Payout Amount (in cents)</Label>
                  <Input
                    id="minimum_payout"
                    type="number"
                    value={settings.minimum_payout_amount}
                    onChange={(e) => setSettings({ ...settings, minimum_payout_amount: parseInt(e.target.value) })}
                    min="0"
                    disabled={!settings.auto_payout}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Minimum amount: €{(settings.minimum_payout_amount / 100).toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="mt-6">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  );
}