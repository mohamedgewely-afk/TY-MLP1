import React from "react";
import { motion } from "framer-motion";
import type { Media } from "../../types.d.ts";
import { placeholderImage } from "../../utils/dam";

export const FeatureCard: React.FC<{ id?: string; title: string; description?: string; media?: Media; onLearnMore?: () => void; }> = ({ id, title, description, media, onLearnMore }) => {
  const img = media?.imageUrl || placeholderImage(800, 600, title);
  return (
    <motion.article
      layout
      whileHover={{ y: -6, boxShadow: "0 12px 30px rgba(0,0,0,0.6)" }}
      transition={{ duration: 0.12 }}
      className="bg-neutral-900 rounded-xl overflow-hidden border border-white/6"
      aria-labelledby={`card-${id}`}
    >
      <div className="h-44 md:h-56 lg:h-64 overflow-hidden">
        <img src={img} alt={media?.alt || title} className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="p-4">
        <h3 id={`card-${id}`} className="text-lg font-semibold text-white">{title}</h3>
        {description && <p className="mt-2 text-sm text-white/70">{description}</p>}
        <div className="mt-4 flex items-center justify-between">
          <button onClick={onLearnMore} className="text-sm text-white/90 underline">Learn more</button>
        </div>
      </div>
    </motion.article>
  );
};