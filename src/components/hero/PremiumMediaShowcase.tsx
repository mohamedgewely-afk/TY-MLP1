import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Media {
  imageUrl?: string;
  videoUrl?: string;
  poster?: string;
  caption?: string;
}

interface CTAAction {
  label: string;
  action: () => void;
}

interface PremiumMediaShowcaseProps {
  media: Media;
  title?: string;
  subtitle?: string;
  ctaPrimary?: CTAAction;
  ctaSecondary?: CTAAction;
  className?: string;
}

const PremiumMediaShowcase: React.FC<PremiumMediaShowcaseProps> = ({
  media,
  title = "Experience Excellence",
  subtitle = "Where luxury meets performance in perfect harmony",
  ctaPrimary = { label: "Build & Price", action: () => {} },
  ctaSecondary = { label: "Book Test Drive", action: () => {} },
  className = ""
}) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);

  const hasVideo = Boolean(media.videoUrl);

  useEffect(() => {
    if (videoElement && hasVideo) {
      if (isVideoPlaying) {
        videoElement.play().catch(console.warn);
      } else {
        videoElement.pause();
      }
    }
  }, [isVideoPlaying, videoElement, hasVideo]);

  const handleVideoToggle = () => {
    setIsVideoPlaying(!isVideoPlaying);
  };

  const handleMuteToggle = () => {
    if (videoElement) {
      videoElement.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section 
      ref={containerRef}
      className={cn("relative h-screen overflow-hidden bg-carbon-matte", className)}
    >
      {/* Background Media */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y }}
      >
        {hasVideo ? (
          <video
            ref={setVideoElement}
            className="w-full h-full object-cover"
            poster={media.poster || media.imageUrl}
            muted={isMuted}
            loop
            playsInline
            autoPlay
            preload="metadata"
          >
            <source src={media.videoUrl} type="video/mp4" />
            <img
              src={media.imageUrl || media.poster}
              alt={media.caption || title}
              className="w-full h-full object-cover"
            />
          </video>
        ) : (
          <img
            src={media.imageUrl || 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/f6516ca6-e2fd-4869-bfff-20532eda7b71/renditions/63c413af-8759-4581-a01b-905989f7d391?binary=true&mformat=true'}
            alt={media.caption || title}
            className="w-full h-full object-cover"
            loading="eager"
            sizes="100vw"
          />
        )}
        
        {/* Luxury gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20" />
      </motion.div>

      {/* Content */}
      <motion.div 
        className="relative z-10 h-full flex items-center"
        style={{ opacity }}
      >
        <div className="container mx-auto px-4 lg:px-8 w-full">
          <div className="max-w-4xl">
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 60, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: prefersReducedMotion ? 0.1 : 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="space-y-8"
            >
              {/* Title */}
              <div className="space-y-4">
                <motion.h1 
                  className="text-5xl md:text-7xl lg:text-8xl font-light text-white tracking-tight leading-none"
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={prefersReducedMotion ? { duration: 0.1 } : { duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  {title}
                </motion.h1>
                
                <motion.p 
                  className="text-xl md:text-2xl lg:text-3xl text-white/80 max-w-2xl font-light tracking-wide"
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={prefersReducedMotion ? { duration: 0.1 } : { duration: 1, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  {subtitle}
                </motion.p>
              </div>

              {/* CTAs */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={prefersReducedMotion ? { duration: 0.1 } : { duration: 1, delay: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <Button
                  onClick={ctaPrimary.action}
                  size="lg"
                  className="bg-white text-black hover:bg-white/90 px-8 py-6 text-lg font-medium tracking-wide transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                >
                  {ctaPrimary.label}
                </Button>
                
                <Button
                  onClick={ctaSecondary.action}
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-8 py-6 text-lg font-medium tracking-wide backdrop-blur-sm transition-all duration-300"
                >
                  {ctaSecondary.label}
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Video Controls */}
      {hasVideo && (
        <div className="absolute bottom-8 right-8 z-20 flex gap-3">
          <Button
            onClick={handleVideoToggle}
            variant="outline"
            size="sm"
            className="bg-black/20 border-white/20 text-white hover:bg-white/10 backdrop-blur-md"
            aria-label={isVideoPlaying ? 'Pause video' : 'Play video'}
          >
            {isVideoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <Button
            onClick={handleMuteToggle}
            variant="outline"
            size="sm"
            className="bg-black/20 border-white/20 text-white hover:bg-white/10 backdrop-blur-md"
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>
      )}

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        animate={prefersReducedMotion ? {} : { y: [0, 10, 0] }}
        transition={prefersReducedMotion ? {} : { duration: 2, repeat: Infinity }}
      >
        <div className="w-1 h-12 bg-white/30 rounded-full">
          <motion.div
            className="w-1 h-6 bg-white rounded-full"
            animate={prefersReducedMotion ? {} : { y: [0, 24, 0] }}
            transition={prefersReducedMotion ? {} : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default PremiumMediaShowcase;