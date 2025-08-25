
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import YouTubeEmbed from '@/components/ui/youtube-embed';
import { useInView } from 'framer-motion';

interface ParallaxImgProps {
  src: string;
  alt: string;
  className?: string;
}

const ParallaxImg: React.FC<ParallaxImgProps> = ({ src, alt, className = "" }) => {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  return (
    <div ref={wrapperRef} className={`relative overflow-hidden pointer-events-none ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover will-change-transform"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
};

interface StorytellingMediaProps {
  mediaType: 'video' | 'image';
  src?: string;
  videoId?: string;
  alt: string;
  className?: string;
}

const StorytellingMedia: React.FC<StorytellingMediaProps> = ({
  mediaType,
  src,
  videoId,
  alt,
  className = ""
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "200px" });

  if (mediaType === 'video' && videoId) {
    return (
      <div ref={ref} className={`relative z-0 rounded-3xl lg:rounded-none ring-1 ring-border lg:ring-0 shadow-xl lg:shadow-none overflow-hidden group ${className}`}>
        {isInView && (
          <YouTubeEmbed
            videoId={videoId}
            className="w-full h-[52vw] max-h-[560px] lg:h-[72vh] xl:h-[78vh]"
            autoplay={false}
            muted={true}
            controls={true}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>
    );
  }

  return (
    <div ref={ref} className={`relative z-0 rounded-3xl lg:rounded-none ring-1 ring-border lg:ring-0 shadow-xl lg:shadow-none overflow-hidden group ${className}`}>
      {isInView && src && (
        <ParallaxImg
          src={src}
          alt={alt}
          className="w-full h-[52vw] max-h-[560px] lg:h-[72vh] xl:h-[78vh] transition-transform duration-700 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
};

export default StorytellingMedia;
