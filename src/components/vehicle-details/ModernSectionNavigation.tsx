// PageWithSideMenuNav.tsx — single-file implementation (no sticky header)

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

/** ========= CONFIG ========= */
type SectionItem = { id: string; label: string; description?: string };

const DEFAULT_SECTIONS: SectionItem[] = [
  { id: "hero", label: "Overview" },
  { id: "virtual-showroom", label: "Experience" },
  { id: "media-showcase", label: "Gallery" },
  { id: "story-performance", label: "Performance" },
  { id: "story-safety", label: "Safety" },
  { id: "story-connected", label: "Connected" },
  { id: "story-sustainable", label: "Hybrid" },
  { id: "story-comfort", label: "Comfort" },
  { id: "story-ownership", label: "Ownership" },
  { id: "offers", label: "Offers" },
  { id: "tech-experience", label: "Technology" },
  { id: "configuration", label: "Configure" },
  { id: "preowned-similar", label: "Pre-Owned" },
  { id: "related", label: "Similar Models" },
  { id: "faq", label: "FAQs" },
];

/** ========= COMPONENT ========= */
export default function PageWithSideMenuNav() {
  const sections = DEFAULT_SECTIONS;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Main scrollable content */}
      <main
        data-scroll-root
        style={{
          flex: 1,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          maxWidth: 1120,
          margin: "0 auto",
          width: "100%",
          padding: "16px",
        }}
      >
        {/* Side menu nav */}
        <SideMenuNav
          sections={sections}
          headerOffset={0}   // no sticky header offset
          accentColor="#EB0A1E"
          mobileTopVh={35}
        />

        {/* Content sections */}
        {sections.map((s, idx) => (
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
            <h2 style={{ margin: "4px 0 12px" }}>
              {idx + 1}. {s.label}
            </h2>
            <p style={{ color: "#555", lineHeight: 1.6 }}>
              This is the <strong>{s.label}</strong> section. Smooth scroll now
              has no sticky header offset.
            </p>
            <div
              style={{
                height: 420,
                borderRadius: 8,
                background: "#eaeaea",
                display: "grid",
                placeItems: "center",
                color: "#666",
              }}
            >
              Media / content placeholder
            </div>
          </section>
        ))}
        <div style={{ height: 120 }} />
      </main>

      {/* Bottom CTA */}
      <div
        style={{
          position: "sticky",
          bottom: 0,
          zIndex: 40,
          background: "#fff",
          borderTop: "1px solid rgba(0,0,0,.1)",
          padding: 12,
          display: "flex",
          gap: 12,
          justifyContent: "center",
        }}
      >
        <button
          style={{
            padding: "12px 16px",
            borderRadius: 10,
            border: "1px solid rgba(0,0,0,.12)",
            background: "#fff",
          }}
        >
          Enquire
        </button>
        <button
          style={{
            padding: "12px 16px",
            borderRadius: 10,
            border: "none",
            color: "#fff",
            background: "#111",
          }}
        >
          Book Test Drive
        </button>
        <button
          style={{
            padding: "12px 16px",
            borderRadius: 10,
            border: "none",
            color: "#fff",
            background: "#EB0A1E",
          }}
        >
          Reserve
        </button>
      </div>
    </div>
  );
}

/** ========= SideMenuNav (unchanged, except default headerOffset=0) ========= */
type SideMenuNavProps = {
  sections?: SectionItem[];
  headerOffset?: number;
  accentColor?: string;
  mobileTopVh?: number;
  scrollRootSelector?: string;
};

// (Keep your existing SideMenuNav implementation here — no changes required)
