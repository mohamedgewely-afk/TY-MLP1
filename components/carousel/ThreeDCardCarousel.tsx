import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { placeholderImage, loadMedia } from "../../utils/dam";

type Slide = { id: string; title: string; ctaLabel?: string; media?: any; bullets?: string[] };

export const ThreeDCardCarousel: React.FC<{ slides?: Slide[] }> = ({ slides = [] }) => {
  const [index, setIndex] = useState(0);
  const len = slides.length || 0;
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prev = slides[(index - 1 + len) % len];
    const next = slides[(index + 1) % len];
    loadMedia(prev?.media?.imageUrl);
    loadMedia(next?.media?.imageUrl);
  }, [index, slides, len]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % Math.max(1, len));
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + Math.max(1, len)) % Math.max(1, len));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [len]);

  if (!len) return null;

  return (
    <section aria-roledescription="carousel" className="py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div ref={containerRef} className="relative">
          <div className="flex gap-6 items-center overflow-visible">
            {slides.map((s, i) => {
              const offset = i - index;
              const abs = Math.abs(offset);
              const scale = i === index ? 1 : abs === 1 ? 0.92 : 0.86;
              const z = i === index ? 50 : 40 - abs;
              return (
                <motion.div
                  key={s.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: scale, y: 0 }}
                  transition={{ duration: 0.28, type: "spring", stiffness: 220, damping: 28 }}
                  style={{ transformOrigin: "center center", zIndex: z }}
                  className="min-w-[280px] sm:min-w-[360px] md:min-w-[420px] lg:min-w-[520px]"
                >
                  <article className="bg-neutral-900 rounded-2xl overflow-hidden border border-white/6">
                    <div className="h-56 lg:h-72 overflow-hidden">
                      <img
                        src={s.media?.imageUrl || placeholderImage(1200, 800, s.title)}
                        alt={s.media?.alt || s.title}
                        className="w-full h-full object-cover"
                        loading={i === index ? "eager" : "lazy"}
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="text-lg font-semibold text-white">{s.title}</h4>
                      {s.bullets && (
                        <ul className="mt-2 text-sm text-white/70 space-y-1">
                          {s.bullets.map((b, idx) => <li key={idx}>• {b}</li>)}
                        </ul>
                      )}
                      <div className="mt-4 flex justify-between items-center">
                        <button className="px-3 py-2 rounded bg-white text-black">{s.ctaLabel || "Explore"}</button>
                        <div className="text-white/60 text-sm">{i + 1}/{len}</div>
                      </div>
                    </div>
                  </article>
                </motion.div>
              );
            })}
          </div>

          <div className="absolute right-0 top-0 flex gap-2">
            <button
              aria-label="Previous"
              onClick={() => setIndex((i) => (i - 1 + len) % len)}
              className="p-2 bg-black/60 rounded text-white"
            >
              ‹
            </button>
            <button
              aria-label="Next"
              onClick={() => setIndex((i) => (i + 1) % len)}
              className="p-2 bg-black/60 rounded text-white"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};