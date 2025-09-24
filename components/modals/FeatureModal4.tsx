import React from "react";
import { Dialog } from "../ui/Dialog";

export const FeatureModal4: React.FC<{ open: boolean; onClose: () => void; title?: string; hotspots?: Array<{ x: number; y: number; label: string }> }> = ({ open, onClose, title = "Hotspot Explorer", hotspots = [] }) => {
  return (
    <Dialog open={open} onClose={onClose} title={title}>
      <div className="relative h-72 bg-white/3 rounded">
        {hotspots.map((h, i) => (
          <button key={i} style={{ left: `${h.x}%`, top: `${h.y}%` }} className="absolute transform -translate-x-1/2 -translate-y-1/2 bg-[var(--brand-primary)] rounded-full w-8 h-8 flex items-center justify-center text-white">
            <span className="text-xs">{i+1}</span>
          </button>
        ))}
      </div>
    </Dialog>
  );
};