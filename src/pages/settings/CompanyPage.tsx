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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import toast from "react-hot-toast";

const companyFormSchema = z.object({
  company_name: z.string().min(2, {
    message: "Bedrijfsnaam moet minimaal 2 karakters bevatten.",
  }),
  company_kvk: z.string().min(8, {
    message: "Ongeldig KVK nummer.",
  }),
  company_btw: z.string().min(14, {
    message: "Ongeldig BTW nummer.",
  }),
  company_address: z.string().min(5, {
    message: "Ongeldig adres.",
  }),
  company_postal: z.string().min(6, {
    message: "Ongeldige postcode.",
  }),
  company_city: z.string().min(2, {
    message: "Ongeldige stad.",
  }),
  company_size: z.string(),
  company_website: z.string().url({
    message: "Ongeldige website URL.",
  }),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

const companySizes = [
  { value: "1-10", label: "1-10 werknemers" },
  { value: "11-50", label: "11-50 werknemers" },
  { value: "51-200", label: "51-200 werknemers" },
  { value: "201-500", label: "201-500 werknemers" },
  { value: "501+", label: "501+ werknemers" },
];

export default function CompanyPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      company_name: user?.user_metadata?.company_name || "",
      company_kvk: user?.user_metadata?.company_kvk || "",
      company_btw: user?.user_metadata?.company_btw || "",
      company_address: user?.user_metadata?.company_address || "",
      company_postal: user?.user_metadata?.company_postal || "",
      company_city: user?.user_metadata?.company_city || "",
      company_size: user?.user_metadata?.company_size || "",
      company_website: user?.user_metadata?.company_website || "",
    },
  });

  async function onSubmit(data: CompanyFormValues) {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          ...data,
          updated_at: new Date().toISOString(),
        },
      });

      if (error) throw error;
      toast.success("Bedrijfsgegevens succesvol bijgewerkt");
    } catch (error) {
      toast.error("Er is iets misgegaan bij het bijwerken van de bedrijfsgegevens");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SettingsLayout>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Bedrijfsgegevens</h3>
          <p className="text-sm text-muted-foreground">
            Beheer uw bedrijfsinformatie en factureringsgegevens
          </p>
        </div>
        <Separator />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="company_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bedrijfsnaam</FormLabel>
                  <FormControl>
                    <Input placeholder="Bedrijf B.V." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="company_kvk"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>KVK Nummer</FormLabel>
                    <FormControl>
                      <Input placeholder="12345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company_btw"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>BTW Nummer</FormLabel>
                    <FormControl>
                      <Input placeholder="NL123456789B01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="company_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adres</FormLabel>
                  <FormControl>
                    <Input placeholder="Straatnaam 123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="company_postal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postcode</FormLabel>
                    <FormControl>
                      <Input placeholder="1234 AB" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company_city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plaats</FormLabel>
                    <FormControl>
                      <Input placeholder="Amsterdam" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="company_size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bedrijfsgrootte</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecteer bedrijfsgrootte" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {companySizes.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company_website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading}>
              {loading ? "Opslaan..." : "Wijzigingen opslaan"}
            </Button>
          </form>
        </Form>
      </div>
    </SettingsLayout>
  );
}