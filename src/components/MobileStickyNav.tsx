
import React from "react";
import { Link } from "react-router-dom";
import { Home, Search, Car, Menu, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobileStickyNavProps {
  activeItem?: string;
  onMenuToggle?: () => void;
}

const MobileStickyNav: React.FC<MobileStickyNavProps> = ({ 
  activeItem = "home", 
  onMenuToggle 
}) => {
  const isMobile = useIsMobile();
  
  if (!isMobile) return null;

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg z-50 pt-2 pb-6 md:hidden"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
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
  );
};

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

export default MobileStickyNav;
