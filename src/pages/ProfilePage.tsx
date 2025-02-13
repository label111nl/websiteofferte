import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Building2, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUserCredits } from '@/hooks/useUserCredits';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = React.useState(false);
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const credits = useUserCredits(user?.id);

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Mail className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Building2 className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Company</p>
              <p className="text-sm text-gray-500">{user?.company_name || 'Not set'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Phone className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Phone</p>
              <p className="text-sm text-gray-500">{user?.phone || 'Not set'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <CreditCard className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Credits</p>
              <Badge variant="secondary">{credits} credits</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="current_password">Current Password</Label>
            <Input
              id="current_password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="new_password">New Password</Label>
            <Input
              id="new_password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <Button 
            onClick={handlePasswordChange}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 