import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Search, ChevronLeft, ChevronRight, RotateCcw, Car } from "lucide-react";
import { EnhancedSceneData } from "@/types/gallery";
import { ENHANCED_GALLERY_DATA } from "@/data/enhanced-gallery-data";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

/**
 * Toyota Experience Gallery — single-file version (no extra TSX files)
 * - Mobile-first: carousel list; overlay stacks correctly on small screens
 * - Desktop: 3-col grid; overlay split pane (media left, info right)
 * - Guaranteed images via robust fallback
 * - Swipe on media (mobile), keyboard arrows, Esc to close
 * - Interactive hotspots (optional, % coords) — inline in this file
 * - Single sticky CTA "Book a Test Drive" with onAskToyota fallback
 */

const TOYOTA_RED = "#EB0A1E";

/* =========================================================================================
 * Inline Hotspot Layer (no external file)
 * =======================================================================================*/
type Hotspot = {
  x: number; // 0..100 (%)
  y: number; // 0..100 (%)
  title: string;
  description?: string;
  media?: string;
};

function HotspotLayer({ hotspots, touch = false }: { hotspots?: Hotspot[]; touch?: boolean }) {
  const [active, setActive] = useState<number | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setActive(null);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  if (!hotspots || hotspots.length === 0) return null;

  return (
    <div ref={wrapRef} className="pointer-events-none absolute inset-0">
      {hotspots.map((h, i) => {
        const top = `${Math.min(100, Math.max(0, h.y))}%`;
        const left = `${Math.min(100, Math.max(0, h.x))}%`;
        const open = active === i;
        return (
          <div key={i} className="absolute" style={{ top, left, transform: "translate(-50%,-50%)" }}>
            <button
              type="button"
              aria-expanded={open}
              onClick={(e) => { e.stopPropagation(); setActive(open ? null : i); }}
              onKeyDown={(e) => { if (e.key === "Escape") setActive(null); }}
              className={cn(
                "pointer-events-auto grid place-items-center rounded-full border bg-background/90 backdrop-blur shadow-sm",
                "focus-visible:ring-2 focus-visible:ring-primary",
                touch ? "h-10 w-10" : "h-7 w-7"
              )}
              title={h.title}
            >
              <span className="relative block h-2 w-2 rounded-full bg-primary">
                <span className="absolute inset-0 -m-1 animate-ping rounded-full bg-primary/40" />
              </span>
            </button>

            <div
              className={cn(
                "pointer-events-auto mt-2 w-56 rounded-xl border bg-background/95 p-3 text-left shadow-xl backdrop-blur",
                "transition-opacity",
                open ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
              role="dialog"
              aria-label={h.title}
            >
              <div className="flex items-start gap-2">
                {h.media && <img src={h.media} alt="" className="h-10 w-10 rounded-md object-cover" />}
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{h.title}</div>
                  {h.description && <p className="mt-0.5 line-clamp-3 text-xs text-muted-foreground">{h.description}</p>}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* =========================================================================================
 * Types
 * =======================================================================================*/
type SortKey = "featured" | "alphabetical";
interface FilterOptions { categories: string[]; searchTerm: string; sortBy: SortKey; }
interface ViewPreferences { layout: "grid" | "carousel"; }
interface EnhancedVehicleGalleryProps {
  experiences?: EnhancedSceneData[];
  locale?: "en" | "ar";
  rtl?: boolean;
  onAskToyota?: (scene: EnhancedSceneData) => void; // Called when CTA clicked without URL
}

/* =========================================================================================
 * Helpers (TS-safe media access)
 * =======================================================================================*/
const pickCover = (exp: any): string | undefined => {
  const m: any = exp?.media;
  return (
    m?.primaryImage ||
    exp?.coverImage ||
    exp?.thumbnail ||
    exp?.image ||
    m?.hero ||
    (Array.isArray(m?.gallery) ? m.gallery[0] : undefined) ||
    (Array.isArray(m?.images) ? m.images[0] : undefined) ||
    undefined
  );
};

const getGallery = (exp: any): string[] => {
  const m: any = exp?.media;
  const arr =
    (Array.isArray(m?.gallery) && m.gallery) ||
    (Array.isArray(m?.images) && m.images) ||
    [];
  const cover = pickCover(exp);
  return Array.from(new Set([cover, ...arr].filter(Boolean) as string[]));
};

const uniq = (arr: (string | undefined | null)[]) =>
  Array.from(new Set(arr.filter(Boolean) as string[])).sort((a, b) => a.localeCompare(b));

const DEFAULT_FILTERS: FilterOptions = { categories: [], searchTerm: "", sortBy: "featured" };
const DEFAULT_VIEW: ViewPreferences = { layout: "carousel" };

/* =========================================================================================
 * a11y: Focus Trap
 * =======================================================================================*/
function useFocusTrap(enabled: boolean, ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (!enabled || !ref.current) return;
    const node = ref.current;
    const get = () =>
      Array.from(node.querySelectorAll<HTMLElement>("a,button,input,textarea,select,[tabindex]:not([tabindex='-1'])"))
        .filter((el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"));
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const els = get(); if (!els.length) return;
      const first = els[0], last = els[els.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (active === first || !node.contains(active)) { last.focus(); e.preventDefault(); }
      } else {
        if (active === last) { first.focus(); e.preventDefault(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [enabled, ref]);
}

/* =========================================================================================
 * SafeImage
 * =======================================================================================*/
function SafeImage({ src, alt, className, contain = false }: { src?: string; alt: string; className?: string; contain?: boolean }) {
  const [loaded, setLoaded] = useState(false);
  const [err, setErr] = useState(false);
  const showFallback = err || !src;
  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {!showFallback && (
        <img
          src={src}
          alt={alt}
          className={cn("h-full w-full", contain ? "object-contain" : "object-cover", loaded ? "opacity-100" : "opacity-0", "transition-opacity")}
          onLoad={() => setLoaded(true)}
          onError={() => setErr(true)}
          loading="lazy"
          draggable={false}
        />
      )}
      {!loaded && !showFallback && <div className="absolute inset-0 animate-pulse bg-muted" />}
      {showFallback && <div className="absolute inset-0 grid place-items-center text-xs text-muted-foreground">No image</div>}
    </div>
  );
}

/* =========================================================================================
 * Filter Bar
 * =======================================================================================*/
function FilterBar({
  filters, onFiltersChange, categories, total, view, onViewChange,
}: {
  filters: FilterOptions;
  onFiltersChange: (u: FilterOptions | ((p: FilterOptions) => FilterOptions)) => void;
  categories: string[];
  total: number;
  view: ViewPreferences;
  onViewChange: (u: ViewPreferences | ((p: ViewPreferences) => ViewPreferences)) => void;
}) {
  const update = (patch: Partial<FilterOptions>) => onFiltersChange((p) => ({ ...p, ...patch }));
  const toggleCategory = (value: string) =>
    onFiltersChange((p) => {
      const set = new Set(p.categories);
      set.has(value) ? set.delete(value) : set.add(value);
      return { ...p, categories: Array.from(set) };
    });

  return (
    <div className="sticky top-0 z-40 w-full border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <label className="relative flex-1" aria-label="Search experiences">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" size={16} />
            <input
              value={filters.searchTerm}
              onChange={(e) => update({ searchTerm: e.target.value })}
              placeholder="Search models, features, tours…"
              className="w-full rounded-xl border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-[var(--toyota-red,#EB0A1E)] focus-visible:ring-2 focus-visible:ring-[var(--toyota-red,#EB0A1E)]"
            />
          </label>

          <div className="hidden items-center gap-1 sm:flex" role="group" aria-label="Layout">
            <button
              type="button"
              aria-pressed={view.layout === "carousel"}
              onClick={() => onViewChange((p) => ({ ...p, layout: "carousel" }))}
              className={cn("rounded-lg border px-2.5 py-2 text-sm", view.layout === "carousel" ? "border-[var(--toyota-red,#EB0A1E)] bg-[var(--toyota-red,#EB0A1E)]/10" : "hover:bg-accent")}
            >
              Carousel
            </button>
            <button
              type="button"
              aria-pressed={view.layout === "grid"}
              onClick={() => onViewChange((p) => ({ ...p, layout: "grid" }))}
              className={cn("rounded-lg border px-2.5 py-2 text-sm", view.layout === "grid" ? "border-[var(--toyota-red,#EB0A1E)] bg-[var(--toyota-red,#EB0A1E)]/10" : "hover:bg-accent")}
            >
              Grid
            </button>
          </div>

          <button
            type="button"
            className="ml-auto inline-flex items-center gap-1 rounded-lg border px-2.5 py-2 text-sm hover:bg-accent"
            onClick={() => onFiltersChange(DEFAULT_FILTERS)}
            aria-label="Reset filters"
          >
            <RotateCcw size={16} /> Reset
          </button>
        </div>

        {categories.length > 0 && (
          <div className="no-scrollbar -mx-1 flex snap-x snap-mandatory items-center gap-2 overflow-x-auto px-1 pb-1">
            {categories.map((c) => {
              const active = filters.categories.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleCategory(c)}
                  aria-pressed={active}
                  className={cn("snap-start rounded-full border px-3 py-1 text-xs", active ? "border-[var(--toyota-red,#EB0A1E)] bg-[var(--toyota-red,#EB0A1E)]/10" : "hover:bg-accent")}
                >
                  {c}
                </button>
              );
            })}
            <span className="ml-auto shrink-0 text-xs text-muted-foreground" aria-live="polite">
              {total} {total === 1 ? "result" : "results"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================================
 * Card
 * =======================================================================================*/
function ExperienceCard({ exp, onOpen }: { exp: EnhancedSceneData; onOpen: (e: EnhancedSceneData) => void }) {
  const cover = pickCover(exp);
  const titleId = `exp-${exp.id}`;
  return (
    <article className="group relative overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm transition hover:shadow-md focus-within:shadow-md">
      <button type="button" onClick={() => onOpen(exp)} aria-labelledby={titleId} className="block w-full text-left">
        <div className="relative">
          <SafeImage src={cover} alt={exp?.title ?? "Experience"} className="aspect-[16/10] w-full" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/65 to-transparent" />
          <div className="pointer-events-none absolute left-0 top-0 h-full w-1 bg-[var(--toyota-red,#EB0A1E)]" />
        </div>
        <div className="space-y-1 p-4">
          <h3 id={titleId} className="line-clamp-1 text-base font-semibold tracking-tight">{exp.title}</h3>
          {exp.description && <p className="line-clamp-2 text-sm text-muted-foreground">{exp.description}</p>}
          <div className="mt-2 flex flex-wrap gap-1">
            {exp.scene && <span className="rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground">{exp.scene}</span>}
            {exp.featured && <span className="rounded-full bg-[var(--toyota-red,#EB0A1E)]/10 px-2 py-0.5 text-[11px] text-[var(--toyota-red,#EB0A1E)]">Featured</span>}
          </div>
        </div>
      </button>
    </article>
  );
}

/* =========================================================================================
 * Expanded Overlay (mobile-first; split on desktop)
 * =======================================================================================*/
function ExpandedOverlay({
  open, onClose, exp, onPrev, onNext, onTestDrive, rtl,
}: {
  open: boolean;
  onClose: () => void;
  exp: EnhancedSceneData | null;
  onPrev?: () => void;
  onNext?: () => void;
  onTestDrive?: (exp: EnhancedSceneData) => void; // IMPORTANT: takes exp
  rtl?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(open, ref);

  const [activeIdx, setActiveIdx] = useState(0);
  const mediaRef = useRef<HTMLDivElement>(null);

  // keys + body lock
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === (rtl ? "ArrowLeft" : "ArrowRight")) { onNext?.(); setActiveIdx(0); }
      if (e.key === (rtl ? "ArrowRight" : "ArrowLeft")) { onPrev?.(); setActiveIdx(0); }
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prevOverflow; };
  }, [open, onClose, onNext, onPrev, rtl]);

  // swipe
  useEffect(() => {
    const el = mediaRef.current;
    if (!el) return;
    let startX = 0, dx = 0;
    const onStart = (e: TouchEvent) => { startX = e.touches[0].clientX; dx = 0; };
    const onMove  = (e: TouchEvent) => { dx = e.touches[0].clientX - startX; };
    const onEnd   = () => { if (Math.abs(dx) > 50) { dx < 0 ? onNext?.() : onPrev?.(); setActiveIdx(0); } };
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: true });
    el.addEventListener("touchend", onEnd);
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
    };
  }, [onNext, onPrev]);

  if (!open || !exp) return null;

  const images = getGallery(exp);
  const hotspots = (exp as any)?.hotspots as Hotspot[] | undefined;

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        {/* Scrim */}
        <div className="absolute inset-0 bg-black/80" onClick={onClose} aria-hidden="true" />

        {/* Dialog */}
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={exp.title}
          ref={ref}
          className="absolute inset-0 m-auto flex h-[92vh] w-full max-w-[1100px] flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl"
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.18 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-2 border-b p-3 sm:p-4">
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold tracking-tight sm:text-lg">{exp.title}</h3>
              {exp.scene && <p className="truncate text-xs text-muted-foreground">{exp.scene}</p>}
            </div>
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-accent focus-visible:ring-2 focus-visible:ring-[var(--toyota-red,#EB0A1E)]"
              onClick={onClose}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
            {/* Media */}
            <div className="relative min-h-[50vh] flex-1 border-b sm:min-h-0 sm:border-b-0 sm:border-r" ref={mediaRef}>
              <div className="relative mx-auto max-h-[70vh] w-full sm:max-h-[75vh]">
                <SafeImage src={images[activeIdx]} alt={exp.title} className="mx-auto w-full max-h-[60vh] sm:max-h-[72vh]" contain />
                {hotspots && hotspots.length > 0 && <HotspotLayer hotspots={hotspots} touch />}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border bg-background/80 p-2 backdrop-blur hover:bg-background focus-visible:ring-2 focus-visible:ring-[var(--toyota-red,#EB0A1E)]"
                      onClick={() => setActiveIdx((i) => (i - 1 + images.length) % images.length)}
                      aria-label="Previous image"
                    >
                      <ChevronLeft />
                    </button>
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border bg-background/80 p-2 backdrop-blur hover:bg-background focus-visible:ring-2 focus-visible:ring-[var(--toyota-red,#EB0A1E)]"
                      onClick={() => setActiveIdx((i) => (i + 1) % images.length)}
                      aria-label="Next image"
                    >
                      <ChevronRight />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          className={cn("h-1.5 w-1.5 rounded-full", i === activeIdx ? "bg-[var(--toyota-red,#EB0A1E)]" : "bg-foreground/30")}
                          aria-label={`Go to image ${i + 1}`}
                          onClick={() => setActiveIdx(i)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex min-h-0 w-full flex-[0_0_auto] flex-col overflow-auto sm:w-[360px]">
              <div className="p-4 sm:p-5">
                {exp.description && <p className="text-sm leading-relaxed text-muted-foreground">{exp.description}</p>}
                {exp.tags?.length ? (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {exp.tags.map((t: string) => (
                      <span key={t} className="rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground">{t}</span>
                    ))}
                  </div>
                ) : null}
                {Array.isArray((exp as any).specs) && (exp as any).specs.length > 0 && (
                  <ul className="mt-4 grid list-disc gap-1 pl-5 text-sm text-muted-foreground">
                    {(exp as any).specs.slice(0, 8).map((s: string, idx: number) => <li key={idx}>{s}</li>)}
                  </ul>
                )}
                {!Array.isArray((exp as any).specs) && (exp as any).specs && typeof (exp as any).specs === "object" && (
                  <div className="mt-4 space-y-2">
                    {Object.entries((exp as any).specs).slice(0, 8).map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-3 border-b py-2 text-sm">
                        <span className="text-muted-foreground">{k}</span>
                        <span className="font-medium">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="h-16" />
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="sticky bottom-0 border-t bg-background/95 p-3 backdrop-blur">
            <div className="mx-auto flex w-full max-w-[1100px] items-center justify-end gap-2 px-2">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg border px-3 py-2 text-sm hover:bg-accent"
                onClick={onClose}
              >
                Close
              </button>
              <a
                href={(exp as any).testDriveUrl || "#"}
                target={((exp as any).testDriveUrl && "_blank") || undefined}
                rel={((exp as any).testDriveUrl && "noreferrer") || undefined}
                onClick={(e) => {
                  if (!(exp as any).testDriveUrl && onTestDrive) {
                    e.preventDefault();
                    onTestDrive(exp);
                  }
                }}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--toyota-red,#EB0A1E)] bg-[var(--toyota-red,#EB0A1E)] px-4 py-2 text-sm font-medium text-white hover:brightness-95"
              >
                <Car size={16} /> Book a Test Drive
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* =========================================================================================
 * Main
 * =======================================================================================*/
const EnhancedVehicleGallery: React.FC<EnhancedVehicleGalleryProps> = ({
  experiences = ENHANCED_GALLERY_DATA,
  locale = "en",
  rtl = false,
  onAskToyota,
}) => {
  const isMobile = useIsMobile();
  const reduceMotion = useReducedMotion();

  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);
  const [view, setView] = useState<ViewPreferences>(DEFAULT_VIEW);
  const [selected, setSelected] = useState<EnhancedSceneData | null>(null);
  const [expanded, setExpanded] = useState(false);

  // Mobile => carousel, Desktop => grid (auto), user can still toggle
  useEffect(() => {
    setView((p) => {
      const desired = isMobile ? "carousel" : "grid";
      return p.layout === desired ? p : { ...p, layout: desired };
    });
  }, [isMobile]);

  const categories = useMemo(() => uniq(experiences.map((e) => e.scene)), [experiences]);

  const list = useMemo(() => {
    let l = Array.isArray(experiences) ? [...experiences] : [];
    if (filters.categories.length) {
      const set = new Set(filters.categories);
      l = l.filter((e) => set.has(e.scene));
    }
    if (filters.searchTerm.trim()) {
      const q = filters.searchTerm.toLowerCase();
      l = l.filter((e: any) =>
        e.title?.toLowerCase().includes(q) ||
        e.description?.toLowerCase().includes(q) ||
        e.scene?.toLowerCase().includes(q) ||
        (e.tags?.some((t: string) => t.toLowerCase().includes(q)) ?? false)
      );
    }
    if (filters.sortBy === "alphabetical") l.sort((a, b) => a.title.localeCompare(b.title));
    if (filters.sortBy === "featured") l.sort((a: any, b: any) => Number(b.featured) - Number(a.featured));
    return l;
  }, [experiences, filters]);

  // keep overlay selection valid when filters change
  useEffect(() => {
    if (!expanded || !selected) return;
    if (!list.some((e) => e.id === selected.id)) { setExpanded(false); setSelected(null); }
  }, [list, expanded, selected]);

  const open = useCallback((e: EnhancedSceneData) => { setSelected(e); setExpanded(true); }, []);
  const close = useCallback(() => { setExpanded(false); setSelected(null); }, []);
  const next = useCallback(() => {
    if (!selected) return;
    const i = list.findIndex((x) => x.id === selected.id);
    if (i < 0) return;
    setSelected(list[(i + 1) % list.length]);
  }, [list, selected]);
  const prev = useCallback(() => {
    if (!selected) return;
    const i = list.findIndex((x) => x.id === selected.id);
    if (i < 0) return;
    setSelected(list[(i - 1 + list.length) % list.length]);
  }, [list, selected]);

  const has = list.length > 0;

  return (
    <section
      className="relative w-full bg-background isolate"
      dir={rtl ? "rtl" : "ltr"}
      lang={locale}
      aria-label="Experience Gallery"
      style={{ ["--toyota-red" as any]: TOYOTA_RED }}
    >
      {/* Hero */}
      <div className="relative border-b">
        <div className="h-1 w-full bg-[var(--toyota-red,#EB0A1E)]" />
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <motion.h1
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl"
          >
            Toyota Experience Gallery
          </motion.h1>
          {experiences?.length ? (
            <p className="mt-2 text-center text-sm text-muted-foreground" aria-live="polite">
              {experiences.length} {experiences.length === 1 ? "experience" : "experiences"}
            </p>
          ) : null}
        </div>
      </div>

      {/* Filters */}
      <FilterBar
        filters={filters}
        onFiltersChange={setFilters}
        categories={categories}
        total={list.length}
        view={view}
        onViewChange={setView}
      />

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {has ? (
          <>
            {/* MOBILE CAROUSEL */}
            {view.layout === "carousel" && (
              <>
                <div className="-mx-4 overflow-x-auto px-4">
                  <div className="no-scrollbar flex snap-x snap-mandatory gap-4 pb-2">
                    {list.map((exp) => (
                      <div key={exp.id} className="snap-start shrink-0 basis-[87%] sm:basis-[60%] md:basis-[45%]">
                        <ExperienceCard exp={exp} onOpen={open} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-2 flex justify-center gap-1 sm:hidden">
                  {Array.from({ length: Math.min(6, Math.max(1, list.length)) }).map((_, i) => (
                    <span key={i} className="h-1.5 w-1.5 rounded-full bg-foreground/20" />
                  ))}
                </div>
              </>
            )}

            {/* DESKTOP GRID */}
            {view.layout === "grid" && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                {list.map((exp) => (
                  <ExperienceCard key={exp.id} exp={exp} onOpen={open} />
                ))}
              </div>
            )}

            <motion.div initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 text-center">
              <p className="text-muted-foreground" aria-live="polite">
                Showing {list.length} {list.length === 1 ? "experience" : "experiences"}
              </p>
            </motion.div>
          </>
        ) : (
          <div role="status" className="mx-auto mt-6 flex max-w-2xl flex-col items-center justify-center rounded-2xl border border-dashed p-10 text-center">
            <div className="mb-2 text-xl font-semibold">No results</div>
            <p className="mb-4 max-w-prose text-muted-foreground">Try clearing the search or deselecting categories.</p>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-xl border px-4 py-2 text-sm hover:bg-accent focus-visible:ring-2 focus-visible:ring-[var(--toyota-red,#EB0A1E)]"
              onClick={() => setFilters(DEFAULT_FILTERS)}
            >
              <RotateCcw size={16} /> Reset filters
            </button>
          </div>
        )}
      </div>

      {/* Expanded */}
      <ExpandedOverlay
        open={expanded && !!selected}
        onClose={close}
        exp={selected}
        onPrev={list.length > 1 ? prev : undefined}
        onNext={list.length > 1 ? next : undefined}
        onTestDrive={onAskToyota}
        rtl={rtl}
      />
    </section>
  );
};

export default EnhancedVehicleGallery;
