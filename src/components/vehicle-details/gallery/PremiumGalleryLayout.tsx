
import React from "react";
import { motion } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { EnhancedSceneData } from "@/types/gallery";
import PremiumExperienceCard from "./PremiumExperienceCard";
import { cn } from "@/lib/utils";

interface PremiumGalleryLayoutProps {
  experiences: EnhancedSceneData[];
  layout: 'grid' | 'carousel';
  onExperienceExpand: (experience: EnhancedSceneData) => void;
  isLoading?: boolean;
}

const PremiumGalleryLayout: React.FC<PremiumGalleryLayoutProps> = ({
  experiences,
  layout,
  onExperienceExpand,
  isLoading = false
}) => {
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className={cn(
          layout === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            : "flex gap-6 overflow-hidden"
        )}>
          {Array.from({ length: layout === 'grid' ? 6 : 4 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="bg-muted/50 rounded-3xl animate-pulse h-[420px] min-w-[320px]"
            />
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (experiences.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="text-center max-w-md mx-auto">
          <motion.div 
            className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-muted via-muted/50 to-muted rounded-full flex items-center justify-center"
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-primary/20 rounded-full" />
            </div>
          </motion.div>
          <h3 className="text-2xl font-bold text-foreground mb-4">
            No experiences found
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Try adjusting your search terms or category filters to discover more Toyota experiences.
          </p>
        </div>
      </motion.div>
    );
  }

  // Grid layout
  if (layout === 'grid') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, staggerChildren: 0.1 }}
        >
          {experiences.map((experience, index) => (
            <PremiumExperienceCard
              key={experience.id}
              data={experience}
              onExpand={onExperienceExpand}
              index={index}
              layout="grid"
            />
          ))}
        </motion.div>
      </div>
    );
  }

  // Carousel layout
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {experiences.map((experience, index) => (
            <CarouselItem key={experience.id} className="pl-4 basis-auto">
              <PremiumExperienceCard
                data={experience}
                onExpand={onExperienceExpand}
                index={index}
                layout="carousel"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </div>
  );
};

export default PremiumGalleryLayout;
