import React, { useState } from "react";
import { Dialog } from "../ui/Dialog";

export const FeatureModal6: React.FC<{ open: boolean; onClose: () => void; title?: string; image?: string }> = ({ open, onClose, title = "360 Spin", image }) => {
  const [angle, setAngle] = useState(0);
  return (
    <Dialog open={open} onClose={onClose} title={title}>
      <div className="w-full h-72 flex items-center justify-center">
        <div style={{ transform: `rotateY(${angle}deg)` }} className="w-60 h-40 bg-white/4 rounded flex items-center justify-center">
          <img src={image} alt="360" className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="mt-4 flex gap-3">
        <button onClick={() => setAngle((a) => a - 30)} className="px-3 py-2 border rounded">⟲</button>
        <button onClick={() => setAngle((a) => a + 30)} className="px-3 py-2 border rounded">⟳</button>
      </div>
    </Dialog>
  );
};