import React, { useEffect, useMemo, useRef, useState } from "react";
// NOTE: This SDK file is self-contained. It does NOT depend on shadcn/ui or your project's UI kit.
// It ships its own tiny Button/Card/Badge primitives and a cn() helper.
// External runtime deps: react, framer-motion (optional: you can remove animations by toggling USE_MOTION=false)

/************************* README (SDK) *************************
Toyota Media SDK (single-file edition)
---------------------------------------------------------------
Exports
- <ToyotaImmersiveStudio />  → full experience (mosaic rail + sticky autoplay video + drawer)
- <WistiaVideo />            → standalone, battle-tested iframe embed (no custom element)
- <SafeImage />              → image with graceful fallback
- Types: MediaItem, MediaType, ToyotaImmersiveStudioProps

Zero hidden deps. You can drop this file in any React app.
Tailwind is optional; if it's not present, inline styles keep layout intact.

Installation
  // nothing to install; drop this file in your src/ and import

Usage
  import { ToyotaImmersiveStudio } from "./ToyotaMediaSDK";
  <ToyotaImmersiveStudio wistiaMediaId="kvdhnonllm" title="Land Cruiser Highlights" />

Test harness
  The bottom of this file exports <SDKSelfTest /> which you can render to validate runtime.

Why iframe and not <wistia-player>?
  Custom elements can fail in sandboxed / SSR environments. The iframe method is robust,
  requires no extra scripts, and supports autoplay on mobile when muted.
*****************************************************************/

/********************** flags ******************************/
const USE_MOTION = true;

/********************** minimal utils **********************/
const cn = (...xs: Array<string | false | null | undefined>) => xs.filter(Boolean).join(" ");

/********************** tiny UI kit ************************/
const BaseCard: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...p }) => (
  <div
    className={cn(
      "bg-white border border-neutral-200 rounded-2xl shadow-sm",
      className
    )}
    {...p}
  />
);
const BaseButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, ...p }) => (
  <button
    className={cn(
      "inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm border border-neutral-300 bg-white hover:bg-neutral-100",
      className
    )}
    {...p}
  />
);
const BaseBadge: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ className, ...p }) => (
  <span className={cn("inline-flex items-center rounded-lg px-2 py-0.5 text-[11px] border border-neutral-300", className)} {...p} />
);

/********************** types ******************************/
export type MediaType = "image" | "video";
export interface MediaItem {
  id: string;
  type: MediaType;
  url: string; // image url or video page url (not used by WistiaVideo)
  title: string;
  description?: string;
  category?: string;
}
export interface ToyotaImmersiveStudioProps {
  title?: string;
  subtitle?: string;
  items?: MediaItem[]; // optional; demo items used if missing
  wistiaMediaId?: string; // default "kvdhnonllm"
  brandName?: string; // header chip
}

/********************** SafeImage *************************/
export const SafeImage: React.FC<{ src?: string; alt?: string; className?: string; fit?: "cover" | "contain"; ratio?: string }>
= ({ src, alt, className, fit = "cover", ratio }) => {
  const [err, setErr] = useState(false);
  return (
    <div className={cn("relative w-full", ratio)} style={!ratio ? { aspectRatio: 16 / 10 } : undefined}>
      {!err ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          style={{ width: "100%", height: "100%", objectFit: fit === "cover" ? "cover" : "contain", background: fit === "contain" ? "#000" : undefined }}
          className={cn(className)}
          onError={() => setErr(true)}
        />
      ) : (
        <div className="w-full h-full grid place-items-center bg-neutral-100 text-neutral-500 text-xs">Image unavailable</div>
      )}
    </div>
  );
};

/********************** Wistia (iframe) ******************/
// Robust iframe-only embed. No custom elements, no extra scripts required.
export const WistiaVideo: React.FC<{
  mediaId: string; // e.g., "kvdhnonllm"
  autoPlay?: boolean;
  muted?: boolean;
  controls?: boolean;
  className?: string;
  aspect?: number; // 16/9 = 1.777...
}> = ({ mediaId, autoPlay = true, muted = true, controls = true, className, aspect = 16 / 9 }) => {
  const [isMuted, setIsMuted] = useState(muted);
  // Changing key forces iframe reload with new params (for unmute)
  const key = `${mediaId}:${autoPlay}:${isMuted}:${controls}:${aspect}`;
  const params = new URLSearchParams({
    seo: "false",
    autoplay: autoPlay ? "1" : "0",
    muted: isMuted ? "1" : "0",
    playsinline: "1",
    dnt: "1",
    controlsVisibleOnLoad: controls ? "true" : "false",
    playbar: controls ? "true" : "false",
    volumeControl: controls ? "true" : "false",
    fullscreenButton: controls ? "true" : "false",
  });
  const src = `https://fast.wistia.net/embed/iframe/${mediaId}?${params.toString()}`;

  return (
    <div className={cn("relative w-full overflow-hidden", className)} style={{ aspectRatio: aspect }}>
      <iframe
        key={key}
        src={src}
        allow="autoplay; fullscreen; picture-in-picture"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
        title="Wistia Video"
      />
      {/* Unmute overlay on mobile */}
      {isMuted && autoPlay && (
        <div style={{ position: "absolute", right: 12, top: 12 }}>
          <BaseButton onClick={() => setIsMuted(false)} title="Unmute">Unmute</BaseButton>
        </div>
      )}
    </div>
  );
};

/********************** Demo items ***********************/
const DEMO: MediaItem[] = [
  { id: "perf", type: "image", url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/7fecacb6-d705-4b29-b16c-cbd108171b42/renditions/da9d8da8-34ae-4c1c-9660-76e39b4a7abe?binary=true&mformat=true", title: "Chassis Dynamics", description: "Adaptive damping and precise control.", category: "Performance" },
  { id: "interior", type: "image", url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/cce498b4-5dab-4a8c-9684-ca2a175103b7/renditions/8b82d3c6-0df7-4252-b3cc-7977595ace57?binary=true&mformat=true", title: "Driver‑Focused Cabin", description: "Premium materials, intuitive controls.", category: "Interior" },
  { id: "quality", type: "image", url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/3a72bd7f-01f6-4398-b012-29b612f5e55c/renditions/1fdf0841-ad9a-4192-880b-7a4f16bbd32a?binary=true&mformat=true", title: "Build Quality", description: "High‑strength materials and precise assembly.", category: "Quality" },
  { id: "engine", type: "image", url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/a2c5b39d-f2db-4f00-968c-e78f73a73652/renditions/4a3588b7-55f0-48f5-98dc-a219f5bfbaad?binary=true&mformat=true", title: "V6 Twin‑Turbo", description: "400+ hp, broad torque band.", category: "Performance" },
  { id: "tech", type: "image", url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/84fd5061-3729-44b7-998c-ef02847d7bed/renditions/806b28e7-dffa-47c1-812b-2e7595defb58?binary=true&mformat=true", title: "Connected Services", description: "CarPlay/Android Auto, OTA updates.", category: "Technology" },
  { id: "safety", type: "image", url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/dd2df84f-19cc-4f85-93bb-b30ad7563f38/renditions/611ebf32-7ddd-4782-98d0-a208784e624d?binary=true&mformat=true", title: "Sensor Coverage", description: "Wide FOV camera + radar.", category: "Safety" },
];

/********************** Cards & Drawer *******************/
const CardTile: React.FC<{ item: MediaItem; onClick: (m: MediaItem) => void; index: number }>
= ({ item, onClick, index }) => {
  const content = (
    <BaseCard className="overflow-hidden cursor-pointer">
      <div className="relative" style={{ aspectRatio: index % 3 === 0 ? 21 / 9 : index % 3 === 1 ? 4 / 3 : 16 / 10, minHeight: 180 }}>
        <div className="absolute left-0 top-0 h-1.5 w-24" style={{ background: "#EB0A1E" }} />
        <SafeImage src={item.url} alt={item.title} className="absolute inset-0" fit="cover" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
          {item.category && <span className="text-[11px] text-white/90 px-2 py-0.5 rounded-full border border-white/50 bg-black/20">{item.category}</span>}
          <h3 className="text-white font-semibold text-lg mt-1">{item.title}</h3>
          {item.description && <p className="text-white/80 text-sm line-clamp-1">{item.description}</p>}
        </div>
      </div>
    </BaseCard>
  );
  if (!USE_MOTION) return <div onClick={() => onClick(item)}>{content}</div>;
  const { motion } = require("framer-motion");
  return (
    <motion.div whileHover={{ y: -3 }} onClick={() => onClick(item)}>
      {content}
    </motion.div>
  );
};

const Drawer: React.FC<{ open: boolean; item?: MediaItem; onClose: () => void }>
= ({ open, item, onClose }) => {
  if (!USE_MOTION) return open && item ? (
    <aside className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] md:w-[560px] bg-white shadow-2xl">
      <div className="flex items-center justify-between p-4 border-b">
        <div><p className="text-xs text-neutral-500">Feature</p><h4 className="text-lg font-bold">{item.title}</h4></div>
        <BaseButton onClick={onClose}>Close</BaseButton>
      </div>
      <div className="p-4 space-y-4 overflow-y-auto">
        <BaseCard className="overflow-hidden">
          <SafeImage src={item.url} alt={item.title} ratio="aspect-[16/10]" fit="cover" />
        </BaseCard>
        {item.description && <p className="text-sm text-neutral-700 leading-relaxed">{item.description}</p>}
      </div>
    </aside>
  ) : null;
  const { AnimatePresence, motion } = require("framer-motion");
  return (
    <AnimatePresence>
      {open && item && (
        <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 240, damping: 26 }} className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] md:w-[560px] bg-white shadow-2xl">
          <div className="flex items-center justify-between p-4 border-b">
            <div><p className="text-xs text-neutral-500">Feature</p><h4 className="text-lg font-bold">{item.title}</h4></div>
            <BaseButton onClick={onClose}>Close</BaseButton>
          </div>
          <div className="p-4 space-y-4 overflow-y-auto">
            <BaseCard className="overflow-hidden">
              <SafeImage src={item.url} alt={item.title} ratio="aspect-[16/10]" fit="cover" />
            </BaseCard>
            {item.description && <p className="text-sm text-neutral-700 leading-relaxed">{item.description}</p>}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

/********************** Main SDK component ***************/
export const ToyotaImmersiveStudio: React.FC<ToyotaImmersiveStudioProps> = ({ title = "Highlights", subtitle = "Explore key features while the video plays.", items, wistiaMediaId = "kvdhnonllm", brandName = "Toyota" }) => {
  const data = useMemo(() => (items?.length ? items.slice(0, 6) : DEMO.slice(0, 6)), [items]);
  const [drawer, setDrawer] = useState<MediaItem | undefined>();

  return (
    <section className="w-full">
      {/* Header */}
      <div className="px-4 md:px-10 pt-8 md:pt-12">
        <div className="flex items-end justify-between gap-6">
          <div>
            <BaseBadge>{brandName}</BaseBadge>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mt-3">{title}</h2>
            <p className="text-sm md:text-base text-neutral-600 mt-2">{subtitle}</p>
          </div>
        </div>
      </div>

      {/* Layout: grid + sticky video */}
      <div className="px-4 md:px-10 pb-12 grid grid-cols-1 lg:grid-cols-[1fr_520px] gap-6 mt-6">
        {/* Mobile video */}
        <div className="block lg:hidden">
          <BaseCard className="overflow-hidden">
            <WistiaVideo mediaId={wistiaMediaId} autoPlay muted aspect={16/9} />
          </BaseCard>
        </div>

        {/* Cards rail */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 content-start">
          {data.map((m, i) => (
            <CardTile key={m.id} item={m} index={i} onClick={(mm) => setDrawer(mm)} />
          ))}
        </div>

        {/* Sticky dock (desktop) */}
        <div className="hidden lg:block">
          <div className="sticky top-6">
            <BaseCard className="overflow-hidden">
              <WistiaVideo mediaId={wistiaMediaId} autoPlay muted aspect={16/9} />
            </BaseCard>
          </div>
        </div>
      </div>

      <Drawer open={!!drawer} item={drawer} onClose={() => setDrawer(undefined)} />
    </section>
  );
};

/********************** Self‑tests ************************/
export const SDKSelfTest: React.FC = () => {
  const [videoReady, setVideoReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  useEffect(() => {
    const t = setTimeout(() => {
      const ok = !!document.querySelector("iframe[src*='fast.wistia.net/embed/iframe']");
      setVideoReady(ok);
      if (!ok) console.warn("[SDK test] Wistia iframe not found — check network/csp.");
    }, 1000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="p-4 text-sm">
      <div>Video iframe present: <b>{String(videoReady)}</b></div>
      <div>Cards rendered: <b>{document.querySelectorAll('[data-sdk-card]').length || 0}</b></div>
    </div>
  );
};

// Default export for convenience
export default ToyotaImmersiveStudio;
