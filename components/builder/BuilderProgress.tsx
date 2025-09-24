import React from "react";

export const BuilderProgress: React.FC<{ step: number; steps: string[] }> = ({ step, steps }) => {
  return (
    <nav aria-label="Builder progress" className="w-full">
      <ol className="flex items-center gap-4">
        {steps.map((s, i) => (
          <li key={s} className="flex-1">
            <div className="text-xs text-white/60">{s}</div>
            <div className="mt-2 h-1 bg-white/6 rounded">
              <div style={{ width: `${Math.min(100, ((step) / Math.max(1, steps.length - 1)) * 100)}%` }} className="h-1 bg-[var(--brand-primary)] rounded" />
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};