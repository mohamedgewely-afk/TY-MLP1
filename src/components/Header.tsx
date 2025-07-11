
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Menu, 
  X, 
  Phone, 
  MapPin, 
  User, 
  Heart, 
  Search,
  Car,
  Wrench,
  Shield,
  FileText,
  Download
} from "lucide-react";
import { usePersona } from "@/contexts/PersonaContext";
import DesktopCategoryMenu from "@/components/DesktopCategoryMenu";
import PersonaSelector from "@/components/home/PersonaSelector";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const location = useLocation();
  const { personaData } = usePersona();
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const updateFavorites = () => {
      const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setFavorites(storedFavorites);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('favorites-updated', updateFavorites);
    updateFavorites();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('favorites-updated', updateFavorites);
    };
  }, []);

  const isVehiclePage = location.pathname.startsWith('/vehicle/');

  const handleDownloadBrochure = () => {
    // Simulate brochure download
    const link = document.createElement('a');
    link.href = '/brochures/toyota-general-brochure.pdf';
    link.download = 'toyota-brochure.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const navigation = [
    { name: "Vehicles", href: "/", icon: Car },
    { name: "Service", href: "/service", icon: Wrench },
    { name: "Parts", href: "/parts", icon: Shield },
    { name: "About", href: "/about", icon: FileText },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-background/95 backdrop-blur-lg border-b shadow-sm' 
            : 'bg-transparent'
        }`}
      >
        <div className="toyota-container">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3"
              >
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-black text-lg lg:text-xl">T</span>
                </div>
                <span className="text-xl lg:text-2xl font-black text-foreground">Toyota</span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <DesktopCategoryMenu />
              <nav className="flex items-center space-x-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-foreground hover:text-primary transition-colors font-medium"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <PersonaSelector />
              <LanguageSwitcher />
              
              {isVehiclePage ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownloadBrochure}
                  className="text-muted-foreground hover:text-primary"
                >
                  <Download className="h-5 w-5" />
                </Button>
              ) : (
                <Link to="/favorites">
                  <Button variant="ghost" size="sm" className="relative">
                    <Heart className="h-5 w-5" />
                    {favorites.length > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                        {favorites.length}
                      </Badge>
                    )}
                  </Button>
                </Link>
              )}

              <Button variant="ghost" size="sm">
                <User className="h-5 w-5" />
              </Button>
              
              <Button variant="ghost" size="sm">
                <Phone className="h-5 w-5 mr-2" />
                <span className="hidden xl:inline">Call Us</span>
              </Button>
              
              <Button asChild>
                <Link to="/enquire">Get Quote</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed right-0 top-0 h-full w-80 bg-background border-l shadow-xl"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                  <span className="text-lg font-bold">Menu</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-6 space-y-6">
                    {/* Persona Selector */}
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-3">Shopping Preference</h3>
                      <PersonaSelector />
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-2">
                      {navigation.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.name}
                            to={item.href}
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <Icon className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium">{item.name}</span>
                          </Link>
                        );
                      })}
                    </nav>

                    {/* Quick Actions */}
                    <div className="space-y-3 pt-6 border-t">
                      <h3 className="text-sm font-semibold text-muted-foreground">Quick Actions</h3>
                      
                      {isVehiclePage ? (
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => {
                            handleDownloadBrochure();
                            setIsMenuOpen(false);
                          }}
                        >
                          <Download className="h-4 w-4 mr-3" />
                          Download Brochure
                        </Button>
                      ) : (
                        <Link to="/favorites" onClick={() => setIsMenuOpen(false)}>
                          <Button variant="outline" className="w-full justify-start relative">
                            <Heart className="h-4 w-4 mr-3" />
                            Favorites
                            {favorites.length > 0 && (
                              <Badge className="ml-auto">
                                {favorites.length}
                              </Badge>
                            )}
                          </Button>
                        </Link>
                      )}

                      <Button variant="outline" className="w-full justify-start">
                        <Phone className="h-4 w-4 mr-3" />
                        Call +971 4 123 4567
                      </Button>
                      
                      <Button variant="outline" className="w-full justify-start">
                        <MapPin className="h-4 w-4 mr-3" />
                        Find Showroom
                      </Button>
                    </div>

                    {/* Language Switcher - Fixed positioning */}
                    <div className="pt-6 border-t">
                      <h3 className="text-sm font-semibold text-muted-foreground mb-3">Language</h3>
                      <div className="flex justify-start">
                        <LanguageSwitcher />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t">
                  <Button 
                    asChild 
                    className="w-full" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link to="/enquire">Get Quote</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
