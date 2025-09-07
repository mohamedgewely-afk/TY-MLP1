// PageWithSectionNav.tsx — single-file, end-to-end demo with unified section nav.
// Paste this entire file into your project and render <DemoVehiclePage />.
// No external UI libraries needed.

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

/** =============== CONFIG =============== */

type SectionItem = { id: string; label: string; description?: string };

const SECTIONS: SectionItem[] = [
  { id: "hero", label: "Overview", description: "Highlights & hero media" },
  { id: "virtual-showroom", label: "Experience", description: "Walkthrough & AR" },
  { id: "media-showcase", label: "Gallery", description: "Photos & videos" },
  { id: "story-performance", label: "Performance", description: "Engines & handling" },
  { id: "story-safety", label: "Safety", description: "Assistance & ratings" },
  { id: "story-connected", label: "Connected", description: "Infotainment & apps" },
  { id: "story-sustainable", label: "Hybrid", description: "Efficiency & emissions" },
  { id: "story-comfort", label: "Comfort", description: "Interior & seating" },
  { id: "story-ownership", label: "Ownership", description: "Warranty & service" },
  { id: "offers", label: "Offers", description: "Finance & leasing" },
  { id: "tech-experience", label: "Technology", description: "ADAS & UX" },
  { id: "configuration", label: "Configure", description: "Build & price" },
  { id: "related", label: "Similar Models", description: "Alternatives" },
  { id: "faq", label: "FAQs", description: "Common questions" },
];

/** =============== UNIFIED SECTION NAV COMPONENT =============== */
/**
 * Mobile: content-first
 *  - Small summon button on right (auto-hides on scroll down, shows on scroll up)
 *  - Full-screen TOC sheet with labeled sections
 * Desktop:
 *  - Slim sticky bar under header (current label + “Sections”)
 *  - In-page right rail with labels (scrollspy), compacts on scroll down
 */
function SectionNavUnified({
  sections = SECTIONS,
  headerOffset = 80,      // match your header height (demo header = 80px)
  mobileTopVh = 34,       // summon button vertical position on mobile
  compactAfter = 320,     // px scrolled before rail compacts on desktop
  accentColor = "#EB0A1E" // brand accent color for active states
}: {
  sections?: SectionItem[];
  headerOffset?: number;
  mobileTopVh?: number;
  compactAfter?: number;
  accentColor?: string;
}) {
  const list = useMemo(() => sections.filter(s => s.id && s.label), [sections]);

  const [active, setActive] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [visible, setVisible] = useState(true);   // mobile summon visibility (auto-hide)
  const [railCompact, setRailCompact] = useState(false);
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const clickScrolling = useRef(false);
  const lastY = useRef(0);
  const portalEl = useRef<HTMLDivElement | null>(null);

  // Mobile portal root (ensures fixed UI is never clipped by ancestors)
  useEffect(() => {
    setMounted(true);
    const el = document.createElement("div");
    el.setAttribute("data-nav-root", "true");
    el.style.zIndex = "2147483647"; // max z-index
    document.body.appendChild(el);
    portalEl.current = el;
    return () => { if (portalEl.current) document.body.removeChild(portalEl.current); portalEl.current = null; };
  }, []);

  // Desktop breakpoint
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const apply = () => setIsDesktop(mql.matches);
    apply();
    mql.addEventListener?.("change", apply);
    return () => mql.removeEventListener?.("change", apply);
  }, []);

  // Scrollspy via IntersectionObserver
  useEffect(() => {
    if (!list.length) return;
    const io = new IntersectionObserver(
      entries => {
        if (clickScrolling.current) return;
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio > 0.3) {
            const i = list.findIndex(s => s.id === (e.target as HTMLElement).id);
            if (i !== -1) setActive(i);
          }
        }
      },
      { root: null, rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.3, 0.6, 1] }
    );
    list.forEach(s => { const el = document.getElementById(s.id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [list]);

  // Auto-hide summon on scroll down; compact rail on desktop
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        const goingDown = y > lastY.current;
        setVisible(y < 120 || !goingDown);
        setRailCompact(goingDown && y > compactAfter);
        lastY.current = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [compactAfter]);

  // Esc closes sheet
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && sheetOpen) setSheetOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [sheetOpen]);

  // Smooth scroll with header offset
  const jumpTo = useCallback((id: string, i: number) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.pageYOffset - Math.max(0, headerOffset);
    clickScrolling.current = true;
    window.scrollTo({ top, behavior: "smooth" });
    setActive(i);
    setSheetOpen(false);
    window.setTimeout(() => (clickScrolling.current = false), 500);
  }, [headerOffset]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? list.filter(s => s.label.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q)) : list;
  }, [query, list]);

  // Inline CSS (self-contained)
  const styles = `
    .sn-surface     { background:#fff; color:#111; border:1px solid rgba(0,0,0,.1); }
    .sn-shadow-sm   { box-shadow:0 4px 12px rgba(0,0,0,.08); }
    .sn-shadow-xl   { box-shadow:0 16px 40px rgba(0,0,0,.18); }
    .sn-rounded     { border-radius:12px; }
    .sn-rounded-lg  { border-radius:14px; }
    .sn-button      { display:inline-flex; align-items:center; justify-content:center; cursor:pointer; }
    .sn-focus:focus { outline:2px solid #6366f1; outline-offset:2px; }
    .sn-hidden      { opacity:0; transform:translateY(4px) scale(.98); pointer-events:none; transition:opacity .15s, transform .15s; }
    .sn-visible     { opacity:1; transform:translateY(0) scale(1); transition:opacity .15s, transform .15s; }
    .sn-rail        { position:fixed; right:24px; top:50%; transform:translateY(-50%); width:240px; z-index:30; }
    .sn-rail-inner  { padding:8px; }
    .sn-rail-compact{ opacity:.96; transform:translateY(-50%) scale(.98); }
    .sn-item        { width:100%; text-align:left; display:flex; gap:12px; align-items:center; padding:10px 12px; border-radius:10px; font-size:14px; }
    .sn-item:hover  { background:rgba(0,0,0,.04); }
    .sn-active      { font-weight:600; background:rgba(0,0,0,.04); }
    .sn-dot         { width:6px; height:6px; border-radius:9999px; background:rgba(0,0,0,.45); }
    .sn-sticky-wrap { position:sticky; z-index:40; }
    .sn-bar         { display:flex; gap:8px; align-items:center; padding:10px 12px; }
    .sn-bar-title   { font-size:14px; font-weight:600; }
    .sn-progress    { height:2px; background:rgba(0,0,0,.12); border-radius:9999px; overflow:hidden; }
    .sn-summon      { position:fixed; right:14px; width:46px; height:46px; border-radius:9999px; }
    .sn-sheet       { position:fixed; inset:0; display:flex; align-items:flex-start; justify-content:center; padding:12px; }
    .sn-sheet-card  { width:100%; max-width:720px; margin-top:12px; }
    .sn-search      { width:100%; padding:8px 12px 8px 36px; border-radius:10px; border:1px solid rgba(0,0,0,.12); font-size:14px; }
    .sn-search-ico  { position:absolute; left:12px; top:50%; transform:translateY(-50%); width:16px; height:16px; opacity:.6; }
    .sn-list        { max-height:70vh; overflow:auto; padding:8px 0 10px; }
    @media (prefers-color-scheme: dark){
      .sn-surface{ background:#0b0b0b; color:#fff; border-color:rgba(255,255,255,.12); }
      .sn-item:hover{ background:rgba(255,255,255,.08); }
      .sn-active{ background:rgba(255,255,255,.08); }
      .sn-dot{ background:rgba(255,255,255,.45); }
      .sn-progress{ background:rgba(255,255,255,.18); }
      .sn-search{ background:#0b0b0b; color:#fff; border-color:rgba(255,255,255,.12); }
    }
    @media (max-width: 1023px){
      .sn-rail{ display:none; }
    }
    @media (min-width: 1024px){
      .sn-summon{ display:none; }
    }
  `;

  // Desktop: sticky bar under header
  const desktopStickyBar = (
    <div className="sn-sticky-wrap" style={{ top: headerOffset }}>
      <div className="sn-surface sn-shadow-sm sn-rounded" style={{ margin: "0 auto", maxWidth: "1200px", padding: "6px 8px" }}>
        <div className="sn-bar">
          <button
            className="sn-button sn-focus"
            onClick={() => jumpTo(list[active]?.id, active)}
            aria-label="Recenter current section"
            style={{ flex: 1, minHeight: 40, alignItems: "flex-start", flexDirection: "column" }}
          >
            <span className="sn-bar-title">{list[active]?.label ?? "Section"}</span>
            <div className="sn-progress" style={{ width: "100%", marginTop: 6 }}>
              <div style={{
                width: list.length > 1 ? `${Math.round((active / (list.length - 1)) * 100)}%` : "100%",
                height: "100%", background: accentColor
              }}/>
            </div>
          </button>
          <button
            className="sn-button sn-focus"
            onClick={() => setSheetOpen(true)}
            aria-expanded={sheetOpen}
            aria-controls="section-sheet"
            style={{ minHeight: 40, padding: "8px 12px", borderRadius: 10 }}
          >
            <span style={{ fontSize: 14 }}>Sections ▾</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Desktop: right rail
  const desktopRail = (
    <nav className="sn-rail" aria-label="Page sections">
      <div className={`sn-surface sn-shadow-xl sn-rounded-lg sn-rail-inner ${railCompact ? "sn-rail-compact" : ""}`}>
        <ul style={{ maxHeight: "70vh", overflow: "auto", paddingRight: 6, margin: 0, listStyle: "none" }}>
          {list.map((s, i) => {
            const isActive = i === active;
            return (
              <li key={s.id} style={{ margin: "4px 0" }}>
                <button
                  onClick={() => jumpTo(s.id, i)}
                  className={`sn-item sn-button sn-focus ${isActive ? "sn-active" : ""}`}
                  aria-current={isActive ? "true" : undefined}
                >
                  <span className="sn-dot" style={{ background: isActive ? accentColor : undefined }} />
                  <span>{s.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );

  // Mobile: summon button (auto-hide), via portal so it's never clipped
  const mobileSummon = mounted && portalEl.current ? createPortal(
    <button
      className={`sn-button sn-surface sn-shadow-xl sn-rounded sn-summon ${visible ? "sn-visible" : "sn-hidden"}`}
      onClick={() => setSheetOpen(true)}
      aria-label="Open sections"
      style={{ top: `calc(${mobileTopVh}vh)`, padding: 0 }}
    >
      {/* Simple hamburger icon */}
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h12v2H3z"/></svg>
    </button>,
    portalEl.current
  ) : null;

  return (
    <>
      <style>{styles}</style>

      {/* Desktop controls */}
      {isDesktop && desktopStickyBar}
      {isDesktop && desktopRail}

      {/* Mobile summon */}
      {!isDesktop && mobileSummon}

      {/* Full-screen TOC sheet (mobile + desktop) */}
      {sheetOpen && (
        <>
          {/* Backdrop */}
          <button
            aria-label="Close sections"
            onClick={() => setSheetOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.28)", zIndex: 2147483646 }}
          />
          {/* Sheet content */}
          <div className="sn-sheet" role="dialog" aria-modal="true" id="section-sheet" style={{ zIndex: 2147483647 }}>
            <div className="sn-surface sn-shadow-xl sn-rounded-lg sn-sheet-card">
              {/* Sheet header */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 12px 6px" }}>
                <div style={{ width: 40, height: 6, borderRadius: 9999, background: "rgba(0,0,0,.18)" }} />
                <div style={{ flex: 1 }} />
                <button
                  onClick={() => setSheetOpen(false)}
                  className="sn-button sn-focus"
                  aria-label="Close"
                  style={{ padding: 8, borderRadius: 10 }}
                >
                  {/* X icon */}
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.29 19.71 2.88 18.3 9.17 12 2.88 5.71 4.29 4.3l6.3 6.3 6.29-6.3z"/>
                  </svg>
                </button>
              </div>

              {/* Search */}
              <div style={{ padding: "0 12px 8px", position: "relative" }}>
                <svg className="sn-search-ico" viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27a6 6 0 1 0-.71.71l.27.28v.79L20 20.5 21.5 19l-6-6zM6 10a4 4 0 1 1 8 0a4 4 0 0 1-8 0"/></svg>
                <input
                  className="sn-search sn-focus"
                  placeholder="Search sections…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              {/* List */}
              <div className="sn-list">
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {(query ? filtered : list).map((s) => {
                    const i = list.findIndex(v => v.id === s.id);
                    const isActive = i === active;
                    return (
                      <li key={s.id} style={{ margin: "4px 10px" }}>
                        <button
                          className={`sn-item sn-button sn-focus ${isActive ? "sn-active" : ""}`}
                          aria-current={isActive ? "true" : undefined}
                          onClick={() => jumpTo(s.id, i)}
                        >
                          <span className="sn-dot" style={{ background: isActive ? accentColor : undefined }} />
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <span>{s.label}</span>
                            {s.description && <span style={{ fontSize: 12, opacity: .7 }}>{s.description}</span>}
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

/** =============== DEMO PAGE (header, bottom CTA, sections) =============== */
/** This shows the nav working around a sticky header and a sticky bottom CTA */
export default function DemoVehiclePage() {
  const headerHeight = 80; // keep in sync with SectionNavUnified headerOffset

  return (
    <div>
      {/* Sticky header (demo) */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          height: headerHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          background: "#ffffff",
          borderBottom: "1px solid rgba(0,0,0,.1)",
        }}
      >
        <strong>Brand</strong>
        <span style={{ opacity: .7 }}>Sticky Header</span>
      </div>

      {/* Unified Section Nav */}
      <SectionNavUnified
        sections={SECTIONS}
        headerOffset={headerHeight}
        mobileTopVh={34}
        compactAfter={320}
        accentColor="#EB0A1E"
      />

      {/* Content sections (demo) */}
      <main style={{ maxWidth: 1120, margin: "16px auto", padding: "0 16px" }}>
        {SECTIONS.map((s, idx) => (
          <section
            key={s.id}
            id={s.id}
            style={{
              border: "1px solid rgba(0,0,0,.08)",
              borderRadius: 12,
              background: "#fafafa",
              padding: 24,
              marginBottom: 16,
            }}
          >
            <h2 style={{ margin: "4px 0 12px" }}>{idx + 1}. {s.label}</h2>
            <p style={{ color: "#555", lineHeight: 1.6 }}>
              This is the <strong>{s.label}</strong> section. {s.description ?? "Section details go here."}
              Scroll to see the scrollspy update. Use the mobile summon (right side) for a full-screen TOC,
              or on desktop: sticky bar under header + right rail.
            </p>
            <div style={{ height: 420, borderRadius: 8, background: "#eaeaea", display: "grid", placeItems: "center", color: "#666" }}>
              Media / content placeholder
            </div>
          </section>
        ))}
        <div style={{ height: 120 }} />
      </main>

      {/* Sticky bottom CTA (demo) */}
      <div
        style={{
          position: "sticky",
          bottom: 0,
          zIndex: 40,
          background: "#ffffff",
          borderTop: "1px solid rgba(0,0,0,.1)",
          padding: 12,
          display: "flex",
          gap: 12,
          justifyContent: "center",
        }}
      >
        <button style={{ padding: "12px 16px", borderRadius: 10, border: "1px solid rgba(0,0,0,.12)", background: "#fff" }}>
          Enquire
        </button>
        <button style={{ padding: "12px 16px", borderRadius: 10, border: "none", color: "#fff", background: "#111" }}>
          Book Test Drive
        </button>
        <button style={{ padding: "12px 16px", borderRadius: 10, border: "none", color: "#fff", background: "#EB0A1E" }}>
          Reserve
        </button>
      </div>
    </div>
  );
}
