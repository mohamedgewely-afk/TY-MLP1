import React, { useEffect } from "react";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  ariaLabel?: string;
  className?: string;
};

export const Dialog: React.FC<DialogProps> = ({ open, onClose, title, children, ariaLabel, className = "" }) => {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-label={ariaLabel || title}
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className={`relative z-10 max-w-4xl w-full ${className} rounded-lg overflow-hidden`} tabIndex={-1}>
        <div className="bg-neutral-900 p-6">{title && <h3 className="text-xl font-semibold">{title}</h3>}</div>
        <div className="bg-neutral-800 p-6">{children}</div>
        <div className="bg-neutral-900 p-4 text-right">
          <button onClick={onClose} className="px-4 py-2 bg-white/6 rounded text-white/90">Close</button>
        </div>
      </div>
    </div>
  );
};