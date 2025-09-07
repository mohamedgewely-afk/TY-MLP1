import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { List, X, ChevronUp, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

type SectionItem = { id: string; label: string; icon?: React.ReactNode };

interface FloatingSectionNavProps {
  sections?: SectionItem[];
  headerOffset?: number;          // sticky header height, default 96
  fabClassName?: string;          // extra classes for the FAB
  panelClassName?: string;        // extra classes for the panel
  placement?: "right-center" | "right-bottom"; // desktop placement
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

const SURFACE = "bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 shadow-xl";

const FloatingSectionNav: React.FC<FloatingSectionNavProps> = ({
  sections = DEFAULT_SECTIONS,
  headerOffset = 96,
  fabClassName,
  panelClassName,
  placement = "right-center",
}) => {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true); // auto-hide/show FAB + panel
  const lastY = useRef(0);
  const clickScrolling = useRef(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // simple mobile swipe-to-close
  const touchStartY = useRef<number | null>(null);

  const valid = useMemo(() => sections.filter(s => s.id && s.label), [sections]);

  const jumpTo = useCallback(
    (id: string, index: number) => {
      const el = document.getElementById(id);
      if (!el) return;
      const y = el.getBoundingClientRect().top + window.pageYOffset - Math.max(0, headerOffset);
      clickScrolling.current = true;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActive(index);
      // close panel on mobile after selection
      if (window.innerWidth < 768) setOpen(false);
      window.setTimeout(() => (clickScrolling.current = false), 500);
    },
    [headerOffset]
  );

  // Active section tracking
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
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0, 0.3, 0.6, 1],
      }
    );
    valid.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [valid]);

  // Auto-hide on scroll
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
        if (goingDown && y > 200 && open) setOpen(false); // hide panel when scrolling down
        lastY.current = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  // Click outside to close
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  // Mobile swipe down to close
  useEffect(() => {
    if (!open) return;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchStartY.current === null) return;
      const dy = e.touches[0].clientY - touchStartY.current;
      if (dy > 40) setOpen(false);
    };
    const panel = panelRef.current;
    panel?.addEventListener("touchstart", onTouchStart, { passive: true });
    panel?.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      panel?.removeEventListener("touchstart", onTouchStart);
      panel?.removeEventListener("touchmove", onTouchMove);
    };
  }, [open]);

  // Keyboard shortcuts (desktop)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Escape" && open) return setOpen(false);
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
  }, [active, valid, jumpTo, open]);

  // FAB positions
  const desktopPos =
    placement === "right-center"
      ? "md:top-1/2 md:-translate-y-1/2 md:right-6"
      : "md:bottom-6 md:right-6";

  return (
    <>
      {/* FAB (floats; hides on scroll down) */}
      <AnimatePresence>
        {visible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 6 }}
            transition={{ duration: 0.15 }}
            onClick={() => setOpen(v => !v)}
            aria-expanded={open}
            aria-label={open ? "Close section navigator" : "Open section navigator"}
            className={cn(
              "fixed z-[90] rounded-full p-3",
              "bottom-6 right-4 md:right-6",        // mobile default
              desktopPos,                            // desktop override
              SURFACE,
              "hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
              fabClassName
            )}
          >
            {open ? (
              <X className="h-5 w-5 text-zinc-900 dark:text-white" />
            ) : (
              <List className="h-5 w-5 text-zinc-900 dark:text-white" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* PANEL */}
      <AnimatePresence>
        {open && (
          <>
            {/* Mobile: full-width bottom sheet */}
            <motion.div
              className="fixed inset-x-0 bottom-0 z-[89] md:hidden"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <div
                ref={panelRef}
                className={cn(
                  "mx-3 mb-3 rounded-2xl overflow-hidden",
                  SURFACE,
                  panelClassName
                )}
              >
                <div className="flex items-center justify-between px-4 pt-3 pb-2">
                  <div className="h-1.5 w-10 rounded-full bg-zinc-300 dark:bg-white/30" />
                  <button
                    onClick={() => setOpen(false)}
                    className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-white/10"
                    aria-label="Hide"
                  >
                    <EyeOff className="h-5 w-5 text-zinc-600 dark:text-zinc-200" />
                  </button>
                </div>

                <ul className="max-h-[60vh] overflow-y-auto py-1">
                  {valid.map((s, i) => {
                    const isActive = i === active;
                    return (
                      <li key={s.id}>
                        <button
                          onClick={() => jumpTo(s.id, i)}
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
                          <span className={cn(isActive ? "text-zinc-900 dark:text-white" : "text-zinc-700 dark:text-zinc-300")}>
                            {s.label}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </motion.div>

            {/* Desktop: anchored popover near FAB */}
            <motion.div
              className={cn(
                "fixed z-[89] hidden md:block",
                placement === "right-center"
                  ? "top-1/2 -translate-y-1/2 right-[92px]" // next to FAB
                  : "right-[92px] bottom-6"
              )}
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 6 }}
              transition={{ duration: 0.18 }}
            >
              <div
                ref={panelRef}
                className={cn(
                  "w-64 rounded-2xl p-2 overflow-hidden",
                  SURFACE,
                  panelClassName
                )}
              >
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
                          <span className={cn(isActive ? "text-zinc-900 dark:text-white" : "text-zinc-700 dark:text-zinc-300")}>
                            {s.label}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </motion.div>

            {/* Click-away backdrop (mobile only) */}
            <motion.div
              className="fixed inset-0 z-[88] md:hidden bg-black/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              aria-hidden
            />
          </>
        )}
      </AnimatePresence>

      {/* Mobile quick Back-to-Top (optional, shows after first section) */}
      <AnimatePresence>
        {visible && !open && active > 0 && (
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className={cn(
              "fixed right-4 bottom-[84px] md:hidden z-[85] rounded-full p-3",
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

export default FloatingSectionNav;