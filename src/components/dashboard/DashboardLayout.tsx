import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  Settings,
  CreditCard,
  Users,
  Bell,
  Menu,
  X,
  ChevronRight
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CreditNotifications } from "@/components/notifications/CreditNotifications";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const mainNav: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Leads",
    href: "/dashboard/leads",
    icon: FileText,
  },
  {
    title: "Abonnement",
    href: "/dashboard/subscription",
    icon: CreditCard,
  },
];

const settingsNav: NavItem[] = [
  {
    title: "Profiel",
    href: "/dashboard/settings/profile",
    icon: Users,
  },
  {
    title: "Notificaties",
    href: "/dashboard/settings/notifications",
    icon: Bell,
  },
  {
    title: "Instellingen",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const location = useLocation();

  const NavItems = ({ items }: { items: NavItem[] }) => {
    return items.map((item) => (
      <Button
        key={item.href}
        variant={location.pathname === item.href ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start",
          location.pathname === item.href && "bg-muted"
        )}
        asChild
      >
        <Link to={item.href} className="flex items-center justify-between">
          <div className="flex items-center">
            <item.icon className="mr-2 h-4 w-4" />
            {item.title}
          </div>
          <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100" />
        </Link>
      </Button>
    ));
  };

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-1 flex-col border-r bg-background">
          <div className="flex h-14 items-center border-b px-4">
            <Link to="/" className="flex items-center font-semibold">
              Website Offerte Aanvragen
            </Link>
          </div>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              <div className="space-y-1">
                <NavItems items={mainNav} />
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Instellingen
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <NavItems items={settingsNav} />
              </div>
            </div>
          </ScrollArea>
        </div>
      </aside>

      {/* Mobile Navigation */}
      <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="lg:hidden px-0 w-14 h-14 flex items-center justify-center"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-14 items-center border-b px-4">
            <Link to="/" className="flex items-center font-semibold">
              Website Offerte Aanvragen
            </Link>
            <Button
              variant="ghost"
              className="ml-auto h-8 w-8 p-0"
              onClick={() => setIsMobileNavOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              <div className="space-y-1">
                <NavItems items={mainNav} />
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Instellingen
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <NavItems items={settingsNav} />
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Add header with notifications */}
        <header className="border-b bg-background">
          <div className="flex h-14 items-center px-4 gap-4 justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                className="lg:hidden"
                onClick={() => setIsMobileNavOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
            
            <div className="flex items-center gap-4">
              <CreditNotifications />
              {/* Add other header items here */}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
} 