import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search, Command, Download, Car, X, ChevronLeft, ChevronRight, Split, Sparkles } from "lucide-react";
import { EnhancedSceneData } from "@/types/gallery";
import { ENHANCED_GALLERY_DATA } from "@/data/enhanced-gallery-data";
import { cn } from "@/lib/utils";

/* =======================
   Toyota Neural Showroom
   ======================= */

const TOYOTA_RED = "#EB0A1E";

/* ---------- helpers ---------- */
const coverOf = (e: any): string | undefined => {
  const m: any = e?.media;
  return m?.primaryImage || e?.coverImage || e?.thumbnail || e?.image || m?.hero ||
    (Array.isArray(m?.gallery) ? m.gallery[0] : undefined) ||
    (Array.isArray(m?.images) ? m.images[0] : undefined);
};
const galleryOf = (e: any): string[] => {
  const m: any = e?.media ?? {};
  const arr = (Array.isArray(m.gallery) && m.gallery) || (Array.isArray(m.images) && m.images) || [];
  const c = coverOf(e);
  return Array.from(new Set([c, ...arr].filter(Boolean) as string[]));
};
const uniq = (arr: (string | undefined | null)[]) =>
  Array.from(new Set(arr.filter(Boolean) as string[])).sort((a, b) => a.localeCompare(b));

/* ---------- primitives ---------- */
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

/* ---------- Command Palette ---------- */
function usePalette<T extends { title?: string; scene?: string; tags?: string[] }>(list: T[], onPick: (i:T)=>void) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen(v=>!v); }
      if (open && e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return list;
    return list.filter(i =>
      i.title?.toLowerCase().includes(s) ||
      i.scene?.toLowerCase().includes(s) ||
      (i.tags ?? []).some(t => t.toLowerCase().includes(s))
    );
  }, [list, q]);

  const ui = (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[80]" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
          <div className="absolute inset-0 bg-black/60" onClick={()=>setOpen(false)} aria-hidden />
          <motion.div
            className="absolute left-1/2 top-20 w-[min(780px,92vw)] -translate-x-1/2 overflow-hidden rounded-2xl border bg-background/95 backdrop-blur shadow-2xl"
            role="dialog" aria-modal
            initial={{y:-10, opacity:0}} animate={{y:0, opacity:1}} exit={{y:-10, opacity:0}} transition={{duration:0.18}}
          >
            <div className="flex items-center gap-2 border-b px-3 py-2">
              <Command size={16} />
              <input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Jump to model, scene, tag…" className="w-full bg-transparent py-2 text-sm outline-none" />
              <kbd className="rounded border px-1.5 py-0.5 text-[10px] text-muted-foreground">Esc</kbd>
            </div>
            <ul className="max-h-[50vh] overflow-auto divide-y">
              {filtered.map((i, idx)=>
                <li key={idx}>
                  <button onClick={()=>{ onPick(i); setOpen(false); }} className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-accent">
                    <div className="h-12 w-16 overflow-hidden rounded border"><SafeImg src={coverOf(i)} alt={i.title ?? "experience"} /></div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{i.title}</div>
                      <div className="truncate text-xs text-muted-foreground">{i.scene}</div>
                    </div>
                  </button>
                </li>
              )}
              {filtered.length===0 && <li className="px-3 py-6 text-center text-sm text-muted-foreground">No results</li>}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
  return { ui, open: () => setOpen(true) };
}

/* ---------- Compare Slider ---------- */
function CompareSlider({
  leftSrc, rightSrc, onClose, titleLeft, titleRight,
}: {
  leftSrc: string; rightSrc: string; titleLeft?: string; titleRight?: string; onClose: () => void;
}) {
  const [pos, setPos] = useState(50);
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    const el = wrapRef.current; if(!el) return;
    let down=false;
    const onDown=(e: MouseEvent)=>{ down=true; };
    const onUp=()=>{ down=false; };
    const onMove=(e: MouseEvent)=>{ if(!down) return; const rect = el.getBoundingClientRect(); const p = ((e.clientX-rect.left)/rect.width)*100; setPos(Math.min(100, Math.max(0, p))); };
    el.addEventListener("mousedown", onDown); window.addEventListener("mouseup", onUp); window.addEventListener("mousemove", onMove);
    return ()=>{ el.removeEventListener("mousedown", onDown); window.removeEventListener("mouseup", onUp); window.removeEventListener("mousemove", onMove); };
  }, []);

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-[90]" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
        <div className="absolute inset-0 bg-black/85" onClick={onClose} aria-hidden />
        <motion.div
          className="absolute left-1/2 top-1/2 grid h-[92vh] w-[min(1200px,96vw)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border bg-background/95 backdrop-blur shadow-2xl"
          role="dialog" aria-modal
          initial={reduce ? {opacity:1}:{opacity:0, scale:0.98}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.98}} transition={{duration:0.18}}
          style={{ ["--toyota" as any]: TOYOTA_RED }}
        >
          <div className="flex items-center justify-between border-b p-3">
            <div className="flex items-center gap-2 text-sm">
              <Split className="h-4 w-4 text-[var(--toyota)]" />
              <span className="font-medium">Compare</span>
            </div>
            <button aria-label="Close" onClick={onClose} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-accent"><X size={18}/></button>
          </div>

          <div ref={wrapRef} className="relative m-6 grid place-items-center rounded-2xl bg-black/80 p-3">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl">
              <img src={rightSrc} alt={titleRight ?? "Right"} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
                <img src={leftSrc} alt={titleLeft ?? "Left"} className="absolute inset-0 h-full w-full object-cover" />
              </div>
              <div className="absolute inset-y-0" style={{ left: `calc(${pos}% - 1px)`, width: 2, background: "white" }} />
              <div className="absolute inset-y-0" style={{ left: `calc(${pos}% - 16px)` }}>
                <div className="grid h-full w-8 place-items-center">
                  <div className="grid h-8 w-8 place-items-center rounded-full border bg-background/90 shadow">
                    <Split className="h-4 w-4" />
                  </div>
                </div>
              </div>

              {/* labels */}
              <div className="absolute left-3 top-3 rounded-full bg-background/80 px-2.5 py-1 text-[11px] backdrop-blur">{titleLeft ?? "Left"}</div>
              <div className="absolute right-3 top-3 rounded-full bg-background/80 px-2.5 py-1 text-[11px] backdrop-blur">{titleRight ?? "Right"}</div>
            </div>
          </div>

          {/* dual CTAs */}
          <div className="border-t p-3">
            <div className="flex justify-end gap-2">
              <a href="#" className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-accent"><Download className="h-4 w-4" /> Download Brochure</a>
              <a href="#" className="inline-flex items-center gap-2 rounded-lg border border-[var(--toyota)] bg-[var(--toyota)] px-4 py-2 text-sm font-medium text-white hover:brightness-95"><Car className="h-4 w-4" /> Book a Test Drive</a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ---------- Story Deck (sequence navigator) ---------- */
function StoryDeck({
  items, open, onClose, onChooseCompare,
}: {
  items: EnhancedSceneData[];
  open: boolean;
  onClose: () => void;
  onChooseCompare: (left: EnhancedSceneData, right: EnhancedSceneData) => void;
}) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  const curr = items[i];
  const nextI = () => setI((p)=> (p+1)%items.length);
  const prevI = () => setI((p)=> (p-1+items.length)%items.length);

  useEffect(()=>{
    if(!open) return;
    const onKey=(e:KeyboardEvent)=>{ if(e.key==="Escape") onClose(); if(e.key==="ArrowRight") nextI(); if(e.key==="ArrowLeft") prevI(); };
    window.addEventListener("keydown", onKey);
    return ()=>window.removeEventListener("keydown", onKey);
  }, [open]);

  if(!open) return null;
  const images = galleryOf(curr);

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-[85]" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
        <div className="absolute inset-0 bg-black/85" onClick={onClose} aria-hidden />
        <motion.div
          className="absolute left-1/2 top-1/2 grid h-[92vh] w-[min(1160px,96vw)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border bg-background/95 backdrop-blur shadow-2xl"
          role="dialog" aria-modal
          initial={reduce?{opacity:1}:{opacity:0, scale:0.98}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.98}} transition={{duration:0.18}}
          style={{ ["--toyota" as any]: TOYOTA_RED }}
        >
          <div className="flex items-center justify-between border-b p-3">
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold">{curr.title}</h3>
              <p className="truncate text-xs text-muted-foreground">{curr.scene}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={prevI} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-accent" aria-label="Previous"><ChevronLeft/></button>
              <button onClick={nextI} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-accent" aria-label="Next"><ChevronRight/></button>
              <button onClick={onClose} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-accent" aria-label="Close"><X/></button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-0 md:grid-cols-[1fr_360px]">
            <div className="relative min-h-[52vh]">
              <div className="absolute inset-0 grid place-items-center">
                <div className="relative aspect-square w-[min(640px,88%)]">
                  <img src={images[0]} alt={curr.title} className="h-full w-full rounded-xl object-cover shadow-xl" />
                </div>
              </div>
            </div>
            <div className="flex min-w-0 flex-col border-t md:border-l md:border-t-0">
              <div className="p-4">
                {curr.description && <p className="text-sm leading-relaxed text-muted-foreground">{curr.description}</p>}
                {curr.tags?.length ? (
                  <div className="mt-3 flex flex-wrap gap-1.5">{curr.tags.map(t=> <span key={t} className="rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground">{t}</span>)}</div>
                ):null}
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <a href={(curr as any).brochureUrl || "#"} onClick={(e)=>{ if(!(curr as any).brochureUrl) e.preventDefault(); }} target={((curr as any).brochureUrl && "_blank") || undefined} rel={((curr as any).brochureUrl && "noreferrer") || undefined} className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-accent"><Download className="h-4 w-4" /> Download Brochure</a>
                  <a href={(curr as any).testDriveUrl || "#"} onClick={(e)=>{ if(!(curr as any).testDriveUrl) e.preventDefault(); }} target={((curr as any).testDriveUrl && "_blank") || undefined} rel={((curr as any).testDriveUrl && "noreferrer") || undefined} className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--toyota)] bg-[var(--toyota)] px-4 py-2 text-sm font-medium text-white hover:brightness-95"><Car className="h-4 w-4" /> Book a Test Drive</a>
                </div>
                <button
                  onClick={()=>{
                    const a = curr;
                    const b = items[(i+1)%items.length];
                    onChooseCompare(a,b);
                  }}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs hover:bg-accent"
                >
                  <Split className="h-4 w-4" /> Compare with next
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ---------- Main Component ---------- */
type Props = {
  experiences?: EnhancedSceneData[];
  title?: string;
  rtl?: boolean;
  locale?: "en" | "ar";
};

const ToyotaNeuralShowroom: React.FC<Props> = ({
  experiences = ENHANCED_GALLERY_DATA,
  title = "Toyota Experience Gallery",
  rtl = false,
  locale = "en",
}) => {
  const [storyOpen, setStoryOpen] = useState(false);
  const [compare, setCompare] = useState<{l: EnhancedSceneData; r: EnhancedSceneData} | null>(null);

  const flow = useMemo(() => experiences.slice().sort((a:any,b:any)=> Number(b.featured)-Number(a.featured)), [experiences]);

  // command palette
  const { ui: paletteUI, open: openPalette } = usePalette(flow, (i)=> {
    setStoryOpen(true);
    // ensure the chosen item starts first in story sequence
    const idx = flow.findIndex(x=>x.id===i.id);
    if (idx>0) flow.unshift(...flow.splice(idx,1));
  });

  const cats = useMemo(()=> uniq(flow.map(e=>e.scene)), [flow]);

  return (
    <section
      className="relative w-full bg-gradient-to-b from-background to-muted/15"
      dir={rtl ? "rtl" : "ltr"}
      lang={locale}
      style={{ ["--toyota" as any]: TOYOTA_RED }}
      aria-label="Toyota Neural Showroom"
    >
      {/* HERO: Neural Canvas */}
      <div className="relative overflow-hidden border-b">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[var(--toyota)]/80 [mask-image:linear-gradient(to_right,transparent,black,transparent)]" />
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1fr,420px] lg:items-center">
            {/* Left: title + actions */}
            <div>
              <motion.h1 initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.45}} className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                {title}
              </motion.h1>
              <p className="mt-2 text-sm text-muted-foreground">{experiences.length} {experiences.length===1 ? "experience" : "experiences"}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={openPalette} className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm hover:bg-accent">
                  <Search className="h-4 w-4" /> Quick Find
                  <kbd className="ml-1 rounded border px-1.5 py-0.5 text-[10px] text-muted-foreground">⌘/Ctrl K</kbd>
                </button>
                <a href={(flow[0] as any)?.brochureUrl || "#"} onClick={(e)=>{ if(!(flow[0] as any)?.brochureUrl) e.preventDefault(); }} target={((flow[0] as any)?.brochureUrl && "_blank") || undefined} rel={((flow[0] as any)?.brochureUrl && "noreferrer") || undefined} className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm hover:bg-accent"><Download className="h-4 w-4" /> Download Brochure</a>
                <a href={(flow[0] as any)?.testDriveUrl || "#"} onClick={(e)=>{ if(!(flow[0] as any)?.testDriveUrl) e.preventDefault(); }} target={((flow[0] as any)?.testDriveUrl && "_blank") || undefined} rel={((flow[0] as any)?.testDriveUrl && "noreferrer") || undefined} className="inline-flex items-center gap-2 rounded-full border border-[var(--toyota)] bg-[var(--toyota)] px-4 py-2 text-sm font-medium text-white hover:brightness-95"><Car className="h-4 w-4" /> Book a Test Drive</a>
              </div>
            </div>

            {/* Right: parallax filmstrip */}
            <div className="relative hidden h-40 overflow-hidden rounded-2xl border bg-card shadow-sm sm:block">
              <div className="absolute inset-0 flex animate-[film_16s_linear_infinite] gap-3 opacity-90 [--w:240px] [mask-image:linear-gradient(to_right,transparent,black,black,transparent)]">
                {flow.slice(0,12).map(e=>(
                  <div key={e.id} className="relative h-full w-[var(--w)] shrink-0 overflow-hidden rounded-lg">
                    <SafeImg src={coverOf(e)} alt={e.title} />
                  </div>
                ))}
              </div>
              <style>{`@keyframes film{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[var(--toyota)]/80" />
            </div>
          </div>
        </div>
      </div>

      {/* Category rail */}
      {cats.length>0 && (
        <div className="mx-auto max-w-7xl px-4 pb-2 pt-3 sm:px-6 lg:px-8">
          <div className="no-scrollbar -mx-1 flex items-center gap-2 overflow-x-auto px-1">
            {cats.map(c=> <span key={c} className="rounded-full border px-3 py-1 text-xs text-muted-foreground">{c}</span>)}
          </div>
        </div>
      )}

      {/* Discovery: Masonry Flow */}
      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {flow.map((item)=>(
            <motion.article key={item.id} initial={{opacity:0,y:8}} whileInView={{opacity:1,y:0}} viewport={{once:true, amount:0.2}} transition={{duration:0.28}} className="group relative mb-4 break-inside-avoid overflow-hidden rounded-3xl border bg-card shadow-sm hover:shadow-lg">
              <SafeImg src={coverOf(item)} alt={item.title} className="h-[46vw] max-h-[320px] w-full sm:h-[34vw] sm:max-h-[300px]" />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute left-0 top-0 h-full w-1.5 bg-[var(--toyota)]" />
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="line-clamp-1 text-lg font-semibold text-white">{item.title}</h3>
                <p className="line-clamp-1 text-xs text-white/80">{item.scene}</p>
              </div>

              <div className="p-3">
                <div className="flex flex-wrap gap-2">
                  <button onClick={()=>setStoryOpen(true)} className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs hover:bg-accent"><Sparkles size={14}/> Story</button>
                  <button
                    onClick={()=>{
                      const other = flow.find(e=>e.id!==item.id) || item;
                      setCompare({ l: item, r: other });
                    }}
                    className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs hover:bg-accent"
                  >
                    <Split size={14}/> Compare
                  </button>
                  <a href={(item as any).brochureUrl || "#"} onClick={(e)=>{ if(!(item as any).brochureUrl) e.preventDefault(); }} target={((item as any).brochureUrl && "_blank") || undefined} rel={((item as any).brochureUrl && "noreferrer") || undefined} className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs hover:bg-accent"><Download size={14}/> Brochure</a>
                  <a href={(item as any).testDriveUrl || "#"} onClick={(e)=>{ if(!(item as any).testDriveUrl) e.preventDefault(); }} target={((item as any).testDriveUrl && "_blank") || undefined} rel={((item as any).testDriveUrl && "noreferrer") || undefined} className="inline-flex items-center gap-1 rounded-full border border-[var(--toyota)] bg-[var(--toyota)] px-3 py-1 text-xs font-medium text-white hover:brightness-95"><Car size={14}/> Test Drive</a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-6 text-center text-muted-foreground">
          Showing {flow.length} {flow.length===1 ? "experience" : "experiences"}
        </div>
      </div>

      {/* Overlays */}
      <StoryDeck
        items={flow}
        open={storyOpen}
        onClose={()=>setStoryOpen(false)}
        onChooseCompare={(l,r)=> setCompare({ l, r })}
      />
      {compare && (
        <CompareSlider
          leftSrc={galleryOf(compare.l)[0]}
          rightSrc={galleryOf(compare.r)[0]}
          titleLeft={compare.l.title}
          titleRight={compare.r.title}
          onClose={()=>setCompare(null)}
        />
      )}
      {paletteUI}

      {/* Quick Actions Dock (persistent) */}
      <div className="fixed inset-x-0 bottom-3 z-[60] mx-auto flex w-[min(720px,92vw)] items-center justify-center gap-2 rounded-full border bg-background/90 px-2 py-1 backdrop-blur shadow-xl">
        <button onClick={openPalette} className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm hover:bg-accent"><Search className="h-4 w-4" /> Find</button>
        <a href={(flow[0] as any)?.brochureUrl || "#"} onClick={(e)=>{ if(!(flow[0] as any)?.brochureUrl) e.preventDefault(); }} target={((flow[0] as any)?.brochureUrl && "_blank") || undefined} rel={((flow[0] as any)?.brochureUrl && "noreferrer") || undefined} className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm hover:bg-accent"><Download className="h-4 w-4" /> Download Brochure</a>
        <a href={(flow[0] as any)?.testDriveUrl || "#"} onClick={(e)=>{ if(!(flow[0] as any)?.testDriveUrl) e.preventDefault(); }} target={((flow[0] as any)?.testDriveUrl && "_blank") || undefined} rel={((flow[0] as any)?.testDriveUrl && "noreferrer") || undefined} className="inline-flex items-center gap-2 rounded-full border border-[var(--toyota)] bg-[var(--toyota)] px-3 py-1.5 text-sm font-medium text-white hover:brightness-95"><Car className="h-4 w-4" /> Book a Test Drive</a>
      </div>
    </section>
  );
};

export default ToyotaNeuralShowroom;
