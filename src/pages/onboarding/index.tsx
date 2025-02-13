import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { completeOnboarding } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const services = [
  { id: 'webdesign', label: 'Webdesign' },
  { id: 'development', label: 'Development' },
  { id: 'ecommerce', label: 'E-commerce' },
  { id: 'cms', label: 'CMS Development' },
  { id: 'seo', label: 'SEO' },
  { id: 'hosting', label: 'Hosting' },
  { id: 'maintenance', label: 'Onderhoud' },
  { id: 'marketing', label: 'Online Marketing' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    company_address: '',
    company_city: '',
    company_postal: '',
    services: [] as string[],
    hourly_rate: '',
    min_project_size: '',
    max_project_size: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userId = localStorage.getItem('userId'); // Set this after registration
      if (!userId) throw new Error('Gebruiker niet gevonden');

      await completeOnboarding(userId, formData);
      toast.success('Profiel bijgewerkt!');
      navigate({ to: '/dashboard' });
    } catch (error) {
      console.error('Onboarding error:', error);
      toast.error('Er is iets misgegaan bij het bijwerken van uw profiel');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="company_address">Adres</Label>
                <Input
                  id="company_address"
                  name="company_address"
                  value={formData.company_address}
                  onChange={handleChange}
                  placeholder="Straat en huisnummer"
                  className="w-full"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company_city">Plaats</Label>
                <Input
                  id="company_city"
                  name="company_city"
                  value={formData.company_city}
                  onChange={handleChange}
                  placeholder="Plaats"
                  className="w-full"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company_postal">Postcode</Label>
                <Input
                  id="company_postal"
                  name="company_postal"
                  value={formData.company_postal}
                  onChange={handleChange}
                  placeholder="1234 AB"
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        );

      case 2:
        return (
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {services.map((service) => (
                <div key={service.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={service.id}
                    checked={formData.services.includes(service.id)}
                    onCheckedChange={() => handleServiceToggle(service.id)}
                    className="data-[state=checked]:bg-primary"
                  />
                  <Label
                    htmlFor={service.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {service.label}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        );

      case 3:
        return (
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="hourly_rate">Uurtarief (€)</Label>
                <Input
                  id="hourly_rate"
                  name="hourly_rate"
                  type="number"
                  value={formData.hourly_rate}
                  onChange={handleChange}
                  placeholder="75"
                  className="w-full"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="min_project_size">Minimum projectgrootte (€)</Label>
                <Input
                  id="min_project_size"
                  name="min_project_size"
                  type="number"
                  value={formData.min_project_size}
                  onChange={handleChange}
                  placeholder="1000"
                  className="w-full"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="max_project_size">Maximum projectgrootte (€)</Label>
                <Input
                  id="max_project_size"
                  name="max_project_size"
                  type="number"
                  value={formData.max_project_size}
                  onChange={handleChange}
                  placeholder="50000"
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welkom!</h1>
          <p className="text-muted-foreground">
            Laten we uw profiel compleet maken
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && "Bedrijfsgegevens"}
              {step === 2 && "Diensten"}
              {step === 3 && "Tarieven"}
            </CardTitle>
            <CardDescription>
              Stap {step} van 3
            </CardDescription>
            <div className="flex justify-center gap-2 pt-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    step === i ? "bg-primary" : "bg-muted"
                  )}
                />
              ))}
            </div>
          </CardHeader>

          <form onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()}>
            {renderStep()}
            
            <CardContent className="flex justify-between pt-6">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                >
                  Vorige
                </Button>
              )}
              
              {step < 3 ? (
                <Button
                  type="button"
                  className={cn(step === 1 && "w-full")}
                  onClick={() => setStep(step + 1)}
                >
                  Volgende
                </Button>
              ) : (
                <Button
                  type="submit"
                  className={cn("ml-auto")}
                  disabled={loading}
                >
                  {loading ? 'Bezig...' : 'Voltooien'}
                </Button>
              )}
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
} 