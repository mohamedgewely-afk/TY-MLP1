import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { List, X } from "lucide-react";
import { cn } from "@/lib/utils";

type SectionItem = { id: string; label: string };

interface StickySectionNavProps {
  sections?: SectionItem[];
  headerOffset?: number;           // px for sticky header height (smooth scroll offset). Default 96.
  brandActiveClass?: string;       // Tailwind class for accent, e.g., "bg-[#EB0A1E]" or "bg-red-600"
  mobileTopPercent?: number;       // Sticky icon vertical position on mobile (0..100). Default 30.
  zIndexClass?: string;            // z-index override. Default "z-[2147483647]" (max) for portal.
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
const HIT = "min-w-[44px] min-h-[44px]"; // WCAG hit target

const StickySectionNav: React.FC<StickySectionNavProps> = ({
  sections = DEFAULT_SECTIONS,
  headerOffset = 96,
  brandActiveClass = "bg-red-600",
  mobileTopPercent = 30,
  zIndexClass = "z-[2147483647]", // safelist this if your Tailwind purges arbitrary classes
}) => {
  const valid = useMemo(() => sections.filter(s => s.id && s.label), [sections]);

  const [activeIdx, setActiveIdx] = useState(0);
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const clickScrolling = useRef(false);
  const lastY = useRef(0);

  // ----- Active section via IntersectionObserver (stable, non-flickery)
  useEffect(() => {
    if (!valid.length) return;
    const io = new IntersectionObserver(
      entries => {
        if (clickScrolling.current) return;
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio > 0.3) {
            const i = valid.findIndex(s => s.id === e.target.id);
            if (i !== -1) setActiveIdx(i);
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

  // ----- Auto-hide on scroll down, show on scroll up / near top
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

  // ----- Smooth scroll with header offset
  const jumpTo = useCallback(
    (id: string, i: number) => {
      const el = document.getElementById(id);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.pageYOffset - Math.max(0, headerOffset);
      clickScrolling.current = true;
      window.scrollTo({ top, behavior: "smooth" });
      setActiveIdx(i);
      setOpen(false);
      window.setTimeout(() => (clickScrolling.current = false), 500);
    },
    [headerOffset]
  );

  // ----- Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Escape" && open) return setOpen(false);
      if (!["ArrowUp", "ArrowDown", "Home", "End"].includes(e.key)) return;
      e.preventDefault();
      if (e.key === "Home") return jumpTo(valid[0].id, 0);
      if (e.key === "End") return jumpTo(valid[valid.length - 1].id, valid.length - 1);
      const delta = e.key === "ArrowDown" ? 1 : -1;
      const next = Math.max(0, Math.min(valid.length - 1, activeIdx + delta));
      jumpTo(valid[next].id, next);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIdx, valid, jumpTo, open]);

  // ----- Mobile portal (ensures visibility even inside transform/overflow stacks)
  const [mounted, setMounted] = useState(false);
  const portalEl = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    setMounted(true);
    const el = document.createElement("div");
    el.setAttribute("data-sticky-nav-root", "true");
    document.body.appendChild(el);
    portalEl.current = el;
    return () => {
      if (portalEl.current) document.body.removeChild(portalEl.current);
      portalEl.current = null;
    };
  }, []);

  // ----- Icon Button (shared)
  const IconButton = (
    <motion.button
      type="button"
      onClick={() => setOpen(v => !v)}
      aria-expanded={open}
      aria-label={open ? "Close section list" : "Open section list"}
      className={cn(
        "fixed right-3 md:right-6 rounded-full p-3",
        "bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 shadow-2xl",
        "hover:shadow-[0_8px_24px_rgba(0,0,0,0.16)]",
        "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
        HIT
      )}
      initial={{ opacity: 0, scale: 0.9, y: 6 }}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.98, y: visible ? 0 : 4 }}
      transition={{ duration: 0.15 }}
      style={{
        top: `clamp(120px, ${mobileTopPercent}vh, 60vh)`, // higher on mobile; mid on desktop
      }}
    >
      {open ? (
        <X className="h-5 w-5 text-zinc-900 dark:text-white" />
      ) : (
        <List className="h-5 w-5 text-zinc-900 dark:text-white" />
      )}
    </motion.button>
  );

  // ----- Panel (compact, anchored to icon)
  const Panel = (
    <AnimatePresence>
      {open && (
        <motion.div
          className={cn(
            "fixed right-[64px] md:right-[92px]",
            "rounded-2xl p-2 w-[78vw] max-w-[320px] md:w-[320px]",
            SURFACE,
            HIT
          )}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 8 }}
          transition={{ duration: 0.16 }}
          style={{
            top: `clamp(100px, ${mobileTopPercent}vh, 60vh)`,
          }}
          role="dialog"
          aria-modal="true"
        >
          <ul className="max-h-[60vh] overflow-y-auto pr-1">
            {valid.map((s, i) => {
              const active = i === activeIdx;
              return (
                <li key={s.id} className="my-0.5">
                  <button
                    onClick={() => jumpTo(s.id, i)}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-left transition",
                      "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                      active
                        ? "bg-zinc-100 dark:bg-white/10 font-semibold"
                        : "hover:bg-zinc-50 dark:hover:bg-white/5"
                    )}
                    aria-current={active ? "true" : undefined}
                  >
                    <span
                      className={cn(
                        "inline-block size-1.5 rounded-full",
                        active ? "bg-zinc-900 dark:bg-white" : "bg-zinc-400/70 dark:bg-white/40"
                      )}
                    />
                    <span className={cn(active ? "text-zinc-900 dark:text-white" : "text-zinc-700 dark:text-zinc-300")}>
                      {s.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Render: desktop directly; mobile via portal (so it never gets clipped)
  const body = (
    <>
      {IconButton}
      {Panel}
      {/* Click-away on mobile to close */}
      <AnimatePresence>
        {open && (
          <motion.button
            aria-label="Close section list"
            className="fixed inset-0 md:hidden bg-black/0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );

  return (
    <>
      {/* Desktop / large screens render in-place */}
      <div className={cn("hidden md:block z-[90]")}>{body}</div>

      {/* Mobile renders in a portal with ultra-high z-index to avoid stacking bugs */}
      {mounted && portalEl.current
        ? createPortal(
            <div className={cn("md:hidden", zIndexClass)}>{body}</div>,
            portalEl.current
          )
        : null}
    </>
  );
};

export default StickySectionNav;