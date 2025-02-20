import React from "react";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router/routes";
import Loader from "./components/ui/loader";

const queryClient = new QueryClient();

export default function App() {
  const { checkUser, isLoading } = useAuthStore();

  React.useEffect(() => {
    checkUser();
  }, [checkUser]);

  if (isLoading) {
    return (
      <Loader />
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
