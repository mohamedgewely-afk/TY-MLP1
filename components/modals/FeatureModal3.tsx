import React from "react";
import { Dialog } from "../ui/Dialog";

export const FeatureModal3: React.FC<{ open: boolean; onClose: () => void; title?: string; videoUrl?: string; poster?: string }> = ({ open, onClose, title = "Video Header", videoUrl, poster }) => {
  return (
    <Dialog open={open} onClose={onClose} title={title}>
      {videoUrl ? (
        <video src={videoUrl} controls poster={poster} className="w-full h-64 object-cover" />
      ) : (
        <div className="w-full h-64 bg-white/6 flex items-center justify-center text-white/60">No video available</div>
      )}
    </Dialog>
  );
};