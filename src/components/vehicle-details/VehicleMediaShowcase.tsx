
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Image as ImageIcon, Video as VideoIcon, CircleChevronLeft, CircleChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehicleModel } from "@/types/vehicle";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

// Enhanced media gallery with better real-world visuals
const defaultMedia = [
  { type: "image", url: "https://di-uploads-pod34.dealerinspire.com/toyotaofnorthcharlotte/uploads/2023/11/2024-toyota-camry-hybrid-xse-platinum-white-pearl-front-three-quarter-view.jpg" },
  { type: "image", url: "https://toyota-cms-media.s3.amazonaws.com/wp-content/uploads/2023/03/2023_Toyota_Camry_XSE_SupersonicRed_001-1500x1000.jpg" },
  { type: "image", url: "https://global.toyota/pages/news/images/2021/07/15/1330/20210715_01_02_s.jpg" },
  { type: "image", url: "https://toyota-cms-media.s3.amazonaws.com/wp-content/uploads/2018/03/2018_Toyota_Camry_XSE_21_697238F73E9357A92C5B4C81E4E13233D9628987-1500x844.jpg" },
  { type: "video", url: "https://www.w3schools.com/html/mov_bbb.mp4", thumbnail: "https://toyota-cms-media.s3.amazonaws.com/wp-content/uploads/2023/03/2023_Toyota_Camry_XSE_SupersonicRed_001-1500x1000.jpg" },
  { type: "video", url: "https://www.w3schools.com/html/mov_bbb.mp4", thumbnail: "https://global.toyota/pages/news/images/2021/07/15/1330/20210715_01_02_s.jpg" },
];

interface VehicleMediaShowcaseProps {
  vehicle: VehicleModel;
}

const VehicleMediaShowcase: React.FC<VehicleMediaShowcaseProps> = ({ vehicle }) => {
  const media = [
    { type: "image", url: vehicle.image },
    ...defaultMedia,
  ];

  const [current, setCurrent] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'image' | 'video'>('all');

  const next = () => setCurrent((prev) => (prev + 1) % media.length);
  const prev = () => setCurrent((prev) => (prev - 1 + media.length) % media.length);

  // Filter media based on active filter
  const filteredMedia = media.filter(m => 
    activeFilter === 'all' ? true : m.type === activeFilter
  );

  const currentFilteredIndex = filteredMedia.findIndex(
    (_, i) => filteredMedia[i] === media[current]
  );

  // Handle filter change
  const handleFilterChange = (filter: 'all' | 'image' | 'video') => {
    setActiveFilter(filter);
    if (filter !== 'all' && media[current].type !== filter) {
      // Find first media item matching the filter
      const firstMatchingIndex = media.findIndex(m => m.type === filter);
      if (firstMatchingIndex >= 0) {
        setCurrent(firstMatchingIndex);
      }
    }
  };

  return (
    <>
      <div className="toyota-container mt-6 mb-12">
        <div className="relative rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
          <Carousel className="w-full">
            <div className="relative h-[340px] md:h-[520px] xl:h-[600px] flex items-center justify-center">
              {media[current].type === "image" ? (
                <img 
                  src={media[current].url} 
                  alt={vehicle.name + " showcase"} 
                  className="object-cover w-full h-full transition-all duration-300 rounded-t-2xl" 
                />
              ) : (
                <video
                  src={media[current].url}
                  controls
                  className="object-cover w-full h-full transition-all duration-300 rounded-t-2xl"
                  poster={media[current].thumbnail || vehicle.image}
                />
              )}

              {/* Arrows */}
              <div className="absolute inset-y-0 left-0 flex items-center">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="ml-4 rounded-full bg-white/70 hover:bg-white/90 dark:bg-gray-900/70 hover:dark:bg-gray-900/90"
                  onClick={prev}
                  aria-label="Previous media"
                >
                  <CircleChevronLeft className="h-8 w-8" />
                </Button>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="mr-4 rounded-full bg-white/70 hover:bg-white/90 dark:bg-gray-900/70 hover:dark:bg-gray-900/90"
                  onClick={next}
                  aria-label="Next media"
                >
                  <CircleChevronRight className="h-8 w-8" />
                </Button>
              </div>
              
              {/* Fullscreen */}
              <Button
                variant="outline"
                size="icon"
                className="absolute bottom-4 right-4 bg-white/70 hover:bg-white/90 rounded-full"
                onClick={() => setFullscreen(true)}
              >
                <Maximize2 className="h-6 w-6" />
              </Button>
            </div>
          </Carousel>
          
          {/* Media Type buttons */}
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <Button
              size="sm"
              variant={activeFilter === "all" ? "default" : "outline"}
              className="rounded-full bg-white/70 hover:bg-white/90"
              onClick={() => handleFilterChange('all')}
              aria-label="Show all media"
            >
              All
            </Button>
            <Button
              size="sm"
              variant={activeFilter === "image" ? "default" : "outline"}
              className="rounded-full bg-white/70 hover:bg-white/90"
              onClick={() => handleFilterChange('image')}
              aria-label="Show images"
            >
              <ImageIcon className="h-4 w-4 mr-1" />
              Images
            </Button>
            <Button
              size="sm"
              variant={activeFilter === "video" ? "default" : "outline"}
              className="rounded-full bg-white/70 hover:bg-white/90"
              onClick={() => handleFilterChange('video')}
              aria-label="Show videos"
            >
              <VideoIcon className="h-4 w-4 mr-1" />
              Videos
            </Button>
          </div>
          
          {/* Progress indicator */}
          <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-2 z-10">
            {filteredMedia.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-2 w-2 rounded-full transition-all ${
                  idx === currentFilteredIndex ? 'bg-toyota-red w-8' : 'bg-gray-300 dark:bg-gray-600'
                }`}
                onClick={() => setCurrent(media.indexOf(filteredMedia[idx]))}
              />
            ))}
          </div>
          
          {/* Thumbnails */}
          <div className="p-4 bg-white dark:bg-gray-800">
            <div className="flex overflow-x-auto gap-2 pb-2 px-2">
              {media.map((m, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`flex-shrink-0 w-20 h-14 cursor-pointer rounded-lg overflow-hidden border-2 transition-all
                    ${idx === current ? "border-toyota-red" : "border-gray-200 dark:border-gray-700"}
                    ${activeFilter !== 'all' && m.type !== activeFilter ? "opacity-40" : ""}
                  `}
                >
                  {m.type === "image" ? (
                    <img src={m.url} alt={`Media ${idx + 1}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                      <VideoIcon className="h-8 w-8 text-toyota-red" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Fullscreen Modal */}
      {fullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col" onClick={() => setFullscreen(false)}>
          <div className="flex justify-end p-6">
            <Button variant="outline" size="icon" className="bg-black/70 text-white"
              onClick={() => setFullscreen(false)}
            >
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </Button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            {media[current].type === "image" ? (
              <img src={media[current].url} alt={"Fullscreen " + vehicle.name} className="max-h-[80vh] max-w-full rounded-lg shadow-xl" />
            ) : (
              <video src={media[current].url} controls className="max-h-[80vh] max-w-full rounded-lg shadow-xl" autoPlay />
            )}
          </div>
          
          <div className="flex justify-between items-center p-6">
            <Button 
              variant="outline" 
              className="bg-black/50 text-white"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              Previous
            </Button>
            
            <div className="flex gap-2">
              {media.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-2 w-2 rounded-full cursor-pointer transition-all ${
                    idx === current ? 'bg-toyota-red w-8' : 'bg-gray-400'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrent(idx);
                  }}
                />
              ))}
            </div>
            
            <Button 
              variant="outline" 
              className="bg-black/50 text-white"
              onClick={(e) => {
                e.stopPropagation();
                next();
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

export default VehicleMediaShowcase;
