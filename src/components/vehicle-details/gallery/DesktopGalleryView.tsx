
import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Eye, Grid3X3, Maximize2, Heart, Share2, Download, 
  ZoomIn, ZoomOut, RotateCw, Palette, Info, Play,
  ChevronLeft, ChevronRight, Layers, SplitSquareHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Chapter } from "../VehicleGallery";
import type { GalleryState } from "@/hooks/use-gallery-state";

interface DesktopGalleryViewProps {
  chapters: Chapter[];
  state: GalleryState;
  isGR: boolean;
  onChapterChange: (chapter: number) => void;
  onImageOpen: (media: { url: string; alt: string }, index: number) => void;
  onToggleFavorite: (imageUrl: string) => void;
  onModeChange: (mode: 'cinematic' | 'grid' | 'split') => void;
}

const DesktopGalleryView: React.FC<DesktopGalleryViewProps> = ({
  chapters,
  state,
  isGR,
  onChapterChange,
  onImageOpen,
  onToggleFavorite,
  onModeChange,
}) => {
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [showImageDetails, setShowImageDetails] = useState(false);
  const currentChapter = chapters[state.currentChapter];

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target !== document.body) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          if (state.currentChapter > 0) {
            onChapterChange(state.currentChapter - 1);
          }
          break;
        case 'ArrowRight':
          if (state.currentChapter < chapters.length - 1) {
            onChapterChange(state.currentChapter + 1);
          }
          break;
        case ' ':
          e.preventDefault();
          // Toggle between cinematic and grid
          onModeChange(state.mode === 'cinematic' ? 'grid' : 'cinematic');
          break;
        case 'g':
          onModeChange('grid');
          break;
        case 'c':
          onModeChange('cinematic');
          break;
        case 's':
          onModeChange('split');
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
          const chapterIndex = parseInt(e.key) - 1;
          if (chapterIndex < chapters.length) {
            onChapterChange(chapterIndex);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [state.currentChapter, state.mode, chapters.length, onChapterChange, onModeChange]);

  if (state.mode === 'grid') {
    return (
      <div className="flex h-[calc(100vh-120px)]">
        {/* Sidebar */}
        <div className={[
          "w-64 border-r p-4",
          isGR ? "border-[#17191B] bg-[#0F1113]" : "border-gray-200 bg-white"
        ].join(" ")}>
          <h3 className={[
            "font-semibold mb-4",
            isGR ? "text-[#E6E7E9]" : "text-gray-900"
          ].join(" ")}>
            Gallery Chapters
          </h3>
          <ScrollArea className="h-full">
            {chapters.map((chapter, index) => (
              <button
                key={index}
                onClick={() => onChapterChange(index)}
                className={[
                  "w-full text-left p-3 rounded-lg mb-2 transition-colors",
                  index === state.currentChapter
                    ? isGR ? "bg-[#1A1C1F] text-[#E6E7E9]" : "bg-gray-100 text-gray-900"
                    : isGR ? "text-[#9DA2A6] hover:bg-[#121416]" : "text-gray-600 hover:bg-gray-50"
                ].join(" ")}
              >
                <div className="font-medium text-sm">{chapter.title}</div>
                <div className="text-xs opacity-70 mt-1">{chapter.media.length} images</div>
              </button>
            ))}
          </ScrollArea>
        </div>

        {/* Masonry Grid */}
        <div className="flex-1 p-6">
          <div className="columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {chapters.flatMap((chapter, chapterIndex) =>
              chapter.media.map((media, imageIndex) => (
                <motion.div
                  key={`${chapterIndex}-${imageIndex}`}
                  className="break-inside-avoid mb-4"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className={[
                      "relative rounded-xl overflow-hidden cursor-pointer group",
                      isGR ? "border border-[#17191B]" : "border border-gray-200"
                    ].join(" ")}
                    onMouseEnter={() => setHoveredImage(media.url)}
                    onMouseLeave={() => setHoveredImage(null)}
                    onClick={() => onImageOpen(media, imageIndex)}
                  >
                    <img
                      src={media.url}
                      alt={media.alt}
                      className="w-full h-auto object-cover"
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="flex gap-2">
                        <Button size="icon" variant="secondary">
                          <Maximize2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(media.url);
                          }}
                        >
                          <Heart className={[
                            "w-4 h-4",
                            state.favorites.includes(media.url) ? "fill-red-500 text-red-500" : ""
                          ].join(" ")} />
                        </Button>
                      </div>
                    </div>

                    {/* Chapter Badge */}
                    <Badge className="absolute top-2 left-2 text-xs">
                      {chapter.title}
                    </Badge>

                    {media.premium && (
                      <Badge className="absolute top-2 right-2 text-xs bg-yellow-500">
                        Signature
                      </Badge>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  if (state.mode === 'split') {
    return (
      <div className="flex h-[calc(100vh-120px)] gap-4 p-4">
        {/* Left Panel - Current Image */}
        <div className="flex-1">
          {currentChapter?.media[0] && (
            <div className="relative h-full rounded-xl overflow-hidden">
              <img
                src={currentChapter.media[0].url}
                alt={currentChapter.media[0].alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white text-xl font-bold mb-2">
                  {currentChapter.title}
                </h3>
                <p className="text-white/80">{currentChapter.subtitle}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Chapter Navigation */}
        <div className="w-80 space-y-4">
          {chapters.map((chapter, index) => (
            <motion.button
              key={index}
              onClick={() => onChapterChange(index)}
              className={[
                "w-full p-4 rounded-xl text-left transition-all",
                index === state.currentChapter
                  ? isGR ? "bg-[#1A1C1F] border-[#EB0A1E]" : "bg-blue-50 border-blue-200"
                  : isGR ? "bg-[#0F1113] border-[#17191B] hover:bg-[#121416]" : "bg-white border-gray-200 hover:bg-gray-50",
                "border"
              ].join(" ")}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex gap-3">
                <img
                  src={chapter.media[0]?.url}
                  alt={chapter.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className={[
                    "font-semibold mb-1",
                    isGR ? "text-[#E6E7E9]" : "text-gray-900"
                  ].join(" ")}>
                    {chapter.title}
                  </h4>
                  <p className={[
                    "text-sm opacity-70",
                    isGR ? "text-[#9DA2A6]" : "text-gray-600"
                  ].join(" ")}>
                    {chapter.media.length} images
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // Cinematic Mode (Enhanced for Desktop)
  return (
    <div className="relative">
      {/* Enhanced Header with more controls */}
      <div className="flex items-center justify-between mb-6 px-6">
        <div>
          <h2 className={[
            "text-2xl font-bold mb-1",
            isGR ? "text-[#E6E7E9]" : "text-gray-900"
          ].join(" ")}>
            {currentChapter?.title}
          </h2>
          <p className={isGR ? "text-[#9DA2A6]" : "text-gray-600"}>
            {currentChapter?.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowImageDetails(!showImageDetails)}
            className={isGR ? "border-[#17191B] text-[#E6E7E9]" : ""}
          >
            <Info className="w-4 h-4 mr-1" />
            Details
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => onModeChange('split')}
            className={isGR ? "border-[#17191B] text-[#E6E7E9]" : ""}
          >
            <SplitSquareHorizontal className="w-4 h-4 mr-1" />
            Split View
          </Button>
        </div>
      </div>

      {/* Multi-column Layout for Large Screens */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 px-6">
        {currentChapter?.media.slice(0, 4).map((media, index) => (
          <motion.div
            key={index}
            className="relative aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer group"
            onMouseEnter={() => setHoveredImage(media.url)}
            onMouseLeave={() => setHoveredImage(null)}
            onClick={() => onImageOpen(media, index)}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={media.url}
              alt={media.alt}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            
            {/* Enhanced Hover Effects */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Advanced Controls */}
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div>
                {media.premium && (
                  <Badge className="mb-2 bg-yellow-500 text-yellow-900">
                    Signature Series
                  </Badge>
                )}
                <p className="text-white text-sm">{media.alt}</p>
              </div>
              
              <div className="flex gap-2">
                <Button size="icon" variant="secondary" className="backdrop-blur-sm">
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="backdrop-blur-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(media.url);
                  }}
                >
                  <Heart className={[
                    "w-4 h-4",
                    state.favorites.includes(media.url) ? "fill-red-500 text-red-500" : ""
                  ].join(" ")} />
                </Button>
                <Button size="icon" variant="secondary" className="backdrop-blur-sm">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chapter Navigation */}
      <div className="flex items-center justify-center mt-8 gap-4">
        <Button
          onClick={() => onChapterChange(state.currentChapter - 1)}
          disabled={state.currentChapter === 0}
          className={isGR ? "bg-[#1A1C1F] border-[#17191B]" : ""}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>

        <div className="flex gap-2">
          {chapters.map((chapter, index) => (
            <button
              key={index}
              onClick={() => onChapterChange(index)}
              className={[
                "px-3 py-1 rounded-full text-sm transition-all",
                index === state.currentChapter
                  ? isGR ? "bg-[#EB0A1E] text-white" : "bg-blue-500 text-white"
                  : isGR ? "bg-[#1A1C1F] text-[#9DA2A6] hover:bg-[#15171A]" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              ].join(" ")}
            >
              {chapter.title}
            </button>
          ))}
        </div>

        <Button
          onClick={() => onChapterChange(state.currentChapter + 1)}
          disabled={state.currentChapter === chapters.length - 1}
          className={isGR ? "bg-[#1A1C1F] border-[#17191B]" : ""}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default DesktopGalleryView;
