import React from "react";
import { Dialog } from "../ui/Dialog";

export const FeatureModal1: React.FC<{ open: boolean; onClose: () => void; title?: string; image?: string }> = ({ open, onClose, title = "Image Focus", image }) => {
  return (
    <Dialog open={open} onClose={onClose} title={title}>
      <div className="w-full">
        <img src={image} alt={title} className="w-full h-96 object-contain" />
      </div>
    </Dialog>
  );
};