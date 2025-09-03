import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search, X, ChevronLeft, ChevronRight, Download, Car, Sparkles, Command } from "lucide-react";
import { EnhancedSceneData } from "@/types/gallery";
import { ENHANCED_GALLERY_DATA } from "@/data/enhanced-gallery-data";
import { cn } from "@/lib/utils";

/**
 * TOYOTA // HOLO-GALLERY
 * A cinematic, out-of-the-box gallery for automotive experiences.
 * - Hero Filmrail + Holo-Pulse accent
 * - Flow Grid (masonry via CSS columns)
 * - Command Palette (⌘/Ctrl+K) for instant search + tag toggles
 * - Deck Overlay: full-bleed, glass HUD, thumb rail, hotspots
 * - Dual CTAs everywhere: Download Brochure + Book Test Drive
 */

const TOKYO_RED = "#EB0A1E";

/** ---- utils (covers + gallery) ---- */
const coverOf = (e: any): string | undefined => {
  const m: any = e?.media;
  return (
    m?.primaryImage ||
    e?.coverImage ||
    e?.thumbnail ||
    e?.image ||
    m?.hero ||
    (Array.isArray(m?.gallery) ? m.gallery[0] : undefined) ||
    (Array.isArray(m?.images) ? m.images[0] : undefined) ||
    undefined
  );
};
const galleryOf = (e: any): string[] => {
  const m: any = e?.media ?? {};
  const arr = (Array.isArray(m.gallery) && m.gallery) || (Array.isArray(m.images) && m.images) || [];
  const c = coverOf(e);
  return Array.from(new Set([c, ...arr].filter(Boolean) as string[]));
};
const uniq = (arr: (string | undefined | null)[]) =>
  Array.from(new Set(arr.filter(Boolean) as string[])).sort((a, b) => a.localeCompare(b));

/** ---- primitives ---- */
function SafeImg({ src, alt, className, contain=false }: { src?: string; alt: string; className?: string; contain?: boolean }) {
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => { setOk(null); }, [src]);
  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
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

/** ---- Command Palette (K) ---- */
function useCommandPalette<T extends { title?: string; scene?: string; tags?: string[] }>(
  list: T[],
  onPick: (item: T) => void
) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const combo = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k";
      if (combo) { e.preventDefault(); setOpen((v) => !v); }
      if (open && e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const tags = useMemo(() => uniq(list.flatMap((i) => i.tags ?? [])), [list]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return list.filter((i) => {
      const qMatch = !q || i.title?.toLowerCase().includes(q) || i.scene?.toLowerCase().includes(q) || (i.tags ?? []).some(t => t.toLowerCase().includes(q));
      const tagMatch = !tag || (i.tags ?? []).includes(tag);
      return qMatch && tagMatch;
    });
  }, [list, query, tag]);

  const palette = (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[70]" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} aria-hidden />
          <motion.div
            className="absolute left-1/2 top-24 w-[min(780px,92vw)] -translate-x-1/2 overflow-hidden rounded-2xl border bg-background/95 backdrop-blur shadow-2xl"
            initial={{y:-8, opacity:0}} animate={{y:0, opacity:1}} exit={{y:-8, opacity:0}} transition={{duration:0.18}}
            role="dialog" aria-modal="true"
          >
            <div className="flex items-center gap-2 border-b px-3 py-2">
              <Command size={16} />
              <input
                autoFocus
                value={query}
                onChange={(e)=>setQuery(e.target.value)}
                placeholder="Search experiences, features, tags…"
                className="w-full bg-transparent py-2 text-sm outline-none"
              />
              <kbd className="rounded border px-1.5 py-0.5 text-[10px] text-muted-foreground">Esc</kbd>
            </div>
            <div className="flex gap-3 p-3">
              <div className="hidden w-48 shrink-0 flex-col gap-1 sm:flex">
                <div className="text-xs font-medium text-muted-foreground mb-1">Tags</div>
                <button
                  onClick={()=>setTag(null)}
                  className={cn("rounded-md px-2 py-1 text-xs text-left", tag===null ? "bg-[var(--toyota,#EB0A1E)]/10 border border-[var(--toyota,#EB0A1E)]" : "border hover:bg-accent")}
                >
                  All
                </button>
                <div className="no-scrollbar mt-1 grid max-h-48 gap-1 overflow-auto pr-1">
                  {tags.map(t=>(
                    <button key={t} onClick={()=>setTag(t)} className={cn("rounded-md border px-2 py-1 text-xs text-left", tag===t && "bg-[var(--toyota,#EB0A1E)]/10 border-[var(--toyota,#EB0A1E)]")}>{t}</button>
                  ))}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <ul className="max-h-[48vh] overflow-auto divide-y">
                  {filtered.map((i, idx)=>(
                    <li key={idx}>
                      <button
                        onClick={()=>{ onPick(i); setOpen(false); }}
                        className="group flex w-full items-center gap-3 px-2 py-2 text-left hover:bg-accent"
                      >
                        <div className="h-12 w-16 overflow-hidden rounded border">
                          <SafeImg src={coverOf(i)} alt={i.title ?? "experience"} />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">{i.title}</div>
                          <div className="truncate text-xs text-muted-foreground">{i.scene}</div>
                        </div>
                        {i.tags?.length ? (
                          <div className="ml-auto hidden gap-1 sm:flex">
                            {i.tags.slice(0,3).map(t=>(
                              <span key={t} className="rounded-full border px-2 py-0.5 text-[10px] text-muted-foreground">{t}</span>
                            ))}
                          </div>
                        ):null}
                      </button>
                    </li>
                  ))}
                  {filtered.length===0 && <li className="px-2 py-6 text-center text-sm text-muted-foreground">No matches</li>}
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return { palette, open: () => setOpen(true) };
}

/** ---- HOLO-PULSE rail ---- */
function HoloPulse() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-px h-1 overflow-hidden">
      <div className="animate-[pulseSlide_2.6s_linear_infinite] h-full w-[200%] bg-gradient-to-r from-transparent via-[var(--toyota,#EB0A1E)] to-transparent opacity-70 [mask-image:linear-gradient(to_right,transparent,black,transparent)]" />
      <style>{`@keyframes pulseSlide{0%{transform:translateX(-50%)}100%{transform:translateX(0)}}`}</style>
    </div>
  );
}

/** ---- Flow Card (hover quick-view) ---- */
function FlowCard({ item, onOpen }: { item: EnhancedSceneData; onOpen: (i: EnhancedSceneData)=>void }) {
  const c = coverOf(item);
  return (
    <article className="group relative mb-4 break-inside-avoid overflow-hidden rounded-3xl border bg-card text-card-foreground shadow-sm transition hover:shadow-lg">
      <button type="button" onClick={()=>onOpen(item)} className="block w-full text-left">
        <div className="relative">
          <SafeImg src={c} alt={item.title} className="h-[48vw] max-h-[340px] w-full sm:h-[34vw] sm:max-h-[300px]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="pointer-events-none absolute left-0 top-0 w-1.5 h-full bg-[var(--toyota,#EB0A1E)]" />
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="line-clamp-1 text-lg font-semibold tracking-tight text-white">{item.title}</h3>
            {item.scene && <p className="mt-0.5 line-clamp-1 text-xs text-white/80">{item.scene}</p>}
          </div>
        </div>
        <div className="p-3">
          {item.description && <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>}
          <div className="mt-3 flex gap-2">
            <a
              href={(item as any).brochureUrl || "#"}
              onClick={(e)=>{ if(!(item as any).brochureUrl) e.preventDefault(); }}
              target={((item as any).brochureUrl && "_blank") || undefined}
              rel={((item as any).brochureUrl && "noreferrer") || undefined}
              className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs hover:bg-accent"
            >
              <Download size={14}/> Brochure
            </a>
            <a
              href={(item as any).testDriveUrl || "#"}
              onClick={(e)=>{ if(!(item as any).testDriveUrl) e.preventDefault(); }}
              target={((item as any).testDriveUrl && "_blank") || undefined}
              rel={((item as any).testDriveUrl && "noreferrer") || undefined}
              className="inline-flex items-center gap-1 rounded-full border border-[var(--toyota,#EB0A1E)] bg-[var(--toyota,#EB0A1E)] px-3 py-1 text-xs font-medium text-white hover:brightness-95"
            >
              <Car size={14}/> Test Drive
            </a>
          </div>
        </div>
      </button>
      {/* Quick-view hover */}
      <div className="pointer-events-none absolute inset-0 hidden items-end justify-end p-3 md:flex">
        <div className="translate-y-2 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
          <div className="rounded-2xl border bg-background/90 px-3 py-2 text-xs backdrop-blur shadow-lg">
            <div className="flex items-center gap-1.5 text-muted-foreground"><Sparkles size={14}/> Quick View</div>
          </div>
        </div>
      </div>
    </article>
  );
}

/** ---- Deck Overlay ---- */
function Deck({
  item, open, onClose, onPrev, onNext,
}: {
  item: EnhancedSceneData | null;
  open: boolean;
  onClose: ()=>void;
  onPrev?: ()=>void;
  onNext?: ()=>void;
}) {
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const images = item ? galleryOf(item) : [];
  useEffect(()=>setIdx(0), [item]);

  // Keyboard
  useEffect(()=>{
    if(!open) return;
    const onKey = (e: KeyboardEvent) => {
      if(e.key === "Escape") onClose();
      if(e.key === "ArrowRight") onNext?.();
      if(e.key === "ArrowLeft") onPrev?.();
    };
    window.addEventListener("keydown", onKey);
    return ()=>window.removeEventListener("keydown", onKey);
  }, [open, onClose, onNext, onPrev]);

  if(!open || !item) return null;

  const hotspots = (item as any).hotspots as Array<{x:number;y:number;title:string;description?:string;media?:string}> | undefined;

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-[80]" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
        <div className="absolute inset-0 bg-black/85" onClick={onClose} aria-hidden />
        <motion.div
          className="absolute left-1/2 top-1/2 grid h-[92vh] w-[min(1160px,96vw)] -translate-x-1/2 -translate-y-1/2 grid-cols-1 overflow-hidden rounded-3xl border bg-background/95 backdrop-blur shadow-2xl md:grid-cols-[1fr_380px]"
          role="dialog" aria-modal
          initial={reduce ? {opacity:1} : {opacity:0, scale:0.98}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.98}} transition={{duration:0.18}}
          style={{ ["--toyota" as any]: TOKYO_RED }}
        >
          {/* Media */}
          <div className="relative">
            {/* prev/next experiences */}
            {onPrev && <button aria-label="Previous experience" onClick={onPrev} className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border bg-background/80 p-2 backdrop-blur hover:bg-background"><ChevronLeft/></button>}
            {onNext && <button aria-label="Next experience" onClick={onNext} className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border bg-background/80 p-2 backdrop-blur hover:bg-background"><ChevronRight/></button>}

            <div className="absolute inset-0 grid place-items-center">
              <div className="relative aspect-square w-[min(640px,86%)]">
                <img src={images[idx]} alt={item.title} className="h-full w-full rounded-xl object-cover shadow-xl" />
                {/* hotspots */}
                {hotspots?.length ? (
                  <div className="pointer-events-none absolute inset-0">
                    {hotspots.map((h, i)=>(
                      <div key={i} className="absolute" style={{ top:`${h.y}%`, left:`${h.x}%`, transform:"translate(-50%,-50%)"}}>
                        <div className="pointer-events-auto grid h-8 w-8 place-items-center rounded-full border bg-background/90 shadow backdrop-blur">
                          <div className="relative h-2 w-2 rounded-full bg-[var(--toyota)]">
                            <span className="absolute inset-0 -m-1 animate-ping rounded-full bg-[color:var(--toyota)]/40" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ):null}
              </div>
            </div>

            {/* thumbs */}
            {images.length>1 && (
              <div className="absolute bottom-0 left-0 right-0">
                <div className="no-scrollbar flex gap-2 overflow-x-auto p-3">
                  {images.map((s, i)=>(
                    <button key={s+i} onClick={()=>setIdx(i)} className={cn("h-16 w-28 shrink-0 overflow-hidden rounded border", i===idx ? "border-[var(--toyota)]" : "border-white/25")}>
                      <img src={s} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <HoloPulse/>
          </div>

          {/* HUD */}
          <div className="flex min-w-0 flex-col">
            <div className="flex items-start justify-between gap-2 border-b p-3">
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold">{item.title}</h3>
                {item.scene && <p className="truncate text-xs text-muted-foreground">{item.scene}</p>}
              </div>
              <button aria-label="Close" onClick={onClose} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-accent"><X size={18}/></button>
            </div>

            <div className="min-h-0 flex-1 overflow-auto p-4">
              {item.description && <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>}
              {item.tags?.length ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.tags.map((t)=> <span key={t} className="rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground">{t}</span>)}
                </div>
              ):null}

              {/* Specs (object or array) */}
              {"specs" in (item as any) && (item as any).specs && (
                Array.isArray((item as any).specs) ? (
                  <ul className="mt-4 grid list-disc gap-1 pl-5 text-sm text-muted-foreground">
                    {(item as any).specs.slice(0,8).map((s:string, i:number)=><li key={i}>{s}</li>)}
                  </ul>
                ) : (
                  <div className="mt-4 space-y-2">
                    {Object.entries((item as any).specs).slice(0,8).map(([k,v])=>(
                      <div key={k} className="flex justify-between gap-3 border-b py-2 text-sm">
                        <span className="text-muted-foreground">{k}</span>
                        <span className="font-medium">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>

            {/* Dual CTAs */}
            <div className="border-t p-3">
              <div className="flex flex-wrap justify-end gap-2">
                <a
                  href={(item as any).brochureUrl || "#"}
                  onClick={(e)=>{ if(!(item as any).brochureUrl) e.preventDefault(); }}
                  target={((item as any).brochureUrl && "_blank") || undefined}
                  rel={((item as any).brochureUrl && "noreferrer") || undefined}
                  className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-accent"
                >
                  <Download className="h-4 w-4"/> Download Brochure
                </a>
                <a
                  href={(item as any).testDriveUrl || "#"}
                  onClick={(e)=>{ if(!(item as any).testDriveUrl) e.preventDefault(); }}
                  target={((item as any).testDriveUrl && "_blank") || undefined}
                  rel={((item as any).testDriveUrl && "noreferrer") || undefined}
                  className="inline-flex items-center gap-2 rounded-lg border border-[var(--toyota,#EB0A1E)] bg-[var(--toyota,#EB0A1E)] px-4 py-2 text-sm font-medium text-white hover:brightness-95"
                >
                  <Car className="h-4 w-4"/> Book a Test Drive
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/** ---- Main Component ---- */
type GalleryProps = {
  experiences?: EnhancedSceneData[];
  title?: string;
  locale?: "en" | "ar";
  rtl?: boolean;
};

const ToyotaHoloGallery: React.FC<GalleryProps> = ({
  experiences = ENHANCED_GALLERY_DATA,
  title = "Toyota Experience Gallery",
  locale = "en",
  rtl = false,
}) => {
  const [selected, setSelected] = useState<EnhancedSceneData | null>(null);
  const [open, setOpen] = useState(false);

  const cats = useMemo(()=> uniq(experiences.map(e=>e.scene)), [experiences]);

  const { palette, open: openPalette } = useCommandPalette(experiences, (i)=>{ setSelected(i); setOpen(true); });

  const flow = useMemo(()=> experiences.slice().sort((a:any,b:any)=> Number(b.featured)-Number(a.featured)), [experiences]);

  const next = useCallback(()=>{
    if(!selected) return;
    const idx = flow.findIndex(x=>x.id===selected.id);
    if(idx<0) return;
    setSelected(flow[(idx+1)%flow.length]);
  }, [flow, selected]);

  const prev = useCallback(()=>{
    if(!selected) return;
    const idx = flow.findIndex(x=>x.id===selected.id);
    if(idx<0) return;
    setSelected(flow[(idx-1+flow.length)%flow.length]);
  }, [flow, selected]);

  return (
    <section
      className="relative w-full bg-gradient-to-b from-background to-muted/20"
      dir={rtl ? "rtl" : "ltr"} lang={locale}
      style={{ ["--toyota" as any]: TOKYO_RED }}
      aria-label="Toyota Holo Gallery"
    >
      {/* HERO FILM-RAIL */}
      <div className="relative overflow-hidden border-b">
        <HoloPulse/>
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="flex flex-col items-center gap-3">
            <motion.h1 initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.45}} className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              {title}
            </motion.h1>
            <p className="text-center text-sm text-muted-foreground">{experiences.length} {experiences.length===1 ? "experience" : "experiences"}</p>

            {/* Global CTAs */}
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
              <button onClick={openPalette} className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm hover:bg-accent">
                <Search className="h-4 w-4"/> Quick Find <kbd className="ml-1 rounded border px-1.5 py-0.5 text-[10px] text-muted-foreground">⌘/Ctrl K</kbd>
              </button>
              <a href={(experiences[0] as any)?.brochureUrl || "#"} onClick={(e)=>{ if(!(experiences[0] as any)?.brochureUrl) e.preventDefault(); }} target={((experiences[0] as any)?.brochureUrl && "_blank") || undefined} rel={((experiences[0] as any)?.brochureUrl && "noreferrer") || undefined} className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm hover:bg-accent">
                <Download className="h-4 w-4"/> Download Brochure
              </a>
              <a href={(experiences[0] as any)?.testDriveUrl || "#"} onClick={(e)=>{ if(!(experiences[0] as any)?.testDriveUrl) e.preventDefault(); }} target={((experiences[0] as any)?.testDriveUrl && "_blank") || undefined} rel={((experiences[0] as any)?.testDriveUrl && "noreferrer") || undefined} className="inline-flex items-center gap-2 rounded-full border border-[var(--toyota)] bg-[var(--toyota)] px-4 py-2 text-sm font-medium text-white hover:brightness-95">
                <Car className="h-4 w-4"/> Book a Test Drive
              </a>
            </div>
          </div>

          {/* Filmstrip */}
          <div className="no-scrollbar mt-6 -mx-4 overflow-x-auto px-4">
            <div className="flex snap-x snap-mandatory gap-3 pb-1">
              {flow.slice(0, 10).map((ex)=>(
                <button
                  key={ex.id}
                  onClick={()=>{ setSelected(ex); setOpen(true); }}
                  className="group snap-start shrink-0 rounded-2xl border bg-card hover:shadow-md"
                >
                  <div className="relative h-28 w-[220px] overflow-hidden rounded-2xl">
                    <SafeImg src={coverOf(ex)} alt={ex.title} />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                      <div className="truncate text-[11px] font-medium text-white/90">{ex.title}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORY CHIPS */}
      {cats.length>0 && (
        <div className="mx-auto max-w-7xl px-4 pb-1 pt-3 sm:px-6 lg:px-8">
          <div className="no-scrollbar -mx-1 flex items-center gap-2 overflow-x-auto px-1">
            {cats.map(c=> <span key={c} className="rounded-full border px-3 py-1 text-xs text-muted-foreground">{c}</span>)}
          </div>
        </div>
      )}

      {/* FLOW GRID (masonry) */}
      <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {flow.map((item)=>(
            <motion.div key={item.id} initial={{opacity:0, y:8}} whileInView={{opacity:1,y:0}} viewport={{once:true, amount:0.2}} transition={{duration:0.28}}>
              <FlowCard item={item} onOpen={(i)=>{ setSelected(i); setOpen(true); }} />
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center text-muted-foreground">
          Showing {flow.length} {flow.length===1 ? "experience" : "experiences"}
        </div>
      </div>

      {/* Overlays */}
      <Deck item={selected} open={open && !!selected} onClose={()=>{ setOpen(false); setSelected(null); }} onPrev={flow.length>1 ? prev : undefined} onNext={flow.length>1 ? next : undefined} />
      {palette}
    </section>
  );
};

export default ToyotaHoloGallery;
