
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ResponsiveImage from '@/components/ui/responsive-image';
import { useOptimizedDeviceInfo } from '@/hooks/use-optimized-device-info';
import { cn } from '@/lib/utils';

interface OptimizedVehicleGalleryProps {
  images: string[];
  vehicleName: string;
}

const OptimizedVehicleGallery: React.FC<OptimizedVehicleGalleryProps> = ({
  images,
  vehicleName
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const { isMobile } = useOptimizedDeviceInfo();

  // Use the actual images prop instead of hardcoded images
  const galleryImages = images && images.length > 0 ? images : [
    // Fallback images if none provided
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true",
  ];

  return (
    <div className="toyota-container py-8 lg:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold mb-4">Gallery</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore every angle of the {vehicleName} with our comprehensive gallery
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="lg:col-span-8"
        >
          <ResponsiveImage
            src={galleryImages[selectedImage]}
            alt={`${vehicleName} - Main view`}
            aspectRatio="showcase"
            priority
            className="rounded-lg shadow-xl"
          />
        </motion.div>

        {/* Thumbnail Grid */}
        <div className="lg:col-span-4">
          <div className={cn(
            "grid gap-3",
            isMobile ? "grid-cols-3" : "grid-cols-2"
          )}>
            {galleryImages.map((image, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                onClick={() => setSelectedImage(index)}
                className={cn(
                  "relative overflow-hidden rounded-lg border-2 transition-all duration-300",
                  selectedImage === index
                    ? "border-primary shadow-lg"
                    : "border-transparent hover:border-primary/50"
                )}
              >
                <ResponsiveImage
                  src={image}
                  alt={`${vehicleName} - View ${index + 1}`}
                  aspectRatio="gallery"
                  className="rounded-md"
                />
                {selectedImage === index && (
                  <div className="absolute inset-0 bg-primary/20 rounded-md" />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Image Counter */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
        className="text-center mt-6"
      >
        <p className="text-sm text-muted-foreground">
          {selectedImage + 1} of {galleryImages.length}
        </p>
      </motion.div>
    </div>
  );
};

export default OptimizedVehicleGallery;
