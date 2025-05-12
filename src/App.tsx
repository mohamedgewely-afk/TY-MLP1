
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import VehicleDetails from "./pages/VehicleDetails";
import TestDrive from "./pages/TestDrive";
import Enquire from "./pages/Enquire";
import NotFound from "./pages/NotFound";
import PreOwned from "./pages/PreOwned";

const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
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
          </TooltipProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default App;
