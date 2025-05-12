import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown, Globe, Moon, Sun, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import MobileStickyNav from "./MobileStickyNav";
import DesktopCategoryMenu from "./DesktopCategoryMenu";

interface ToyotaLayoutProps {
  children: React.ReactNode;
}

const ToyotaLayout: React.FC<ToyotaLayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setCategoryMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={cn("min-h-screen flex flex-col bg-background", 
      isDarkMode ? "dark" : "")}>
      {/* Header */}
      <header ref={navRef} className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
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
            <div 
              className="relative"
              onMouseEnter={() => setCategoryMenuOpen(true)}
              onMouseLeave={() => setCategoryMenuOpen(false)}
            >
              <NavLink 
                href="/new-cars" 
                onClick={(e) => {
                  e.preventDefault();
                  setCategoryMenuOpen(!categoryMenuOpen);
                }}
                className="flex items-center gap-1"
              >
                New Cars <ChevronDown className={cn("h-4 w-4 transition-transform", categoryMenuOpen ? "rotate-180" : "")} />
              </NavLink>
              <DesktopCategoryMenu 
                isOpen={categoryMenuOpen} 
                onClose={() => setCategoryMenuOpen(false)} 
              />
            </div>
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

      {/* Footer - Updated with modern design */}
      <footer className="bg-slate-900 text-white">
        <div className="toyota-container py-16">
          {/* Upper Footer with grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Brand Section */}
            <div className="md:col-span-5 space-y-6">
              <img 
                src="https://www.toyota.ae/-/media/Images/toyota-global-logo.svg" 
                alt="Toyota" 
                className="h-10 invert" 
              />
              <p className="text-gray-300 max-w-md">
                Experience innovation, quality and reliability with Toyota UAE. Discover a range of vehicles designed to exceed your expectations.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-toyota-red hover:bg-toyota-darkred">
                  Find a Dealer
                </Button>
                <Button variant="outline" className="border-white/30 hover:bg-white/10">
                  Book a Service
                </Button>
              </div>
              <div className="flex space-x-5 pt-4">
                <a href="#" className="hover:text-toyota-red transition-colors" aria-label="Facebook">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="hover:text-toyota-red transition-colors" aria-label="Instagram">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="hover:text-toyota-red transition-colors" aria-label="Twitter">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="hover:text-toyota-red transition-colors" aria-label="YouTube">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-bold mb-6">Explore</h3>
              <ul className="space-y-3">
                <FooterLink href="/new-cars">New Cars</FooterLink>
                <FooterLink href="/hybrid">Hybrid Models</FooterLink>
                <FooterLink href="/performance">GR Performance</FooterLink>
                <FooterLink href="/pre-owned">Pre-Owned Vehicles</FooterLink>
                <FooterLink href="/offers">Current Offers</FooterLink>
                <FooterLink href="/compare">Compare Models</FooterLink>
              </ul>
            </div>

            {/* Services Links */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-bold mb-6">Services</h3>
              <ul className="space-y-3">
                <FooterLink href="/service">Service & Maintenance</FooterLink>
                <FooterLink href="/roadside">Roadside Assistance</FooterLink>
                <FooterLink href="/warranty">Warranty</FooterLink>
                <FooterLink href="/accessories">Genuine Accessories</FooterLink>
                <FooterLink href="/financial">Financial Services</FooterLink>
                <FooterLink href="/fleet">Fleet Solutions</FooterLink>
              </ul>
            </div>

            {/* About Links */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-bold mb-6">About</h3>
              <ul className="space-y-3">
                <FooterLink href="/about">About Toyota UAE</FooterLink>
                <FooterLink href="/news">Latest News</FooterLink>
                <FooterLink href="/careers">Careers</FooterLink>
                <FooterLink href="/sustainability">Sustainability</FooterLink>
                <FooterLink href="/contact">Contact Us</FooterLink>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="md:col-span-1">
              <h3 className="text-lg font-bold mb-6">Newsletter</h3>
              <p className="text-gray-300 text-sm mb-4">Subscribe for updates on new models, offers, and events.</p>
              <form className="flex flex-col space-y-3">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-slate-800 rounded px-4 py-2 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-toyota-red" 
                />
                <Button className="bg-toyota-red hover:bg-toyota-darkred">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
          
          {/* Lower Footer */}
          <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col lg:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Toyota Motor Corporation. All Rights Reserved.
            </p>
            <div className="flex flex-wrap gap-6 mt-4 lg:mt-0 text-sm text-gray-400">
              <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-white transition-colors">Terms of Use</a>
              <a href="/cookies" className="hover:text-white transition-colors">Cookie Policy</a>
              <a href="/sitemap" className="hover:text-white transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Nav */}
      <MobileStickyNav 
        onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      {/* Chat Widget - Adjust position to account for expanded sticky nav */}
      <div className="fixed bottom-32 md:bottom-8 right-8 z-50">
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
const NavLink = ({ href, children, onClick, className }: { href: string; children: React.ReactNode; onClick?: (e: React.MouseEvent) => void; className?: string }) => (
  <Link 
    to={href} 
    onClick={onClick}
    className={cn("text-gray-700 dark:text-gray-200 hover:text-toyota-red dark:hover:text-toyota-red font-medium text-sm transition", className)}
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

export default ToyotaLayout;
