import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Search, ChevronLeft, ChevronRight, RotateCcw, Car } from "lucide-react";
import { EnhancedSceneData } from "@/types/gallery";
import { ENHANCED_GALLERY_DATA } from "@/data/enhanced-gallery-data";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

/**
 * Toyota Experience Gallery — DISTINCT UI
 * - Hero: bold Toyota stripe + headline
 * - Cards: 1:1 tiles with red accent rule and large labels
 * - Mobile overlay: bottom sheet (rounded top) with swipe + independent scroll
 * - Desktop overlay: centered split pane (media left, details right)
 * - Stronger image fallback; optional hotspots
 * - One sticky CTA
 */

const TOYOTA_RED = "#EB0A1E";

/* ----------------- Inline Hotspots (optional) ------------------ */
type Hotspot = { x: number; y: number; title: string; description?: string; media?: string };
function HotspotLayer({ hotspots }: { hotspots?: Hotspot[] }) {
  const [open, setOpen] = useState<number | null>(null);
  if (!hotspots?.length) return null;
  return (
    <div className="pointer-events-none absolute inset-0">
      {hotspots.map((h, i) => (
        <div key={i} className="absolute" style={{ top: `${h.y}%`, left: `${h.x}%`, transform: "translate(-50%,-50%)" }}>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setOpen(open === i ? null : i); }}
            className="pointer-events-auto grid h-8 w-8 place-items-center rounded-full border bg-background/90 backdrop-blur shadow focus-visible:ring-2 focus-visible:ring-primary"
            title={h.title}
          >
            <span className="relative block h-2 w-2 rounded-full bg-primary">
              <span className="absolute inset-0 -m-1 animate-ping rounded-full bg-primary/40" />
            </span>
          </button>
          <div className={cn(
            "pointer-events-auto mt-2 w-56 rounded-xl border bg-background/95 p-3 shadow-xl transition",
            open === i ? "opacity-100" : "opacity-0 pointer-events-none"
          )}>
            <div className="flex items-start gap-2">
              {h.media && <img src={h.media} alt="" className="h-10 w-10 rounded object-cover" />}
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{h.title}</div>
                {h.description && <p className="mt-0.5 line-clamp-3 text-xs text-muted-foreground">{h.description}</p>}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ----------------- Types & helpers ------------------ */
type SortKey = "featured" | "alphabetical";
interface FilterOptions { categories: string[]; searchTerm: string; sortBy: SortKey; }
interface ViewPreferences { layout: "grid" | "carousel"; }
interface EnhancedVehicleGalleryProps {
  experiences?: EnhancedSceneData[];
  locale?: "en" | "ar";
  rtl?: boolean;
  onAskToyota?: (scene: EnhancedSceneData) => void;
}

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

/* ----------------- a11y focus trap ------------------ */
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
      if (e.shiftKey) { if (active === first || !node.contains(active)) { last.focus(); e.preventDefault(); } }
      else { if (active === last) { first.focus(); e.preventDefault(); } }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [enabled, ref]);
}

/* ----------------- primitives ------------------ */
function SafeImage({ src, alt, className, contain = false }: { src?: string; alt: string; className?: string; contain?: boolean }) {
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => { setOk(null); }, [src]);
  return (
    <div className={cn("relative bg-muted overflow-hidden", className)}>
      {src && (
        <img
          src={src}
          alt={alt}
          className={cn("h-full w-full transition-opacity duration-300", contain ? "object-contain" : "object-cover", ok ? "opacity-100" : "opacity-0")}
          onLoad={() => setOk(true)}
          onError={() => setOk(false)}
          draggable={false}
          loading="lazy"
        />
      )}
      {ok === null && <div className="absolute inset-0 animate-pulse bg-muted" />}
      {(ok === false || !src) && <div className="absolute inset-0 grid place-items-center text-xs text-muted-foreground">No image</div>}
    </div>
  );
}

/* ----------------- distinct FilterBar ------------------ */
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
    <div className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Red control rail */}
        <div className="h-1 w-full bg-[var(--toyota-red,#EB0A1E)]" />
        <div className="flex flex-col gap-2 py-3">
          <div className="flex items-center gap-2">
            <label className="relative flex-1" aria-label="Search experiences">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" size={16} />
              <input
                value={filters.searchTerm}
                onChange={(e) => update({ searchTerm: e.target.value })}
                placeholder="Search model, feature, scene…"
                className="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-[var(--toyota-red,#EB0A1E)] focus-visible:ring-2 focus-visible:ring-[var(--toyota-red,#EB0A1E)]"
              />
            </label>

            <div className="hidden items-center gap-1 sm:flex" role="group" aria-label="Layout">
              <button
                type="button"
                aria-pressed={view.layout === "carousel"}
                onClick={() => onViewChange((p) => ({ ...p, layout: "carousel" }))}
                className={cn("rounded-md border px-2.5 py-2 text-xs font-medium",
                  view.layout === "carousel" ? "border-[var(--toyota-red,#EB0A1E)] bg-[var(--toyota-red,#EB0A1E)]/10" : "hover:bg-accent")}
              >
                Carousel
              </button>
              <button
                type="button"
                aria-pressed={view.layout === "grid"}
                onClick={() => onViewChange((p) => ({ ...p, layout: "grid" }))}
                className={cn("rounded-md border px-2.5 py-2 text-xs font-medium",
                  view.layout === "grid" ? "border-[var(--toyota-red,#EB0A1E)] bg-[var(--toyota-red,#EB0A1E)]/10" : "hover:bg-accent")}
              >
                Grid
              </button>
            </div>

            <button
              type="button"
              className="ml-auto inline-flex items-center gap-1 rounded-md border px-2.5 py-2 text-xs font-medium hover:bg-accent"
              onClick={() => onFiltersChange(DEFAULT_FILTERS)}
            >
              <RotateCcw size={16} /> Reset
            </button>
          </div>

          {/* Toyota chips */}
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
                    className={cn(
                      "snap-start rounded-full border px-3 py-1 text-xs",
                      active ? "border-[var(--toyota-red,#EB0A1E)] bg-[var(--toyota-red,#EB0A1E)]/10" : "hover:bg-accent"
                    )}
                  >
                    {c}
                  </button>
                );
              })}
              <span className="ml-auto shrink-0 text-xs text-muted-foreground">{total} {total === 1 ? "result" : "results"}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ----------------- Card: SQUARE + red accent ------------------ */
function ExperienceCard({ exp, onOpen }: { exp: EnhancedSceneData; onOpen: (e: EnhancedSceneData) => void }) {
  const cover = pickCover(exp);
  return (
    <article className="group relative overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm hover:shadow-md focus-within:shadow-md">
      <button type="button" onClick={() => onOpen(exp)} className="block w-full text-left">
        <div className="relative">
          <SafeImage src={cover} alt={exp?.title ?? "Experience"} className="aspect-square w-full" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="pointer-events-none absolute left-0 top-0 h-full w-1.5 bg-[var(--toyota-red,#EB0A1E)]" />
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="line-clamp-1 text-lg font-bold text-white tracking-tight">{exp.title}</h3>
            {exp.scene && <p className="mt-0.5 line-clamp-1 text-xs text-white/80">{exp.scene}</p>}
          </div>
        </div>
        <div className="p-3">
          {exp.description && <p className="line-clamp-2 text-sm text-muted-foreground">{exp.description}</p>}
          {exp.featured && (
            <span className="mt-2 inline-block rounded-full bg-[var(--toyota-red,#EB0A1E)]/10 px-2 py-0.5 text-[11px] font-medium text-[var(--toyota-red,#EB0A1E)]">
              Featured
            </span>
          )}
        </div>
      </button>
    </article>
  );
}

/* ----------------- Overlay (MOBILE BOTTOM SHEET / DESKTOP DIALOG) — PREMIUM ------------------ */
function ExpandedOverlay({
  open, onClose, exp, onPrev, onNext, onTestDrive, rtl,
}: {
  open: boolean;
  onClose: () => void;
  exp: EnhancedSceneData | null;
  onPrev?: () => void;
  onNext?: () => void;
  onTestDrive?: (exp: EnhancedSceneData) => void;
  rtl?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const sheetRef = useRef<HTMLDivElement>(null);
  useFocusTrap(open, sheetRef);

  const [activeIdx, setActiveIdx] = useState(0);
  const mediaRef = useRef<HTMLDivElement>(null);

  // simple desktop check
  const isDesktop = typeof window !== "undefined" ? window.matchMedia("(min-width: 640px)").matches : true;

  // lock body + keyboard nav
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === (rtl ? "ArrowLeft" : "ArrowRight")) { onNext?.(); setActiveIdx(0); }
      if (e.key === (rtl ? "ArrowRight" : "ArrowLeft")) { onPrev?.(); setActiveIdx(0); }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, onClose, onNext, onPrev, rtl]);

  // swipe between *experiences* on the media pane
  useEffect(() => {
    const el = mediaRef.current;
    if (!el) return;
    let startX = 0, dx = 0;
    const start = (e: TouchEvent) => { startX = e.touches[0].clientX; dx = 0; };
    const move  = (e: TouchEvent) => { dx = e.touches[0].clientX - startX; };
    const end   = () => { if (Math.abs(dx) > 50) { dx < 0 ? onNext?.() : onPrev?.(); setActiveIdx(0); } };
    el.addEventListener("touchstart", start, { passive: true });
    el.addEventListener("touchmove", move, { passive: true });
    el.addEventListener("touchend", end);
    return () => { el.removeEventListener("touchstart", start); el.removeEventListener("touchmove", move); el.removeEventListener("touchend", end); };
  }, [onNext, onPrev]);

  if (!open || !exp) return null;

  const images = getGallery(exp);
  const hotspots = (exp as any)?.hotspots as Array<{ x:number; y:number; title:string; description?:string; media?:string }> | undefined;

  // ---------- Desktop dialog (split) ----------
  const DesktopDialog = (
    <motion.div
      role="dialog"
      aria-modal="true"
      ref={sheetRef}
      className="absolute inset-0 m-auto flex h-[92vh] w-full max-w-[1100px] overflow-hidden rounded-2xl border bg-background shadow-2xl"
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.18 }}
    >
      {/* LEFT: MEDIA — full-bleed cover with premium canvas */}
      <div
        ref={mediaRef}
        className="relative flex-1"
        style={{
          background:
            "radial-gradient(140% 120% at 50% 45%, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.88) 40%, rgba(0,0,0,0.82) 60%, rgba(0,0,0,0.78) 100%)",
        }}
      >
        {/* Experience nav */}
        {onPrev && (
          <button
            type="button"
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border bg-background/80 p-2 backdrop-blur hover:bg-background focus-visible:ring-2 focus-visible:ring-[var(--toyota-red,#EB0A1E)]"
            onClick={() => { onPrev(); setActiveIdx(0); }}
            aria-label="Previous experience"
          >
            <ChevronLeft />
          </button>
        )}
        {onNext && (
          <button
            type="button"
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border bg-background/80 p-2 backdrop-blur hover:bg-background focus-visible:ring-2 focus-visible:ring-[var(--toyota-red,#EB0A1E)]"
            onClick={() => { onNext(); setActiveIdx(0); }}
            aria-label="Next experience"
          >
            <ChevronRight />
          </button>
        )}

        {/* MEDIA: absolute cover (fills column), subtle vignettes */}
        <div className="absolute inset-0 flex items-center justify-center">
  <div className="relative aspect-square w-full max-w-[600px]">
    <img
      src={images[activeIdx]}
      alt={exp.title}
      className="h-full w-full object-cover rounded-xl shadow-lg"
      draggable={false}
      loading="lazy"
    />
    {/* Hotspots overlay */}
    {hotspots?.length ? <HotspotLayer hotspots={hotspots} /> : null}
  </div>
</div>

        {/* Thumbnail rail */}
        {images.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0">
            <div className="no-scrollbar flex gap-2 overflow-x-auto p-3">
              {images.map((src, idx) => (
                <button
                  key={src + idx}
                  onClick={() => setActiveIdx(idx)}
                  aria-label={`Preview image ${idx + 1}`}
                  className={cn(
                    "h-16 w-28 shrink-0 overflow-hidden rounded border",
                    idx === activeIdx ? "border-[var(--toyota-red,#EB0A1E)]" : "border-white/25"
                  )}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT: INFO */}
      <div className="flex w-[360px] min-w-[320px] flex-col bg-background">
        <div className="flex items-center justify-between gap-2 border-b p-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold">{exp.title}</h3>
            {exp.scene && <p className="truncate text-xs text-muted-foreground">{exp.scene}</p>}
          </div>
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-accent"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-auto p-4">
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
              {(exp as any).specs.slice(0, 8).map((s: string, i: number) => <li key={i}>{s}</li>)}
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
        </div>

        <div className="border-t p-3">
          <div className="flex justify-end gap-2">
            <button className="rounded-lg border px-3 py-2 text-sm hover:bg-accent" onClick={onClose}>Close</button>
            <a
              href={(exp as any).testDriveUrl || "#"}
              target={((exp as any).testDriveUrl && "_blank") || undefined}
              rel={((exp as any).testDriveUrl && "noreferrer") || undefined}
              onClick={(e) => { if (!(exp as any).testDriveUrl && onTestDrive) { e.preventDefault(); onTestDrive(exp); } }}
              className="rounded-lg border border-[var(--toyota-red,#EB0A1E)] bg-[var(--toyota-red,#EB0A1E)] px-4 py-2 text-sm font-medium text-white hover:brightness-95"
            >
              <Car className="mr-2 inline h-4 w-4" /> Book a Test Drive
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // ---------- Mobile bottom sheet ----------
  const MobileSheet = (
    <motion.div
      role="dialog"
      aria-modal="true"
      ref={sheetRef}
      className="absolute inset-x-0 bottom-0 mx-auto flex h-[90vh] w-full max-w-none flex-col overflow-hidden rounded-t-3xl border bg-background shadow-2xl"
      initial={reduceMotion ? { y: 0, opacity: 1 } : { y: "100%", opacity: 1 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 1 }}
      transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
    >
      <div className="relative border-b p-3">
        <div className="absolute left-1/2 top-1 h-1.5 w-12 -translate-x-1/2 rounded-full bg-foreground/20" />
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold">{exp.title}</h3>
            {exp.scene && <p className="truncate text-xs text-muted-foreground">{exp.scene}</p>}
          </div>
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-accent" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
      </div>

      {/* Media area with cover */}
      <div
        ref={mediaRef}
        className="relative flex-1"
        style={{
          background:
            "radial-gradient(140% 120% at 50% 45%, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.88) 40%, rgba(0,0,0,0.82) 60%, rgba(0,0,0,0.78) 100%)",
        }}
      >
        <img
          src={images[activeIdx]}
          alt={exp.title}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
          loading="lazy"
        />
        {hotspots?.length ? <HotspotLayer hotspots={hotspots} /> : null}
        {images.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0">
            <div className="no-scrollbar flex gap-2 overflow-x-auto p-3">
              {images.map((src, idx) => (
                <button
                  key={src + idx}
                  onClick={() => setActiveIdx(idx)}
                  aria-label={`Preview image ${idx + 1}`}
                  className={cn(
                    "h-14 w-24 shrink-0 overflow-hidden rounded border",
                    idx === activeIdx ? "border-[var(--toyota-red,#EB0A1E)]" : "border-white/25"
                  )}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Info + CTA */}
      <div className="max-h-[36vh] min-h-[24vh] overflow-auto border-t p-4">
        {exp.description && <p className="text-sm leading-relaxed text-muted-foreground">{exp.description}</p>}
        {exp.tags?.length ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {exp.tags.map((t: string) => <span key={t} className="rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground">{t}</span>)}
          </div>
        ) : null}

        <div className="mt-4 flex justify-end gap-2">
          <button className="rounded-lg border px-3 py-2 text-sm hover:bg-accent" onClick={onClose}>Close</button>
          <a
            href={(exp as any).testDriveUrl || "#"}
            target={((exp as any).testDriveUrl && "_blank") || undefined}
            rel={((exp as any).testDriveUrl && "noreferrer") || undefined}
            onClick={(e) => { if (!(exp as any).testDriveUrl && onTestDrive) { e.preventDefault(); onTestDrive(exp); } }}
            className="rounded-lg border border-[var(--toyota-red,#EB0A1E)] bg-[var(--toyota-red,#EB0A1E)] px-4 py-2 text-sm font-medium text-white hover:brightness-95"
          >
            <Car className="mr-2 inline h-4 w-4" /> Book a Test Drive
          </a>
        </div>
      </div>
    </motion.div>
  );

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className="absolute inset-0 bg-black/80" onClick={onClose} aria-hidden="true" />
        {isDesktop ? DesktopDialog : MobileSheet}
      </motion.div>
    </AnimatePresence>
  );
}
/* ----------------- Main ------------------ */
const EnhancedVehicleGallery: React.FC<EnhancedVehicleGalleryProps> = ({
  experiences = ENHANCED_GALLERY_DATA,
  locale = "en",
  rtl = false,
  onAskToyota,
}) => {
  const isMobile = useIsMobile();
  const reduceMotion = useReducedMotion();

  const [filters, setFilters] = useState<FilterOptions>({ categories: [], searchTerm: "", sortBy: "featured" });
  const [view, setView] = useState<ViewPreferences>({ layout: "carousel" });
  const [selected, setSelected] = useState<EnhancedSceneData | null>(null);
  const [expanded, setExpanded] = useState(false);

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
      className="relative w-full bg-background"
      dir={rtl ? "rtl" : "ltr"}
      lang={locale}
      style={{ ["--toyota-red" as any]: TOYOTA_RED }}
      aria-label="Experience Gallery"
    >
      {/* HERO — bold stripe + headline */}
      <div className="border-b bg-gradient-to-b from-background to-muted/20">
        <div className="h-1 w-full bg-[var(--toyota-red,#EB0A1E)]" />
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <motion.h1
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl"
          >
            Toyota Experience Gallery
          </motion.h1>
          {experiences?.length ? (
            <p className="mt-2 text-center text-sm text-muted-foreground">
              {experiences.length} {experiences.length === 1 ? "experience" : "experiences"}
            </p>
          ) : null}
        </div>
      </div>

      {/* FILTERS */}
      <FilterBar
        filters={filters}
        onFiltersChange={setFilters}
        categories={categories}
        total={list.length}
        view={view}
        onViewChange={setView}
      />

      {/* CONTENT */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {has ? (
          <>
            {/* Mobile carousel */}
            {view.layout === "carousel" && (
              <>
                <div className="-mx-4 overflow-x-auto px-4">
                  <div className="no-scrollbar flex snap-x snap-mandatory gap-4 pb-2">
                    {list.map((exp) => (
                      <div key={exp.id} className="snap-start shrink-0 basis-[86%] sm:basis-[58%] md:basis-[44%]">
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

            {/* Desktop grid */}
            {view.layout === "grid" && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                {list.map((exp) => (
                  <ExperienceCard key={exp.id} exp={exp} onOpen={open} />
                ))}
              </div>
            )}

            <motion.div initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 text-center">
              <p className="text-muted-foreground">Showing {list.length} {list.length === 1 ? "experience" : "experiences"}</p>
            </motion.div>
          </>
        ) : (
          <div className="mx-auto mt-6 flex max-w-2xl flex-col items-center justify-center rounded-2xl border border-dashed p-10 text-center">
            <div className="mb-2 text-xl font-semibold">No results</div>
            <p className="mb-4 max-w-prose text-muted-foreground">Try clearing the search or deselecting categories.</p>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-md border px-4 py-2 text-sm hover:bg-accent"
              onClick={() => setFilters(DEFAULT_FILTERS)}
            >
              <RotateCcw size={16} /> Reset filters
            </button>
          </div>
        )}
      </div>

      {/* OVERLAY */}
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
