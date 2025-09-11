import React, { CSSProperties, useEffect, useMemo, useRef, useState } from "react";

/* -------------------- Brand & primitives -------------------- */
const TOK = {
  red: "#EB0A1E",
  ink: "#0F172A",
  subt: "#6B7280",
  line: "#E5E7EB",
  bg: "#FFFFFF",
};
const R = { card: 16, sheet: 20 };
const card: CSSProperties = { background: TOK.bg, border: `1px solid ${TOK.line}`, borderRadius: R.card, boxShadow: "0 1px 2px rgba(15,23,42,.06)" };
const btnBase: CSSProperties = { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 12, padding: "10px 14px", fontSize: 14, cursor: "pointer" };
const btn = { ...btnBase, border: `1px solid ${TOK.line}`, background: "#fff" };
const btnPrimary = { ...btnBase, background: TOK.red, color: "#fff", border: "1px solid transparent" };
const tag: CSSProperties = { display: "inline-flex", alignItems: "center", borderRadius: 999, padding: "6px 10px", fontSize: 12, border: `1px solid ${TOK.line}`, background: "#fff", color: TOK.ink };
const Edge: React.FC<{ w?: number }> = ({ w = 110 }) => <div style={{ position: "absolute", left: 0, top: 0, height: 6, width: w, background: TOK.red }} />;

const useIsDesktop = () => {
  const [desk, setDesk] = useState(() => (typeof window !== "undefined" ? window.matchMedia("(min-width:1024px)").matches : false));
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width:1024px)");
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
    return () => (document.body.style.overflow = prev);
  }, [locked]);
};
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(n, max));

/* -------------------- Types -------------------- */
type VehicleLike = { name?: string } | any;

type JourneyStep = {
  url?: string;
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
  url: string; // cover image
  title: string;
  description?: string;
  category?: string;
  journey?: JourneyStep[];
};

interface Props {
  vehicle?: VehicleLike;
  onBookTestDrive?: () => void;
  wistiaMediaId?: string;
}

/* -------------------- Media widgets -------------------- */
const SafeImage: React.FC<{
  src?: string;
  alt?: string;
  fit?: "cover" | "contain";
  aspect?: number;
  style?: CSSProperties;
  fallbackSrc?: string;
}> = ({ src, alt, fit = "contain", aspect = 16 / 9, style, fallbackSrc }) => {
  const [err, setErr] = useState(false);
  const effective = !err ? src : fallbackSrc || src;

  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: String(aspect), background: fit === "contain" ? "#000" : "#111", overflow: "hidden", ...style }}>
      {effective ? (
        <img
          src={effective}
          alt={alt}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => {
            if (!err) setErr(true);
          }}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: fit }}
        />
      ) : (
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "#9CA3AF", background: "#F3F4F6", fontSize: 12 }}>
          Image unavailable
        </div>
      )}
    </div>
  );
};

const WistiaVideo: React.FC<{ id: string; autoPlay?: boolean; muted?: boolean; aspect?: number; style?: CSSProperties }> = ({
  id,
  autoPlay = true,
  muted = true,
  aspect = 16 / 9,
  style,
}) => {
  const [m, setM] = useState(muted);
  const qs = new URLSearchParams({
    seo: "false",
    dnt: "1",
    playsinline: "1",
    autoplay: autoPlay ? "1" : "0",
    muted: m ? "1" : "0",
    controlsVisibleOnLoad: "true",
    playbar: "true",
    fullscreenButton: "true",
    volumeControl: "true",
  });
  const src = `https://fast.wistia.net/embed/iframe/${id}?${qs.toString()}`;
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: String(aspect), borderRadius: R.card, overflow: "hidden", ...style }}>
      <iframe title="Wistia" src={src} allow="autoplay; fullscreen; picture-in-picture" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} />
      {m && autoPlay && (
        <button onClick={() => setM(false)} style={{ ...btn, position: "absolute", right: 12, top: 12, background: "rgba(255,255,255,.92)" }}>
          Unmute
        </button>
      )}
    </div>
  );
};

const YouTubeVideo: React.FC<{ id: string; autoPlay?: boolean; muted?: boolean; aspect?: number; style?: CSSProperties }> = ({
  id,
  autoPlay = true,
  muted = true,
  aspect = 16 / 9,
  style,
}) => {
  const params = new URLSearchParams({ autoplay: autoPlay ? "1" : "0", mute: muted ? "1" : "0", rel: "0", modestbranding: "1", playsinline: "1" });
  const src = `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: String(aspect), borderRadius: R.card, overflow: "hidden", ...style }}>
      <iframe title="YouTube" src={src} allow="autoplay; encrypted-media; picture-in-picture" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} />
    </div>
  );
};

/* -------------------- Demo data (6 cards) -------------------- */
const ITEMS: MediaItem[] = [
  {
    id: "performance",
    url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/a2c5b39d-f2db-4f00-968c-e78f73a73652/renditions/4a3588b7-55f0-48f5-98dc-a219f5bfbaad?binary=true&mformat=true",
    title: "V6 Twin-Turbo",
    description: "Broad torque band, effortless pace.",
    category: "Performance",
    journey: [
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/c90aebf7-5fbd-4d2f-b8d0-e2d473cc8656?binary=true&mformat=true",
        title: "Cooling Strategy",
        body: "Dual-path cooling keeps temps stable under load.",
        bullets: ["Dual circuits", "Low-temp charge-air", "Repeatable pace"],
        specs: ["3.5L V6 TT", "400+ hp", "0–60 in 4.2s"],
        benefits: ["Instant response", "High efficiency"],
        technology: ["Direct injection", "VVT", "Closed-loop boost"],
      },
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/0518d633-0b79-4964-97b1-daff0c8d5bf3/renditions/75f7f2ee-7e9b-4277-82ad-ca0126042c8c?binary=true&mformat=true",
        title: "Turbo Detail",
        body: "Low-inertia turbines widen usable torque.",
        specs: ["VGT", "Low-mass impellers"],
        benefits: ["Broad plateau torque"],
        technology: ["Smart boost maps"],
      },
      {
        video: { kind: "youtube", id: "NCSxxuPE6wM", aspect: 16 / 9 },
        title: "On-Road Pull",
        body: "Torque delivery & shift logic in sync.",
        specs: ["Eco/Sport maps"],
        benefits: ["Confidence"],
        technology: ["ECU learning"],
      },
    ],
  },
  {
    id: "interior",
    url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/cce498b4-5dab-4a8c-9684-ca2a175103b7/renditions/8b82d3c6-0df7-4252-b3cc-7977595ace57?binary=true&mformat=true",
    title: "Driver-Focused Cabin",
    description: "Premium materials, low distraction.",
    category: "Interior",
    journey: [
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/561ac4b4-3604-4e66-ae72-83e2969d7d65/items/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24/renditions/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24?binary=true&mformat=true",
        title: "Center Console",
        body: "Clear haptics with storage within reach.",
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
    url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/3a72bd7f-01f6-4398-b012-29b612f5e55c/renditions/1fdf0841-ad9a-4192-880b-7a4f16bbd32a?binary=true&mformat=true",
    title: "Build Quality",
    description: "High-strength materials; precise assembly.",
    category: "Quality",
    journey: [
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/15e8a778-27d5-4f87-af8c-08ae7b310941/items/a911702a-c978-4d26-9fe1-a6880684f9a0/renditions/b917d329-34db-42eb-87e5-c9a9c22fe929?binary=true&mformat=true",
        title: "Materials",
        body: "Premium substrates & coatings for longevity.",
        bullets: ["HS steel", "Corrosion protection"],
        specs: ["Multi-stage paint"],
        benefits: ["Durability"],
        technology: ["Laser gap checks"],
      },
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/a876132d-c35d-4d35-99c7-651e180dd8a1/renditions/98c1ac8c-a8bc-4f7c-8862-31fb9f7bff30?binary=true&mformat=true",
        title: "Finish Details",
        body: "Panel alignment & paint depth.",
        bullets: ["Consistency", "Refinement"],
        specs: ["QA audits"],
        benefits: ["Low maintenance"],
        technology: ["Robotics + human QA"],
      },
    ],
  },
  {
    id: "handling",
    url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/dd2df84f-19cc-4f85-93bb-b30ad7563f38/renditions/611ebf32-7ddd-4782-98d0-a208784e624d?binary=true&mformat=true",
    title: "Chassis Dynamics",
    description: "Adaptive damping; precise control.",
    category: "Performance",
  },
  {
    id: "tech",
    url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/84fd5061-3729-44b7-998c-ef02847d7bed/renditions/806b28e7-dffa-47c1-812b-2e7595defb58?binary=true&mformat=true",
    title: "Connected Services",
    description: "CarPlay/Android Auto, OTA updates.",
    category: "Technology",
  },
  {
    id: "safety",
    url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/dd2df84f-19cc-4f85-93bb-b30ad7563f38/renditions/611ebf32-7ddd-4782-98d0-a208784e624d?binary=true&mformat=true",
    title: "Toyota Safety Sense",
    description: "Wide FOV camera + radar.",
    category: "Safety",
    journey: [
      {
        video: { kind: "wistia", id: "kvdhnonllm", aspect: 16 / 9 },
        title: "Sensor Fusion",
        body: "Camera+radar fusion; assistance when you need it.",
        bullets: ["PCS", "LTA", "ACC", "BSM"],
        specs: ["Radar + camera"],
        benefits: ["Confidence", "Reduced fatigue"],
        technology: ["AI detection"],
      },
    ],
  },
];

/* -------------------- Helpers: normalize journeys & fallbacks -------------------- */
const normalized = (item: MediaItem): JourneyStep[] => {
  // Ensure each modal has ≥ 3 steps so the layout is always consistent.
  const base: JourneyStep[] =
    (item.journey && item.journey.length > 0 ? item.journey : [{ url: item.url, title: item.title, body: item.description }]).map((s) => ({
      ...s,
      url: s.url ?? item.url,
    }));

  const out = [...base];
  while (out.length < 3) out.push({ ...out[out.length - 1], url: out[out.length - 1].url ?? item.url });
  return out;
};

const kpisFrom = (s?: JourneyStep) => {
  const a = (s?.specs ?? []).slice(0, 2);
  const b = (s?.benefits ?? []).slice(0, 1);
  const c = (s?.technology ?? []).slice(0, 1);
  return [...a, ...b, ...c];
};

/* -------------------- Small UI atoms -------------------- */
const StatPill: React.FC<{ label: string }> = ({ label }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 999, border: `1px solid ${TOK.line}`, background: "#fff", fontSize: 12 }}>
    <span style={{ width: 6, height: 6, background: TOK.red, borderRadius: 999 }} />
    {label}
  </span>
);
const SpecList: React.FC<{ items?: string[] }> = ({ items }) =>
  !items?.length ? null : (
    <div style={{ ...card, padding: 16 }}>
      <div style={{ fontWeight: 800, marginBottom: 10 }}>Specifications</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {items!.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 6, height: 6, background: TOK.red, borderRadius: 999 }} />
            <span style={{ fontSize: 14 }}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );

const BulletBlock: React.FC<{ title: string; items?: string[]; color?: string }> = ({ title, items, color = "#10B981" }) =>
  !items?.length ? null : (
    <div style={{ ...card, padding: 16 }}>
      <div style={{ fontWeight: 800, marginBottom: 10 }}>{title}</div>
      <ul>
        {items!.map((b, i) => (
          <li key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: i === items!.length - 1 ? "0" : `1px dashed ${TOK.line}` }}>
            <span style={{ width: 6, height: 6, background: color, borderRadius: 999 }} />
            <span style={{ fontSize: 14 }}>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );

/* -------------------- Tile -------------------- */
const Tile: React.FC<{ item: MediaItem; onClick: (m: MediaItem) => void; big?: boolean }> = ({ item, onClick, big }) => {
  return (
    <div
      onClick={() => onClick(item)}
      style={{ ...card, overflow: "hidden", cursor: "pointer", transition: "transform .2s ease" }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <div style={{ position: "relative" }}>
        <Edge />
        <SafeImage src={item.url} alt={item.title} fit="cover" aspect={big ? 21 / 9 : 16 / 10} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: 16, background: "linear-gradient(to top, rgba(0,0,0,.6), rgba(0,0,0,0))" }}>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>{item.title}</div>
          {item.description && <div style={{ color: "rgba(255,255,255,.9)", fontSize: 13, marginTop: 4 }}>{item.description}</div>}
        </div>
      </div>
    </div>
  );
};

/* -------------------- Journey Modal -------------------- */
const JourneyModal: React.FC<{ open: boolean; item?: MediaItem; onClose: () => void; onBook?: () => void }> = ({ open, item, onClose, onBook }) => {
  const isDesktop = useIsDesktop();
  useBodyScrollLock(open);

  const [idx, setIdx] = useState(0);
  const [dragX, setDragX] = useState(0);
  const startX = useRef<number | null>(null);

  const steps = useMemo(() => (item ? normalized(item) : []), [item]);
  const step = steps[clamp(idx, 0, Math.max(0, steps.length - 1))];
  const isVideo = !!step?.video;

  useEffect(() => setIdx(0), [item]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIdx((p) => (p + 1) % steps.length);
      if (e.key === "ArrowLeft") setIdx((p) => (p - 1 + steps.length) % steps.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, steps.length, onClose]);

  const begin = (x: number) => {
    startX.current = x;
    setDragX(0);
  };
  const move = (x: number) => {
    if (startX.current !== null) setDragX(x - startX.current);
  };
  const end = () => {
    const THRESH = 60;
    if (Math.abs(dragX) > THRESH && steps.length > 1) {
      setIdx((p) => (dragX < 0 ? (p + 1) % steps.length : (p - 1 + steps.length) % steps.length));
    }
    startX.current = null;
    setDragX(0);
  };

  if (!open || !item) return null;

  const overlay: CSSProperties = { position: "fixed", inset: 0, zIndex: 60, background: "rgba(0,0,0,.75)", display: "grid", placeItems: "center" };
  const shell: CSSProperties = isDesktop
    ? { ...card, width: "min(1400px, 96vw)", height: "min(88vh, 900px)", borderRadius: R.sheet, overflow: "hidden", display: "grid", gridTemplateRows: "auto 1fr" }
    : { background: "#fff", position: "fixed", inset: 0, display: "grid", gridTemplateRows: "auto 1fr auto" };

  const head: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: isDesktop ? "12px 16px" : "14px 16px",
    borderBottom: `1px solid ${TOK.line}`,
    background: "#fff",
  };

  const grid: CSSProperties = isDesktop ? { display: "grid", gridTemplateColumns: "minmax(0, 1.25fr) minmax(360px, 1fr)" } : { display: "grid", gridTemplateRows: "auto 1fr" };
  const right: CSSProperties = isDesktop ? { padding: 16, borderLeft: `1px solid ${TOK.line}`, overflowY: "auto", background: "#fff" } : { padding: 16, overflowY: "auto", background: "#fff" };

  const kpis = kpisFrom(step);

  return (
    <div style={overlay} onClick={isDesktop ? onClose : undefined} aria-modal="true" role="dialog">
      <div style={shell} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={head}>
          <div style={{ fontWeight: 900, fontSize: 16 }}>{item.title}</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {steps.length > 1 && <span style={tag}>{idx + 1} / {steps.length}</span>}
            {onBook && <button style={btnPrimary} onClick={onBook}>Book Test Drive</button>}
            <button style={btn} onClick={onClose} aria-label="Close">Close</button>
          </div>
        </div>

        {/* Body */}
        <div style={grid}>
          {/* Media */}
          <div
            style={{ position: "relative", padding: 12, background: "#0b0b0b" }}
            onTouchStart={(e) => begin(e.touches[0].clientX)}
            onTouchMove={(e) => move(e.touches[0].clientX)}
            onTouchEnd={end}
            onPointerDown={(e) => begin(e.clientX)}
            onPointerMove={(e) => move(e.clientX)}
            onPointerUp={end}
          >
            {isVideo ? (
              step.video!.kind === "wistia" ? (
                <WistiaVideo id={step.video!.id} autoPlay muted aspect={step.video!.aspect ?? 16 / 9} />
              ) : (
                <YouTubeVideo id={step.video!.id} autoPlay muted aspect={step.video!.aspect ?? 16 / 9} />
              )
            ) : (
              <SafeImage src={step.url} alt={step.title} fit="contain" aspect={16 / 9} fallbackSrc={item.url} />
            )}

            {/* Arrows */}
            {steps.length > 1 && (
              <>
                <button aria-label="Previous" onClick={() => setIdx((p) => (p - 1 + steps.length) % steps.length)} style={{ ...btn, position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,.92)" }}>
                  ‹
                </button>
                <button aria-label="Next" onClick={() => setIdx((p) => (p + 1) % steps.length)} style={{ ...btn, position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,.92)" }}>
                  ›
                </button>
              </>
            )}

            {/* Dots */}
            {steps.length > 1 && (
              <div style={{ position: "absolute", bottom: 12, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 8 }}>
                {steps.map((_, i) => (
                  <button key={i} onClick={() => setIdx(i)} aria-label={`Go to step ${i + 1}`} style={{ width: 8, height: 8, borderRadius: 999, border: 0, background: i === idx ? TOK.red : "#D1D5DB" }} />
                ))}
              </div>
            )}

            {/* Thumb rail (desktop) */}
            {isDesktop && steps.length > 1 && (
              <div style={{ position: "absolute", right: 12, top: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                {steps.map((s, i) => (
                  <button key={i} onClick={() => setIdx(i)} aria-label={`Step ${i + 1}`} style={{ width: 72, height: 48, borderRadius: 8, overflow: "hidden", border: i === idx ? `2px solid ${TOK.red}` : `1px solid ${TOK.line}`, background: "#fff" }}>
                    {s.video ? (
                      <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", fontSize: 11 }}>Video</div>
                    ) : (
                      <SafeImage src={s.url} alt={s.title} fit="cover" aspect={72 / 48} fallbackSrc={item.url} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div style={right}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
              <div style={{ fontSize: 20, fontWeight: 900 }}>{step.title || item.title}</div>
              <div style={{ color: TOK.subt, fontSize: 13 }}>{item.category || ""}</div>
            </div>

            {kpis.length > 0 && (
              <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
                {kpis.map((k, i) => (
                  <StatPill key={i} label={k} />
                ))}
              </div>
            )}

            {step.body && (
              <div style={{ ...card, padding: 16, marginTop: 16 }}>
                <div style={{ fontWeight: 800, marginBottom: 6 }}>Overview</div>
                <p style={{ color: TOK.subt, lineHeight: 1.6 }}>{step.body}</p>
              </div>
            )}

            <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <SpecList items={step.specs} />
              <BulletBlock title="Benefits" items={step.benefits} color="#10B981" />
              <BulletBlock title="Technology" items={step.technology} color="#3B82F6" />
            </div>

            {steps.length > 1 && (
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button style={btn} onClick={() => setIdx((p) => (p - 1 + steps.length) % steps.length)}>
                  Previous
                </button>
                <button style={btn} onClick={() => setIdx((p) => (p + 1) % steps.length)}>
                  Next
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile bottom controls */}
        {!isDesktop && steps.length > 1 && (
          <div style={{ padding: 12, borderTop: `1px solid ${TOK.line}`, background: "#fff", display: "flex", justifyContent: "space-between", gap: 8 }}>
            <button style={btn} onClick={() => setIdx((p) => (p - 1 + steps.length) % steps.length)}>
              ‹ Prev
            </button>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {steps.map((_, i) => (
                <span key={i} style={{ width: 8, height: 8, borderRadius: 999, background: i === idx ? TOK.red : "#D1D5DB" }} />
              ))}
            </div>
            <button style={btn} onClick={() => setIdx((p) => (p + 1) % steps.length)}>
              Next ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* -------------------- Page scaffold -------------------- */
const VehicleMediaShowcase: React.FC<Props> = ({ vehicle, onBookTestDrive, wistiaMediaId = "kvdhnonllm" }) => {
  const isDesktop = useIsDesktop();
  const [journeyOf, setJourneyOf] = useState<MediaItem | undefined>();
  const items = useMemo<MediaItem[]>(() => ITEMS, []);

  const wrap: CSSProperties = { maxWidth: 1280, margin: "0 auto", padding: "24px 16px 48px" };

  return (
    <section aria-label="Media Studio">
      <div style={wrap}>
        <div style={{ marginBottom: 16 }}>
          <span style={tag}>{vehicle?.name ?? "Toyota"}</span>
          <h2 style={{ fontSize: isDesktop ? 44 : 28, fontWeight: 900, letterSpacing: -0.5, color: TOK.ink, marginTop: 8 }}>Highlights</h2>
          <p style={{ color: TOK.subt, marginTop: 6 }}>Tap any card to open a rich, guided journey. Autoplay video below.</p>
        </div>

        {/* Sticky hero video on desktop */}
        <div style={{ ...card, overflow: "hidden", position: isDesktop ? "sticky" as const : "static", top: 24, marginBottom: 24 }}>
          <WistiaVideo id={wistiaMediaId} autoPlay muted aspect={16 / 9} />
        </div>

        {/* Cards */}
        {isDesktop ? (
          <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
            {items.map((m, i) => (
              <div key={m.id} style={{ gridColumn: i === 0 ? "span 2" : undefined }} onClick={() => setJourneyOf(m)}>
                <Tile item={m} onClick={setJourneyOf} big={i === 0} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gap: 14 }}>
            {items.map((m) => (
              <div key={m.id} onClick={() => setJourneyOf(m)}>
                <Tile item={m} onClick={setJourneyOf} />
              </div>
            ))}
          </div>
        )}
      </div>

      <JourneyModal open={!!journeyOf} item={journeyOf} onClose={() => setJourneyOf(undefined)} onBook={onBookTestDrive} />
    </section>
  );
};

export default React.memo(VehicleMediaShowcase);
