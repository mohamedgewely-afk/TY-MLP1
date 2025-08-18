
import React, { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, Share2, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSwipeable } from "@/hooks/use-swipeable";
import { contextualHaptic } from "@/utils/haptic";
import type { Chapter } from "../VehicleGallery";
import type { GalleryState } from "@/hooks/use-gallery-state";

interface MobileGalleryViewProps {
  chapters: Chapter[];
  state: GalleryState;
  isGR: boolean;
  onChapterChange: (chapter: number) => void;
  onImageOpen: (media: { url: string; alt: string }, index: number) => void;
  onToggleFavorite: (imageUrl: string) => void;
  onModeChange: (mode: 'cinematic' | 'grid') => void;
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
  const currentChapter = chapters[state.currentChapter];
  
  const handleSwipeLeft = useCallback(() => {
    contextualHaptic.swipeNavigation();
    if (state.currentChapter < chapters.length - 1) {
      onChapterChange(state.currentChapter + 1);
    }
  }, [state.currentChapter, chapters.length, onChapterChange]);

  const handleSwipeRight = useCallback(() => {
    contextualHaptic.swipeNavigation();
    if (state.currentChapter > 0) {
      onChapterChange(state.currentChapter - 1);
    }
  }, [state.currentChapter, onChapterChange]);

  const swipeRef = useSwipeable({
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
    threshold: 50,
    debug: false,
  });

  const handleShare = async (imageUrl: string) => {
    contextualHaptic.buttonPress();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Toyota Vehicle Image',
          url: imageUrl,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    }
  };

  const handleDownload = (imageUrl: string) => {
    contextualHaptic.buttonPress();
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'toyota-image.jpg';
    link.click();
  };

  if (state.mode === 'grid') {
    return (
      <div className="grid grid-cols-2 gap-3 p-4">
        {chapters.flatMap((chapter, chapterIndex) =>
          chapter.media.map((media, imageIndex) => (
            <motion.button
              key={`${chapterIndex}-${imageIndex}`}
              onClick={() => onImageOpen(media, imageIndex)}
              className={[
                "relative aspect-[4/3] rounded-xl overflow-hidden",
                isGR ? "border border-[#17191B]" : "border border-gray-200"
              ].join(" ")}
              whileTap={{ scale: 0.98 }}
            >
              <img src={media.url} alt={media.alt} className="w-full h-full object-cover" />
              {media.premium && (
                <Badge className="absolute top-2 left-2 text-xs">
                  Signature
                </Badge>
              )}
              <div className="absolute bottom-2 right-2">
                <Eye className="w-4 h-4 text-white drop-shadow-lg" />
              </div>
            </motion.button>
          ))
        )}
      </div>
    );
  }

  return (
    <div ref={swipeRef} className="relative">
      {/* Chapter Progress Dots */}
      <div className="sticky top-16 z-10 flex items-center justify-center py-2">
        <div className="flex gap-1.5 px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-sm">
          {chapters.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                contextualHaptic.selectionChange();
                onChapterChange(index);
              }}
              className={[
                "w-2 h-2 rounded-full transition-all",
                index === state.currentChapter
                  ? isGR ? "bg-[#EB0A1E]" : "bg-white"
                  : "bg-white/40"
              ].join(" ")}
              aria-label={`Go to ${chapters[index].title}`}
            />
          ))}
        </div>
      </div>

      {/* Chapter Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={state.currentChapter}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="px-4 pb-6"
        >
          {/* Chapter Header */}
          <div className="mb-4">
            <h2 className={[
              "text-xl font-bold mb-1",
              isGR ? "text-[#E6E7E9]" : "text-gray-900"
            ].join(" ")}>
              {currentChapter?.title}
            </h2>
            <p className={isGR ? "text-[#9DA2A6]" : "text-gray-600"}>
              {currentChapter?.subtitle}
            </p>
          </div>

          {/* Main Image */}
          {currentChapter?.media[0] && (
            <div className="relative mb-6">
              <motion.button
                onClick={() => onImageOpen(currentChapter.media[0], 0)}
                className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden"
                whileTap={{ scale: 0.99 }}
              >
                <img
                  src={currentChapter.media[0].url}
                  alt={currentChapter.media[0].alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                
                {/* Action Buttons */}
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <Button
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(currentChapter.media[0].url);
                    }}
                    className="bg-black/20 backdrop-blur-sm hover:bg-black/30"
                  >
                    <Heart className={[
                      "w-4 h-4",
                      state.favorites.includes(currentChapter.media[0].url)
                        ? "fill-red-500 text-red-500"
                        : "text-white"
                    ].join(" ")} />
                  </Button>
                  
                  <Button
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(currentChapter.media[0].url);
                    }}
                    className="bg-black/20 backdrop-blur-sm hover:bg-black/30"
                  >
                    <Share2 className="w-4 h-4 text-white" />
                  </Button>
                  
                  <Button
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(currentChapter.media[0].url);
                    }}
                    className="bg-black/20 backdrop-blur-sm hover:bg-black/30"
                  >
                    <Download className="w-4 h-4 text-white" />
                  </Button>
                </div>
              </motion.button>
            </div>
          )}

          {/* Additional Images */}
          {currentChapter?.media.slice(1, 3).map((media, index) => (
            <motion.button
              key={index + 1}
              onClick={() => onImageOpen(media, index + 1)}
              className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-4"
              whileTap={{ scale: 0.99 }}
            >
              <img
                src={media.url}
                alt={media.alt}
                className="w-full h-full object-cover"
              />
              {media.premium && (
                <Badge className="absolute top-2 left-2 text-xs">
                  Signature
                </Badge>
              )}
            </motion.button>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <div className="fixed bottom-20 left-4 right-4 flex justify-between pointer-events-none">
        <Button
          size="icon"
          onClick={() => {
            contextualHaptic.buttonPress();
            onChapterChange(state.currentChapter - 1);
          }}
          disabled={state.currentChapter === 0}
          className={[
            "pointer-events-auto",
            isGR ? "bg-[#1A1C1F] border-[#17191B]" : "bg-white border-gray-200",
            state.currentChapter === 0 ? "opacity-30" : ""
          ].join(" ")}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <Button
          size="icon"
          onClick={() => {
            contextualHaptic.buttonPress();
            onChapterChange(state.currentChapter + 1);
          }}
          disabled={state.currentChapter === chapters.length - 1}
          className={[
            "pointer-events-auto",
            isGR ? "bg-[#1A1C1F] border-[#17191B]" : "bg-white border-gray-200",
            state.currentChapter === chapters.length - 1 ? "opacity-30" : ""
          ].join(" ")}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default MobileGalleryView;
