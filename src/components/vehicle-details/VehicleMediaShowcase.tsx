// src/components/vehicle-details/VehicleMediaShowcase.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import type { VehicleModel } from "@/types/vehicle";

/* ================= Brand tokens ================= */
const TOK = {
  red: "#EB0A1E",
  ring: "focus:outline-none focus:ring-2 focus:ring-red-500",
  card: "bg-white shadow-sm border border-zinc-100",
  radius: "rounded-2xl",
  muted: "text-zinc-600",
  container: "mx-auto max-w-[1400px] px-4 md:px-6",
} as const;

const cx = (...a: Array<string | false | null | undefined>) => a.filter(Boolean).join(" ");

/* ================= Utilities ================= */
function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}

/* Focus trap inside a container */
function useFocusTrap(enabled: boolean, containerRef: React.RefObject<HTMLElement>, firstFocusRef?: React.RefObject<HTMLElement>, onRestore?: () => void) {
  useEffect(() => {
    if (!enabled) return;
    const container = containerRef.current;
    const prevFocused = document.activeElement as HTMLElement | null;

    // focus first
    firstFocusRef?.current?.focus?.();

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !container) return;
      const focusables = Array.from(
        container.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"));
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement;

      if (e.shiftKey) {
        if (active === first || !container.contains(active)) {
          last.focus();
          e.preventDefault();
        }
      } else {
        if (active === last || !container.contains(active)) {
          first.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
      onRestore?.();
      prevFocused?.focus?.();
    };
  }, [enabled, containerRef, firstFocusRef, onRestore]);
}

const ImageSafe: React.FC<
  React.ImgHTMLAttributes<HTMLImageElement> & { cover?: boolean }
> = ({ src, alt, className, cover, ...rest }) => {
  const [err, setErr] = useState(!src);
  if (!src || err) {
    return (
      <div className={cx("grid place-items-center bg-zinc-100 text-[11px] text-zinc-400", className)}>
        Image unavailable
      </div>
    );
  }
  return (
    <img
      {...rest}
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setErr(true)}
      className={cx(cover ? "object-cover" : "object-contain", "block", className)}
    />
  );
};

const WistiaEmbed: React.FC<{
  id: string;
  aspect?: number;
  autoPlay?: boolean;
  muted?: boolean;
  className?: string;
}> = ({ id, aspect = 16 / 9, autoPlay, muted, className }) => {
  const qs = new URLSearchParams({
    seo: "false",
    videoFoam: "true",
    autoplay: autoPlay ? "true" : "false",
    muted: muted ? "true" : "false",
    controlsVisibleOnLoad: "true",
  }).toString();

  return (
    <div className={cx("relative w-full overflow-hidden", className)} style={{ aspectRatio: String(aspect) }}>
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://fast.wistia.net/embed/iframe/${id}?${qs}`}
        title="Wistia video"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

/* ================= Types ================= */
type DetailBlock = { overview?: string; specs?: string[]; features?: string[]; tech?: string[] };
type Slide = { url: string; title: string; description?: string; details?: DetailBlock };

type Variant = "performance" | "safety" | "interior" | "quality" | "technology" | "handling";
type VariantStyle = { accent: string; slab: string; chip: string; bg?: string; border?: string };

type MediaItem = {
  id: "v6" | "interior" | "safety" | "handling" | "quality" | "connect";
  category: string;
  title: string;
  summary: string;
  kind: "image" | "video";
  thumbnail: string;
  gallery: Slide[];
  video?: { provider: "wistia" | "youtube"; id: string; autoplay?: boolean };
  badges?: string[];
  variant: Variant;
};

const VARIANT: Record<Variant, VariantStyle> = {
  performance: { accent: "text-red-600", slab: "bg-red-50/70", chip: "bg-red-100", bg: "bg-gradient-to-br from-red-50 to-white", border: "border-red-200" },
  safety:      { accent: "text-blue-700", slab: "bg-blue-50/70", chip: "bg-blue-100", bg: "bg-gradient-to-br from-blue-50 to-white", border: "border-blue-200" },
  interior:    { accent: "text-amber-700", slab: "bg-amber-50/70", chip: "bg-amber-100", bg: "bg-gradient-to-br from-amber-50 to-white", border: "border-amber-200" },
  quality:     { accent: "text-zinc-700", slab: "bg-zinc-50/70", chip: "bg-zinc-100", bg: "bg-gradient-to-br from-zinc-50 to-white", border: "border-zinc-200" },
  technology:  { accent: "text-cyan-700", slab: "bg-cyan-50/70", chip: "bg-cyan-100", bg: "bg-gradient-to-br from-cyan-50 to-white", border: "border-cyan-200" },
  handling:    { accent: "text-emerald-700", slab: "bg-emerald-50/70", chip: "bg-emerald-100", bg: "bg-gradient-to-br from-emerald-50 to-white", border: "border-emerald-200" },
};

/* ================= Demo media (DAM only) ================= */
// (unchanged) DEMO array omitted here for brevity in this snippet — keep yours as-is
//  ⟶ paste your DEMO array from your current file here.

const DEMO: MediaItem[] = [/* ... keep your same items ... */];

/* ================= Props ================= */
interface Props {
  vehicle: VehicleModel; // kept for compatibility
}

/* ================= Variant content ================= */
const SpecCard: React.FC<{ title: string; bullets?: string[]; accentClass?: string }> = ({
  title,
  bullets,
  accentClass,
}) => {
  if (!bullets || bullets.length === 0) {
    return (
      <div className={cx(TOK.card, "rounded-xl p-4 opacity-60")}>
        <h6 className="mb-1 font-semibold">{title}</h6>
        <p className="text-zinc-500">—</p>
      </div>
    );
  }
  return (
    <div className={cx(TOK.card, "rounded-xl p-4")}>
      <h6 className={cx("mb-2 font-semibold", accentClass)}>{title}</h6>
      <ul className="space-y-2 text-sm">
        {bullets.slice(0, 6).map((b, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full" style={{ background: TOK.red }} />
            <span className="text-zinc-700">{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

/* Distinctive variant renderers (unique UX/CX per type) */
function VariantPanel(v: Variant, slide: Slide | null, item: MediaItem) {
  const accent = VARIANT[v].accent;

  // small helper to render horizontal stat bars (performance)
  const StatBar: React.FC<{ label: string; val: number; max?: number }> = ({ label, val, max = 100 }) => (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium">{label}</span>
        <span className="text-zinc-500">{val}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-zinc-100">
        <div className="h-2 rounded-full" style={{ width: `${Math.min(100, Math.max(0, (val / max) * 100))}%`, background: TOK.red }} />
      </div>
    </div>
  );

  switch (v) {
    case "performance":
      return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-4">
            <SpecCard title="Specifications" bullets={slide?.details?.specs} accentClass={accent} />
            <div className={cx(TOK.card, "rounded-xl p-4")}>
              <h6 className={cx("mb-2 font-semibold", accent)}>Performance Snapshot</h6>
              <div className="space-y-3">
                <StatBar label="Acceleration" val={92} />
                <StatBar label="Response" val={88} />
                <StatBar label="Efficiency" val={72} />
              </div>
            </div>
          </div>
          <SpecCard title="Features" bullets={slide?.details?.features} accentClass={accent} />
          <SpecCard title="Technology" bullets={slide?.details?.tech} accentClass={accent} />
        </div>
      );
    case "safety":
      return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className={cx(TOK.card, "rounded-xl p-4")}>
            <h6 className={cx("mb-2 font-semibold", accent)}>Overview</h6>
            <p className={TOK.muted}>{slide?.details?.overview || item.summary}</p>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-xs">
              {(slide?.details?.specs || []).slice(0, 6).map((s, i) => (
                <li key={i} className="rounded-lg border border-blue-200 px-2 py-1">{s}</li>
              ))}
            </ul>
          </div>
          <div className={cx(TOK.card, "rounded-xl p-4")}>
            <h6 className={cx("mb-2 font-semibold", accent)}>Assist Highlights</h6>
            <ul className="space-y-2 text-sm">
              <li>Forward Collision Prevention</li>
              <li>Lane Trace Assist</li>
              <li>Adaptive Cruise Control</li>
              <li>Blind Spot Monitor</li>
            </ul>
          </div>
        </div>
      );
    case "interior":
      return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SpecCard title="Comfort" bullets={slide?.details?.features} accentClass={accent} />
          <div className={cx(TOK.card, "rounded-xl p-4")}>
            <h6 className={cx("mb-2 font-semibold", accent)}>Finishes & Tech</h6>
            <div className="grid grid-cols-5 gap-2">
              {["#111827","#374151","#9CA3AF","#D1D5DB","#F3F4F6"].map((c,i)=>(
                <div key={i} className="h-8 w-full rounded-lg border" style={{background:c}} />
              ))}
            </div>
            <ul className="mt-3 text-sm">
              {(slide?.details?.tech || []).slice(0,4).map((t,i)=>(<li key={i} className="list-disc list-inside">{t}</li>))}
            </ul>
          </div>
        </div>
      );
    case "quality":
      return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SpecCard title="Materials" bullets={slide?.details?.specs} accentClass={accent} />
          <SpecCard title="Process" bullets={slide?.details?.features} accentClass={accent} />
        </div>
      );
    case "technology":
      return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className={cx(TOK.card, "rounded-xl p-4")}>
            <h6 className={cx("mb-2 font-semibold", accent)}>Connectivity</h6>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              {(slide?.details?.specs || []).slice(0,6).map((s,i)=>(<li key={i} className="rounded-lg border border-cyan-200 px-2 py-1">{s}</li>))}
            </ul>
          </div>
          <SpecCard title="Cloud" bullets={slide?.details?.tech} accentClass={accent} />
        </div>
      );
    case "handling":
      return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <SpecCard title="Dynamics" bullets={slide?.details?.features} accentClass={accent} />
          <SpecCard title="Hardware" bullets={slide?.details?.specs} accentClass={accent} />
          <div className={cx(TOK.card, "rounded-xl p-4")}>
            <h6 className={cx("mb-2 font-semibold", accent)}>Drive Modes</h6>
            <div className="flex flex-wrap gap-2">
              {["Eco","Normal","Sport","Trail"].map((m)=>(
                <span key={m} className="rounded-full border border-emerald-200 px-3 py-1 text-xs">{m}</span>
              ))}
            </div>
          </div>
        </div>
      );
  }
}

/* ================= Component ================= */
const VehicleMediaShowcase: React.FC<Props> = () => {
  const items = useMemo(() => DEMO.slice(0, 6), []);
  const topWistiaId = "kvdhnonllm";

  /* Modal state */
  const [open, setOpen] = useState<MediaItem | null>(null);
  const [idx, setIdx] = useState(0);
  useBodyScrollLock(!!open);

  // Remember opener for focus restore
  const openerRef = useRef<HTMLElement | null>(null);

  const hasVideo = !!open?.video;
  const slides = open?.gallery ?? [];
  const visualIsVideo = hasVideo && idx === 0;
  const currSlide: Slide | null = !visualIsVideo ? slides[hasVideo ? idx - 1 : idx] : null;
  const total = (slides.length || 0) + (hasVideo ? 1 : 0) || 1;

  const next = useCallback(() => {
    if (!open) return;
    setIdx((p) => (p + 1) % total);
  }, [open, total]);
  const prev = useCallback(() => {
    if (!open) return;
    setIdx((p) => (p - 1 + total) % total);
  }, [open, total]);

  /* keyboard nav */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, next, prev]);

  /* touch swipe */
  const tStart = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => (tStart.current = e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (tStart.current == null) return;
    const dx = e.changedTouches[0].clientX - tStart.current;
    if (dx > 40) prev();
    if (dx < -40) next();
    tStart.current = null;
  };

  const openBooking = () => {
    try {
      window.dispatchEvent(new CustomEvent("open-booking", { detail: { source: "VehicleMediaShowcase" } }));
      (document.querySelector("[data-open-booking]") as HTMLButtonElement | null)?.click();
    } catch {}
  };

  const mobWrapRef = useRef<HTMLDivElement>(null);
  const [mobIndex, setMobIndex] = useState(0);
  useEffect(() => {
    const el = mobWrapRef.current;
    if (!el) return;
    const onScroll = () => {
      const w = (el.firstElementChild as HTMLElement | null)?.clientWidth || 1;
      const gap = 16;
      setMobIndex(Math.round(el.scrollLeft / (w + gap)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const thumbOf = (m: MediaItem) => m.thumbnail || m.gallery[0]?.url || "";

  /* ============== MODAL focus trap refs ============== */
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusRef = useRef<HTMLButtonElement>(null);
  useFocusTrap(!!open, modalRef, firstFocusRef, () => {
    openerRef.current?.focus?.();
  });

  /* ================= Render ================= */
  return (
    <section className={TOK.container}>
      {/* Video card — keep in normal flow (no forced z-index) */}
      <div className={cx(TOK.card, TOK.radius, "relative z-0 p-3 md:p-4 mb-10 md:mb-14")}>
        <div className="mb-3 flex items-center gap-3">
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-semibold">Video</span>
          <h2 className="text-2xl font-bold md:text-3xl">Highlights</h2>
        </div>
        <div className="md:max-h-[420px]">
          <WistiaEmbed id={topWistiaId} aspect={16 / 9} muted autoPlay className="overflow-hidden rounded-xl" />
        </div>
      </div>

      {/* Mobile: snap carousel */}
      <div className="mb-6 md:hidden">
        <div
          ref={mobWrapRef}
          className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {items.map((m) => (
            <button
              key={m.id}
              onClick={(e) => { openerRef.current = e.currentTarget; setOpen(m); setIdx(0); }}
              className={cx(TOK.card, TOK.radius, TOK.ring, "snap-start min-w-[86%] overflow-hidden text-left")}
            >
              <div className="relative">
                <ImageSafe src={thumbOf(m)} alt={m.title} cover className="h-44 w-full" />
                <div className="absolute left-0 top-0 h-1 rounded-tl-[16px]" style={{ background: TOK.red, width: 72 }} />
              </div>
              <div className="p-4">
                <div className="mb-1 flex items-center gap-2">
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs">{m.category}</span>
                  {m.badges?.slice(0, 2).map((b) => (
                    <span key={b} className="rounded-full border border-zinc-200 px-2 py-0.5 text-[11px]">
                      {b}
                    </span>
                  ))}
                </div>
                <h3 className="text-base font-semibold">{m.title}</h3>
                <p className={cx("mt-1 text-sm", TOK.muted)}>{m.summary}</p>
              </div>
            </button>
          ))}
        </div>
        <div className="mt-2 flex justify-center gap-2">
          {items.map((_, i) => (
            <span
              key={i}
              className={cx("h-1.5 w-1.5 rounded-full", i === mobIndex ? "" : "bg-zinc-300")}
              style={{ background: i === mobIndex ? TOK.red : undefined }}
            />
          ))}
        </div>
      </div>

      {/* Desktop grid */}
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
        {items.map((m) => (
          <button
            key={m.id}
            onClick={(e) => { openerRef.current = e.currentTarget; setOpen(m); setIdx(0); }}
            className={cx(TOK.card, TOK.radius, TOK.ring, "overflow-hidden text-left transition-shadow hover:shadow-md")}
          >
            <div className="relative">
              <ImageSafe src={thumbOf(m)} alt={m.title} cover className="h-56 w-full md:h-64" />
              <div className="absolute left-0 top-0 h-1 rounded-tl-[16px]" style={{ background: TOK.red, width: 82 }} />
            </div>
            <div className="p-4">
              <div className="mb-1 flex items-center gap-2">
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs">{m.category}</span>
                {m.badges?.slice(0, 3).map((b) => (
                  <span key={b} className="rounded-full border border-zinc-200 px-2 py-0.5 text-[11px]">
                    {b}
                  </span>
                ))}
              </div>
              <h3 className="text-lg font-semibold">{m.title}</h3>
              <p className={cx("mt-1 text-sm", TOK.muted)}>{m.summary}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Modal */}
      {open &&
        ReactDOM.createPortal(
          <div
            className="fixed inset-0 z-[1000] flex items-start md:items-center justify-center bg-black/70 backdrop-blur-sm p-0 md:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="media-modal-title"
            onClick={() => setOpen(null)}
          >
            <div
              ref={modalRef}
              className={cx(
                "bg-white w-full h-[100svh] md:h-[92vh] md:max-w-[1300px] md:rounded-2xl overflow-hidden",
                "flex flex-col pt-[env(safe-area-inset-top)]"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 z-10 border-b bg-white/95 px-3 py-3 backdrop-blur md:px-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h4 id="media-modal-title" className="truncate text-base font-bold md:text-2xl">{open.title}</h4>
                    <p className="text-xs text-zinc-500 md:text-sm">{open.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs md:text-sm">
                      {(() => {
                        const total = (open.gallery.length || 0) + (open.video ? 1 : 0) || 1;
                        return `${idx + 1}/${total}`;
                      })()}
                    </span>
                    <button
                      ref={firstFocusRef}
                      onClick={() => setOpen(null)}
                      className="rounded-full border px-3 py-2 hover:bg-zinc-50"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,56svh)_minmax(0,1fr)] md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:grid-rows-1">
                {/* Visual */}
                <div
                  className="relative select-none bg-black md:rounded-l-2xl"
                  onTouchStart={onTouchStart}
                  onTouchEnd={onTouchEnd}
                >
                  {hasVideo && idx === 0 ? (
                    open.video?.provider === "wistia" ? (
                      <WistiaEmbed id={open.video.id} autoPlay={open.video.autoplay} muted className="h-full w-full" />
                    ) : (
                      <div className="relative h-full w-full" style={{ aspectRatio: "16/9" }}>
                        <iframe
                          className="absolute inset-0 h-full w-full"
                          src={`https://www.youtube.com/embed/${open.video?.id}?rel=0&modestbranding=1&playsinline=1&autoplay=1&mute=1`}
                          title="Video"
                          allow="autoplay; encrypted-media; picture-in-picture"
                        />
                      </div>
                    )
                  ) : (
                    <ImageSafe
                      src={(currSlide?.url || open.thumbnail) as string}
                      alt={(currSlide?.title || open.title) as string}
                      cover
                      className="h-full w-full"
                    />
                  )}

                  {/* Thumbs (desktop) */}
                  <div className="absolute left-3 top-3 hidden max-h-[90%] flex-col gap-2 overflow-auto md:flex">
                    {hasVideo && (
                      <button
                        onClick={() => setIdx(0)}
                        className={cx(
                          "h-14 w-20 overflow-hidden rounded-md border bg-white text-xs font-medium",
                          idx === 0 && "ring-2 ring-red-500"
                        )}
                      >
                        Video
                      </button>
                    )}
                    {slides.map((s, i) => {
                      const real = hasVideo ? i + 1 : i;
                      return (
                        <button
                          key={s.url + i}
                          onClick={() => setIdx(real)}
                          className={cx("h-14 w-20 overflow-hidden rounded-md border", idx === real && "ring-2 ring-red-500")}
                        >
                          <ImageSafe src={s.url} alt={s.title} cover className="h-full w-full" />
                        </button>
                      );
                    })}
                  </div>

                  {/* Arrows & dots */}
                  {total > 1 && (
                    <>
                      <button
                        aria-label="Previous"
                        onClick={prev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white px-3 py-2 text-zinc-900 shadow"
                      >
                        ‹
                      </button>
                      <button
                        aria-label="Next"
                        onClick={next}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white px-3 py-2 text-zinc-900 shadow"
                      >
                        ›
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                        {Array.from({ length: total }).map((_, i) => (
                          <span
                            key={i}
                            className={cx("h-1.5 w-1.5 rounded-full", i === idx ? "" : "bg-white/50")}
                            style={{ background: i === idx ? TOK.red : undefined }}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {/* Mobile thumbs */}
                  <div className="absolute inset-x-0 bottom-0 flex gap-2 overflow-x-auto bg-gradient-to-t from-black/50 to-transparent px-3 py-2 md:hidden">
                    {hasVideo && (
                      <button
                        onClick={() => setIdx(0)}
                        className={cx(
                          "h-12 w-16 overflow-hidden rounded-md border bg-white text-[11px] font-medium",
                          idx === 0 && "ring-2 ring-red-500"
                        )}
                      >
                        Video
                      </button>
                    )}
                    {slides.map((s, i) => {
                      const real = hasVideo ? i + 1 : i;
                      return (
                        <button
                          key={s.url + i}
                          onClick={() => setIdx(real)}
                          className={cx("h-12 w-16 overflow-hidden rounded-md border", idx === real && "ring-2 ring-red-500")}
                        >
                          <ImageSafe src={s.url} alt={s.title} cover className="h-full w-full" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Content — variant specific with subtle backgrounds per variant */}
                <div className={cx("flex min-h-0 flex-col md:rounded-r-2xl", VARIANT[open.variant].bg)}>
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 p-4">
                    {open.badges?.slice(0, 5).map((b) => (
                      <span key={b} className={cx("rounded-full px-2 py-1 text-xs", VARIANT[open.variant].chip)}>
                        {b}
                      </span>
                    ))}
                  </div>

                  {/* Title slab */}
                  <div className={cx("mx-4 mb-4 rounded-xl border p-4", VARIANT[open.variant].slab, VARIANT[open.variant].border)}>
                    <h5 className={cx("mb-1 text-lg font-semibold", VARIANT[open.variant].accent)}>
                      {currSlide?.title || open.title}
                    </h5>
                    <p className={TOK.muted}>{currSlide?.description || open.summary}</p>
                  </div>

                  {/* Variant panel */}
                  <div className="px-4 pb-4 overflow-auto">{VariantPanel(open.variant, currSlide, open)}</div>

                  {/* Desktop-only prev/next (kept single location; no double CTA) */}
                  {total > 1 && (
                    <div className="hidden items-center justify-between border-t bg-white/80 p-4 backdrop-blur md:flex">
                      <div className="flex gap-3">
                        <button onClick={prev} className="rounded-full border px-4 py-2 hover:bg-zinc-50">
                          Previous
                        </button>
                        <button
                          onClick={next}
                          className="rounded-full px-4 py-2 text-white"
                          style={{ background: TOK.red }}
                        >
                          Next
                        </button>
                      </div>
                      <div />
                    </div>
                  )}
                </div>
              </div>

              {/* Fixed/Sticky footer (mobile & desktop) */}
              <div className="sticky bottom-0 z-20 border-t bg-white/95 px-3 py-3 backdrop-blur md:px-6">
                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={() => setOpen(null)}
                    className="rounded-full border px-4 py-2 hover:bg-zinc-50"
                  >
                    Close
                  </button>
                  <button
                    onClick={openBooking}
                    className="rounded-full px-4 py-2 font-semibold text-white"
                    style={{ background: TOK.red }}
                  >
                    Book Test Drive
                  </button>
                </div>
              </div>

              {/* Safe-area spacer for iOS */}
              <div className="h-[env(safe-area-inset-bottom)]" />
            </div>
          </div>,
          document.body
        )}
    </section>
  );
};

export default VehicleMediaShowcase;
