
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehicleModel } from "@/types/vehicle";

interface VehicleGalleryProps {
  vehicle: VehicleModel;
}

// Placeholder images for the gallery (would come from vehicle data in a real app)
const galleryImages = [
  "https://www.toyota.ae/-/media/project/tme/tjae/toyota-ae/showroom/npp/corolla/corolla-hero-full.jpg",
  "https://www.toyota.ae/-/media/project/tme/tjae/toyota-ae/showroom/npp/corolla/corolla-style-full-width-1.jpg",
  "https://www.toyota.ae/-/media/project/tme/tjae/toyota-ae/showroom/npp/corolla/corolla-interior-full-width.jpg",
  "https://www.toyota.ae/-/media/project/tme/tjae/toyota-ae/showroom/npp/corolla/corolla-safety-full-width.jpg",
];

const VehicleGallery: React.FC<VehicleGalleryProps> = ({ vehicle }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);
  
  const images = [vehicle.image, ...galleryImages];
  
  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };
  
  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };
  
  const handleFullscreen = () => {
    setShowFullscreen(true);
  };
  
  return (
    <>
      <div className="toyota-container">
        <div className="relative rounded-xl overflow-hidden bg-white dark:bg-gray-800">
          {/* Main Image */}
          <div className="relative h-[300px] md:h-[500px]">
            <img 
              src={images[currentImage]} 
              alt={`${vehicle.name} - View ${currentImage + 1}`}
              className="w-full h-full object-cover"
            />
            
            {/* Navigation Arrows */}
            <div className="absolute inset-0 flex items-center justify-between p-4">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-10 w-10 rounded-full bg-white/70 backdrop-blur-sm"
                onClick={prevImage}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-10 w-10 rounded-full bg-white/70 backdrop-blur-sm"
                onClick={nextImage}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Fullscreen Button */}
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute bottom-4 right-4 h-10 w-10 rounded-full bg-white/70 backdrop-blur-sm"
              onClick={handleFullscreen}
            >
              <Maximize2 className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Thumbnail Gallery */}
          <div className="p-4 bg-white dark:bg-gray-800">
            <div className="flex overflow-x-auto space-x-2 pb-2">
              {images.map((img, idx) => (
                <div 
                  key={idx}
                  className={`flex-shrink-0 w-24 h-16 cursor-pointer rounded-md overflow-hidden border-2 transition-all ${
                    currentImage === idx ? 'border-toyota-red' : 'border-transparent'
                  }`}
                  onClick={() => setCurrentImage(idx)}
                >
                  <img 
                    src={img} 
                    alt={`${vehicle.name} thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Fullscreen Gallery Modal */}
      {showFullscreen && (
        <div 
          className="fixed inset-0 bg-black z-50 flex flex-col"
          onClick={() => setShowFullscreen(false)}
        >
          <div className="flex justify-end p-4">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-10 w-10 rounded-full bg-black/50 text-white"
              onClick={() => setShowFullscreen(false)}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <img 
              src={images[currentImage]} 
              alt={`${vehicle.name} - View ${currentImage + 1}`}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          
          <div className="flex justify-between items-center p-4">
            <Button 
              variant="outline" 
              className="bg-black/50 text-white"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              Previous
            </Button>
            
            <span className="text-white text-sm">
              {currentImage + 1} of {images.length}
            </span>
            
            <Button 
              variant="outline" 
              className="bg-black/50 text-white"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
            >
              Next
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default VehicleGallery;
