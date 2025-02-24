import {
  createRootRoute,
  createRoute,
  Outlet,
  createRouter,
} from "@tanstack/react-router";
import PublicLayout from "@/components/PublicLayout";
import DashboardLayout from "@/components/DashboardLayout";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import Register from "@/pages/Register";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import SettingsPage from "@/pages/SettingsPage";
import ProfilePage from "@/pages/ProfilePage";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboardLayout from "@/components/dashboard/AdminDashboardLayout";
import CreditsPage from "@/pages/CreditsPage";
import QuotePage from "@/pages/QuotePage";
import OnboardingPage from "@/pages/OnboardingPage";
import LeadDetailsPage from "@/pages/LeadDetailsPage";
import VerifyEmailPage from "@/pages/auth/VerifyEmail";
import ResetPasswordPage from "@/pages/ResetPassword";
import LeadsPage from "@/pages/LeadsPage";
import { lazy } from "react";
import { supabase } from "@/lib/supabase";
import MarketerDashboardLayout from "@/components/dashboard/MarketerDashboardLayout";

// Root route
export const rootRoute = createRootRoute({
  component: PublicLayout,
});

// Public routes
export const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

export const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: Register,
});

export const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth/forgot-password",
  component: ForgotPasswordPage,
});

// Admin routes
export const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminDashboardLayout,
});

export const adminLoginRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/login",
  component: AdminLogin,
});

export const adminSettingsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/settings",
  component: SettingsPage,
});

// Marketer routes
// export const marketerRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: "/dashboard",
//   component: DashboardLayout,
// });

// Shared routes for both admin and marketer
export const sharedLeadsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shared/leads",
  validateSearch: (search: Record<string, unknown>) => ({
    tab: (search.tab || "all") as "all" | "purchased" | "available",
    sort: (search.sort || "created_at") as string,
    filter: (search.filter || "") as string,
  }),
});

export const sharedLeadDetailsRoute = createRoute({
  getParentRoute: () => sharedLeadsRoute,
  path: "/$leadId",
  component: lazy(() => import("@/pages/LeadDetailsPage")),
  loader: async ({ params: { leadId } }) => {
    // Check if lead exists and if user can view it
    const { data: lead } = await supabase
      .from("leads")
      .select("*, lead_purchases(*)")
      .eq("id", leadId)
      .single();

    if (!lead) throw new Error("Lead not found");

    // Check purchase limit
    if (lead.current_purchases >= 5) {
      throw new Error("Maximum purchases reached for this lead");
    }

    return { lead };
  },
});

export const sharedQuoteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/offerte-aanvragen",
  component: QuotePage,
});

// Add auth routes
export const verifyEmailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth/verify",
  component: VerifyEmailPage,
  validateSearch: (search: Record<string, unknown>) => ({
    email: search.email as string,
    token: search.token as string,
  }),
});

export const resetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth/reset-password",
  component: ResetPasswordPage,
  validateSearch: (search: Record<string, unknown>) => ({
    type: search.type as string,
    token: search.token as string,
  }),
});

// First declare all routes
export const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: lazy(() => import("@/components/DashboardLayout")),
});

export const leadDetailsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/leads/$leadId",
  component: lazy(() => import("@/pages/LeadDetailsPage")),
});

export const quoteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/offerte-aanvragen",
  component: lazy(() => import("@/pages/StandaloneQuotePage")),
});

// Marketer routes
export const marketerIndexRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/marketer",
  component: MarketerDashboardLayout,
});

export const marketerSettingsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/settings",
  component: SettingsPage,
});

export const marketerProfileRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/profile",
  component: ProfilePage,
});

export const marketerCreditsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/financial/credits",
  component: CreditsPage,
});

export const marketerOnboardingRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/onboarding",
  component: OnboardingPage,
});

// Then build the route tree
export const routeTree = rootRoute.addChildren([
  homeRoute,
  loginRoute,
  registerRoute,
  forgotPasswordRoute,
  verifyEmailRoute,
  resetPasswordRoute,
  adminRoute.addChildren([adminLoginRoute, adminSettingsRoute]),
  dashboardRoute.addChildren([
    marketerIndexRoute,
    marketerSettingsRoute,
    marketerProfileRoute,
    marketerCreditsRoute,
    marketerOnboardingRoute,
    leadDetailsRoute,
  ]),
  sharedLeadsRoute,
  sharedLeadDetailsRoute,
  quoteRoute,
]);

// Export types for type safety
export type AppRouter = typeof routeTree;

// Create and export router
export const router = createRouter({
  routeTree: rootRoute.addChildren([
    homeRoute,
    loginRoute,
    registerRoute,
    forgotPasswordRoute,
    verifyEmailRoute,
    resetPasswordRoute,
    adminRoute.addChildren([adminLoginRoute, adminSettingsRoute]),
    dashboardRoute.addChildren([
      marketerIndexRoute,
      marketerSettingsRoute,
      marketerProfileRoute,
      marketerCreditsRoute,
      marketerOnboardingRoute,
      leadDetailsRoute,
    ]),
    sharedLeadsRoute,
    sharedLeadDetailsRoute,
    quoteRoute,
  ]),
});

// Type declarations
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
