import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/lib/supabase";
import { SettingsLayout } from "@/components/settings/SettingsLayout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import toast from "react-hot-toast";

const notificationsFormSchema = z.object({
  email_new_leads: z.boolean(),
  email_lead_updates: z.boolean(),
  email_marketing: z.boolean(),
  push_new_leads: z.boolean(),
  push_lead_updates: z.boolean(),
  push_credits: z.boolean(),
});

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;

export default function NotificationsPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      email_new_leads: user?.user_metadata?.notifications?.email_new_leads ?? true,
      email_lead_updates: user?.user_metadata?.notifications?.email_lead_updates ?? true,
      email_marketing: user?.user_metadata?.notifications?.email_marketing ?? false,
      push_new_leads: user?.user_metadata?.notifications?.push_new_leads ?? true,
      push_lead_updates: user?.user_metadata?.notifications?.push_lead_updates ?? true,
      push_credits: user?.user_metadata?.notifications?.push_credits ?? true,
    },
  });

  async function onSubmit(data: NotificationsFormValues) {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          notifications: data,
          updated_at: new Date().toISOString(),
        },
      });

      if (error) throw error;
      toast.success("Notificatie-instellingen succesvol bijgewerkt");
    } catch (error) {
      toast.error("Er is iets misgegaan bij het bijwerken van de notificatie-instellingen");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SettingsLayout>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Notificaties</h3>
          <p className="text-sm text-muted-foreground">
            Beheer uw email en push notificatie voorkeuren
          </p>
        </div>
        <Separator />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div>
              <h4 className="text-sm font-medium mb-4">Email Notificaties</h4>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email_new_leads"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Nieuwe Leads</FormLabel>
                        <FormDescription>
                          Ontvang een email wanneer er nieuwe leads beschikbaar zijn
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email_lead_updates"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Lead Updates</FormLabel>
                        <FormDescription>
                          Ontvang updates over leads waar u op heeft gereageerd
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email_marketing"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Marketing</FormLabel>
                        <FormDescription>
                          Ontvang tips, updates en aanbiedingen
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-4">Push Notificaties</h4>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="push_new_leads"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Nieuwe Leads</FormLabel>
                        <FormDescription>
                          Ontvang direct een melding bij nieuwe leads
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="push_lead_updates"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Lead Updates</FormLabel>
                        <FormDescription>
                          Ontvang direct updates over uw leads
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="push_credits"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Credits</FormLabel>
                        <FormDescription>
                          Ontvang meldingen over uw credit saldo
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Opslaan..." : "Wijzigingen opslaan"}
            </Button>
          </form>
        </Form>
      </div>
    </SettingsLayout>
  );
}