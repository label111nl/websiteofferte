import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/store/authStore';
import { useAdminAuthStore } from '@/store/adminAuthStore';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  CreditCard,
  Bell,
  ChevronDown,
  BarChart3,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { NotificationBell } from './NotificationBell';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CreditBalance } from './credits/CreditBalance';
import { supabase } from '@/lib/supabase';
import { set } from 'date-fns';
import { CreditPurchaseModal } from './credits/CreditPurchaseModal';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut: userSignOut } = useAuthStore();
  const { admin, signOut: adminSignOut } = useAdminAuthStore();
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  // const [openBuyCredits, setOpenBuyCredits] = useState<boolean>(false);

  const isAdminDashboard = Boolean(admin);

  useEffect(() => {
   const fetchCredits = async () => {
    if(user) {
      const { data: credits, error: userError } = await supabase
           .from("users")
           .select("credits")
           .eq("id", user.id)
           .single();
        

       setCredits(credits?.credits);
    }
   }
   fetchCredits();
  },[user])

  const handleSignOut = async () => {
    if (isAdminDashboard) {
      await adminSignOut();
      navigate({ to: '/admin/login' });
    } else {
      await userSignOut();
      navigate({ to: '/login' });
    }
  };

  const navigation = isAdminDashboard ? [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      current: location.pathname === '/admin',
    },
    {
      name: 'Leads',
      icon: Users,
      current: location.pathname.includes('/admin/leads'),
      dropdownItems: [
        { name: 'Alle Leads', href: '/admin' },
        { name: 'In Behandeling', href: '/admin?tab=pending' },
        { name: 'Goedgekeurd', href: '/admin?tab=approved' },
        { name: 'Afgekeurd', href: '/admin?tab=rejected' },
      ]
    },
    {
      name: 'Blog',
      href: '/admin/blog',
      icon: FileText,
      current: location.pathname.includes('/admin/blog'),
    },
    {
      name: 'Instellingen',
      icon: Settings,
      current: location.pathname.includes('/admin/settings'),
      dropdownItems: [
        { name: 'Algemeen', href: '/admin/settings' },
        { name: 'Betalingen', href: '/admin/settings/payment' },
        { name: 'Lead Matching', href: '/admin/settings/matching' },
        { name: 'AI Configuratie', href: '/admin/settings/ai' },
        { name: 'Gebruikers', href: '/admin/settings/users' },
        { name: 'Audit Logs', href: '/admin/settings/audit-logs' },
      ]
    },
  ] : [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      current: location.pathname === '/dashboard',
    },
    {
      name: 'Leads',
      icon: Users,
      current: location.pathname.includes('/leads'),
      dropdownItems: [
        { name: 'Beschikbare Leads', href: '/dashboard/leads' },
        { name: 'Mijn Leads', href: '/dashboard/leads?tab=my-leads' },
      ]
    },
    {
      name: 'Statistieken',
      href: '/dashboard/analytics',
      icon: BarChart3,
      current: location.pathname.includes('/analytics'),
    },
    {
      name: 'Financieel',
      icon: CreditCard,
      current: location.pathname.includes('/financial'),
      dropdownItems: [
        { name: 'Credits', href: '/dashboard/financial/credits' },
        { name: 'Facturen', href: '/dashboard/financial/invoices' },
        { name: 'Transacties', href: '/dashboard/financial/transactions' },
      ]
    },
    {
      name: 'Instellingen',
      icon: Settings,
      current: location.pathname.includes('/settings'),
      dropdownItems: [
        { name: 'Profiel', href: '/dashboard/settings/profile' },
        { name: 'Portfolio', href: '/dashboard/settings/portfolio' },
        { name: 'Bedrijf', href: '/dashboard/settings/company' },
        { name: 'Notificaties', href: '/dashboard/settings/notifications' },
      ]
    },
  ];

    const navigationMarketer = [
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        current: location.pathname === '/dashboard',
      },
      {
        name: 'Leads',
        icon: Users,
        current: location.pathname.includes('/leads'),
        dropdownItems: [
          { name: 'Beschikbare Leads', href: '/dashboard/leads' },
          { name: 'Mijn Leads', href: '/dashboard/leads?tab=my-leads' },
        ]
      },
      {
        name: 'Financieel',
        icon: CreditCard,
        current: location.pathname.includes('/financial'),
        dropdownItems: [
          { name: 'Abonnement', href: '/dashboard/subscription' },
          { name: 'Facturen', href: '/dashboard/financial/invoices' },
          { name: 'Transacties', href: '/dashboard/financial/transactions' },
        ]
      },
      {
        name: 'Instellingen',
        icon: Settings,
        current: location.pathname.includes('/settings'),
        dropdownItems: [
          { name: 'Profiel', href: '/dashboard/settings/profile' },
          { name: 'Portfolio', href: '/dashboard/settings/portfolio' },
          { name: 'Bedrijfsgegevens', href: '/dashboard/settings/company' },
          { name: 'Notificaties', href: '/dashboard/settings/notifications' },
        ]
      },
    ];

    const toggleDropdown = (name: string) => {
      setOpenDropdown(openDropdown === name ? null : name);
    };
  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile header */}

      {location.pathname.includes('/marketer') ?
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-center h-16 px-4 border-b">
                      <h1 className="text-xl font-bold text-gray-900">Website Offertes</h1>
                    </div>
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                      {navigationMarketer.map((item) => (
                        <div key={item.name}>
                          {item.dropdownItems ? (
                            <div className="space-y-1">
                              <button
                                onClick={() => toggleDropdown(item.name)}
                                className={`
                                  flex items-center justify-between w-full px-4 py-2 text-sm font-medium rounded-md
                                  ${item.current
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-50'
                                  }
                                `}
                              >
                                <div className="flex items-center">
                                  <item.icon className="mr-3 h-5 w-5" />
                                  {item.name}
                                </div>
                                <ChevronDown
                                  className={`w-4 h-4 transition-transform duration-200 ${
                                    openDropdown === item.name ? 'transform rotate-180' : ''
                                  }`}
                                />
                              </button>
                              {openDropdown === item.name && (
                                <div className="pl-11 space-y-1">
                                  {item.dropdownItems.map((subItem) => (
                                    <Link
                                      key={subItem.href}
                                      to={subItem.href}
                                      className={`
                                        block px-4 py-2 text-sm font-medium rounded-md
                                        ${location.pathname === subItem.href
                                          ? 'text-blue-700'
                                          : 'text-gray-600 hover:text-gray-900'
                                        }
                                      `}
                                    >
                                      {subItem.name}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <Link
                              to={item.href}
                              className={`
                                flex items-center px-4 py-2 text-sm font-medium rounded-md
                                ${item.current
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'text-gray-600 hover:bg-gray-50'
                                }
                              `}
                            >
                              <item.icon className="mr-3 h-5 w-5" />
                              {item.name}
                            </Link>
                          )}
                        </div>
                      ))}
                    </nav>
                    <div className="flex-shrink-0 p-4 border-t">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50"
                      >
                        <LogOut className="mr-3 h-5 w-5" />
                        Uitloggen
                      </button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              <div className="flex items-center space-x-4">
                <NotificationBell />
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Credits:</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {credits ?? 0}
                  </span>
                  <Link
                    to="/dashboard/financial/credits"
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Buy Credits
                  </Link>
                </div>
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.user_metadata?.avatar_url} />
                      <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link 
                      to={isAdminDashboard ? '/admin/settings' : '/dashboard/settings'}
                      className="flex items-center"
                    >
                      Instellingen
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                    Uitloggen
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              </div>
            </div> :  <Sheet>
        <div className="lg:hidden flex items-center justify-between p-4 border-b bg-white">
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <div className="flex items-center space-x-4">
            <NotificationBell />
            <Avatar>
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <SheetContent side="left" className="p-0 w-72">
          <ScrollArea className="h-full">
            <div className="p-6">
              <h2 className="text-lg font-semibold">Website Offertes</h2>
              <p className="text-sm text-muted-foreground">
                {isAdminDashboard ? 'Beheerders Portaal' : 'Partner Portaal'}
              </p>
            </div>
            <Separator />
            <nav className="space-y-1 p-4">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.dropdownItems ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className={`w-full justify-between ${item.current ? 'bg-accent' : ''}`}
                        >
                          <span className="flex items-center">
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.name}
                          </span>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="start" side="right">
                        {item.dropdownItems.map((subItem) => (
                          <DropdownMenuItem key={subItem.href} asChild>
                            <Link to={subItem.href}>{subItem.name}</Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${item.current ? 'bg-accent' : ''}`}
                      asChild
                    >
                      <Link to={item.href}>
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.name}
                      </Link>
                    </Button>
                  )}
                </div>
              ))}
            </nav>
          </ScrollArea>
        </SheetContent>
      </Sheet>} 

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r">
          <div className="flex items-center justify-between p-6">
            <div>
              <h2 className="text-lg font-semibold">Website Offertes</h2>
              <p className="text-sm text-muted-foreground">
                {isAdminDashboard ? 'Beheerders Portaal' : 'Partner Portaal'}
              </p>
            </div>
          </div>
          <Separator />
          <ScrollArea className="flex-1">
            <nav className="space-y-1 p-4">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.dropdownItems ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className={`w-full justify-between ${item.current ? 'bg-accent' : ''}`}
                        >
                          <span className="flex items-center">
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.name}
                          </span>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="start" side="right">
                        {item.dropdownItems.map((subItem) => (
                          <DropdownMenuItem key={subItem.href} asChild>
                            <Link to={subItem.href}>{subItem.name}</Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${item.current ? 'bg-accent' : ''}`}
                      asChild
                    >
                      <Link to={item.href}>
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.name}
                      </Link>
                    </Button>
                  )}
                </div>
              ))}
            </nav>
          </ScrollArea>
          <Separator />
          <div className="p-4">
            {!isAdminDashboard && <CreditBalance className="mb-4" />}
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Uitloggen
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        <header className="max-lg:hidden md:sticky top-0 z-10 bg-white border-b">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-semibold">
              {navigation.find(item => item.current)?.name || 'Dashboard'}
            </h1>
            <div className="flex items-center space-x-4">
              <NotificationBell />
              <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Credits:</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {credits ?? 0}
                  </span>
                  <Link
                    to="/dashboard/financial/credits"
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Buy Credits
                  </Link>
                  {/* <Button
                    variant="ghost" 
                    onClick={() => setOpenBuyCredits(true)}
                  >
                    openModal </Button>
                    <CreditPurchaseModal open={openBuyCredits} /> */}
                </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.user_metadata?.avatar_url} />
                      <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link 
                      to={isAdminDashboard ? '/admin/settings' : '/dashboard/settings'}
                      className="flex items-center"
                    >
                      Instellingen
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                    Uitloggen
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <main className="p-6">
          <Outlet /> {/* Ensure Outlet is used to render child routes */}
        </main>
      </div>
      
    </div>
  );
}