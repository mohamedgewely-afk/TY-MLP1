import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Sparkles, X, Search, ChevronLeft, ChevronRight, RotateCcw, Car } from "lucide-react";
import { EnhancedSceneData } from "@/types/gallery";
import { ENHANCED_GALLERY_DATA } from "@/data/enhanced-gallery-data";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

/**
 * GOALS
 * - Guaranteed images (robust cover selection + fallback)
 * - Mobile-first carousel (scroll-snap) + desktop grid
 * - Minimal, sensible filters (Search + Category chips only)
 * - Rich expanded view with multi-image, specs, and prominent Test Drive CTA
 * - Accessibility: focus trap, ESC/Arrows, reduced motion, RTL-aware
 */

// ---- Types (adjust to your app if needed) ---------------------------------
export type SortKey = "featured" | "alphabetical";
export interface FilterOptions {
  categories: string[]; // derived from exp.scene
  searchTerm: string;
  sortBy: SortKey;
}
export interface ViewPreferences {
  layout: "grid" | "carousel";
  cardSize: "small" | "medium" | "large";
}

interface EnhancedVehicleGalleryProps {
  experiences?: EnhancedSceneData[];
  locale?: "en" | "ar";
  rtl?: boolean;
  onAskToyota?: (scene: EnhancedSceneData) => void; // used for Test Drive
}

// ---- Helpers ---------------------------------------------------------------
function pickCover(exp: any): string | undefined {
  return (
    exp?.coverImage ||
    exp?.thumbnail ||
    exp?.image ||
    exp?.images?.[0]?.src ||
    exp?.images?.[0] ||
    exp?.media?.find?.((m: any) => m.url)?.url ||
    undefined
  );
}

const uniq = (arr: (string | undefined | null)[]) =>
  Array.from(new Set(arr.filter(Boolean) as string[])).sort((a, b) => a.localeCompare(b));

const DEFAULT_FILTERS: FilterOptions = {
  categories: [],
  searchTerm: "",
  sortBy: "featured",
};

const DEFAULT_VIEW: ViewPreferences = {
  layout: "carousel", // MOBILE-FIRST: carousel by default, grid for desktop via effect
  cardSize: "medium",
};

// ---- Accessibility: focus trap for the dialog -----------------------------
function useFocusTrap(enabled: boolean, ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (!enabled || !ref.current) return;
    const node = ref.current;
    const focusable = () =>
      Array.from(
        node.querySelectorAll<HTMLElement>(
          "a,button,input,textarea,select,[tabindex]:not([tabindex='-1'])"
        )
      ).filter((el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"));
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const list = focusable();
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (active === first || !node.contains(active)) {
          last.focus();
          e.preventDefault();
        }
      } else {
        if (active === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [enabled, ref]);
}

// ---- SafeImage with skeleton + fallback -----------------------------------
function SafeImage({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  const [loaded, setLoaded] = useState(false);
  const [err, setErr] = useState(false);
  const showFallback = err || !src;
  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {!showFallback && (
        <img
          src={src}
          alt={alt}
          className={cn("h-full w-full object-cover transition-opacity", loaded ? "opacity-100" : "opacity-0")}
          onLoad={() => setLoaded(true)}
          onError={() => setErr(true)}
          draggable={false}
        />
      )}
      {!loaded && !showFallback && <div className="absolute inset-0 animate-pulse bg-muted" />}
      {showFallback && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
          No image available
        </div>
      )}
    </div>
  );
}

// ---- FilterBar (MINIMAL: search + categories + reset) ----------------------
function FilterBar({
  filters,
  onFiltersChange,
  categories,
  total,
  view,
  onViewChange,
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
    <div className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <label className="relative flex-1" aria-label="Search experiences">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" size={16} />
            <input
              value={filters.searchTerm}
              onChange={(e) => update({ searchTerm: e.target.value })}
              placeholder="Search…"
              className="w-full rounded-xl border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary"
            />
          </label>

          <div className="hidden items-center gap-1 sm:flex" role="group" aria-label="Layout">
            <button
              type="button"
              aria-pressed={view.layout === "carousel"}
              onClick={() => onViewChange((p) => ({ ...p, layout: "carousel" }))}
              className={cn(
                "rounded-lg border px-2.5 py-2 text-sm",
                view.layout === "carousel" ? "border-primary bg-primary/10" : "hover:bg-accent"
              )}
            >
              Mobile Carousel
            </button>
            <button
              type="button"
              aria-pressed={view.layout === "grid"}
              onClick={() => onViewChange((p) => ({ ...p, layout: "grid" }))}
              className={cn(
                "rounded-lg border px-2.5 py-2 text-sm",
                view.layout === "grid" ? "border-primary bg-primary/10" : "hover:bg-accent"
              )}
            >
              Desktop Grid
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
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Categories:</span>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => toggleCategory(c)}
                aria-pressed={filters.categories.includes(c)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  filters.categories.includes(c) ? "border-primary bg-primary/10" : "hover:bg-accent"
                )}
              >
                {c}
              </button>
            ))}
            <span className="ml-auto text-xs text-muted-foreground" aria-live="polite">
              {total} {total === 1 ? "result" : "results"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Card ------------------------------------------------------------------
function ExperienceCard({ exp, onOpen }: { exp: EnhancedSceneData; onOpen: (e: EnhancedSceneData) => void }) {
  const cover = pickCover(exp);
  const titleId = `exp-${exp.id}`;
  return (
    <article className="group relative overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm transition hover:shadow-md focus-within:shadow-md">
      <button type="button" onClick={() => onOpen(exp)} aria-labelledby={titleId} className="block w-full text-left">
        <SafeImage src={cover} alt={exp?.title ?? "Experience"} className="aspect-[16/10] w-full" />
        <div className="p-4">
          <h3 id={titleId} className="line-clamp-1 text-base font-semibold">
            {exp.title}
          </h3>
          {exp.description && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{exp.description}</p>}
          <div className="mt-2 flex flex-wrap gap-1">
            {exp.scene && <span className="rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground">{exp.scene}</span>}
            {exp.featured && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] text-primary">Featured</span>
            )}
          </div>
        </div>
      </button>
    </article>
  );
}

// ---- Expanded Overlay (multi-image + CTA) ---------------------------------
function ExpandedOverlay({
  open,
  onClose,
  exp,
  onPrev,
  onNext,
  onTestDrive,
  rtl,
}: {
  open: boolean;
  onClose: () => void;
  exp: EnhancedSceneData | null;
  onPrev?: () => void;
  onNext?: () => void;
  onTestDrive?: () => void;
  rtl?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(open, ref);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === (rtl ? "ArrowLeft" : "ArrowRight")) onNext?.();
      if (e.key === (rtl ? "ArrowRight" : "ArrowLeft")) onPrev?.();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose, onNext, onPrev, rtl]);

  if (!open || !exp) return null;
  const images: string[] = (exp.images?.map((i: any) => i?.src ?? i) ?? []).filter(Boolean);
  const cover = pickCover(exp) ?? images[0];
  const gallery = images.length ? images : [cover].filter(Boolean) as string[];

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={exp.title}
          ref={ref}
          className="absolute inset-0 m-auto flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl"
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.18 }}
        >
          <div className="flex items-center justify-between gap-2 border-b p-3 sm:p-4">
            <div className="flex min-w-0 items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Sparkles size={16} className="text-primary" />
              </span>
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold sm:text-lg">{exp.title}</h3>
                {exp.scene && <p className="truncate text-xs text-muted-foreground">{exp.scene}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm hover:bg-accent"
                onClick={onTestDrive}
              >
                <Car size={16} /> Test Drive
              </button>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary"
                onClick={onClose}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Media + thumbs */}
          <div className="relative bg-black/5">
            <SafeImage src={cover} alt={exp.title} className="aspect-[16/9] w-full" />
            {onPrev && (
              <button
                type="button"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border bg-background/80 p-2 backdrop-blur hover:bg-background focus-visible:ring-2 focus-visible:ring-primary"
                onClick={onPrev}
                aria-label="Previous"
              >
                <ChevronLeft />
              </button>
            )}
            {onNext && (
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border bg-background/80 p-2 backdrop-blur hover:bg-background focus-visible:ring-2 focus-visible:ring-primary"
                onClick={onNext}
                aria-label="Next"
              >
                <ChevronRight />
              </button>
            )}

            {gallery.length > 1 && (
              <div className="no-scrollbar -mx-2 mt-2 flex gap-2 overflow-x-auto px-2 pb-2">
                {gallery.map((src, i) => (
                  <button
                    key={src + i}
                    className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg border"
                    onClick={(e) => {
                      e.preventDefault();
                      // naive swap by reordering array (kept simple for inline)
                      const idx = i;
                      const head = gallery[idx];
                      if (head) {
                        const img = (e.currentTarget.parentElement?.previousElementSibling as HTMLElement) // SafeImage wrapper
                          ?.querySelector("img") as HTMLImageElement | null;
                        if (img) img.src = head;
                      }
                    }}
                  >
                    <img src={src} alt="thumbnail" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="grid gap-4 p-4 sm:grid-cols-3 sm:gap-6">
            <div className="sm:col-span-2">
              {exp.description && <p className="text-sm text-muted-foreground">{exp.description}</p>}
              {exp.tags?.length ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {exp.tags.map((t: string) => (
                    <span key={t} className="rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground">
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="flex items-end justify-start gap-2 sm:justify-end">
              <a
                href={(exp as any).testDriveUrl || "#"}
                target={((exp as any).testDriveUrl && "_blank") || undefined}
                rel={((exp as any).testDriveUrl && "noreferrer") || undefined}
                onClick={(e) => {
                  if (!(exp as any).testDriveUrl) {
                    e.preventDefault();
                    onTestDrive?.();
                  }
                }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-accent sm:w-auto"
              >
                <Car size={16} /> Book a Test Drive
              </a>
              <button
                type="button"
                className="inline-flex w-full items-center justify-center rounded-lg border px-3 py-2 text-sm hover:bg-accent sm:w-auto"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ---- MAIN ------------------------------------------------------------------
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

  // Policy: default carousel on mobile, grid on desktop; don't fight user choice
  useEffect(() => {
    setView((p) => {
      const desired = isMobile ? "carousel" : "grid";
      return p.layout === desired ? p : { ...p, layout: desired };
    });
  }, [isMobile]);

  // Facets
  const categories = useMemo(() => uniq(experiences.map((e) => e.scene)), [experiences]);

  // Filter + sort
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

  // Expanded sync
  useEffect(() => {
    if (!expanded || !selected) return;
    const exists = list.some((e) => e.id === selected.id);
    if (!exists) {
      setExpanded(false);
      setSelected(null);
    }
  }, [list, expanded, selected]);

  const canNav = list.length > 1;
  const open = useCallback((e: EnhancedSceneData) => {
    setSelected(e);
    setExpanded(true);
  }, []);
  const close = useCallback(() => {
    setExpanded(false);
    setSelected(null);
  }, []);
  const next = useCallback(() => {
    if (!canNav || !selected) return;
    const i = list.findIndex((x) => x.id === selected.id);
    if (i < 0) return;
    setSelected(list[(i + 1) % list.length]);
  }, [list, selected, canNav]);
  const prev = useCallback(() => {
    if (!canNav || !selected) return;
    const i = list.findIndex((x) => x.id === selected.id);
    if (i < 0) return;
    setSelected(list[(i - 1 + list.length) % list.length]);
  }, [list, selected, canNav]);

  const has = list.length > 0;

  return (
    <section className="relative w-full bg-background" dir={rtl ? "rtl" : "ltr"} lang={locale} aria-label="Experience Gallery">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/10">
        <div className="absolute inset-0 pointer-events-none [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <motion.div
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="text-center"
          >
            <motion.span
              className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg"
              animate={reduceMotion ? {} : { rotate: [0, 5, -5, 0], scale: [1, 1.04, 1] }}
              transition={reduceMotion ? {} : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="h-8 w-8 text-primary-foreground" />
            </motion.span>
            <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">Experience Gallery</h1>
            {experiences?.length ? (
              <p className="mt-2 text-sm text-muted-foreground" aria-live="polite">
                {experiences.length} {experiences.length === 1 ? "experience" : "experiences"}
              </p>
            ) : null}
          </motion.div>
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
            {/* MOBILE-FIRST CAROUSEL */}
            {view.layout === "carousel" && (
              <div className="-mx-4 overflow-x-auto px-4">
                <div className="no-scrollbar flex snap-x snap-mandatory gap-4 pb-2">
                  {list.map((exp) => (
                    <div key={exp.id} className="snap-start shrink-0 basis-[85%] sm:basis-[60%] md:basis-[45%]">
                      <ExperienceCard exp={exp} onOpen={open} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DESKTOP GRID */}
            {view.layout === "grid" && (
              <div className={cn("grid gap-4 sm:gap-6", "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3")}
              >
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
              className="inline-flex items-center gap-1 rounded-xl border px-4 py-2 text-sm hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary"
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
        onPrev={canNav ? prev : undefined}
        onNext={canNav ? next : undefined}
        onTestDrive={selected ? () => onAskToyota?.(selected) : undefined}
        rtl={rtl}
      />
    </section>
  );
};

export default EnhancedVehicleGallery;
