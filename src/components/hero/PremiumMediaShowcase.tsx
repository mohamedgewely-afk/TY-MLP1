import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useReducedMotionSafe, motionSafeVariants } from '@/hooks/useReducedMotionSafe';
import type { Media } from '@/data/demo-data';

interface PremiumMediaShowcaseProps {
  media: Media;
  title?: string;
  subtitle?: string;
  ctaPrimary?: {
    label: string;
    action: () => void;
  };
  ctaSecondary?: {
    label: string;
    action: () => void;
  };
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
  const prefersReducedMotion = useReducedMotionSafe();

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
    <section className={`relative h-screen overflow-hidden bg-black ${className}`}>
      {/* Media Background */}
      <div className="absolute inset-0 z-0">
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
            {/* Fallback image */}
            <img
              src={media.imageUrl || media.poster}
              alt={media.caption || title}
              className="w-full h-full object-cover"
            />
          </video>
        ) : (
          <img
            src={media.imageUrl}
            alt={media.caption || title}
            className="w-full h-full object-cover"
            loading="eager"
            sizes="100vw"
          />
        )}
        
        {/* Luxury gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="toyota-container w-full">
          <div className="max-w-4xl">
            <motion.div
              custom={prefersReducedMotion}
              variants={motionSafeVariants}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Title */}
              <div className="space-y-4">
                <motion.h1 
                  className="text-5xl md:text-7xl font-light text-white tracking-tight leading-none"
                  custom={prefersReducedMotion}
                  variants={motionSafeVariants}
                  initial="initial"
                  animate="animate"
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {title}
                </motion.h1>
                
                <motion.p 
                  className="text-xl md:text-2xl text-white/80 max-w-2xl font-light tracking-wide"
                  custom={prefersReducedMotion}
                  variants={motionSafeVariants}
                  initial="initial"
                  animate="animate"
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  {subtitle}
                </motion.p>
              </div>

              {/* CTAs */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                custom={prefersReducedMotion}
                variants={motionSafeVariants}
                initial="initial"
                animate="animate"
                transition={{ duration: 0.8, delay: 0.8 }}
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
      </div>

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

      {/* Subtle parallax particles for luxury feel */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/10 rounded-full"
              style={{
                left: `${20 + i * 30}%`,
                top: `${30 + i * 20}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default PremiumMediaShowcase;