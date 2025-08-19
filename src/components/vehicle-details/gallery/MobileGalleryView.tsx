
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Eye, Grid3X3, Maximize2, Heart, Share2, Download, 
  ChevronLeft, ChevronRight, Play, Pause 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Chapter } from "../VehicleGallery";
import type { GalleryState } from "@/hooks/use-gallery-state";
import { contextualHaptic } from "@/utils/haptic";

interface MobileGalleryViewProps {
  chapters: Chapter[];
  state: GalleryState;
  isGR: boolean;
  onChapterChange: (chapter: number) => void;
  onImageOpen: (media: { url: string; alt: string }, index: number) => void;
  onToggleFavorite: (imageUrl: string) => void;
  onModeChange: (mode: 'cinematic' | 'grid' | 'split') => void;
}

const MobileGalleryView: React.FC<MobileGalleryViewProps> = ({
  chapters,
  state,
  isGR,
  onChapterChange,
  onImageOpen,
  onToggleFavorite,
  onModeChange,
}) => {
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  const [isAutoplay, setIsAutoplay] = useState(false);

  const currentChapter = chapters[state.currentChapter];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoplay) return;
    
    const timer = setInterval(() => {
      const nextChapter = (state.currentChapter + 1) % chapters.length;
      setSlideDirection('right');
      onChapterChange(nextChapter);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoplay, state.currentChapter, chapters.length, onChapterChange]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setTouchEnd(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchEnd({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);
    const minSwipeDistance = 50;

    if (isHorizontalSwipe && Math.abs(distanceX) > minSwipeDistance) {
      contextualHaptic.selectionChange();
      
      if (distanceX > 0 && state.currentChapter < chapters.length - 1) {
        // Swipe left - next chapter
        setSlideDirection('right');
        onChapterChange(state.currentChapter + 1);
      } else if (distanceX < 0 && state.currentChapter > 0) {
        // Swipe right - previous chapter
        setSlideDirection('left');
        onChapterChange(state.currentChapter - 1);
      }
    }
  };

  const handleShare = async (media: { url: string; alt: string }) => {
    contextualHaptic.buttonPress();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Toyota ${media.alt}`,
          url: media.url,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    }
  };

  const handleDownload = (media: { url: string; alt: string }) => {
    contextualHaptic.buttonPress();
    const link = document.createElement('a');
    link.href = media.url;
    link.download = `toyota-${media.alt.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    link.click();
  };

  if (state.mode === 'grid') {
    return (
      <div className="p-4">
        {/* Grid Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className={[
            "font-semibold",
            isGR ? "text-[#E6E7E9]" : "text-gray-900"
          ].join(" ")}>
            All Images ({chapters.reduce((acc, ch) => acc + ch.media.length, 0)})
          </h3>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onModeChange('cinematic')}
            className={isGR ? "border-[#17191B] text-[#E6E7E9]" : ""}
          >
            <Eye className="w-4 h-4 mr-1" />
            Cinematic
          </Button>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 gap-3">
          {chapters.flatMap((chapter, chapterIndex) =>
            chapter.media.map((media, imageIndex) => (
              <motion.div
                key={`${chapterIndex}-${imageIndex}`}
                className="relative aspect-square rounded-lg overflow-hidden"
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  contextualHaptic.buttonPress();
                  onImageOpen(media, imageIndex);
                }}
              >
                <img
                  src={media.url}
                  alt={media.alt}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black/20 flex items-end p-2">
                  <div className="flex gap-1 w-full">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 bg-white/20 backdrop-blur-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(media.url);
                      }}
                    >
                      <Heart className={[
                        "w-3 h-3",
                        state.favorites.includes(media.url) ? "fill-red-500 text-red-500" : "text-white"
                      ].join(" ")} />
                    </Button>
                    
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 bg-white/20 backdrop-blur-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(media);
                      }}
                    >
                      <Share2 className="w-3 h-3 text-white" />
                    </Button>
                    
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 bg-white/20 backdrop-blur-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(media);
                      }}
                    >
                      <Download className="w-3 h-3 text-white" />
                    </Button>
                  </div>
                </div>

                {/* Chapter badge */}
                <Badge className="absolute top-2 left-2 text-xs">
                  {chapter.title}
                </Badge>
              </motion.div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Cinematic Mode
  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex-1">
          <h2 className={[
            "text-xl font-bold mb-1",
            isGR ? "text-[#E6E7E9]" : "text-gray-900"
          ].join(" ")}>
            {currentChapter?.title}
          </h2>
          <p className={[
            "text-sm",
            isGR ? "text-[#9DA2A6]" : "text-gray-600"
          ].join(" ")}>
            {currentChapter?.subtitle}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              contextualHaptic.buttonPress();
              setIsAutoplay(!isAutoplay);
            }}
            className={isGR ? "text-[#E6E7E9]" : ""}
          >
            {isAutoplay ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
          
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onModeChange('grid')}
            className={isGR ? "text-[#E6E7E9]" : ""}
          >
            <Grid3X3 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main Image */}
      <div
        className="relative h-64 mx-4 mb-4 rounded-xl overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait" custom={slideDirection}>
          {currentChapter?.media[0] && (
            <motion.div
              key={state.currentChapter}
              custom={slideDirection}
              initial={{ x: slideDirection === 'right' ? 300 : -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: slideDirection === 'right' ? -300 : 300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative h-full cursor-pointer"
              onClick={() => {
                contextualHaptic.buttonPress();
                onImageOpen(currentChapter.media[0], 0);
              }}
            >
              <img
                src={currentChapter.media[0].url}
                alt={currentChapter.media[0].alt}
                className="w-full h-full object-cover"
              />
              
              {/* Action buttons overlay */}
              <div className="absolute bottom-3 right-3 flex gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 bg-white/20 backdrop-blur-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(currentChapter.media[0].url);
                  }}
                >
                  <Heart className={[
                    "w-4 h-4",
                    state.favorites.includes(currentChapter.media[0].url) ? "fill-red-500 text-red-500" : "text-white"
                  ].join(" ")} />
                </Button>
                
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 bg-white/20 backdrop-blur-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare(currentChapter.media[0]);
                  }}
                >
                  <Share2 className="w-4 h-4 text-white" />
                </Button>
              </div>

              {/* Expand icon */}
              <div className="absolute top-3 right-3">
                <Maximize2 className="w-5 h-5 text-white drop-shadow-lg" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation arrows */}
      {chapters.length > 1 && (
        <>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              contextualHaptic.buttonPress();
              setSlideDirection('left');
              onChapterChange(state.currentChapter - 1);
            }}
            disabled={state.currentChapter === 0}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-white bg-black/20 backdrop-blur-sm disabled:opacity-30"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              contextualHaptic.buttonPress();
              setSlideDirection('right');
              onChapterChange(state.currentChapter + 1);
            }}
            disabled={state.currentChapter === chapters.length - 1}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-black/20 backdrop-blur-sm disabled:opacity-30"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </>
      )}

      {/* Chapter dots */}
      <div className="flex justify-center items-center gap-2 px-4 pb-4">
        {chapters.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              contextualHaptic.selectionChange();
              const direction = index > state.currentChapter ? 'right' : 'left';
              setSlideDirection(direction);
              onChapterChange(index);
            }}
            className={[
              "w-2 h-2 rounded-full transition-all",
              index === state.currentChapter
                ? isGR ? "bg-[#EB0A1E] w-6" : "bg-blue-500 w-6"
                : isGR ? "bg-[#17191B]" : "bg-gray-300"
            ].join(" ")}
          />
        ))}
      </div>

      {/* Thumbnail strip */}
      {currentChapter?.media.length > 1 && (
        <div className="px-4 pb-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {currentChapter.media.slice(1, 6).map((media, index) => (
              <button
                key={index}
                onClick={() => {
                  contextualHaptic.buttonPress();
                  onImageOpen(media, index + 1);
                }}
                className="flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden"
              >
                <img
                  src={media.url}
                  alt={media.alt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
            
            {currentChapter.media.length > 6 && (
              <button
                onClick={() => onModeChange('grid')}
                className={[
                  "flex-shrink-0 w-16 h-12 rounded-lg flex items-center justify-center text-xs font-medium",
                  isGR ? "bg-[#1A1C1F] text-[#E6E7E9]" : "bg-gray-100 text-gray-600"
                ].join(" ")}
              >
                +{currentChapter.media.length - 6}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileGalleryView;
