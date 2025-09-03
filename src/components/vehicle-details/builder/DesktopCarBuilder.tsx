import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X, RotateCcw, CheckCircle2, Info, Sparkles } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { useDeviceInfo } from "@/hooks/use-device-info";
import { addLuxuryHapticToButton, contextualHaptic } from "@/utils/haptic";


export interface BuilderConfig {
modelYear: string;
engine: string;
grade: string;
exteriorColor: string;
interiorColor: string;
accessories: string[];
}


export interface DesktopCarBuilderProps {
vehicle: VehicleModel;
step: number;
config: BuilderConfig;
setConfig: React.Dispatch<React.SetStateAction<BuilderConfig>>;
showConfirmation: boolean;
calculateTotalPrice: () => number;
handlePayment: () => void;
goBack: () => void;
goNext: () => void;
onClose: () => void;
onReset: () => void;
/** NEW: allow tablet-optimized variant using the same component to keep only 3 files total */
variant?: "desktop" | "tablet";
}


// color assets – same images preserved
const EXTERIOR_IMAGES: { name: string; image: string; swatch: string }[] = [
{
name: "Pearl White",
image:
"https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true",
swatch: "#f5f5f5",
},
{
name: "Midnight Black",
image:
"https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true",
swatch: "#101010",
},
{
name: "Silver Metallic",
image:
"https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true",
swatch: "#c7c9cc",
},
{
name: "Deep Blue",
image:
"https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true",
swatch: "#0c3c74",
},
{
name: "Ruby Red",
image:
"https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true",
swatch: "#8a1111",
},
];


const ENGINES = [
{ name: "3.5L V6", tag: "Gasoline" },
{ name: "4.0L V6", tag: "Performance" },
{ name: "2.5L Hybrid", tag: "Hybrid" },
];


const GRADES = [
{ name: "Base", badge: "Everyday Essentials" },
{ name: "SE", badge: "Sport Enhanced" },
export default DesktopCarBuilder;
// ---------- UI bits ----------
const Section: React.FC<{ title: string; subtitle?: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
<section className="px-6 py-5 border-b border-border/10">
<div className="flex items-start justify-between gap-3">
<div>
<h3 className="text-base font-bold leading-tight">{title}</h3>
{subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
</div>
<Info className="h-4 w-4 text-muted-foreground/70" />
</div>
<div className="mt-4">{children}</div>
</section>
);


const StepDots: React.FC<{ current: number; total: number }> = ({ current, total }) => (
<div className="flex items-center gap-2">
{Array.from({ length: total }).map((_, i) => (
<div
key={i}
className={`h-2 rounded-full transition-all ${i + 1 <= current ? "bg-primary w-8" : "bg-muted-foreground/30 w-3"}`}
/>
))}
</div>
);


const SelectableCard: React.FC<{
selected?: boolean;
onClick?: () => void;
image: string;
label: string;
caption?: string;
}> = ({ selected, onClick, image, label, caption }) => (
<button
onClick={onClick}
className={`group relative overflow-hidden rounded-2xl border text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
${selected ? "border-primary/60 bg-primary/5" : "border-border/50 hover:border-border"}`}
>
<div className="aspect-[16/10] w-full overflow-hidden">
<motion.img
src={image}
alt={label}
className="w-full h-full object-cover"
initial={{ scale: 1.04 }}
whileHover={{ scale: 1.08 }}
transition={{ type: "spring", stiffness: 180, damping: 16 }}
loading="lazy"
decoding="async"
/>
</div>
<div className="p-3">
<div className="text-sm font-semibold leading-tight flex items-center gap-2">
{label}
{selected && <CheckCircle2 className="h-4 w-4 text-primary" />}
</div>
{caption && <div className="text-xs text-muted-foreground">{caption}</div>}
</div>
</button>
);


const ColorSwatch: React.FC<{
color: string;
label: string;
active?: boolean;
onClick?: () => void;
onHover?: () => void;
}> = ({ color, label, active, onClick, onHover }) => (
<button
onMouseEnter={onHover}
onClick={onClick}
className={`relative w-11 h-11 rounded-full border transition outline-none focus-visible:ring-2 focus-visible:ring-primary
${active ? "border-primary ring-2 ring-primary/30" : "border-border/60 hover:border-border"}`}
aria-label={label}
>
<span className="absolute inset-0 rounded-full" style={{ background: color }} />
<span className="sr-only">{label}</span>
</button>
);