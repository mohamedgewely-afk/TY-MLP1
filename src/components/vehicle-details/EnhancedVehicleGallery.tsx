import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Sparkles,
  X,
  Search,
  Grid3X3,
  Rows,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { EnhancedSceneData } from "@/types/gallery";
import { ENHANCED_GALLERY_DATA } from "@/data/enhanced-gallery-data";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

/**
 * Local types (align to your existing types if they differ)
 */
export type SortKey = "featured" | "alphabetical" | "newest" | "popular";
export interface FilterOptions {
  categories: string[];
  experienceTypes: string[];
  searchTerm: string;
  sortBy: SortKey;
}
export interface ViewPreferences {
  layout: "grid" | "carousel"; // carousel = horizontal scroll w/ snap
  cardSize: "small" | "medium" | "large";
  showPreviews: boolean;
}

interface EnhancedVehicleGalleryProps {
  experiences?: EnhancedSceneData[];
  locale?: "en" | "ar";
  rtl?: boolean;
  onAskToyota?: (scene: EnhancedSceneData) => void;
}

/** Utility: pick best cover image from scene */
function getCoverImage(scene: any): string | undefined {
  return (
    scene?.coverImage ||
    scene?.thumbnail ||
    scene?.image ||
    scene?.images?.[0]?.src ||
    scene?.media?.[0]?.url ||
    undefined
  );
}

/** Unique, sorted list helper */
const uniq = (arr: (string | undefined | null)[]) =>
  Array.from(new Set(arr.filter(Boolean) as string[])).sort((a, b) =>
    a.localeCompare(b)
  );

const DEFAULT_FILTERS: FilterOptions = {
  categories: [],
  experienceTypes: [],
  searchTerm: "",
  sortBy: "featured",
};

const DEFAULT_VIEW_PREFS: ViewPreferences = {
  layout: "grid",
  cardSize: "medium",
  showPreviews: true,
};

/**
 * Accessible focus trapping for the modal
 */
function useFocusTrap(enabled: boolean, containerRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (!enabled || !containerRef.current) return;
    const root = containerRef.current;

    const getFocusable = () =>
      Array.from(
        root.querySelectorAll<HTMLElement>(
          "a, button, input, textarea, select, summary, [tabindex]:not([tabindex='-1'])"
        )
      ).filter((el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"));

    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = getFocusable();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (active === first || !root.contains(active)) {
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

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [enabled, containerRef]);
}

/**
 * Image component with loading + fallback
 */
function SafeImage({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const showFallback = error || !src;

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {!showFallback && (
        <img
          src={src}
          alt={alt}
          className={cn(
            "h-full w-full object-cover transition-opacity",
            loaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          draggable={false}
        />
      )}
      {!loaded && !showFallback && (
        <div className="absolute inset-0 animate-pulse bg-muted" />
      )}
      {showFallback && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
          No image
        </div>
      )}
    </div>
  );
}

/**
 * FILTER BAR (inline version to keep this file drop-in)
 */
function FilterBar({
  filters,
  onFiltersChange,
  viewPrefs,
  onViewPrefsChange,
  categories,
  types,
  totalResults,
}: {
  filters: FilterOptions;
  onFiltersChange: (updater: FilterOptions | ((p: FilterOptions) => FilterOptions)) => void;
  viewPrefs: ViewPreferences;
  onViewPrefsChange: (updater: ViewPreferences | ((p: ViewPreferences) => ViewPreferences)) => void;
  categories: string[];
  types: string[];
  totalResults: number;
}) {
  const update = (patch: Partial<FilterOptions>) =>
    onFiltersChange((prev) => ({ ...prev, ...patch }));

  const toggleChip = (key: "categories" | "experienceTypes", value: string) => {
    onFiltersChange((prev) => {
      const set = new Set(prev[key]);
      if (set.has(value)) set.delete(value);
      else set.add(value);
      return { ...prev, [key]: Array.from(set) } as FilterOptions;
    });
  };

  return (
    <div className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        {/* Search */}
        <label className="relative flex-1" aria-label="Search experiences">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" size={16} />
          <input
            value={filters.searchTerm}
            onChange={(e) => update({ searchTerm: e.target.value })}
            placeholder="Search…"
            className="w-full rounded-xl border bg-background pl-9 pr-3 py-2 text-sm outline-none ring-0 focus:border-primary focus-visible:ring-2 focus-visible:ring-primary"
          />
        </label>

        {/* Layout toggle */}
        <div className="hidden items-center gap-1 sm:flex" role="group" aria-label="View layout">
          <button
            type="button"
            aria-pressed={viewPrefs.layout === "grid"}
            onClick={() => onViewPrefsChange((p) => ({ ...p, layout: "grid" }))}
            className={cn(
              "inline-flex items-center gap-1 rounded-lg border px-2.5 py-2 text-sm",
              viewPrefs.layout === "grid"
                ? "border-primary bg-primary/10"
                : "hover:bg-accent"
            )}
          >
            <Grid3X3 size={16} /> Grid
          </button>
          <button
            type="button"
            aria-pressed={viewPrefs.layout === "carousel"}
            onClick={() => onViewPrefsChange((p) => ({ ...p, layout: "carousel" }))}
            className={cn(
              "inline-flex items-center gap-1 rounded-lg border px-2.5 py-2 text-sm",
              viewPrefs.layout === "carousel"
                ? "border-primary bg-primary/10"
                : "hover:bg-accent"
            )}
          >
            <Rows size={16} /> Carousel
          </button>
        </div>

        {/* Reset */}
        <button
          type="button"
          className="ml-auto inline-flex items-center gap-1 rounded-lg border px-2.5 py-2 text-sm hover:bg-accent"
          onClick={() => onFiltersChange(DEFAULT_FILTERS)}
          aria-label="Reset filters"
        >
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {/* Chips */}
      <div className="mx-auto max-w-7xl px-4 pb-3 sm:px-6">
        {/* Categories */}
        {categories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 py-1">
            <span className="text-xs font-medium text-muted-foreground">Categories:</span>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => toggleChip("categories", c)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  filters.categories.includes(c)
                    ? "border-primary bg-primary/10"
                    : "hover:bg-accent"
                )}
                aria-pressed={filters.categories.includes(c)}
              >
                {c}
              </button>
            ))}
          </div>
        )}
        {/* Types */}
        {types.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 py-1">
            <span className="text-xs font-medium text-muted-foreground">Types:</span>
            {types.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => toggleChip("experienceTypes", t)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  filters.experienceTypes.includes(t)
                    ? "border-primary bg-primary/10"
                    : "hover:bg-accent"
                )}
                aria-pressed={filters.experienceTypes.includes(t)}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        <div className="py-1 text-xs text-muted-foreground" aria-live="polite">
          {totalResults} {totalResults === 1 ? "result" : "results"}
        </div>
      </div>
    </div>
  );
}

/**
 * Experience Card
 */
function ExperienceCard({
  exp,
  onOpen,
  size = "medium",
}: {
  exp: EnhancedSceneData;
  onOpen: (exp: EnhancedSceneData) => void;
  size?: ViewPreferences["cardSize"];
}) {
  const cover = getCoverImage(exp);
  const aspect = "aspect-[16/10]"; // predictable ratio for grid
  const titleId = `exp-title-${exp.id}`;

  return (
    <article
      className="group relative overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm transition hover:shadow-md focus-within:shadow-md"
    >
      <button
        type="button"
        onClick={() => onOpen(exp)}
        aria-labelledby={titleId}
        className="block w-full text-left focus:outline-none"
      >
        <SafeImage src={cover} alt={exp?.title ?? "Experience"} className={cn("w-full", aspect)} />
        <div className="space-y-1 p-4">
          <h3 id={titleId} className="line-clamp-1 text-base font-semibold">
            {exp.title}
          </h3>
          {exp.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">{exp.description}</p>
          )}
          <div className="mt-2 flex flex-wrap gap-1">
            {exp.scene && (
              <span className="rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground">
                {exp.scene}
              </span>
            )}
            {exp.experienceType && (
              <span className="rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground">
                {exp.experienceType}
              </span>
            )}
            {exp.featured && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] text-primary">
                Featured
              </span>
            )}
          </div>
        </div>
      </button>
    </article>
  );
}

/**
 * Expanded Modal
 */
function ExpandedOverlay({
  open,
  onClose,
  experience,
  onPrev,
  onNext,
  onAskToyota,
  rtl,
}: {
  open: boolean;
  onClose: () => void;
  experience: EnhancedSceneData | null;
  onPrev?: () => void;
  onNext?: () => void;
  onAskToyota?: (scene: EnhancedSceneData) => void;
  rtl?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  useFocusTrap(open, ref);

  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === (rtl ? "ArrowLeft" : "ArrowRight")) onNext?.();
      if (e.key === (rtl ? "ArrowRight" : "ArrowLeft")) onPrev?.();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lastFocus.current?.focus?.();
    };
  }, [open, onClose, onNext, onPrev, rtl]);

  const cover = experience ? getCoverImage(experience) : undefined;

  return (
    <AnimatePresence>
      {open && experience && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Scrim */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={experience.title}
            ref={ref}
            className="absolute inset-0 m-auto flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl md:h-fit"
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.18 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-2 border-b p-3 sm:p-4">
              <div className="flex min-w-0 items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Sparkles size={16} className="text-primary" />
                </span>
                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold sm:text-lg">
                    {experience.title}
                  </h3>
                  {experience.scene && (
                    <p className="truncate text-xs text-muted-foreground">{experience.scene}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="hidden items-center gap-1 rounded-lg border px-2.5 py-1.5 text-sm hover:bg-accent sm:inline-flex"
                  onClick={() => experience && onAskToyota?.(experience)}
                >
                  Ask Toyota
                </button>
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  onClick={onClose}
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Media */}
            <div className="relative">
              <SafeImage
                src={cover}
                alt={experience.title}
                className="aspect-[16/9] w-full"
              />

              {/* Nav controls */}
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
            </div>

            {/* Body */}
            <div className="grid gap-3 p-4 sm:grid-cols-3 sm:gap-6">
              <div className="sm:col-span-2">
                {experience.description && (
                  <p className="text-sm text-muted-foreground">{experience.description}</p>
                )}
                {experience.tags?.length ? (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {experience.tags.map((t: string) => (
                      <span key={t} className="rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground">
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="flex items-end justify-start gap-2 sm:justify-end">
                <button
                  type="button"
                  className="inline-flex w-full items-center justify-center rounded-lg border px-3 py-2 text-sm hover:bg-accent sm:w-auto"
                  onClick={() => experience && onAskToyota?.(experience)}
                >
                  Ask Toyota
                </button>
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
      )}
    </AnimatePresence>
  );
}

/**
 * MAIN COMPONENT (drop-in)
 */
const EnhancedVehicleGallery: React.FC<EnhancedVehicleGalleryProps> = ({
  experiences = ENHANCED_GALLERY_DATA,
  locale = "en",
  rtl = false,
  onAskToyota,
}) => {
  const isMobile = useIsMobile();
  const reduceMotion = useReducedMotion();

  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);
  const [viewPrefs, setViewPrefs] = useState<ViewPreferences>(DEFAULT_VIEW_PREFS);
  const [selected, setSelected] = useState<EnhancedSceneData | null>(null);
  const [expanded, setExpanded] = useState(false);

  /** Layout policy: force grid on mobile, keep preference on desktop */
  useEffect(() => {
    setViewPrefs((prev) => {
      const desired = isMobile ? "grid" : prev.layout;
      if (desired === prev.layout) return prev;
      return { ...prev, layout: desired };
    });
  }, [isMobile]);

  /** Derive facets */
  const facets = useMemo(() => {
    const cats = uniq(experiences.map((e) => e.scene));
    const types = uniq(experiences.map((e) => (e as any).experienceType));
    return { cats, types };
  }, [experiences]);

  /** Filter + sort */
  const filtered = useMemo(() => {
    let list = Array.isArray(experiences) ? [...experiences] : [];

    if (filters.categories.length) {
      const set = new Set(filters.categories);
      list = list.filter((e) => set.has(e.scene));
    }
    if (filters.experienceTypes.length) {
      const set = new Set(filters.experienceTypes);
      list = list.filter((e: any) => set.has(e.experienceType));
    }
    if (filters.searchTerm.trim()) {
      const q = filters.searchTerm.toLowerCase();
      list = list.filter((e: any) =>
        e.title?.toLowerCase().includes(q) ||
        e.description?.toLowerCase().includes(q) ||
        e.scene?.toLowerCase().includes(q) ||
        (e.tags?.some((t: string) => t.toLowerCase().includes(q)) ?? false)
      );
    }

    switch (filters.sortBy) {
      case "alphabetical":
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "featured":
        list.sort((a: any, b: any) => Number(b.featured) - Number(a.featured));
        break;
      default:
        // TODO: newest/popular when backend provides fields
        break;
    }

    return list;
  }, [experiences, filters]);

  /** Keep expanded item in sync */
  useEffect(() => {
    if (!expanded || !selected) return;
    const exists = filtered.some((e) => e.id === selected.id);
    if (!exists) {
      setExpanded(false);
      setSelected(null);
    }
  }, [filtered, expanded, selected]);

  const canNavigate = filtered.length > 1;

  const open = useCallback((e: EnhancedSceneData) => {
    setSelected(e);
    setExpanded(true);
  }, []);

  const close = useCallback(() => {
    setExpanded(false);
    setSelected(null);
  }, []);

  const openNext = useCallback(() => {
    if (!canNavigate || !selected) return;
    const idx = filtered.findIndex((e) => e.id === selected.id);
    if (idx < 0) return;
    const next = (idx + 1) % filtered.length;
    setSelected(filtered[next]);
  }, [filtered, selected, canNavigate]);

  const openPrev = useCallback(() => {
    if (!canNavigate || !selected) return;
    const idx = filtered.findIndex((e) => e.id === selected.id);
    if (idx < 0) return;
    const prev = (idx - 1 + filtered.length) % filtered.length;
    setSelected(filtered[prev]);
  }, [filtered, selected, canNavigate]);

  const hasResults = filtered.length > 0;

  return (
    <section
      className="relative w-full bg-background"
      dir={rtl ? "rtl" : "ltr"}
      lang={locale}
      aria-label="Experience Gallery"
    >
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/10">
        <div className="absolute inset-0 pointer-events-none [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
          <motion.div
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="text-center"
          >
            <motion.div
              className="mb-6 flex justify-center"
              animate={
                reduceMotion ? {} : { rotate: [0, 5, -5, 0], scale: [1, 1.06, 1] }
              }
              transition={reduceMotion ? {} : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="relative inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                <Sparkles className="h-8 w-8 text-primary-foreground" />
              </span>
            </motion.div>

            <h1 className="mb-4 text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
              Experience Gallery
            </h1>
            <p className="mx-auto mb-6 max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Discover every angle, feature, and capability through immersive experiences
            </p>
            {experiences?.length ? (
              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                  <span className="font-medium" aria-live="polite">
                    {experiences.length} {experiences.length === 1 ? "Experience" : "Experiences"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                  <span className="font-medium">Interactive Tours</span>
                </div>
              </div>
            ) : null}
          </motion.div>
        </div>
      </div>

      {/* Filters */}
      <FilterBar
        filters={filters}
        onFiltersChange={setFilters}
        viewPrefs={viewPrefs}
        onViewPrefsChange={setViewPrefs}
        categories={facets.cats}
        types={facets.types}
        totalResults={filtered.length}
      />

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {hasResults ? (
          <>
            {/* Grid view */}
            {viewPrefs.layout === "grid" && (
              <div
                className={cn(
                  "grid gap-4 sm:gap-6",
                  viewPrefs.cardSize === "small" && "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
                  viewPrefs.cardSize === "medium" && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
                  viewPrefs.cardSize === "large" && "grid-cols-1 md:grid-cols-2"
                )}
              >
                {filtered.map((exp) => (
                  <ExperienceCard key={exp.id} exp={exp} onOpen={open} size={viewPrefs.cardSize} />
                ))}
              </div>
            )}

            {/* Carousel (horizontal scroll with snap) */}
            {viewPrefs.layout === "carousel" && (
              <div className="-mx-4 overflow-x-auto px-4">
                <div className="flex snap-x snap-mandatory gap-4 pb-2">
                  {filtered.map((exp) => (
                    <div key={exp.id} className="snap-start shrink-0 basis-80 sm:basis-96">
                      <ExperienceCard exp={exp} onOpen={open} size={viewPrefs.cardSize} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <motion.div
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-10 text-center"
            >
              <p className="text-muted-foreground" aria-live="polite">
                Showing {filtered.length} {filtered.length === 1 ? "experience" : "experiences"}
              </p>
            </motion.div>
          </>
        ) : (
          <div
            role="status"
            className="mx-auto mt-6 flex max-w-2xl flex-col items-center justify-center rounded-2xl border border-dashed p-10 text-center"
          >
            <div className="mb-2 text-xl font-semibold">No results</div>
            <p className="mb-4 max-w-prose text-muted-foreground">
              Try adjusting filters or clearing the search. You can also explore all categories in the grid view.
            </p>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-xl border px-4 py-2 text-sm hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
        experience={selected}
        onPrev={canNavigate ? openPrev : undefined}
        onNext={canNavigate ? openNext : undefined}
        onAskToyota={onAskToyota}
        rtl={rtl}
      />
    </section>
  );
};

export default EnhancedVehicleGallery;
