import { useState, useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { AuthService } from '@/services/AuthService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';
import { Route } from '@tanstack/react-router';
import { rootRoute } from '@/router';

export const resetPasswordRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/auth/reset-password',
  validateSearch: (search: Record<string, unknown>) => ({
    type: search.type as string
  })
});
export default function ResetPassword() {
  const search = useSearch({ from: resetPasswordRoute.id as '/auth/reset-password' });
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);

  useEffect(() => {
    // Check of we in reset mode zijn (via email link)
    const type = search.type as string | undefined;
    setIsResetMode(type === 'recovery');
  }, [search]);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await AuthService.resetPassword(email);
      toast.success('Reset instructies zijn verzonden naar uw email');
    } catch (error) {
      console.error('Reset request error:', error);
      toast.error('Er ging iets mis bij het verzenden van de reset instructies');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await AuthService.updatePassword(newPassword);
      toast.success('Wachtwoord succesvol gewijzigd');
      navigate({ to: '/login' });
    } catch (error) {
      console.error('Password update error:', error);
      toast.error('Er ging iets mis bij het wijzigen van het wachtwoord');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isResetMode ? 'Nieuw wachtwoord instellen' : 'Wachtwoord vergeten'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {isResetMode ? (
            <form onSubmit={handlePasswordUpdate} className="space-y-6">
              <div>
                <Label htmlFor="newPassword">Nieuw wachtwoord</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Bezig...' : 'Wachtwoord wijzigen'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRequestReset} className="space-y-6">
              <div>
                <Label htmlFor="email">E-mailadres</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Bezig...' : 'Reset aanvragen'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 