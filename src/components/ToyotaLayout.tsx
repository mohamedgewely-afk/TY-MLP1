
import React, { useEffect } from "react";
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

  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }

    // Add PWA install prompt handling
    let deferredPrompt: any;
    
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      
      // Show install banner after 30 seconds
      setTimeout(() => {
        if (deferredPrompt) {
          const installBanner = document.createElement('div');
          installBanner.innerHTML = `
            <div style="position: fixed; bottom: 80px; left: 16px; right: 16px; background: #eb0a1e; color: white; padding: 16px; border-radius: 12px; z-index: 1000; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-weight: bold;">Install Toyota UAE App</div>
                <div style="font-size: 14px; opacity: 0.9;">Get the full experience</div>
              </div>
              <button id="install-btn" style="background: white; color: #eb0a1e; border: none; padding: 8px 16px; border-radius: 8px; font-weight: bold;">Install</button>
              <button id="dismiss-btn" style="background: transparent; color: white; border: none; padding: 8px; margin-left: 8px;">×</button>
            </div>
          `;
          document.body.appendChild(installBanner);
          
          document.getElementById('install-btn')?.addEventListener('click', () => {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then(() => {
              deferredPrompt = null;
              document.body.removeChild(installBanner);
            });
          });
          
          document.getElementById('dismiss-btn')?.addEventListener('click', () => {
            document.body.removeChild(installBanner);
          });
        }
      }, 30000);
    });
  }, []);

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
