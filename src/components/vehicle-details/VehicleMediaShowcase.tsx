// src/components/vehicle-details/VehicleMediaShowcase.tsx
// React-only, no external UI libs. Autoplay Wistia via iframe (reliable in sandboxes/SSR).
import React, { CSSProperties, useEffect, useMemo, useState } from "react";

/* ───────────── helpers / tiny UI ───────────── */
const cn = (...xs: Array<string | false | null | undefined>) => xs.filter(Boolean).join(" ");
const cardStyle: CSSProperties = { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, boxShadow: "0 1px 2px rgba(15,23,42,.06)" };
const btnStyle: CSSProperties = { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 10, padding: "8px 12px", fontSize: 14, border: "1px solid #d1d5db", background: "#fff", cursor: "pointer" };
const badgeStyle: CSSProperties = { display: "inline-flex", alignItems: "center", borderRadius: 10, padding: "3px 8px", fontSize: 11, border: "1px solid #d1d5db", color: "#111827" };
const EdgeAccent: React.FC<{ width?: number; color?: string }> = ({ width = 96, color = "#EB0A1E" }) => (
  <div style={{ position: "absolute", left: 0, top: 0, height: 6, width, background: color }} />
);

/* ───────────── types (loose to avoid path deps) ───────────── */
type MediaType = "image" | "video";
type VehicleLike = { name?: string } | any;
type MediaItem = { id: string; type: MediaType; url: string; title: string; description?: string; category?: string };

interface Props {
  vehicle?: VehicleLike; // your VehicleModel passes fine
  wistiaMediaId?: string; // e.g., "kvdhnonllm"
}

/* ───────────── SafeImage ───────────── */
const SafeImage: React.FC<{ src?: string; alt?: string; fit?: "cover" | "contain"; aspect?: number; minHeight?: number }> = ({
  src, alt, fit = "cover", aspect = 16 / 10, minHeight = 180,
}) => {
  const [err, setErr] = useState(false);
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: String(aspect), minHeight, overflow: "hidden" }}>
      {!err ? (
        <img src={src} alt={alt} loading="lazy" decoding="async"
          onError={() => setErr(true)}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: fit, background: fit === "contain" ? "#000" : undefined }}
        />
      ) : (
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "#f3f4f6", color: "#6b7280", fontSize: 12 }}>
          Image unavailable
        </div>
      )}
    </div>
  );
};

/* ───────────── Wistia (iframe, no custom element) ───────────── */
const WistiaVideo: React.FC<{ mediaId: string; autoPlay?: boolean; muted?: boolean; controls?: boolean; aspect?: number }> = ({
  mediaId, autoPlay = true, muted = true, controls = true, aspect = 16 / 9,
}) => {
  const [isMuted, setIsMuted] = useState(muted);
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
    <div style={{ position: "relative", width: "100%", aspectRatio: String(aspect), overflow: "hidden", borderRadius: 16 }}>
      <iframe key={`${mediaId}:${String(isMuted)}`} src={src} allow="autoplay; fullscreen; picture-in-picture" title="Wistia Video"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
      />
      {isMuted && autoPlay && (
        <button onClick={() => setIsMuted(false)}
          style={{ ...btnStyle, position: "absolute", right: 12, top: 12, background: "rgba(255,255,255,.9)", backdropFilter: "saturate(180%) blur(6px)" }}
          title="Unmute">
          Unmute
        </button>
      )}
    </div>
  );
};

/* ───────────── demo items (your DAM) ───────────── */
const DEMO: MediaItem[] = [
  { id: "perf", type: "image", url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/7fecacb6-d705-4b29-b16c-cbd108171b42/renditions/da9d8da8-34ae-4c1c-9660-76e39b4a7abe?binary=true&mformat=true", title: "Chassis Dynamics", description: "Adaptive damping and precise control.", category: "Performance" },
  { id: "interior", type: "image", url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/cce498b4-5dab-4a8c-9684-ca2a175103b7/renditions/8b82d3c6-0df7-4252-b3cc-7977595ace57?binary=true&mformat=true", title: "Driver-Focused Cabin", description: "Premium materials, intuitive controls.", category: "Interior" },
  { id: "quality", type: "image", url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/3a72bd7f-01f6-4398-b012-29b612f5e55c/renditions/1fdf0841-ad9a-4192-880b-7a4f16bbd32a?binary=true&mformat=true", title: "Build Quality", description: "High-strength materials and precise assembly.", category: "Quality" },
  { id: "engine", type: "image", url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/a2c5b39d-f2db-4f00-968c-e78f73a73652/renditions/4a3588b7-55f0-48f5-98dc-a219f5bfbaad?binary=true&mformat=true", title: "V6 Twin-Turbo", description: "400+ hp, broad torque band.", category: "Performance" },
  { id: "tech", type: "image", url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/84fd5061-3729-44b7-998c-ef02847d7bed/renditions/806b28e7-dffa-47c1-812b-2e7595defb58?binary=true&mformat=true", title: "Connected Services", description: "CarPlay/Android Auto, OTA updates.", category: "Technology" },
  { id: "safety", type: "image", url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/dd2df84f-19cc-4f85-93bb-b30ad7563f38/renditions/611ebf32-7ddd-4782-98d0-a208784e624d?binary=true&mformat=true", title: "Sensor Coverage", description: "Wide FOV camera + radar.", category: "Safety" },
];

/* ───────────── card + drawer ───────────── */
const CardTile: React.FC<{ item: MediaItem; index: number; onClick: (m: MediaItem) => void }> = ({ item, index, onClick }) => {
  const aspect = index % 3 === 0 ? 21 / 9 : index % 3 === 1 ? 4 / 3 : 16 / 10;
  return (
    <div onClick={() => onClick(item)}
      style={{ ...cardStyle, overflow: "hidden", cursor: "pointer", transition: "transform .2s ease" }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
      data-sdk-card
    >
      <div style={{ position: "relative" }}>
        <EdgeAccent />
        <SafeImage src={item.url} alt={item.title} fit="cover" aspect={aspect} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: 12, background: "linear-gradient(to top, rgba(0,0,0,.6), rgba(0,0,0,0))" }}>
          {item.category && <span style={{ ...badgeStyle, color: "#fff", borderColor: "rgba(255,255,255,.5)", background: "rgba(0,0,0,.2)" }}>{item.category}</span>}
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 18, marginTop: 6 }}>{item.title}</div>
          {item.description && <div style={{ color: "rgba(255,255,255,.85)", fontSize: 13, marginTop: 2, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{item.description}</div>}
        </div>
      </div>
    </div>
  );
};

const Drawer: React.FC<{ open: boolean; item?: MediaItem; onClose: () => void }> = ({ open, item, onClose }) => {
  if (!open || !item) return null;
  return (
    <aside role="dialog" aria-modal="true"
      style={{ position: "fixed", inset: "0 0 0 auto", width: "min(560px, 100%)", background: "#fff", boxShadow: "-12px 0 24px rgba(0,0,0,.1)", zIndex: 50 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 16, borderBottom: "1px solid #e5e7eb" }}>
        <div>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Feature</div>
          <div style={{ fontSize: 18, fontWeight: 800 }}>{item.title}</div>
        </div>
        <button onClick={onClose} style={btnStyle} aria-label="Close">Close</button>
      </div>
      <div style={{ padding: 16, overflowY: "auto", maxHeight: "calc(100vh - 64px)" }}>
        <div style={{ ...cardStyle, overflow: "hidden" }}>
          <SafeImage src={item.url} alt={item.title} aspect={16 / 10} fit="cover" />
        </div>
        {item.description && <p style={{ marginTop: 16, color: "#374151", fontSize: 14, lineHeight: 1.6 }}>{item.description}</p>}
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Category</div>
          <div style={{ fontSize: 14 }}>{item.category || "—"}</div>
        </div>
      </div>
    </aside>
  );
};

/* ───────────── responsive helper ───────────── */
const useIsDesktop = () => {
  const [desktop, setDesktop] = useState<boolean>(() => (typeof window !== "undefined" ? window.matchMedia("(min-width: 1024px)").matches : false));
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => setDesktop(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return desktop;
};

/* ───────────── main export ───────────── */
const VehicleMediaShowcase: React.FC<Props> = ({ vehicle, wistiaMediaId = "kvdhnonllm" }) => {
  const brand = vehicle?.name ?? "Toyota";
  const isDesktop = useIsDesktop();
  const items: MediaItem[] = useMemo(() => DEMO, []);

  /* layout styles */
  const headerWrap: CSSProperties = { padding: "32px 16px 0" };
  const headerInner: CSSProperties = { display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, maxWidth: 1200, margin: "0 auto" };
  const titleStyle: CSSProperties = { fontSize: isDesktop ? 44 : 28, fontWeight: 900, letterSpacing: -0.5, marginTop: 12 };
  const subtitleStyle: CSSProperties = { fontSize: isDesktop ? 16 : 14, color: "#6b7280", marginTop: 8 };
  const contentGrid: CSSProperties = { display: "grid", gap: 24, padding: 16, paddingBottom: 48, maxWidth: 1200, margin: "16px auto 0" };
  const desktopTwoCol: CSSProperties = { display: "grid", gap: 24, gridTemplateColumns: "1fr 520px", alignItems: "start" };
  const stickyDock: CSSProperties = { position: "sticky", top: 24 };

  return (
    <section aria-label="Media Showcase">
      {/* Header */}
      <div style={headerWrap}>
        <div style={headerInner}>
          <div>
            <span style={badgeStyle}>{brand}</span>
            <h2 style={titleStyle}>Highlights</h2>
            <p style={subtitleStyle}>Explore key features while the video plays.</p>
          </div>
        </div>
      </div>

      {/* Layout: rail + sticky video (desktop), video on top (mobile) */}
      <div style={{ ...contentGrid, ...(isDesktop ? desktopTwoCol : {}) }}>
        {!isDesktop && (
          <div>
            <div style={{ ...cardStyle, overflow: "hidden" }}>
              <WistiaVideo mediaId={wistiaMediaId} autoPlay muted aspect={16 / 9} />
            </div>
          </div>
        )}

        <div style={{ display: "grid", gap: 20, gridTemplateColumns: isDesktop ? "repeat(3, minmax(0, 1fr))" : "repeat(1, minmax(0, 1fr))" }}>
          {items.map((m, i) => (
            <CardTile key={m.id} item={m} index={i} onClick={() => setDrawer(m)} />
          ))}
        </div>

        {isDesktop && (
          <div>
            <div style={{ ...stickyDock }}>
              <div style={{ ...cardStyle, overflow: "hidden" }}>
                <WistiaVideo mediaId={wistiaMediaId} autoPlay muted aspect={16 / 9} />
              </div>
            </div>
          </div>
        )}
      </div>

      <Drawer open={!!drawerItem} item={drawerItem} onClose={() => setDrawer(undefined)} />
    </section>
  );

  function setDrawer(m?: MediaItem) { setDrawerItem(m); }
  function setDrawerItem(m?: MediaItem) { _setDrawerItem(m); }
  const [_drawerItem, _setDrawerItem] = useState<MediaItem | undefined>(undefined);
};

export default React.memo(VehicleMediaShowcase);
