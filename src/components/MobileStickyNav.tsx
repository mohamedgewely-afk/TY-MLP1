import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Search, Car, Menu, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselPrevious, 
  CarouselNext 
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

interface MobileStickyNavProps {
  activeItem?: string;
  onMenuToggle?: () => void;
}

const MobileStickyNav: React.FC<MobileStickyNavProps> = ({ 
  activeItem = "home", 
  onMenuToggle 
}) => {
  const isMobile = useIsMobile();
  const [expanded, setExpanded] = useState(false);
  const [activeCard, setActiveCard] = useState(0);
  
  // Quick action cards data
  const quickActionCards = [
    {
      id: 1,
      title: "Book Test Drive",
      icon: <Car className="h-8 w-8" />,
      color: "bg-toyota-red text-white",
      link: "/test-drive"
    },
    {
      id: 2,
      title: "Latest Offers",
      icon: <span className="text-lg font-bold">%</span>,
      color: "bg-blue-500 text-white",
      link: "/offers"
    },
    {
      id: 3,
      title: "Build & Price",
      icon: <span className="text-lg font-bold">$</span>,
      color: "bg-green-500 text-white",
      link: "/configure"
    },
    {
      id: 4,
      title: "Service Booking",
      icon: <span className="text-lg font-bold">🔧</span>,
      color: "bg-amber-500 text-white",
      link: "/service"
    },
  ];
  
  if (!isMobile) return null;

  const handleToggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      {/* Main Sticky Nav */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg z-50 pt-2 pb-6 md:hidden"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Expandable Card Area */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden px-4 pb-3"
            >
              <Carousel
                opts={{ align: "start", loop: true }}
                className="w-full"
              >
                <CarouselContent>
                  {quickActionCards.map((card) => (
                    <CarouselItem key={card.id} className="basis-2/3">
                      <Link to={card.link}>
                        <Card className={cn("h-24", card.color)}>
                          <CardContent className="flex items-center justify-center h-full p-4">
                            <div className="text-center">
                              <div className="flex justify-center mb-2">
                                {card.icon}
                              </div>
                              <h3 className="font-medium">{card.title}</h3>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center mt-2">
                  <CarouselPrevious className="relative static h-7 w-7 translate-y-0 mr-2" />
                  <CarouselNext className="relative static h-7 w-7 translate-y-0" />
                </div>
              </Carousel>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Button */}
        <div className="flex justify-center mb-2">
          <button
            onClick={handleToggleExpanded}
            className="rounded-full bg-gray-200 dark:bg-gray-800 p-1 flex items-center justify-center"
          >
            {expanded ? 
              <ChevronDown className="h-4 w-4 text-gray-500" /> : 
              <ChevronUp className="h-4 w-4 text-gray-500" />
            }
          </button>
        </div>

        {/* Main Navigation */}
        <div className="grid grid-cols-5 gap-1">
          <NavItem 
            icon={<Home className="h-6 w-6" />}
            label="Home"
            to="/"
            isActive={activeItem === "home"}
          />
          <NavItem 
            icon={<Search className="h-6 w-6" />}
            label="Search"
            to="/search"
            isActive={activeItem === "search"}
          />
          <NavItem 
            icon={<Car className="h-6 w-6" />}
            label="Models"
            to="/new-cars"
            isActive={activeItem === "models"}
          />
          <NavItem 
            icon={<Heart className="h-6 w-6" />}
            label="Favorites"
            to="/favorites"
            isActive={activeItem === "favorites"}
          />
          <NavItem 
            icon={<Menu className="h-6 w-6" />}
            label="Menu"
            to="#"
            onClick={onMenuToggle}
            isActive={activeItem === "menu"}
          />
        </div>

        {/* Safe area for iOS devices */}
        <div className="h-6 bg-white dark:bg-gray-900 pb-safe-area-inset-bottom" />
      </motion.div>
    </>
  );
};

// NavItem Component - Keep this the same
interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  isActive?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, to, isActive = false, onClick }) => {
  const content = (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className={cn(
          "p-1 transition-colors",
          isActive ? "text-toyota-red" : "text-gray-500 dark:text-gray-400"
        )}>
          {icon}
        </div>
        <span className={cn(
          "text-xs text-center transition-colors",
          isActive ? "text-toyota-red font-medium" : "text-gray-500 dark:text-gray-400"
        )}>
          {label}
        </span>
      </div>
      {isActive && (
        <motion.div
          layoutId="indicator"
          className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-toyota-red rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </>
  );

  if (onClick) {
    return (
      <button 
        onClick={onClick} 
        className="relative flex items-center justify-center px-1"
      >
        {content}
      </button>
    );
  }

  return (
    <Link 
      to={to} 
      className="relative flex items-center justify-center px-1"
    >
      {content}
    </Link>
  );
};

// Components for the expanded drawer toggle
const ChevronUp = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m18 15-6-6-6 6"/>
  </svg>
);

const ChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

export default MobileStickyNav;
