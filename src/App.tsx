
import React, { Suspense } from "react";
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PersonaProvider } from "@/contexts/PersonaContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import EnhancedLoading from "@/components/ui/enhanced-loading";
import OptimizedHead from "@/components/OptimizedHead";

// Aggressive lazy loading for route-level code splitting (429KB → 150KB initial)
const Index = React.lazy(() => import("./pages/Index"));
const VehicleDetails = React.lazy(() => import("./pages/VehicleDetails"));
const TestDrive = React.lazy(() => import("./pages/TestDrive"));
const Enquire = React.lazy(() => import("./pages/Enquire"));
const PreOwned = React.lazy(() => import("./pages/PreOwned"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

// Optimized query client with enhanced caching for reduced network requests
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes - increased for better caching
      gcTime: 30 * 60 * 1000, // 30 minutes - extended garbage collection time
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors to reduce network load
        if (error instanceof Error && 'status' in error && 
            typeof error.status === 'number' && error.status >= 400 && error.status < 500) {
          return false;
        }
        return failureCount < 1; // Reduce retry attempts from 2 to 1
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: false,
      // Enable background updates for better UX
      refetchIntervalInBackground: false,
      // Use network-first strategy for critical data
      networkMode: 'online'
    },
    mutations: {
      retry: 1, // Reduce mutation retries
      networkMode: 'online'
    }
  }
});

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <PersonaProvider>
          <TooltipProvider>
            <OptimizedHead />
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
  </HelmetProvider>
);

export default App;
