import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

type SectionItem = { id: string; label: string; description?: string };

interface SectionNavigatorProps {
  sections?: SectionItem[];
  /** Sticky header height in px (used for sticky bar position + scroll offset). Default 96 */
  headerOffset?: number;
  /** Tailwind class for brand accent (active chip/progress). Example: "bg-[#EB0A1E]" or "bg-red-600" */
  brandActiveClass?: string;
  /** Max width class for aligning bar with your content container */
  containerMaxWidthClass?: string; // e.g. "max-w-screen-xl"
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

const SURFACE_BAR   = "bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 shadow-sm";
const SURFACE_PANEL = "bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 shadow-xl";

/**
 * Best-practice section navigator:
 * Mobile: sticky bar under header + top sheet TOC
 * Desktop: sticky bar + in-page right rail with scrollspy
 */
const SectionNavigator: React.FC<SectionNavigatorProps> = ({
  sections = DEFAULT_SECTIONS,
  headerOffset = 96,
  brandActiveClass = "bg-red-600",
  containerMaxWidthClass = "max-w-screen-xl",
  className,
}) => {
  const valid = useMemo(() => sections.filter(s => s?.id && s?.label), [sections]);
  const [active, setActive] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [railCompact, setRailCompact] = useState(false);
  const [query, setQuery] = useState("");
  const lastY = useRef(0);
  const clickScrolling = useRef(false);

  const scrollToId = useCallback(
    (id: string, index: number) => {
      const el = document.getElementById(id);
      if (!el) return;
      const y = el.getBoundingClientRect().top + window.pageYOffset - Math.max(0, headerOffset);
      clickScrolling.current = true;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActive(index);
      // Close sheet on mobile after select
      if (window.innerWidth < 768) setSheetOpen(false);
      window.setTimeout(() => (clickScrolling.current = false), 500);
    },
    [headerOffset]
  );

  const progressPct = useMemo(() => {
    if (valid.length <= 1) return 100;
    return Math.round((active / (valid.length - 1)) * 100);
  }, [active, valid.length]);

  // Scrollspy
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
      { root: null, rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.3, 0.6, 1] }
    );
    valid.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [valid]);

  // Rail compacting (desktop)
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        const goingDown = y > lastY.current;
        setRailCompact(goingDown && y > 300);
        lastY.current = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keyboard shortcuts (desktop)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Escape" && sheetOpen) return setSheetOpen(false);
      if (!["ArrowUp", "ArrowDown", "Home", "End"].includes(e.key)) return;
      e.preventDefault();
      if (e.key === "Home") return scrollToId(valid[0].id, 0);
      if (e.key === "End") return scrollToId(valid[valid.length - 1].id, valid.length - 1);
      const delta = e.key === "ArrowDown" ? 1 : -1;
      const next = Math.max(0, Math.min(valid.length - 1, active + delta));
      scrollToId(valid[next].id, next);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, valid, scrollToId, sheetOpen]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return valid;
    return valid.filter(s => s.label.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q));
  }, [query, valid]);

  return (
    <>
      {/* Sticky Section Bar (mobile + desktop) */}
      <div className={cn("sticky z-[60]", className)} style={{ top: headerOffset }}>
        <div className={cn("mx-auto px-3", containerMaxWidthClass)}>
          <div className={cn("rounded-xl px-3 py-2 md:px-4 md:py-2.5 flex items-center gap-3", SURFACE_BAR)}>
            {/* Current section (tap to re-center) */}
            <button
              onClick={() => scrollToId(valid[active]?.id, active)}
              className="min-h-11 md:min-h-0 flex-1 text-left"
              aria-label="Recenter current section"
            >
              <div className="text-sm md:text-sm font-medium text-zinc-900 dark:text-white">
                {valid[active]?.label ?? "Section"}
              </div>
              <div className="mt-1 h-1 w-full rounded-full bg-zinc-200 dark:bg-white/20 overflow-hidden">
                <div className={cn("h-full rounded-full", brandActiveClass)} style={{ width: `${progressPct}%` }} />
              </div>
            </button>

            {/* Sections trigger (opens top sheet on mobile; also useful on desktop) */}
            <button
              onClick={() => setSheetOpen(true)}
              className={cn(
                "min-h-11 md:min-h-0 inline-flex items-center gap-1.5 rounded-md px-2.5 py-2",
                "text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-white/10",
                "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              )}
              aria-expanded={sheetOpen}
              aria-controls="section-sheet"
            >
              <span>Sections</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          {/* Chips row (optional; hidden on very small screens) */}
          <div className="mt-2 hidden sm:block">
            <div className="flex gap-2 overflow-x-auto p-1">
              {valid.map((s, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={s.id}
                    onClick={() => scrollToId(s.id, i)}
                    className={cn(
                      "px-3 py-2 rounded-lg border text-[13px] whitespace-nowrap",
                      "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition",
                      isActive
                        ? cn("text-white border-transparent", brandActiveClass)
                        : "bg-transparent text-zinc-700 dark:text-zinc-300 border-zinc-300/70 dark:border-white/20 hover:bg-zinc-50 dark:hover:bg-white/5"
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
      </div>

      {/* Desktop Right Rail (inside the page grid) */}
      <nav
        className="fixed right-6 top-1/2 -translate-y-1/2 z-[50] hidden md:block"
        aria-label="Page sections"
      >
        <div
          className={cn(
            "w-60 rounded-2xl p-2 transition-all duration-150",
            railCompact ? "opacity-95 scale-[0.98]" : "opacity-100 scale-100",
            SURFACE_PANEL
          )}
        >
          <ul className="max-h-[70vh] overflow-y-auto pr-1">
            {valid.map((s, i) => {
              const isActive = i === active;
              return (
                <li key={s.id} className="my-0.5">
                  <button
                    onClick={() => scrollToId(s.id, i)}
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
                    <span className={cn(isActive ? "text-zinc-900 dark:text-white" : "text-zinc-700 dark:text-zinc-300")}>
                      {s.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* MOBILE & DESKTOP: Top Sheet TOC (clean, labeled) */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.div
              id="section-sheet"
              role="dialog"
              aria-modal="true"
              className="fixed inset-x-0 top-0 z-[70]"
              initial={{ y: -24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -24, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <div className={cn("mx-3 mt-3 rounded-2xl overflow-hidden", SURFACE_PANEL)}>
                {/* Header */}
                <div className="flex items-center gap-2 px-4 pt-3 pb-2">
                  <div className="h-1.5 w-10 rounded-full bg-zinc-300 dark:bg-white/30" />
                  <div className="flex-1" />
                  <button
                    onClick={() => setSheetOpen(false)}
                    className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-white/10"
                    aria-label="Close sections"
                  >
                    <X className="h-5 w-5 text-zinc-600 dark:text-zinc-200" />
                  </button>
                </div>

                {/* Search */}
                <div className="px-4 pb-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search sections…"
                      className="w-full rounded-lg border border-zinc-300/70 dark:border-white/20 bg-white dark:bg-zinc-900 pl-9 pr-3 py-2 text-sm
                                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* List */}
                <ul className="max-h-[70vh] overflow-y-auto pb-2">
                  {filtered.map((s) => {
                    const i = valid.findIndex(v => v.id === s.id);
                    const isActive = i === active;
                    return (
                      <li key={s.id}>
                        <button
                          onClick={() => scrollToId(s.id, i)}
                          className={cn(
                            "w-full text-left px-4 py-3 flex items-center gap-3",
                            isActive ? "bg-zinc-100 dark:bg-white/10 font-semibold" : "hover:bg-zinc-50 dark:hover:bg-white/5"
                          )}
                          aria-current={isActive ? "true" : undefined}
                        >
                          <span
                            className={cn(
                              "inline-block size-1.5 rounded-full",
                              isActive ? "bg-zinc-900 dark:bg-white" : "bg-zinc-400/70 dark:bg-white/40"
                            )}
                          />
                          <div>
                            <div className={cn(isActive ? "text-zinc-900 dark:text-white" : "text-zinc-700 dark:text-zinc-300")}>
                              {s.label}
                            </div>
                            {s.description && (
                              <div className="text-[12px] text-zinc-500 dark:text-zinc-400">{s.description}</div>
                            )}
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </motion.div>

            {/* Backdrop (click to close) */}
            <motion.button
              className="fixed inset-0 z-[60] bg-black/25"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-label="Close sections"
              onClick={() => setSheetOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default SectionNavigator;
