
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { PersonaProvider } from "@/contexts/PersonaContext";
import Index from "./pages/Index";
import VehicleDetails from "./pages/VehicleDetails";
import TestDrive from "./pages/TestDrive";
import Enquire from "./pages/Enquire";
import NotFound from "./pages/NotFound";
import PreOwned from "./pages/PreOwned";
import "./styles/persona-patterns.css";

// Create a ScrollToTop component to reset scroll position on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Create a SkipToContent component for accessibility
const SkipToContent = () => {
  return (
    <a 
      href="#main-content" 
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-toyota-red focus:text-white focus:rounded-md"
    >
      Skip to content
    </a>
  );
};

// Create a component to set meta info based on persona
const MetaUpdater = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    // Set page title and other meta info
    document.title = "Toyota UAE - Personalized Hybrid Experience";
    
    // Add meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 
      'Explore Toyota Hybrid models personalized to your lifestyle and needs. Find the perfect vehicle for your driving style.');
  }, [pathname]);

  return null;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <PersonaProvider>
            <TooltipProvider>
              <SkipToContent />
              <ScrollToTop />
              <MetaUpdater />
              <Toaster />
              <Sonner position="top-center" />
              <main id="main-content">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/vehicle/:vehicleName" element={<VehicleDetails />} />
                  <Route path="/test-drive" element={<TestDrive />} />
                  <Route path="/pre-owned" element={<PreOwned />} />
                  <Route path="/new-cars" element={<Index />} /> {/* Redirects to home for now */}
                  <Route path="/hybrid" element={<Index />} /> {/* Redirects to home for now */}
                  <Route path="/offers" element={<Index />} /> {/* Redirects to home for now */}
                  <Route path="/service" element={<Index />} /> {/* Redirects to home for now */}
                  <Route path="/configure" element={<Index />} /> {/* Redirects to home for now */}
                  <Route path="/enquire" element={<Enquire />} />
                  <Route path="/contact" element={<Index />} /> {/* Redirects to home for now */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </TooltipProvider>
          </PersonaProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default App;
