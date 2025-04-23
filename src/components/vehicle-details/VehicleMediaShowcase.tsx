
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Image as ImageIcon, Video as VideoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehicleModel } from "@/types/vehicle";

// Example: Add video objects into the media list below
const defaultMedia = [
  { type: "image", url: "https://www.toyota.ae/-/media/project/tme/tjae/toyota-ae/showroom/npp/camry/camry-hero-full.jpg" },
  { type: "image", url: "https://www.toyota.ae/-/media/project/tme/tjae/toyota-ae/showroom/npp/camry/camry-interior-full-width.jpg" },
  { type: "video", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
];

interface VehicleMediaShowcaseProps {
  vehicle: VehicleModel;
  // Add hook for vehicle grades later
}

const VehicleMediaShowcase: React.FC<VehicleMediaShowcaseProps> = ({ vehicle }) => {
  // Here you could source media per-grade; for now, augment the vehicle with some demo video and images
  const media = [
    { type: "image", url: vehicle.image },
    ...defaultMedia,
  ];

  const [current, setCurrent] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const next = () => setCurrent((prev) => (prev + 1) % media.length);
  const prev = () => setCurrent((prev) => (prev - 1 + media.length) % media.length);

  // Toggle only image or video media with buttons
  const imageIndexes = media.map((m, i) => (m.type === 'image' ? i : null)).filter((i) => i !== null) as number[];
  const videoIndexes = media.map((m, i) => (m.type === 'video' ? i : null)).filter((i) => i !== null) as number[];

  return (
    <>
      <div className="toyota-container mt-6 mb-12">
        <div className="relative rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
          <div className="relative h-[340px] md:h-[520px] xl:h-[600px] flex items-center justify-center">
            {media[current].type === "image" ? (
              <img src={media[current].url} alt={vehicle.name + " showcase"} className="object-cover w-full h-full transition-all duration-300 rounded-2xl" />
            ) : (
              <video
                src={media[current].url}
                controls
                className="object-cover w-full h-full transition-all duration-300 rounded-2xl"
                poster={vehicle.image}
              />
            )}

            {/* Arrows */}
            <div className="absolute inset-y-0 left-3 flex items-center">
              <Button variant="outline" size="icon" className="bg-white/70 hover:bg-white/90 dark:bg-gray-900/70"
                onClick={prev}
                aria-label="Previous media"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </div>
            <div className="absolute inset-y-0 right-3 flex items-center">
              <Button variant="outline" size="icon" className="bg-white/70 hover:bg-white/90 dark:bg-gray-900/70"
                onClick={next}
                aria-label="Next media"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
            {/* Fullscreen */}
            <Button
              variant="outline"
              size="icon"
              className="absolute bottom-4 right-4 bg-white/70 hover:bg-white/90"
              onClick={() => setFullscreen(true)}
            >
              <Maximize2 className="h-6 w-6" />
            </Button>
          </div>
          {/* Media Type buttons */}
          <div className="absolute top-4 right-20 flex gap-2 z-10">
            <Button
              size="icon"
              variant={media[current].type === "image" ? "default" : "outline"}
              className="rounded-full"
              onClick={() => setCurrent(imageIndexes[0] || 0)}
              aria-label="Show images"
            >
              <ImageIcon className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant={media[current].type === "video" ? "default" : "outline"}
              className="rounded-full"
              onClick={() => setCurrent(videoIndexes[0] || 0)}
              aria-label="Show videos"
            >
              <VideoIcon className="h-5 w-5" />
            </Button>
          </div>
          {/* Thumbnails */}
          <div className="p-4 bg-white dark:bg-gray-800 border-t mt-2">
            <div className="flex overflow-x-auto gap-2 pb-2">
              {media.map((m, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`flex-shrink-0 w-20 h-14 cursor-pointer rounded-lg overflow-hidden border-2 transition-all
                    ${idx === current ? "border-toyota-red" : "border-gray-200 dark:border-gray-700"}
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
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col" onClick={() => setFullscreen(false)}>
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
              <img src={media[current].url} alt={"Fullscreen " + vehicle.name} className="max-h-[70vh] max-w-full rounded-lg shadow-xl" />
            ) : (
              <video src={media[current].url} controls className="max-h-[70vh] w-auto rounded-lg shadow-xl" autoPlay />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default VehicleMediaShowcase;

