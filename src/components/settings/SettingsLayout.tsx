import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  User,
  Building2,
  Bell,
  Lock,
  CreditCard,
  Settings,
  ChevronRight
} from "lucide-react";
import { useLocation, Link } from "@tanstack/react-router";

const sidebarNavItems = [
  {
    title: "Profiel",
    href: "/dashboard/settings/profile",
    icon: User,
  },
  {
    title: "Bedrijf",
    href: "/dashboard/settings/company",
    icon: Building2,
  },
  {
    title: "Notificaties",
    href: "/dashboard/settings/notifications",
    icon: Bell,
  },
  {
    title: "Beveiliging",
    href: "/dashboard/settings/security",
    icon: Lock,
  },
  {
    title: "Facturering",
    href: "/dashboard/settings/billing",
    icon: CreditCard,
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export function SettingsLayout({ children }: SettingsLayoutProps) {
  const location = useLocation();

  return (
    <div className="space-y-6 p-6 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Instellingen</h2>
        <p className="text-muted-foreground">
          Beheer uw account instellingen en voorkeuren
        </p>
      </div>
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/5">
          <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
            {sidebarNavItems.map((item) => (
              <Button
                key={item.href}
                variant={location.pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "justify-start",
                  location.pathname === item.href && "bg-muted"
                )}
                asChild
              >
                <Link to={item.href} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            ))}
          </nav>
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </div>
  );
} 