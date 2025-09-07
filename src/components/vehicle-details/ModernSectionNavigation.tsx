import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

type SectionItem = { id: string; label: string; icon?: React.ReactNode };

interface ModernSectionNavProps {
  sections?: SectionItem[];
  headerOffset?: number; // px, for sticky headers
  className?: string;
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

const SURFACE =
  "bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 shadow-xl";

const ModernSectionNav: React.FC<ModernSectionNavProps> = ({
  sections = DEFAULT_SECTIONS,
  headerOffset = 96,
  className,
}) => {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true); // global auto-hide/show
  const lastY = useRef(0);
  const clickScrolling = useRef(false);

  const valid = useMemo(() => sections.filter(s => s.id && s.label), [sections]);

  const jumpTo = useCallback(
    (id: string, index: number) => {
      const el = document.getElementById(id);
      if (!el) return;
      const y = el.getBoundingClientRect().top + window.pageYOffset - Math.max(0, headerOffset);
      clickScrolling.current = true;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActive(index);
      // release the click lock after scrolling
      window.setTimeout(() => (clickScrolling.current = false), 500);
    },
    [headerOffset]
  );

  // Track active section
  useEffect(() => {
    if (!valid.length) return;
    const io = new IntersectionObserver(
      entries => {
        if (clickScrolling.current) return;
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio > 0.3) {
            const i = valid.findIndex(s => s.id === e.target.id);
            if (i !== -1) setActive(i);
          }
        }
      },
      {
        root: null,
        rootMargin: "-30% 0px -55% 0px", // stable, avoids flicker
        threshold: [0, 0.3, 0.6, 1],
      }
    );
    valid.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [valid]);

  // Auto-hide on scroll down, show on scroll up / near top
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        const goingDown = y > lastY.current;
        const nearTop = y < 120;
        setVisible(nearTop || !goingDown);
        lastY.current = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keyboard: ArrowUp/Down, Home/End (desktop convenience)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (!["ArrowUp", "ArrowDown", "Home", "End"].includes(e.key)) return;
      e.preventDefault();
      if (e.key === "Home") return jumpTo(valid[0].id, 0);
      if (e.key === "End") return jumpTo(valid[valid.length - 1].id, valid.length - 1);
      const delta = e.key === "ArrowDown" ? 1 : -1;
      const next = Math.max(0, Math.min(valid.length - 1, active + delta));
      jumpTo(valid[next].id, next);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, valid, jumpTo]);

  // ===== UI =====

  return (
    <>
      {/* Desktop rail */}
      <AnimatePresence>
        {visible && (
          <motion.nav
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.16 }}
            className={cn(
              "fixed right-6 top-1/2 -translate-y-1/2 z-[80] hidden md:block",
              className
            )}
            aria-label="Page sections"
          >
            <div className={cn("w-56 rounded-2xl p-2", SURFACE)}>
              <ul className="max-h-[70vh] overflow-y-auto pr-1">
                {valid.map((s, i) => {
                  const isActive = i === active;
                  return (
                    <li key={s.id} className="my-0.5">
                      <button
                        onClick={() => jumpTo(s.id, i)}
                        className={cn(
                          "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-left transition",
                          "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                          isActive
                            ? "bg-zinc-100 dark:bg-white/10 font-semibold"
                            : "hover:bg-zinc-50 dark:hover:bg-white/5"
                        )}
                        aria-current={isActive ? "true" : undefined}
                      >
                        <span
                          className={cn(
                            "inline-block size-1.5 rounded-full",
                            isActive ? "bg-zinc-900 dark:bg-white" : "bg-zinc-400/70 dark:bg-white/40"
                          )}
                        />
                        <span
                          className={cn(
                            isActive ? "text-zinc-900 dark:text-white" : "text-zinc-700 dark:text-zinc-300"
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
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Mobile bottom chips */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.16 }}
            className="fixed bottom-0 inset-x-0 z-[80] md:hidden pb-[env(safe-area-inset-bottom)]"
          >
            <div className="mx-auto max-w-screen-md">
              <div className={cn("mx-3 mb-3 rounded-2xl", SURFACE)}>
                <div className="flex overflow-x-auto gap-2 p-2">
                  {valid.map((s, i) => {
                    const isActive = i === active;
                    return (
                      <button
                        key={s.id}
                        onClick={() => jumpTo(s.id, i)}
                        className={cn(
                          "px-3 py-2 rounded-lg border text-sm whitespace-nowrap transition",
                          "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                          isActive
                            ? "bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white"
                            : "bg-transparent text-zinc-700 dark:text-zinc-300 border-zinc-300/60 dark:border-white/20"
                        )}
                        aria-current={isActive ? "true" : undefined}
                      >
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile back-to-top FAB (appears after first section) */}
      <AnimatePresence>
        {active > 0 && (
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className={cn(
              "fixed right-4 bottom-24 md:hidden z-[81] rounded-full p-3",
              SURFACE
            )}
            aria-label="Back to top"
          >
            <ChevronUp className="h-5 w-5 text-zinc-900 dark:text-white" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModernSectionNav;