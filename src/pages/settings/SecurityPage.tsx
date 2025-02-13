import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/lib/supabase";
import { SettingsLayout } from "@/components/settings/SettingsLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import toast from "react-hot-toast";
import { Shield, Key, Smartphone } from "lucide-react";

const passwordFormSchema = z.object({
  current_password: z.string().min(6, {
    message: "Wachtwoord moet minimaal 6 karakters bevatten.",
  }),
  new_password: z.string().min(6, {
    message: "Wachtwoord moet minimaal 6 karakters bevatten.",
  }),
  confirm_password: z.string(),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Wachtwoorden komen niet overeen",
  path: ["confirm_password"],
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export default function SecurityPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  async function onSubmit(data: PasswordFormValues) {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.new_password,
      });

      if (error) throw error;
      
      form.reset();
      toast.success("Wachtwoord succesvol bijgewerkt");
    } catch (error) {
      toast.error("Er is iets misgegaan bij het bijwerken van uw wachtwoord");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SettingsLayout>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Beveiliging</h3>
          <p className="text-sm text-muted-foreground">
            Beheer uw wachtwoord en beveiligingsinstellingen
          </p>
        </div>
        <Separator />

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-4 h-4" />
                Wachtwoord wijzigen
              </CardTitle>
              <CardDescription>
                Wijzig uw wachtwoord om uw account veilig te houden
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="current_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Huidig wachtwoord</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="new_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nieuw wachtwoord</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirm_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bevestig nieuw wachtwoord</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={loading}>
                    {loading ? "Opslaan..." : "Wachtwoord wijzigen"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                Twee-factor authenticatie
              </CardTitle>
              <CardDescription>
                Extra beveiliging voor uw account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline">
                2FA Inschakelen
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Beveiligingslog
              </CardTitle>
              <CardDescription>
                Recente activiteit op uw account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Laatste login
                  </span>
                  <span>
                    {new Date(user?.last_sign_in_at || "").toLocaleString('nl-NL')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    IP Adres
                  </span>
                  <span>
                    {/* Add actual IP address if available */}
                    ***.***.***
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SettingsLayout>
  );
} 