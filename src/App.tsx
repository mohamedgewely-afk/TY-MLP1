
import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PersonaProvider } from "@/contexts/PersonaContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import EnhancedLoading from "@/components/ui/enhanced-loading";

// Lazy load pages for better code splitting
const Index = React.lazy(() => import("./pages/Index"));
const VehicleDetails = React.lazy(() => import("./pages/VehicleDetails"));
const TestDrive = React.lazy(() => import("./pages/TestDrive"));
const Enquire = React.lazy(() => import("./pages/Enquire"));
const PreOwned = React.lazy(() => import("./pages/PreOwned"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && 'status' in error && 
            typeof error.status === 'number' && error.status >= 400 && error.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true
    }
  }
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <PersonaProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center">
                <EnhancedLoading 
                  variant="branded" 
                  text="Loading Toyota UAE..."
                  size="lg"
                />
              </div>
            }>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/vehicle/:vehicleName" element={<VehicleDetails />} />
                <Route path="/test-drive" element={<TestDrive />} />
                <Route path="/enquire" element={<Enquire />} />
                <Route path="/pre-owned" element={<PreOwned />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </PersonaProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
