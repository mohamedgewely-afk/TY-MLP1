import React from "react";

export const BuilderNavigation: React.FC<{ onPrev?: () => void; onNext?: () => void; canNext?: boolean }> = ({ onPrev, onNext, canNext = true }) => {
  return (
    <div className="flex items-center gap-3">
      <button onClick={onPrev} className="px-3 py-2 rounded border border-white/6 text-white">Back</button>
      <button onClick={onNext} disabled={!canNext} className={`px-4 py-2 rounded ${canNext ? "bg-[var(--brand-primary)] text-white" : "bg-white/6 text-white/60"}`}>Next</button>
    </div>
  );
};