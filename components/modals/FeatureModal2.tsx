import React from "react";
import { Dialog } from "../ui/Dialog";

export const FeatureModal2: React.FC<{ open: boolean; onClose: () => void; title?: string; specs?: Record<string, string> }> = ({ open, onClose, title = "Spec Drilldown", specs = {} }) => {
  return (
    <Dialog open={open} onClose={onClose} title={title}>
      <div className="space-y-2">
        {Object.entries(specs).map(([k, v]) => (
          <div key={k} className="flex justify-between text-white/80">
            <div>{k}</div>
            <div>{v}</div>
          </div>
        ))}
      </div>
    </Dialog>
  );
};