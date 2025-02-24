import React from 'react';
// import { Link, useLocation, useNavigate } from '@tanstack/react-router';
// import { 
//   LayoutDashboard, 
//   Users, 
//   Settings, 
//   LogOut,
//   Menu,
//   X,
//   ChevronDown,
//   CreditCard,
//   Bell,
//   Building2
// } from 'lucide-react';
// import { useAuthStore } from '@/store/authStore';
// import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
// import { Button } from '@/components/ui/button';
// import { NotificationBell } from '../NotificationBell';
import MarketerDashboard from '@/pages/MarketerDashboard';

interface MarketerDashboardLayoutProps {
  children: React.ReactNode;
}

export default function MarketerDashboardLayout({ children }: MarketerDashboardLayoutProps) {
  // const location = useLocation();
  // const navigate = useNavigate();
  // const { user, signOut } = useAuthStore();
  // const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);

  // const navigation = [
  //   {
  //     name: 'Dashboard',
  //     href: '/dashboard',
  //     icon: LayoutDashboard,
  //     current: location.pathname === '/dashboard',
  //   },
  //   {
  //     name: 'Leads',
  //     icon: Users,
  //     current: location.pathname.includes('/leads'),
  //     dropdownItems: [
  //       { name: 'Beschikbare Leads', href: '/dashboard/leads' },
  //       { name: 'Mijn Leads', href: '/dashboard/leads?tab=my-leads' },
  //     ]
  //   },
  //   {
  //     name: 'Financieel',
  //     icon: CreditCard,
  //     current: location.pathname.includes('/financial'),
  //     dropdownItems: [
  //       { name: 'Abonnement', href: '/dashboard/subscription' },
  //       { name: 'Facturen', href: '/dashboard/financial/invoices' },
  //       { name: 'Transacties', href: '/dashboard/financial/transactions' },
  //     ]
  //   },
  //   {
  //     name: 'Instellingen',
  //     icon: Settings,
  //     current: location.pathname.includes('/settings'),
  //     dropdownItems: [
  //       { name: 'Profiel', href: '/dashboard/settings/profile' },
  //       { name: 'Portfolio', href: '/dashboard/settings/portfolio' },
  //       { name: 'Bedrijfsgegevens', href: '/dashboard/settings/company' },
  //       { name: 'Notificaties', href: '/dashboard/settings/notifications' },
  //     ]
  //   },
  // ];

  // const handleSignOut = async () => {
  //   await signOut();
  //   navigate({ to: '/login' });
  // };

  // const toggleDropdown = (name: string) => {
  //   setOpenDropdown(openDropdown === name ? null : name);
  // };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile header */}
      {/* <div className="sm:hidden flex items-center justify-between p-4 bg-white border-b">
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
                {navigation.map((item) => (
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
              {user?.credits ?? 0}
            </span>
            <Link
              to="/dashboard/financial/credits"
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Buy Credits
            </Link>
          </div>
        </div>
      </div> */}

      {/* Desktop sidebar */}
      {/* <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r">
          <div className="flex items-center justify-center h-16 px-4 border-b">
            <h1 className="text-xl font-bold text-gray-900">Website Offertes</h1>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
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
      </div> */}

      {/* Main content */}
      <div>
        {/* <header className="lg:hidden bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center">
              <h1 className="text-lg font-semibold text-gray-900">
                {navigation.find(item => item.current)?.name || 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationBell />
              {user?.subscription_type === 'premium' ? (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Premium
                </span>
              ) : (
                <Link
                  to="/dashboard"
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  Upgrade to Premium
                </Link>
              )}
            </div>
          </div>
        </header> */}
        <main>
          <MarketerDashboard />
        </main>
      </div>
    </div>
  );
}