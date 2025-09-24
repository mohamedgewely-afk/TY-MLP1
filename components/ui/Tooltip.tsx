import React from "react";

export const Tooltip: React.FC<{ label: string; children: React.ReactElement }> = ({ label, children }) => {
  return (
    <span className="group relative inline-flex items-center">
      {children}
      <span role="tooltip" className="pointer-events-none absolute bottom-full mb-2 hidden group-hover:inline-block rounded bg-black/80 text-white text-xs px-2 py-1">
        {label}
      </span>
    </span>
  );
};