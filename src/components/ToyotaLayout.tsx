
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown, Globe, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ToyotaLayoutProps {
  children: React.ReactNode;
}

const ToyotaLayout: React.FC<ToyotaLayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
    // In a real implementation, this would redirect to the appropriate language version
  };

  return (
    <div className={cn("min-h-screen flex flex-col bg-background", 
      isDarkMode ? "dark" : "")}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
        <div className="toyota-container py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img 
              src="https://www.toyota.ae/-/media/Images/toyota-global-logo.svg" 
              alt="Toyota" 
              className="h-8" 
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink href="/new-cars">New Cars</NavLink>
            <NavLink href="/hybrid">Hybrid</NavLink>
            <NavLink href="/pre-owned">Pre-Owned</NavLink>
            <NavLink href="/offers">Offers</NavLink>
            <NavLink href="/service">Service</NavLink>
            <NavLink href="/contact">Contact</NavLink>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleDarkMode}
              className="rounded-full"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleLanguage}
              className="rounded-full"
            >
              <Globe className="h-5 w-5" />
              <span className="sr-only">Change Language</span>
            </Button>

            <Button variant="default" className="bg-toyota-red hover:bg-toyota-darkred">
              Book Test Drive
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-full"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg z-40">
            <div className="py-4 space-y-1 px-4">
              <MobileNavLink href="/new-cars">New Cars</MobileNavLink>
              <MobileNavLink href="/hybrid">Hybrid</MobileNavLink>
              <MobileNavLink href="/pre-owned">Pre-Owned</MobileNavLink>
              <MobileNavLink href="/offers">Offers</MobileNavLink>
              <MobileNavLink href="/service">Service</MobileNavLink>
              <MobileNavLink href="/contact">Contact</MobileNavLink>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 py-4 px-4 flex justify-between">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleDarkMode}
                className="rounded-full text-sm"
              >
                {isDarkMode ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleLanguage}
                className="rounded-full text-sm"
              >
                <Globe className="h-4 w-4 mr-2" />
                {language === 'en' ? 'العربية' : 'English'}
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white dark:bg-black">
        <div className="toyota-container py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Toyota UAE</h3>
              <p className="text-gray-400 text-sm">
                Experience innovation, quality and reliability with Toyota UAE.
              </p>
              <div className="flex space-x-4">
                <SocialIcon href="#" aria-label="Facebook">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </SocialIcon>
                <SocialIcon href="#" aria-label="Instagram">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </SocialIcon>
                <SocialIcon href="#" aria-label="Twitter">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </SocialIcon>
                <SocialIcon href="#" aria-label="YouTube">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                  </svg>
                </SocialIcon>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Explore</h3>
              <ul className="space-y-2">
                <FooterLink href="/new-cars">New Cars</FooterLink>
                <FooterLink href="/hybrid">Hybrid Models</FooterLink>
                <FooterLink href="/performance">GR Performance</FooterLink>
                <FooterLink href="/pre-owned">Pre-Owned Vehicles</FooterLink>
                <FooterLink href="/offers">Current Offers</FooterLink>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Services</h3>
              <ul className="space-y-2">
                <FooterLink href="/service">Service & Maintenance</FooterLink>
                <FooterLink href="/roadside">Roadside Assistance</FooterLink>
                <FooterLink href="/warranty">Warranty</FooterLink>
                <FooterLink href="/accessories">Genuine Accessories</FooterLink>
                <FooterLink href="/financial">Financial Services</FooterLink>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Toyota UAE Headquarters</li>
                <li>Airport Road, Dubai</li>
                <li>United Arab Emirates</li>
                <li className="pt-2">+971 4 XXX XXXX</li>
                <li>info@toyota.ae</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>© {new Date().getFullYear()} Toyota Motor Corporation. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg z-50">
        <div className="grid grid-cols-4 py-2">
          <MobileNavButton href="/new-cars" label="Cars">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </MobileNavButton>
          
          <MobileNavButton href="/offers" label="Offers">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </MobileNavButton>
          
          <MobileNavButton href="/test-drive" label="Test Drive">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </MobileNavButton>
          
          <MobileNavButton href="#" label="More" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </MobileNavButton>
        </div>
      </div>

      {/* Chat Widget */}
      <div className="fixed bottom-20 md:bottom-8 right-8 z-50">
        <Button 
          className="rounded-full shadow-lg bg-toyota-red hover:bg-toyota-darkred flex items-center gap-2 px-4"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Chat with Us
        </Button>
      </div>
    </div>
  );
};

// Helper Components
const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link 
    to={href} 
    className="text-gray-700 dark:text-gray-200 hover:text-toyota-red dark:hover:text-toyota-red font-medium text-sm transition"
  >
    {children}
  </Link>
);

const MobileNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link 
    to={href} 
    className="block py-2 px-3 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
  >
    {children}
  </Link>
);

const MobileNavButton = ({ 
  href, 
  label, 
  onClick, 
  children 
}: { 
  href: string; 
  label: string; 
  onClick?: () => void;
  children: React.ReactNode 
}) => (
  <Link 
    to={href} 
    className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:text-toyota-red"
    onClick={onClick}
  >
    <div className="icon">{children}</div>
    <span className="text-xs mt-1">{label}</span>
  </Link>
);

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <li>
    <Link 
      to={href} 
      className="text-gray-400 hover:text-white transition-colors duration-200"
    >
      {children}
    </Link>
  </li>
);

const SocialIcon = ({ 
  href, 
  "aria-label": ariaLabel,
  children 
}: { 
  href: string; 
  "aria-label": string;
  children: React.ReactNode 
}) => (
  <a 
    href={href}
    className="text-gray-400 hover:text-white transition-colors duration-200"
    aria-label={ariaLabel}
  >
    {children}
  </a>
);

export default ToyotaLayout;
