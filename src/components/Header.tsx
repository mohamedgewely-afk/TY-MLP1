
import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, X, Search, User, Heart, Globe, ShoppingBag, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePersona } from "@/contexts/PersonaContext";
import LanguageSwitcher from "./LanguageSwitcher";
import PersonaSelector from "./home/PersonaSelector";
import DesktopCategoryMenu from "./DesktopCategoryMenu";
import FavoritesDrawer from "./home/FavoritesDrawer";
import EnhancedSearch from "./search/EnhancedSearch";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const isMobile = useIsMobile();
  const location = useLocation();
  const { currentLanguage } = useLanguage();
  const { personaData } = usePersona();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateFavoritesCount = () => {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setFavoritesCount(favorites.length);
    };

    updateFavoritesCount();
    window.addEventListener('favorites-updated', updateFavoritesCount);
    
    return () => {
      window.removeEventListener('favorites-updated', updateFavoritesCount);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleFavorites = () => {
    setIsFavoritesOpen(!isFavoritesOpen);
  };

  const isHomePage = location.pathname === '/';

  const navigation = [
    { name: "Vehicles", href: "/#vehicles" },
    { name: "Pre-Owned", href: "/pre-owned" },
    { name: "Service", href: "#" },
    { name: "Offers", href: "/#offers" },
    { name: "About", href: "#" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 ${
          isHomePage && !isMobile ? 'lg:bg-transparent lg:border-transparent' : ''
        }`}
      >
        <div className="toyota-container">
          <div className="flex h-16 lg:h-20 items-center justify-between">
            {/* Mobile Menu Button */}
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                className="shrink-0"
                aria-label="Toggle menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            )}

            {/* Logo */}
            <Link 
              to="/" 
              className={`flex items-center space-x-2 ${isMobile ? 'flex-1 justify-center' : ''}`}
              onClick={closeMenu}
            >
              <div className="font-black text-2xl lg:text-3xl text-primary">
                TOYOTA
              </div>
              <div className="hidden sm:block text-xs text-muted-foreground font-medium">
                UAE
              </div>
            </Link>

            {/* Desktop Navigation */}
            {!isMobile && (
              <nav className="hidden lg:flex items-center space-x-8">
                <DesktopCategoryMenu />
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`text-sm font-medium transition-colors hover:text-primary relative group ${
                      isHomePage ? 'text-white hover:text-primary' : 'text-foreground'
                    }`}
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                  </Link>
                ))}
              </nav>
            )}

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2">
              {/* Language Switcher - Fixed positioning for mobile */}
              {isMobile ? (
                <div className="relative">
                  <LanguageSwitcher />
                </div>
              ) : (
                <LanguageSwitcher />
              )}

              {/* Search */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSearch}
                className={`relative ${isHomePage && !isMobile ? 'text-white hover:text-primary' : ''}`}
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Favorites */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFavorites}
                className={`relative ${isHomePage && !isMobile ? 'text-white hover:text-primary' : ''}`}
                aria-label="Favorites"
              >
                <Heart className="h-5 w-5" />
                {favoritesCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-primary text-primary-foreground">
                    {favoritesCount}
                  </Badge>
                )}
              </Button>

              {/* Enquire Button - Better spacing on mobile */}
              <Button 
                asChild 
                size={isMobile ? "sm" : "default"}
                className={`${isMobile ? 'ml-2' : 'ml-4'} shrink-0`}
              >
                <Link to="/enquire">
                  <Phone className="h-4 w-4 mr-2" />
                  Enquire
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && isMobile && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t shadow-lg"
            >
              <div className="px-4 py-6 space-y-4">
                <PersonaSelector />
                <nav className="space-y-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block text-lg font-medium text-foreground hover:text-primary transition-colors"
                      onClick={closeMenu}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
                <div className="pt-4 border-t">
                  <Button className="w-full" asChild>
                    <Link to="/enquire" onClick={closeMenu}>
                      Get in Touch
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Enhanced Search Modal */}
      <EnhancedSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Favorites Drawer */}
      <FavoritesDrawer isOpen={isFavoritesOpen} onClose={() => setIsFavoritesOpen(false)} />
    </>
  );
};

export default Header;
