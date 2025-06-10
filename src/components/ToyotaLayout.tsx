import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Toaster } from "@/components/ui/toaster";
import MobileStickyNav from "./MobileStickyNav";
import { useIsMobile } from "@/hooks/use-mobile";

interface ToyotaLayoutProps {
  children: React.ReactNode;
  activeNavItem?: string;
}

const ToyotaLayout: React.FC<ToyotaLayoutProps> = ({ children, activeNavItem }) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header />
      
      <main className="flex-1">
        {children}
      </main>
      
      <Footer />
      
      {isMobile && (
        <MobileStickyNav activeItem={activeNavItem} />
      )}
      
      <Toaster />
    </div>
  );
};

export default ToyotaLayout;
