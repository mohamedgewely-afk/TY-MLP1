import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSnapshot } from "valtio";
import {
  Menu,
  Globe,
  ChevronDown,
  Check
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePersona } from "@/contexts/PersonaContext";
import { vehicles } from "@/data/vehicles";
import { cn } from "@/lib/utils";
import { categoryState } from "@/lib/states";
import DesktopCategoryMenu from "./DesktopCategoryMenu";
import PersonaSelector from "./PersonaSelector";

export default function Header() {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { currentLanguage, handleLanguageChange } = useLanguage();
  const { personaData, setPersonaData } = usePersona();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const categorySnap = useSnapshot(categoryState);

  const handleOpenCategory = (category: string) => {
    categoryState.selectedCategory = category;
  };

  const handleCloseCategory = () => {
    categoryState.selectedCategory = null;
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="toyota-container flex h-16 items-center justify-between">
        {/* Logo Section */}
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="https://www.toyota.ae/static/images/toyota-logo.svg" 
            alt="Toyota" 
            className="h-8 w-8"
          />
          <span className="font-bold text-xl">Toyota UAE</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Vehicles</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <DesktopCategoryMenu 
                    isOpen={true}
                    onClose={() => {}}
                  />
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/offers">
                  Offers
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/service">
                  Service
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/about">
                  About
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <PersonaSelector onSelect={() => {}} />
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          {/* Enhanced Language Switcher with Better Arabic Text Size */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Globe className="h-4 w-4" />
                <span className="ml-2 text-sm font-medium min-w-[60px] text-left">
                  {currentLanguage === 'en' ? 'English' : 'العربية'}
                </span>
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => handleLanguageChange('en')}
                className={`flex items-center justify-between ${currentLanguage === 'en' ? 'bg-primary/5' : ''}`}
              >
                <span className="font-medium text-base">English</span>
                {currentLanguage === 'en' && <Check className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleLanguageChange('ar')}
                className={`flex items-center justify-between ${currentLanguage === 'ar' ? 'bg-primary/5' : ''}`}
                dir="rtl"
              >
                <span className="font-medium text-lg leading-relaxed" style={{ fontSize: '18px', lineHeight: '1.6' }}>
                  العربية
                </span>
                {currentLanguage === 'ar' && <Check className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="sm">
            Find a Dealer
          </Button>

          <Button variant="ghost" size="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.9 14.9c.3-.7.5-1.5.5-2.3 0-4.2-3.3-7.5-7.5-7.5S4.9 8.4 4.9 12.5c0 .8.2 1.6.5 2.3" />
              <path d="M2 15s2-2.5 5-2.5c3 0 5 2.5 5 2.5" />
              <path d="M22 15s-2-2.5-5-2.5c-3 0-5 2.5-5 2.5" />
            </svg>
          </Button>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="mt-8 space-y-6">
                <PersonaSelector onSelect={() => {}} />
                <div className="space-y-4">
                  <Button variant="ghost" className="w-full justify-start">
                    Vehicles
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    Offers
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    Service
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    About
                  </Button>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start">
                      <Globe className="h-4 w-4 mr-2" />
                      Language
                      <ChevronDown className="h-4 w-4 ml-auto" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={() => handleLanguageChange('en')}
                      className={`flex items-center justify-between ${currentLanguage === 'en' ? 'bg-primary/5' : ''}`}
                    >
                      <span className="font-medium text-base">English</span>
                      {currentLanguage === 'en' && <Check className="h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleLanguageChange('ar')}
                      className={`flex items-center justify-between ${currentLanguage === 'ar' ? 'bg-primary/5' : ''}`}
                      dir="rtl"
                    >
                      <span className="font-medium text-lg leading-relaxed" style={{ fontSize: '18px', lineHeight: '1.6' }}>
                        العربية
                      </span>
                      {currentLanguage === 'ar' && <Check className="h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
