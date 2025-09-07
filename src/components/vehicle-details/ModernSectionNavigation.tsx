import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { contextualHaptic } from "@/utils/haptic";

/**
 * ModernSectionNav
 * - Mobile: bottom dock with labeled chips (scrollable)
 * - Desktop: right rail with a vertical labeled list
 * - Always shows current section label & progress
 * - High contrast surfaces (visible on white / photo backgrounds)
 */

type SectionItem = {
  id: string;
  label: string;
  icon?: React.ReactNode;
};

interface ModernSectionNavProps {
  sections?: SectionItem[];
  /** Header height offset for smooth scroll (px). Default: 96 */
  headerOffset?: number;
  /** Additional className applied to the outermost container */
  className?: string;
  /** Enable mobile haptics (best effort). Default: true */
  enableHaptics?: boolean;
}

const DEFAULT_SECTIONS: SectionItem[] = [
  { id: "hero", label: "Overview" },
  { id: "virtual-showroom", label: "Experience" },
  { id: "media-showcase", label: "Gallery" },
  { id: "story-performance", label: "Performance" },
  { id: "story-safety", label: "Safety" },
  { id: "story-connected", label: "Connected" },
  { id: "story-sustainable", label: "Hybrid" },
  { id: "story-comfort", label: "Comfort" },
  { id: "story-ownership", label: "Ownership" },
  { id: "offers", label: "Offers" },
  { id: "tech-experience", label: "Technology" },
  { id: "configuration", label: "Configure" },
  { id: "related", label: "Similar Models" },
  { id: "faq", label: "FAQs" },
];

const SURFACE_CLASSES =
  "bg-white/95 dark:bg-zinc-900/95 border border-black/10 dark:border-white/10 shadow-xl";

const ModernSectionNav: React.FC<ModernSectionNavProps> = ({
  sections = DEFAULT_SECTIONS,
  headerOffset = 96,
  className,
  enableHaptics = true,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isRailCompact, setIsRailCompact] = useState(false);
  const lastScrollYRef = useRef(0);
  const clickScrollRef = useRef(false); // prevent IO flicker after manual click

  const validSections = useMemo(
    () => sections.filter((s) => !!s?.id && !!s?.label),
    [sections]
  );

  const progress = useMemo(() => {
    if (validSections.length <= 1) return 1;
    return activeIndex / (validSections.length - 1);
  }, [activeIndex, validSections.length]);

  const jumpTo = useCallback(
    (id: string, index: number) => {
      // optional haptics on mobile
      if (enableHaptics) {
        try {
          contextualHaptic?.selectionChange?.();
        } catch {
          /* noop */
        }
      }

      const el = typeof document !== "undefined" ? document.getElementById(id) : null;
      if (!el) return;

      const top =
        el.getBoundingClientRect().top + (window?.pageYOffset || 0) - Math.max(0, headerOffset);

      clickScrollRef.current = true;
      window.scrollTo({ top, behavior: "smooth" });

      // lock active section until scroll settles (avoid IO race)
      setActiveIndex(index);
      window.setTimeout(() => (clickScrollRef.current = false), 600);
    },
    [headerOffset, enableHaptics]
  );

  // Intersection Observer: track which section is in view
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!validSections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (clickScrollRef.current) return; // ignore while smooth scrolling from a click
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
            const idx = validSections.findIndex((s) => s.id === entry.target.id);
            if (idx !== -1) {
              setActiveIndex(idx);
            }
          }
        }
      },
      {
        root: null,
        rootMargin: "-30% 0px -55% 0px", // stabilizes the active section
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    validSections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [validSections]);

  // Compact rail on scroll down; expand on scroll up
  useEffect(() => {
    if (typeof window === "undefined") return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        const last = lastScrollYRef.current;
        const goingDown = y > last;
        setIsRailCompact(goingDown && y > 300);
        lastScrollYRef.current = y;
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keyboard support (desktop): ArrowUp/Down/Home/End to move
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (!["ArrowUp", "ArrowDown", "Home", "End"].includes(e.key)) return;

      e.preventDefault();
      if (e.key === "Home") return jumpTo(validSections[0].id, 0);
      if (e.key === "End") return jumpTo(validSections[validSections.length - 1].id, validSections.length - 1);

      const delta = e.key === "ArrowDown" ? 1 : -1;
      let next = activeIndex + delta;
      next = Math.max(0, Math.min(validSections.length - 1, next));
      jumpTo(validSections[next].id, next);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, validSections, jumpTo]);

  // ====== UI ======

  return (
    <>
      {/* Current Section Pill (visible on both) */}
      <motion.div
        className={cn(
          "fixed left-4 bottom-28 md:bottom-auto md:top-1/2 md:left-auto md:right-6",
          "-translate-y-0 md:-translate-y-1/2 z-[60]",
          "rounded-xl px-3.5 py-2.5 flex items-center gap-2",
          SURFACE_CLASSES,
          className
        )}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* tiny active indicator */}
        <span className="inline-block size-2 rounded-full bg-zinc-900 dark:bg-white" />
        <span className="text-sm font-medium text-zinc-900 dark:text-white">
          {validSections[activeIndex]?.label ?? "Section"}
        </span>
        <span className="ml-2 text-xs text-zinc-500 dark:text-zinc-400">
          {activeIndex + 1}/{validSections.length}
        </span>
        {/* thin progress */}
        <div className="ml-3 h-1 w-20 rounded-full bg-zinc-200 dark:bg-white/20 overflow-hidden">
          <div
            className="h-full rounded-full bg-zinc-900 dark:bg-white"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      </motion.div>

      {/* Desktop Right Rail */}
      <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-[60] hidden md:block">
        <div
          className={cn(
            "w-56 transition-all duration-200",
            isRailCompact ? "opacity-90 scale-[0.98]" : "opacity-100 scale-100"
          )}
        >
          <div className={cn("rounded-2xl p-2", SURFACE_CLASSES)}>
            <ul className="max-h-[70vh] overflow-y-auto pr-1">
              {validSections.map((s, i) => {
                const active = i === activeIndex;
                return (
                  <li key={s.id} className="my-0.5">
                    <button
                      onClick={() => jumpTo(s.id, i)}
                      className={cn(
                        "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-left",
                        "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                        active
                          ? "bg-zinc-100 dark:bg-white/10 font-semibold"
                          : "hover:bg-zinc-50 dark:hover:bg-white/5"
                      )}
                      aria-current={active ? "true" : undefined}
                      aria-label={`Go to ${s.label}`}
                    >
                      <span
                        className={cn(
                          "inline-block size-1.5 rounded-full",
                          active ? "bg-zinc-900 dark:bg-white" : "bg-zinc-400/70 dark:bg-white/40"
                        )}
                      />
                      <span
                        className={cn(
                          active ? "text-zinc-900 dark:text-white" : "text-zinc-700 dark:text-zinc-300"
                        )}
                      >
                        {s.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Dock */}
      <div className="fixed bottom-0 inset-x-0 z-[60] md:hidden pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto max-w-screen-md">
          <div className={cn("mx-3 mb-3 rounded-2xl", SURFACE_CLASSES)}>
            <div className="flex overflow-x-auto gap-2 p-2 no-scrollbar">
              {validSections.map((s, i) => {
                const active = i === activeIndex;
                return (
                  <button
                    key={s.id}
                    onClick={() => jumpTo(s.id, i)}
                    className={cn(
                      "px-3 py-2 rounded-lg border text-sm whitespace-nowrap",
                      "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                      active
                        ? "bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white"
                        : "bg-transparent text-zinc-700 dark:text-zinc-300 border-zinc-300/60 dark:border-white/20"
                    )}
                    aria-current={active ? "true" : undefined}
                    aria-label={`Go to ${s.label}`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll-To-Top FAB (mobile) */}
      <AnimatePresence>
        {activeIndex > 0 && (
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className={cn(
              "fixed right-4 bottom-24 md:hidden z-[61]",
              "rounded-full p-3",
              SURFACE_CLASSES,
              "backdrop-blur"
            )}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            aria-label="Back to Top"
          >
            <ChevronUp className="h-5 w-5 text-zinc-900 dark:text-white" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModernSectionNav;
