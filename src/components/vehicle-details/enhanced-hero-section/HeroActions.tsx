
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar, Settings, ArrowRight } from 'lucide-react';

interface HeroActionsProps {
  onBookTestDrive: () => void;
  onCarBuilder: () => void;
}

export const HeroActions: React.FC<HeroActionsProps> = ({
  onBookTestDrive,
  onCarBuilder
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.6 }}
      className="flex flex-col gap-3"
      role="group"
      aria-label="Vehicle actions"
    >
      <Button 
        onClick={onBookTestDrive}
        size="lg"
        className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group w-full min-h-[48px]"
        aria-describedby="test-drive-description"
      >
        <Calendar className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" aria-hidden="true" />
        Book Test Drive
        <motion.div
          className="ml-2"
          animate={{ x: [0, 3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          aria-hidden="true"
        >
          <ArrowRight className="h-4 w-4" />
        </motion.div>
      </Button>
      
      <Button 
        onClick={onCarBuilder}
        variant="outline"
        size="lg"
        className="border border-white/40 text-white hover:bg-white hover:text-gray-900 font-bold px-6 py-3 rounded-lg transition-all duration-300 group bg-white/10 backdrop-blur-sm w-full min-h-[48px]"
        aria-describedby="car-builder-description"
      >
        <Settings className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" aria-hidden="true" />
        Configure Your Car
      </Button>

      {/* Screen reader descriptions */}
      <div className="sr-only">
        <div id="test-drive-description">
          Schedule a test drive to experience the vehicle firsthand
        </div>
        <div id="car-builder-description">
          Customize your vehicle with different options and accessories
        </div>
      </div>
    </motion.div>
  );
};
