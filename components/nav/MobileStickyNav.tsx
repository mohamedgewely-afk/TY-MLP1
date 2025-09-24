import React from "react";
import { motion } from "framer-motion";
import { useSticky } from "../../hooks/useSticky";

type Action = { id: string; label: string; onClick?: () => void; icon?: React.ReactNode };

export const MobileStickyNav: React.FC<{ actions?: Action[] }> = ({ actions = [] }) => {
  const compact = useSticky(80);
  const defaultActions: Action[] = [
    { id: "compare", label: "Compare" },
    { id: "build", label: "Build" },
    { id: "test", label: "Test Drive" },
    { id: "share", label: "Share" },
  ];

  const items = actions.length ? actions : defaultActions;

  return (
    <nav aria-label="Mobile actions" className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 md:hidden">
      <motion.div
        animate={{ scale: compact ? 0.96 : 1, opacity: compact ? 0.95 : 1 }}
        transition={{ duration: 0.12 }}
        className="backdrop-blur-md bg-black/60 border border-white/6 rounded-full px-3 py-2 shadow-lg flex gap-2"
      >
        {items.map((a) => (
          <button
            key={a.id}
            onClick={a.onClick}
            className="flex flex-col items-center text-xs text-white px-3 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/40"
            aria-label={a.label}
            title={a.label}
          >
            <span className="w-6 h-6 rounded-full bg-white/6 flex items-center justify-center text-white text-sm">•</span>
            <span className="mt-1">{a.label}</span>
          </button>
        ))}
      </motion.div>
    </nav>
  );
};