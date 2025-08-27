import React, { Suspense, lazy } from "react";
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { PersonaProvider } from "@/contexts/PersonaContext";
import EnhancedLoading from "@/components/ui/enhanced-loading";
import OptimizedHead from "@/components/OptimizedHead";
import ErrorBoundary from "@/components/ErrorBoundary";

// Debug React hooks availability
console.log('App.tsx React hooks check:', { 
  useState: React.useState, 
  useEffect: React.useEffect,
  useContext: React.useContext 
});

// Aggressive lazy loading for route-level code splitting (429KB → 150KB initial)
const Index = lazy(() => import("./pages/Index"));
const VehicleDetails = lazy(() => import("./pages/VehicleDetails"));
const TestDrive = lazy(() => import("./pages/TestDrive"));
const Enquire = lazy(() => import("./pages/Enquire"));
const PreOwned = lazy(() => import("./pages/PreOwned"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Optimized query client with enhanced caching for reduced network requests
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: (failureCount, error) => {
        if (error instanceof Error && 'status' in error && 
            typeof error.status === 'number' && error.status >= 400 && error.status < 500) {
          return false;
        }
        return failureCount < 1;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: false,
      refetchIntervalInBackground: false,
      networkMode: 'online'
    },
    mutations: {
      retry: 1,
      networkMode: 'online'
    }
  }
});

const App = () => {
  console.log('App component rendering, React version:', React.version);
  
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary>
            <LanguageProvider>
              <ErrorBoundary>
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
              </ErrorBoundary>
            </LanguageProvider>
          </ErrorBoundary>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;
