// src/components/vehicle-details/VehicleMediaShowcase.tsx
// React-only, premium “Journey” media studio for Toyota.
// Mobile journey overlay shows content as swipeable cards (no vertical scroll-jank).
// Desktop journey overlay is split: large media + sticky content panel.

import React, { CSSProperties, useEffect, useMemo, useRef, useState } from "react";

/* ---------- Tiny UI tokens ---------- */
const COLOR = {
  brand: "#EB0A1E",
  ink: "#0F172A",
  subt: "#6B7280",
  line: "#E5E7EB",
  card: "#FFFFFF",
  ghost: "rgba(255,255,255,.92)",
};
const R = { card: 16, sheet: 20, chip: 12 };
const card: CSSProperties = { background: COLOR.card, border: `1px solid ${COLOR.line}`, borderRadius: R.card, boxShadow: "0 1px 2px rgba(15,23,42,.06)" };
const btn: CSSProperties = { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 12, padding: "10px 14px", fontSize: 14, border: `1px solid ${COLOR.line}`, background: "#fff", cursor: "pointer" };
const badge: CSSProperties = { display: "inline-flex", alignItems: "center", borderRadius: 10, padding: "3px 8px", fontSize: 11, border: `1px solid ${COLOR.line}`, color: "#111827" };
const chip: CSSProperties = { display: "inline-flex", alignItems: "center", borderRadius: 999, padding: "6px 12px", fontSize: 12, border: `1px solid ${COLOR.line}`, background: "#fff" };
const Edge: React.FC<{ w?: number; c?: string }> = ({ w = 120, c = COLOR.brand }) => <div style={{ position: "absolute", left: 0, top: 0, height: 6, width: w, background: c }} />;

/* ---------- Types ---------- */
type VehicleLike = { name?: string } | any;
type MediaType = "image" | "video";
type JourneyStep = {
  url?: string;                            // image for this step
  title?: string;
  body?: string;
  bullets?: string[];
  specs?: string[];
  benefits?: string[];
  technology?: string[];
  video?: { kind: "wistia" | "youtube"; id: string; aspect?: number };
};
type MediaItem = {
  id: string;
  type: MediaType;
  url: string;                             // cover image
  title: string;
  description?: string;
  category?: string;
  journey?: JourneyStep[];                 // steps for “Journey”
};
interface Props { vehicle?: VehicleLike; wistiaMediaId?: string; }

/* ---------- Helpers ---------- */
const useIsDesktop = () => {
  const [desk, setDesk] = useState<boolean>(() => (typeof window !== "undefined" ? window.matchMedia("(min-width: 1024px)").matches : false));
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const on = () => setDesk(mq.matches);
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return desk;
};
const useBodyScrollLock = (locked: boolean) => {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [locked]);
};
const preloadNeighbors = (list: string[], idx: number) => {
  useEffect(() => {
    if (!list?.length) return;
    const next = list[(idx + 1) % list.length];
    const prev = list[(idx - 1 + list.length) % list.length];
    [next, prev].forEach((src) => { if (!src) return; const img = new Image(); img.src = src; });
  }, [list, idx]);
};

/* ---------- Media widgets ---------- */
const SafeImage: React.FC<{ src?: string; alt?: string; fit?: "cover" | "contain"; aspect?: number; minH?: number; style?: CSSProperties }> = ({
  src, alt, fit = "cover", aspect = 16 / 10, minH = 180, style
}) => {
  const [err, setErr] = useState(false);
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: String(aspect), minHeight: minH, overflow: "hidden", ...style }}>
      {!err ? (
        <img src={src} alt={alt} loading="lazy" decoding="async" onError={() => setErr(true)}
             style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: fit, background: fit === "contain" ? "#000" : undefined }} />
      ) : (
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "#f3f4f6", color: "#6b7280", fontSize: 12 }}>
          Image unavailable
        </div>
      )}
    </div>
  );
};

const WistiaVideo: React.FC<{ id: string; autoPlay?: boolean; muted?: boolean; controls?: boolean; aspect?: number; style?: CSSProperties }> = ({
  id, autoPlay = true, muted = true, controls = true, aspect = 16 / 9, style
}) => {
  const [m, setM] = useState(muted);
  const qs = new URLSearchParams({
    seo: "false", autoplay: autoPlay ? "1" : "0", muted: m ? "1" : "0", playsinline: "1", dnt: "1",
    controlsVisibleOnLoad: controls ? "true" : "false", playbar: controls ? "true" : "false", volumeControl: controls ? "true" : "false", fullscreenButton: controls ? "true" : "false",
  });
  const src = `https://fast.wistia.net/embed/iframe/${id}?${qs.toString()}`;
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: String(aspect), overflow: "hidden", borderRadius: R.card, ...style }}>
      <iframe key={`${id}:${String(m)}`} src={src} allow="autoplay; fullscreen; picture-in-picture" title="Wistia"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} />
      {m && autoPlay && (
        <button onClick={() => setM(false)} style={{ ...btn, position: "absolute", right: 12, top: 12, background: COLOR.ghost, backdropFilter: "saturate(180%) blur(6px)" }}>
          Unmute
        </button>
      )}
    </div>
  );
};

const YouTubeVideo: React.FC<{ id: string; autoPlay?: boolean; muted?: boolean; aspect?: number; style?: CSSProperties }> = ({
  id, autoPlay = true, muted = true, aspect = 16 / 9, style
}) => {
  const params = new URLSearchParams({ autoplay: autoPlay ? "1" : "0", mute: muted ? "1" : "0", rel: "0", modestbranding: "1", playsinline: "1" });
  const src = `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: String(aspect), overflow: "hidden", borderRadius: R.card, ...style }}>
      <iframe src={src} allow="autoplay; encrypted-media; picture-in-picture" title="YouTube"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} />
    </div>
  );
};

/* ---------- Demo data (DAM + journey content) ---------- */
const DEMO: MediaItem[] = [
  {
    id: "performance",
    type: "image",
    url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/a2c5b39d-f2db-4f00-968c-e78f73a73652/renditions/4a3588b7-55f0-48f5-98dc-a219f5bfbaad?binary=true&mformat=true",
    title: "V6 Twin-Turbo",
    description: "400+ hp, broad torque band.",
    category: "Performance",
    journey: [
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/c90aebf7-5fbd-4d2f-b8d0-e2d473cc8656?binary=true&mformat=true",
        title: "Cooling Strategy",
        body: "Dual-path cooling improves thermal stability under load.",
        bullets: ["Dual circuits", "Low-temp charge-air", "Lap-after-lap consistency"],
        specs: ["3.5L V6 TT", "400+ hp", "0–60 in 4.2s"],
        benefits: ["Instant response", "High efficiency"],
        technology: ["Direct injection", "VVT", "Closed-loop boost"],
      },
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/0518d633-0b79-4964-97b1-daff0c8d5bf3/renditions/75f7f2ee-7e9b-4277-82ad-ca0126042c8c?binary=true&mformat=true",
        title: "Turbo Detail",
        body: "Low-inertia turbines widen usable torque.",
        bullets: ["VGT control", "Lag-minimized response"],
        specs: ["VGT", "Low-mass impellers"],
        benefits: ["Broad plateau torque"],
        technology: ["Smart boost maps"],
      },
      {
        video: { kind: "youtube", id: "NCSxxuPE6wM", aspect: 16 / 9 },
        title: "On-Road Pull",
        body: "See torque delivery & shift logic together.",
        bullets: ["Broad plateau", "Smart boost"],
        specs: ["Eco/Sport mapping"],
        benefits: ["Confidence"],
        technology: ["ECU learning"],
      },
    ],
  },
  {
    id: "interior",
    type: "image",
    url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/cce498b4-5dab-4a8c-9684-ca2a175103b7/renditions/8b82d3c6-0df7-4252-b3cc-7977595ace57?binary=true&mformat=true",
    title: "Driver-Focused Cabin",
    description: "Premium materials, intuitive controls.",
    category: "Interior",
    journey: [
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/561ac4b4-3604-4e66-ae72-83e2969d7d65/items/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24/renditions/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24?binary=true&mformat=true",
        title: "Center Console",
        body: "Clear haptics and storage within reach.",
        bullets: ["Wireless pad", "Hidden stowage", "Low distraction"],
        specs: ['12.3" display', "Tri-zone climate"],
        benefits: ["Comfort", "Clarity"],
        technology: ["Voice control", "Wireless charging"],
      },
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/7fecacb6-d705-4b29-b16c-cbd108171b42/renditions/da9d8da8-34ae-4c1c-9660-76e39b4a7abe?binary=true&mformat=true",
        title: "Seating",
        body: "Supportive geometry; ventilation; memory.",
        bullets: ["Multi-way adjust", "Ventilated"],
        specs: ["Driver memory"],
        benefits: ["Less fatigue"],
        technology: ["Seat micro-vents"],
      },
    ],
  },
  {
    id: "quality",
    type: "image",
    url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/3a72bd7f-01f6-4398-b012-29b612f5e55c/renditions/1fdf0841-ad9a-4192-880b-7a4f16bbd32a?binary=true&mformat=true",
    title: "Build Quality",
    description: "High-strength materials and precise assembly.",
    category: "Quality",
    journey: [
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/15e8a778-27d5-4f87-af8c-08ae7b310941/items/a911702a-c978-4d26-9fe1-a6880684f9a0/renditions/b917d329-34db-42eb-87e5-c9a9c22fe929?binary=true&mformat=true",
        title: "Materials",
        body: "Premium substrates and coatings for longevity.",
        bullets: ["HS steel", "Corrosion protection"],
        specs: ["Multi-stage paint"],
        benefits: ["Durability"],
        technology: ["Laser gap checks"],
      },
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/a876132d-c35d-4d35-99c7-651e180dd8a1/renditions/98c1ac8c-a8bc-4f7c-8862-31fb9f7bff30?binary=true&mformat=true",
        title: "Finish Details",
        body: "Panel alignment and paint depth.",
        bullets: ["Consistency", "Refinement"],
        specs: ["QA audits"],
        benefits: ["Low maintenance"],
        technology: ["Robotics + human QA"],
      },
    ],
  },
  {
    id: "handling",
    type: "image",
    url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/dd2df84f-19cc-4f85-93bb-b30ad7563f38/renditions/611ebf32-7ddd-4782-98d0-a208784e624d?binary=true&mformat=true",
    title: "Chassis Dynamics",
    description: "Adaptive damping and precise control.",
    category: "Performance",
  },
  {
    id: "tech",
    type: "image",
    url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/84fd5061-3729-44b7-998c-ef02847d7bed/renditions/806b28e7-dffa-47c1-812b-2e7595defb58?binary=true&mformat=true",
    title: "Connected Services",
    description: "CarPlay/Android Auto, OTA updates.",
    category: "Technology",
  },
  {
    id: "safety",
    type: "image",
    url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/dd2df84f-19cc-4f85-93bb-b30ad7563f38/renditions/611ebf32-7ddd-4782-98d0-a208784e624d?binary=true&mformat=true",
    title: "Sensor Coverage",
    description: "Wide FOV camera + radar.",
    category: "Safety",
    journey: [
      {
        video: { kind: "wistia", id: "kvdhnonllm", aspect: 16 / 9 },
        title: "Toyota Safety Sense",
        body: "Camera + radar fusion; assistance when you need it.",
        bullets: ["PCS", "LTA", "ACC", "BSM"],
        specs: ["Radar + camera"],
        benefits: ["Confidence", "Reduced fatigue"],
        technology: ["Sensor fusion", "AI detection"],
      },
    ],
  },
];

/* ---------- Tiles (page) ---------- */
const CardTile: React.FC<{ item: MediaItem; index: number; onClick: (m: MediaItem) => void; big?: boolean }> = ({ item, index, onClick, big }) => {
  const aspect = big ? 21 / 9 : index % 3 === 1 ? 4 / 3 : 16 / 10;
  return (
    <div onClick={() => onClick(item)}
         style={{ ...card, overflow: "hidden", cursor: "pointer", transition: "transform .2s ease" }}
         onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
         onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}>
      <div style={{ position: "relative" }}>
        <Edge />
        <SafeImage src={item.url} alt={item.title} fit="cover" aspect={aspect} minH={big ? 260 : 200} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: 14, background: "linear-gradient(to top, rgba(0,0,0,.6), rgba(0,0,0,0))" }}>
          {item.category && <span style={{ ...badge, color: "#fff", borderColor: "rgba(255,255,255,.5)", background: "rgba(0,0,0,.2)" }}>{item.category}</span>}
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 20, marginTop: 8 }}>{item.title}</div>
          {item.description && <div style={{ color: "rgba(255,255,255,.9)", fontSize: 13, marginTop: 4, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{item.description}</div>}
        </div>
      </div>
    </div>
  );
};

/* ---------- Journey Content Cards (amazing on mobile) ---------- */
type PanelKey = "overview" | "specs" | "benefits" | "technology";
const panels: { key: PanelKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "specs", label: "Specs" },
  { key: "benefits", label: "Benefits" },
  { key: "technology", label: "Tech" },
];

const ContentCard: React.FC<{ title: string; children?: React.ReactNode; width?: number }> = ({ title, children, width = 280 }) => (
  <div style={{ ...card, minWidth: width, maxWidth: width, padding: 16 }}>
    <div style={{ fontWeight: 800, fontSize: 14, letterSpacing: .2, textTransform: "uppercase", color: COLOR.ink }}>{title}</div>
    <div style={{ marginTop: 10, color: COLOR.ink }}>{children}</div>
  </div>
);

const JourneyPanelRail: React.FC<{ step: JourneyStep }> = ({ step }) => {
  return (
    <div style={{ display: "flex", gap: 12, overflowX: "auto", padding: "4px 2px 2px" }}>
      {/* Overview */}
      <ContentCard title="Overview">
        {step.body && <p style={{ fontSize: 14, lineHeight: 1.6, color: COLOR.subt }}>{step.body}</p>}
        {step.bullets && step.bullets.length > 0 && (
          <ul style={{ marginTop: 8, paddingLeft: 18, color: COLOR.ink, fontSize: 14 }}>
            {step.bullets.map((b, i) => <li key={i} style={{ marginTop: 6 }}>{b}</li>)}
          </ul>
        )}
      </ContentCard>

      {/* Specs */}
      {step.specs && step.specs.length > 0 && (
        <ContentCard title="Specs">
          <ul style={{ marginTop: 2 }}>
            {step.specs.map((s, i) => (
              <li key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: i === step.specs!.length - 1 ? "0" : `1px dashed ${COLOR.line}` }}>
                <span style={{ width: 6, height: 6, background: COLOR.brand, borderRadius: 999 }} />
                <span style={{ fontSize: 14 }}>{s}</span>
              </li>
            ))}
          </ul>
        </ContentCard>
      )}

      {/* Benefits */}
      {step.benefits && step.benefits.length > 0 && (
        <ContentCard title="Benefits">
          <ul style={{ marginTop: 2 }}>
            {step.benefits.map((b, i) => (
              <li key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: i === step.benefits!.length - 1 ? "0" : `1px dashed ${COLOR.line}` }}>
                <span style={{ width: 6, height: 6, background: "#10B981", borderRadius: 999 }} />
                <span style={{ fontSize: 14 }}>{b}</span>
              </li>
            ))}
          </ul>
        </ContentCard>
      )}

      {/* Tech */}
      {step.technology && step.technology.length > 0 && (
        <ContentCard title="Tech">
          <ul style={{ marginTop: 2 }}>
            {step.technology.map((t, i) => (
              <li key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: i === step.technology!.length - 1 ? "0" : `1px dashed ${COLOR.line}` }}>
                <span style={{ width: 6, height: 6, background: "#3B82F6", borderRadius: 999 }} />
                <span style={{ fontSize: 14 }}>{t}</span>
              </li>
            ))}
          </ul>
        </ContentCard>
      )}
    </div>
  );
};

/* ---------- Journey Overlay (mobile-first) ---------- */
const JourneyOverlay: React.FC<{ open: boolean; item?: MediaItem; onClose: () => void }> = ({ open, item, onClose }) => {
  const isDesktop = useIsDesktop();
  useBodyScrollLock(open);

  const [idx, setIdx] = useState(0);
  const railRef = useRef<HTMLDivElement | null>(null);

  const steps = useMemo<JourneyStep[]>(() => {
    if (!item) return [];
    return item.journey?.length ? item.journey : [{ url: item.url, title: item.title, body: item.description }];
  }, [item]);

  // Swipe (media)
  const startX = useRef<number | null>(null);
  const deltaX = useRef(0);
  const THRESHOLD = 44;

  const onStart = (x: number) => { startX.current = x; deltaX.current = 0; };
  const onMove = (x: number) => { if (startX.current !== null) deltaX.current = x - startX.current; };
  const onEnd = () => {
    if (Math.abs(deltaX.current) > THRESHOLD && steps.length > 1) {
      setIdx((p) => (deltaX.current < 0 ? (p + 1) % steps.length : (p - 1 + steps.length) % steps.length));
    }
    startX.current = null; deltaX.current = 0;
  };

  useEffect(() => { setIdx(0); }, [item]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIdx((p) => (p + 1) % steps.length);
      if (e.key === "ArrowLeft") setIdx((p) => (p - 1 + steps.length) % steps.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, steps.length]);

  preloadNeighbors(steps.map(s => s.url || ""), idx);

  if (!open || !item) return null;
  const step = steps[Math.max(0, Math.min(idx, steps.length - 1))];
  const isVideo = !!step.video;

  const overlayBackdrop: CSSProperties = { position: "fixed", inset: 0, zIndex: 60, background: "rgba(0,0,0,.75)" };
  const sheet: CSSProperties = isDesktop
    ? { ...card, position: "fixed", inset: "24px", borderRadius: R.sheet, display: "grid", gridTemplateColumns: "1fr 420px", gap: 16, maxWidth: 1400, margin: "0 auto", background: "#fff" }
    : { position: "fixed", left: 0, right: 0, top: 0, bottom: 0, background: "#fff", display: "grid", gridTemplateRows: "auto auto 1fr", zIndex: 61 };

  const header: CSSProperties = isDesktop
    ? { gridColumn: "1 / -1", display: "flex", alignItems: "center", justifyContent: "space-between", padding: 12, borderBottom: `1px solid ${COLOR.line}` }
    : { position: "sticky", top: 0, zIndex: 2, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: `1px solid ${COLOR.line}`, background: "#fff" };

  const mediaWrap: CSSProperties = isDesktop ? { padding: 12 } : { padding: 12, paddingBottom: 6, overflow: "hidden", touchAction: "pan-y" };
  const contentDock: CSSProperties = isDesktop
    ? { padding: 12, borderLeft: `1px solid ${COLOR.line}`, display: "flex", flexDirection: "column", overflow: "auto" }
    : { padding: "4px 12px 12px", borderTop: `1px solid ${COLOR.line}`, overflow: "hidden" };

  return (
    <div role="dialog" aria-modal="true" style={overlayBackdrop} onClick={isDesktop ? onClose : undefined}>
      <div onClick={(e) => e.stopPropagation()} style={sheet}>
        {/* Header */}
        <div style={header}>
          <div style={{ fontWeight: 900, fontSize: 16 }}>{item.title}</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {steps.length > 1 && <span style={{ ...chip }}>{idx + 1} / {steps.length}</span>}
            <button onClick={onClose} style={btn} aria-label="Close">Close</button>
          </div>
        </div>

        {/* Media */}
        <div
          style={mediaWrap}
          onTouchStart={(e) => onStart(e.touches[0].clientX)}
          onTouchMove={(e) => onMove(e.touches[0].clientX)}
          onTouchEnd={onEnd}
          onPointerDown={(e) => onStart(e.clientX)}
          onPointerMove={(e) => onMove(e.clientX)}
          onPointerUp={onEnd}
        >
          {isVideo ? (
            step.video!.kind === "wistia" ? (
              <WistiaVideo id={step.video!.id} autoPlay muted aspect={step.video!.aspect ?? 16 / 9} />
            ) : (
              <YouTubeVideo id={step.video!.id} autoPlay muted aspect={step.video!.aspect ?? 16 / 9} />
            )
          ) : (
            <SafeImage src={step.url} alt={step.title} fit="contain" aspect={16 / 9} minH={isDesktop ? 380 : 240} />
          )}

          {/* Progress dots */}
          {steps.length > 1 && (
            <div style={{ marginTop: 10, display: "flex", gap: 8, justifyContent: "center" }}>
              {steps.map((_, i) => (
                <button key={i} onClick={() => setIdx(i)} aria-label={`Go to step ${i + 1}`}
                        style={{ width: 8, height: 8, borderRadius: 999, background: i === idx ? COLOR.brand : "#D1D5DB", border: 0 }} />
              ))}
            </div>
          )}
        </div>

        {/* Content (swipeable rail of cards on mobile; sticky panel on desktop) */}
        <div style={contentDock}>
          {/* Title inside content panel for context */}
          <div style={{ fontWeight: 800, fontSize: 18, padding: isDesktop ? "0 0 8px" : "0 4px 8px" }}>{step.title || item.title}</div>

          {/* Mobile/desktop unified: horizontal rail of structured content cards */}
          <div ref={railRef} style={{ display: "flex", gap: 12, overflowX: "auto", padding: isDesktop ? "2px" : "0 4px 2px" }}>
            <JourneyPanelRail step={step} />
          </div>

          {/* Bottom controls */}
          {steps.length > 1 && (
            <div style={{ display: "flex", gap: 8, marginTop: 12, padding: isDesktop ? 0 : "0 4px" }}>
              <button onClick={() => setIdx((p) => (p - 1 + steps.length) % steps.length)} style={btn} aria-label="Previous">Previous</button>
              <button onClick={() => setIdx((p) => (p + 1) % steps.length)} style={btn} aria-label="Next">Next</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------- Page scaffold (sticky Wistia + rail/mosaic) ---------- */
const VehicleMediaShowcase: React.FC<Props> = ({ vehicle, wistiaMediaId = "kvdhnonllm" }) => {
  const brand = vehicle?.name ?? "Toyota";
  const isDesktop = useIsDesktop();
  const items = useMemo<MediaItem[]>(() => DEMO, []);
  const [journeyOf, setJourneyOf] = useState<MediaItem | undefined>(undefined);

  const headerWrap: CSSProperties = { padding: "32px 16px 0" };
  const headerInner: CSSProperties = { display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, maxWidth: 1280, margin: "0 auto" };
  const title: CSSProperties = { fontSize: isDesktop ? 44 : 28, fontWeight: 900, letterSpacing: -0.5, marginTop: 12, color: COLOR.ink };
  const subtitle: CSSProperties = { fontSize: isDesktop ? 16 : 14, color: COLOR.subt, marginTop: 8 };
  const frame: CSSProperties = { display: "grid", gap: 24, padding: 16, paddingBottom: 48, maxWidth: 1280, margin: "16px auto 0" };

  return (
    <section aria-label="Media Showcase">
      {/* Header */}
      <div style={headerWrap}>
        <div style={headerInner}>
          <div>
            <span style={badge}>{brand}</span>
            <h2 style={title}>Highlights</h2>
            <p style={subtitle}>Click any card to enter a guided journey. Video plays above.</p>
          </div>
        </div>
      </div>

      {/* Video + content */}
      <div style={frame}>
        <div style={{ ...(isDesktop ? { position: "sticky", top: 24 } : {}), ...card, overflow: "hidden" }}>
          <WistiaVideo id={wistiaMediaId} autoPlay muted aspect={16 / 9} />
        </div>

        {/* Mobile: single horizontal rail (no long scroll) */}
        {!isDesktop && (
          <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 2, scrollSnapType: "x mandatory" }}>
            {items.map((m, i) => (
              <div key={m.id} style={{ flex: "0 0 82%", scrollSnapAlign: "center" }} onClick={() => setJourneyOf(m)}>
                <CardTile item={m} index={i} onClick={() => setJourneyOf(m)} />
              </div>
            ))}
          </div>
        )}

        {/* Desktop: mosaic with hero span */}
        {isDesktop && (
          <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(3, minmax(0, 1fr))", alignItems: "start" }}>
            {items.map((m, i) => {
              const big = i === 0;
              return (
                <div key={m.id} style={{ gridColumn: big ? "span 2" : undefined }} onClick={() => setJourneyOf(m)}>
                  <CardTile item={m} index={i} onClick={() => setJourneyOf(m)} big={big} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Journey overlay */}
      <JourneyOverlay open={!!journeyOf} item={journeyOf} onClose={() => setJourneyOf(undefined)} />
    </section>
  );
};

export default React.memo(VehicleMediaShowcase);
