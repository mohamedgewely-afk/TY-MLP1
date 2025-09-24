import React from "react";
import { Dialog } from "../ui/Dialog";

export const FeatureModal5: React.FC<{ open: boolean; onClose: () => void; title?: string; qas?: Array<{ q: string; a: string }> }> = ({ open, onClose, title = "Q&A", qas = [] }) => {
  return (
    <Dialog open={open} onClose={onClose} title={title}>
      <div className="space-y-2">
        {qas.map((qa, i) => (
          <details key={i} className="bg-white/5 p-3 rounded">
            <summary className="cursor-pointer text-white font-medium">{qa.q}</summary>
            <div className="mt-2 text-white/80">{qa.a}</div>
          </details>
        ))}
      </div>
    </Dialog>
  );
};