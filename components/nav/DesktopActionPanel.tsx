import React from "react";
import { motion } from "framer-motion";
import { useSticky } from "../../hooks/useSticky";

type Props = { onReserve?: () => void; onBuild?: () => void; onCompare?: () => void; onTestDrive?: () => void; onShare?: () => void };

export const DesktopActionPanel: React.FC<Props> = ({ onReserve, onBuild, onCompare, onTestDrive, onShare }) => {
  const visible = useSticky(300);

  return (
    <aside
      aria-label="Actions"
      className={`hidden lg:flex fixed right-8 top-1/3 z-40`}
      style={{ pointerEvents: visible ? "auto" : "none" }}
    >
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : 20 }}
        transition={{ duration: 0.28 }}
        className="flex flex-col gap-3 p-3 rounded-xl bg-[rgba(255,255,255,0.03)] border border-white/6 shadow-lg"
      >
        <button onClick={onReserve} className="px-3 py-2 rounded-md bg-gradient-to-b from-black/70 to-black/50 text-white">
          Reserve
        </button>
        <button onClick={onBuild} className="px-3 py-2 rounded-md border border-white/6 text-white">Build</button>
        <button onClick={onCompare} className="px-3 py-2 rounded-md border border-white/6 text-white">Compare</button>
        <button onClick={onTestDrive} className="px-3 py-2 rounded-md border border-white/6 text-white">Test Drive</button>
        <button onClick={onShare} className="px-3 py-2 rounded-md border border-white/6 text-white">Share</button>
      </motion.div>
    </aside>
  );
};