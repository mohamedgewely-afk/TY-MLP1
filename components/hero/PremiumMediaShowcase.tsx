import React, { useRef } from "react";
import { motion } from "framer-motion";
import type { Media } from "../../types.d.ts";
import { placeholderImage, loadMedia } from "../../utils/dam";

type Props = {
  media?: Media;
  title?: string;
  subtitle?: string;
  primaryCta?: { label: string; onClick?: () => void };
  secondaryCta?: { label: string; onClick?: () => void };
  pinned?: boolean;
};

export const PremiumMediaShowcase: React.FC<Props> = ({
  media = {},
  title = "Land Cruiser — Elevated",
  subtitle = "Luxury, capability, and refined craftsmanship.",
  primaryCta = { label: "Reserve Online" },
  secondaryCta = { label: "Build Yours" },
  pinned = false,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  if (typeof window !== "undefined") {
    loadMedia(media.poster || media.imageUrl);
  }

  return (
    <section aria-labelledby="hero-title" className={`relative w-full ${pinned ? "sticky top-0 z-20" : ""} bg-carbon-matte`}>  
      <div className="relative overflow-hidden">
        <div className="w-full h-[60vh] md:h-[72vh] lg:h-[80vh]">
          {media.videoUrl ? (
            <video
              className="w-full h-full object-cover"
              poster={media.poster}
              src={media.videoUrl}
              autoPlay
              muted
              playsInline
              loop
              aria-label={media.caption}
            />
          ) : (
            <img
              ref={ref}
              src={media.imageUrl || placeholderImage(1600, 900, "Hero")}
              alt={media.alt || title}
              className="w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 pointer-events-none" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.995 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.32, ease: "easeOut" }}
          className="absolute inset-0 flex items-end lg:items-center justify-start p-6 md:p-12 lg:p-20"
        >
          <div className="max-w-3xl text-white">
            <h1 id="hero-title" className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
              {title}
            </h1>
            <p className="mt-3 text-sm md:text-base text-white/80">{subtitle}</p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={primaryCta.onClick}
                className="bg-white text-black px-4 py-2 rounded-md shadow-sm hover:scale-[1.02] transition-transform duration-120"
                aria-label={primaryCta.label}
              >
                {primaryCta.label}
              </button>
              <button
                onClick={secondaryCta.onClick}
                className="border border-white/20 text-white px-4 py-2 rounded-md hover:bg-white/6 transition-colors duration-120"
                aria-label={secondaryCta.label}
              >
                {secondaryCta.label}
              </button>
            </div>
            {media.caption && <div className="mt-4 text-xs text-white/60">{media.caption}</div>}
          </div>
        </motion.div>
      </div>
    </section>
  );
};