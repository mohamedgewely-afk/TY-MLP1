import React, { useCallback, useEffect, useMemo, useRef } from "react";
handlePayment: () => void;
goBack: () => void;
goNext: () => void;
onClose: () => void;
onReset: () => void;
deviceCategory: DeviceCategory;
}


const MOBILE_COLORS = [
{ name: "Pearl White", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true", swatch: "#f5f5f5" },
{ name: "Midnight Black", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true", swatch: "#101010" },
{ name: "Silver Metallic", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true", swatch: "#c7c9cc" },
{ name: "Deep Blue", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true", swatch: "#0c3c74" },
{ name: "Ruby Red", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true", swatch: "#8a1111" },
];


const MobileCarBuilder: React.FC<MobileCarBuilderProps> = ({
vehicle,
step,
config,
setConfig,
showConfirmation,
calculateTotalPrice,
handlePayment,
goBack,
goNext,
onClose,
onReset,
deviceCategory,
}) => {
const backRef = useRef<HTMLButtonElement>(null);
const closeRef = useRef<HTMLButtonElement>(null);
const resetRef = useRef<HTMLButtonElement>(null);


useEffect(() => {
[backRef, closeRef].forEach((r) => r.current && addLuxuryHapticToButton(r.current, { type: "luxuryPress", onPress: true }));
if (resetRef.current) addLuxuryHapticToButton(resetRef.current, { type: "premiumError", onPress: true });
}, []);


const activeImg = useMemo(() => {
const f = MOBILE_COLORS.find((c) => c.name === config.exteriorColor) || MOBILE_COLORS[0];
return f.image;
}, [config.exteriorColor]);


// Preload for snappy switch
useEffect(() => {
MOBILE_COLORS.forEach((c) => {
const img = new Image();
img.src = c.image;
img.decoding = "async";
img.loading = "eager" as any;
});
}, []);


const setColor = useCallback((name: string) => setConfig((c) => ({ ...c, exteriorColor: name })), [setConfig]);


return (
<motion.div
className="relative w-full min-h-screen flex flex-col bg-gradient-to-b from-background via-muted/10 to-background"
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
>
{/* Header */}
<div className="flex items-center justify-between px-3 py-2 border-b border-border/10 backdrop-blur-md sticky top-0 z-30 bg-background/90">
<div className="flex items-center gap-1.5">
<button ref={step > 1 ? backRef : closeRef} onClick={() => (step > 1 ? goBack() : onClose())} className="rounded-xl border p-2.5">
{step > 1 ? <ArrowLeft className="h-4 w-4" /> : <X className="h-4 w-4" />}
</button>
<button ref={resetRef} onClick={onReset} className="rounded-xl border p-2.5">
<RotateCcw className="h-4 w-4" />
</button>
</div>
<div className="text-center">
<div className="text-sm font-bold leading-none">Build Your <span className="text-primary">{vehicle.name}</span></div>
<div className="text-[10px] text-muted-foreground mt-1">{step}/4</div>
</div>
<div className="w-10" />
</div>


{/* Hero image */}
<div className="relative w-full h-40 border-b border-border/10 bg-gradient-to-br from-muted/10 via-background/50 to-background">
<motion.img
key={activeImg}
src={activeImg}
alt={`${config.exteriorColor} ${vehicle.name}`}
className="absolute inset-0 w-full h-full object-contain"
initial={{ opacity: 0, scale: 1.04 }}
animate={{ opacity: 1, scale: 1 }}
transition={{ type: "spring", stiffness: 240, damping: 24 }}
decoding="async"
loading="eager"
/>
<div className="absolute bottom-2 left-2 right-2 px-3 py-2 rounded-2xl backdrop-blur-xl border border-white/10 bg-background/80">
<div className="flex items-center justify-between gap-2">
<div className="min-w-0">
<div className="text-xs font-bold truncate">{config.modelYear} {vehicle.name}</div>
<div className="text-[11px] text-muted-foreground truncate">{config.grade || "Select Grade"} · {config.engine}</div>
export default MobileCarBuilder;