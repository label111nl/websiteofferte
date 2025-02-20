import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  CreditCard,
  Bell,
  Building2,
} from "lucide-react";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "../NotificationBell";
import { LeadTable } from "./LeadTable";
import { useLeads } from "@/hooks/queries/useLeads";
import { Lead } from "@/types";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import formatDateToUpdate, { formatDate } from "@/lib/utils";
import Loader from "../ui/loader";

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

export default function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, signOut } = useAdminAuthStore();
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: leads = [] } = useLeads();
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);

  const queryClient = useQueryClient();

  const navigation = [
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
        { name: 'All Leads', href: '/admin' },
        { name: 'Pending Review', href: '/admin?tab=pending' },
        { name: 'Approved', href: '/admin?tab=approved' },
        { name: 'Rejected', href: '/admin?tab=rejected' },
      ]
    },
    {
      name: 'Blog',
      href: '/admin/blog',
      icon: FileText,
      current: location.pathname.includes('/admin/blog'),
    },
    {
      name: 'Settings',
      icon: Settings,
      current: location.pathname.includes('/admin/settings'),
      dropdownItems: [
        { name: 'General', href: '/admin/settings' },
        { name: 'Payment', href: '/admin/settings/payment' },
        { name: 'Lead Matching', href: '/admin/settings/lead-matching' },
        { name: 'AI Configuration', href: '/admin/settings/ai' },
        { name: 'Users', href: '/admin/settings/users' },
        { name: 'Audit Logs', href: '/admin/settings/audit-logs' },
      ]
    },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: '/admin/login' });
  };

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handlePublishLead = async (
    id: string,
    publish: NonNullable<Lead["published"]>,
    price: number
  ) => {
    const { error } = await supabase
      .from("leads")
      .update({
        published: publish,
        published_at: formatDateToUpdate(new Date()),
        price: price,
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating lead:", error.message);
      return;
    }

    queryClient.setQueryData<Lead[]>(
      ["leads"],
      (prev) =>
        prev?.map((lead) =>
          lead.id === id ? { ...lead, published: publish } : lead
        ) || []
    );
  };

  const handleCallStatusChange = async (
    id: string,
    status: NonNullable<Lead["call_status"]>
  ) => {
    const { error } = await supabase
      .from("leads")
      .update({
        call_status: status,
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating lead:", error.message);
      return;
    }

    queryClient.setQueryData<Lead[]>(
      ["leads"],
      (prev) =>
        prev?.map((lead) =>
          lead.id === id ? { ...lead, call_status: status } : lead
        ) || []
    );
  };


  const handleStatusChange = async (
    id: string,
    status: NonNullable<Lead["status"]>
  ) => {
    console.log(id,status,"ID HBERE ID ")
    const { error } = await supabase
      .from("leads")
      .update({
        status: status,
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating lead:", error.message);
      return;
    }

    queryClient.setQueryData<Lead[]>(
      ["leads"],
      (prev) =>
        prev?.map((lead) =>
          lead.id === id ? { ...lead, status: status } : lead
        ) || []
    );
  };

  useEffect(() => {
    setLoading(true);
    if (leads.length > 0) {
      setFilteredLeads(leads);
      setLoading(false);
    }
  }, [leads]);

  useEffect(() => {
    const filterLeads = () => {
      if (location.search) {
        const tab = new URLSearchParams(location.search).get("tab");
        if (tab === "pending") {
          setFilteredLeads(leads.filter((lead) => lead.status === "pending"));
        } else if (tab === "approved") {
          setFilteredLeads(leads.filter((lead) => lead.status === "approved"));
        } else if (tab === "rejected") {
          setFilteredLeads(leads.filter((lead) => lead.status === "rejected"));
        } else {
          setFilteredLeads(leads);
        }
      }
    };

    filterLeads();
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-100">
      Mobile header
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b mr-1">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-center h-16 px-4 border-b">
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
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
                  Sign Out
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex items-center space-x-4">
          <NotificationBell />
          <span className="text-sm text-gray-600">
            {admin?.email}
          </span>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r">
          <div className="flex items-center justify-center h-16 px-4 border-b">
            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
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
              Sign Out
            </button>
          </div>
        </div>
      </div>
      {/* Main content */}
      <div className="lg:pl-64">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center">
              <h1 className="text-lg font-semibold text-gray-900">
                {navigation.find(item => item.current)?.name || 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationBell />
            </div>
          </div>
        </header>
        <main className="p-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Leads</h2>
              {loading ? (
                <Loader />
              ) : (
                <LeadTable
                  leads={filteredLeads || []}
                  onCallStatusChange={handleCallStatusChange}
                  onPublishLead={handlePublishLead}
                  isAdmin
                  onStatusChange={handleStatusChange}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}