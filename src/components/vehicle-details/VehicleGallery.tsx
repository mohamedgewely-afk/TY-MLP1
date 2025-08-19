
import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import SceneCard, { SceneData } from "./SceneCard";
import GalleryContainer from "./GalleryContainer";

// Default scenes data
const DEFAULT_SCENES: SceneData[] = [
  {
    id: "lc-exterior-hero",
    title: "Land Cruiser",
    scene: "Exterior",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/f6516ca6-e2fd-4869-bfff-20532eda7b71/renditions/63c413af-8759-4581-a01b-905989f7d391?binary=true&mformat=true",
    description: "TNGA‑F platform. Lighter, tougher, more capable.",
    narration: "/audio/lc_exterior.mp3",
    specs: {
      drivetrain: "Full‑time 4WD, locking diffs",
      horsepower: "409 hp (3.5L V6 TT)",
      torque: "650 Nm",
      suspension: "Adaptive Variable Suspension",
    },
  },
  {
    id: "lc-urban",
    title: "Land Cruiser",
    scene: "Urban",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/cce498b4-5dab-4a8c-9684-ca2a175103b7/renditions/8b82d3c6-0df7-4252-b3cc-7977595ace57?binary=true&mformat=true",
    description: "Commanding stance with refined aerodynamics.",
    narration: "/audio/lc_urban.mp3",
    specs: {
      drivetrain: "10‑speed automatic",
      horsepower: "409 hp",
      range: "~800+ km",
    },
  },
  {
    id: "lc-capability",
    title: "Land Cruiser",
    scene: "Capability",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/f9670484-f03f-46ba-aac8-424889e779a0/renditions/ad34680c-160b-43a6-9785-541adba34a45?binary=true&mformat=true",
    description: "Born for dunes. Crawl Control and Multi‑Terrain Select.",
    narration: "/audio/lc_capability.mp3",
    specs: {
      drivetrain: "MTS + Crawl",
      torque: "650 Nm",
      topSpeed: "210 km/h",
    },
  },
  {
    id: "lc-interior",
    title: "Land Cruiser",
    scene: "Interior",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/5ae14c90-6ca2-49dd-a596e3e4b2bf449b/renditions/62240799-f5a0-4728-80b3-c928ff0d6985?binary=true&mformat=true",
    description: "Functional luxury. 12.3'' display & Terrain Monitor.",
    narration: "/audio/lc_interior.mp3",
    specs: {
      seats: "Ventilated leather, flexible 3rd row",
      safety: "Toyota Safety Sense",
      battery: "USB‑C fast charge",
    },
  },
  {
    id: "lc-night",
    title: "Land Cruiser",
    scene: "Night",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/0e241336-53f3-4bd0-8c67-61baf34bfdbd/renditions/cda649a1-788a-481d-a794-15dc2d9f7d64?binary=true&mformat=true",
    description: "Quiet power after dark. LED signature.",
    narration: "/audio/lc_night.mp3",
    specs: {
      drivetrain: "Full‑time 4WD",
      range: "~800+ km",
      horsepower: "409 hp",
    },
  },
];

interface VehicleGalleryProps {
  scenes?: SceneData[];
  onAskToyota?: (scene: SceneData) => void;
}

export default function VehicleGallery({ 
  scenes = DEFAULT_SCENES, 
  onAskToyota 
}: VehicleGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [selected, setSelected] = useState<SceneData | null>(null);
  const [filter, setFilter] = useState<string>("All");
  const trackRef = useRef<HTMLDivElement>(null);

  // Filter scenes
  const filtered = useMemo(
    () => (filter === "All" ? scenes : scenes.filter((s) => s.scene === filter)),
    [scenes, filter]
  );

  // Center card function
  const centerCard = useCallback((index: number) => {
    const el = trackRef.current;
    if (!el) return;
    const child = el.children[index] as HTMLElement | undefined;
    if (!child) return;
    const left = child.offsetLeft - (el.clientWidth - child.clientWidth) / 2;
    el.scrollTo({ left, behavior: "smooth" });
  }, []);

  // Reset when filter changes
  useEffect(() => {
    setActiveIdx(0);
    trackRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  }, [filter]);

  // Center active card
  useEffect(() => {
    centerCard(activeIdx);
  }, [activeIdx, centerCard]);

  return (
    <>
      <style>{`
        .gallery-track::-webkit-scrollbar {
          display: none;
        }
        .gallery-track {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `}</style>
      
      <GalleryContainer
        scenes={filtered}
        activeIdx={activeIdx}
        setActiveIdx={setActiveIdx}
        filter={filter}
        setFilter={setFilter}
      >
        {/* Gallery Track */}
        <div
          ref={trackRef}
          className="gallery-track flex gap-4 md:gap-6 lg:gap-8 overflow-x-auto snap-x snap-mandatory pb-8 scroll-smooth touch-pan-x overscroll-x-contain px-4 md:px-8 lg:px-12 xl:px-16"
          role="listbox"
          aria-label="Land Cruiser lifestyle scenes"
        >
          {filtered.length === 0 && (
            <div className="text-white/70 text-sm py-10 mx-auto">
              No scenes available for this filter.
            </div>
          )}
          {filtered.map((scene, idx) => (
            <SceneCard
              key={scene.id}
              data={scene}
              active={idx === activeIdx}
              onEnter={() => {
                setSelected(scene);
                setActiveIdx(idx);
              }}
              onFocus={() => setActiveIdx(idx)}
            />
          ))}
        </div>
      </GalleryContainer>
    </>
  );
}
