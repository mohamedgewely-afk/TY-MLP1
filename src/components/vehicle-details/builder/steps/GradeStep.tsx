import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Star, Zap, Shield, Crown, ChevronRight } from "lucide-react";

interface GradeStepProps {
  config: { grade: string };
  setConfig: React.Dispatch<React.SetStateAction<any>>;
}

const grades = [
  {
    name: "Base",
    description: "Essential features",
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true",
    price: "From AED 89,000",
    monthlyEMI: "1,850",
    features: ["Manual A/C", "6 Speakers", "Basic Interior"],
    icon: Shield,
    badge: "Value",
    accent: {
      ring: "ring-blue-300/60",
      dot: "bg-blue-600",
      chip: "bg-blue-50 text-blue-700 border-blue-200",
      glow: "from-blue-500/10",
    },
  },
  {
    name: "SE",
    description: "Sport edition",
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true",
    price: "From AED 95,000",
    monthlyEMI: "1,980",
    features: ["Sport Seats", "8-inch Display", "Rear Camera"],
    icon: Zap,
    badge: "Sport",
    accent: {
      ring: "ring-red-300/60",
      dot: "bg-red-600",
      chip: "bg-red-50 text-red-700 border-red-200",
      glow: "from-red-500/10",
    },
  },
  {
    name: "XLE",
    description: "Premium comfort",
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true",
    price: "From AED 110,000",
    monthlyEMI: "2,290",
    features: ["Leather Trim", "Premium Audio", "Auto Climate"],
    icon: Star,
    badge: "Most Popular",
    accent: {
      ring: "ring-orange-300/60",
      dot: "bg-orange-600",
      chip: "bg-orange-50 text-orange-700 border-orange-200",
      glow: "from-orange-500/10",
    },
  },
  {
    name: "Limited",
    description: "Luxury features",
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true",
    price: "From AED 125,000",
    monthlyEMI: "2,600",
    features: ["Premium Leather", "9-inch Touch", "Heated Seats"],
    icon: Crown,
    badge: "Luxury",
    accent: {
      ring: "ring-purple-300/60",
      dot: "bg-purple-600",
      chip: "bg-purple-50 text-purple-700 border-purple-200",
      glow: "from-purple-500/10",
    },
  },
  {
    name: "Platinum",
    description: "Ultimate luxury",
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true",
    price: "From AED 145,000",
    monthlyEMI: "3,020",
    features: ["Executive Leather", "Premium JBL", "360° Camera"],
    icon: Crown,
    badge: "Ultimate",
    accent: {
      ring: "ring-amber-300/60",
      dot: "bg-amber-600",
      chip: "bg-amber-50 text-amber-700 border-amber-200",
      glow: "from-amber-500/10",
    },
  },
] as const;

const cardVariants = {
  initial: { opacity: 0, y: 18, scale: 0.98 },
  in: { opacity: 1, y: 0, scale: 1 },
};

const GradeStep: React.FC<GradeStepProps> = ({ config, setConfig }) => {
  const prefersReducedMotion = useReducedMotion();

  const onSelect = (name: string) => setConfig((prev: any) => ({ ...prev, grade: name }));

  return (
    <div className="p-6 pb-24 bg-gradient-to-b from-background via-background/60 to-muted/30">
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl md:text-3xl font-black tracking-tight">
          Select Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Grade</span>
        </h2>
        <p className="text-muted-foreground text-sm md:text-base mt-1">
          Choose the perfect combination of features and luxury
        </p>
      </motion.div>

      {/* Cards as a radiogroup */}
      <div role="radiogroup" aria-label="Vehicle grade" className="space-y-4">
        {grades.map((grade, index) => {
          const Icon = grade.icon;
          const isSelected = config?.grade === grade.name;

          return (
            <motion.div
              key={grade.name}
              variants={cardVariants}
              initial="initial"
              animate="in"
              transition={{ duration: 0.45, delay: index * 0.06 }}
            >
              <button
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                onClick={() => onSelect(grade.name)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(grade.name);
                  }
                }}
                className={[
                  "group relative w-full overflow-hidden rounded-2xl border-2 text-left",
                  "transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                  isSelected
                    ? "bg-gradient-to-br from-primary/5 to-primary/0 border-primary shadow-xl"
                    : "bg-card/95 backdrop-blur-sm border-border hover:border-primary/30 hover:shadow-xl",
                ].join(" ")}
              >
                {/* Accent glow */}
                <div
                  className={`pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-r ${grade.accent.glow} via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* top-right selected check */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute top-4 right-4 z-20"
                  >
                    <div className="bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg">
                      <Check className="h-4 w-4" />
                    </div>
                  </motion.div>
                )}

                <div className="relative z-10 flex items-center gap-5 p-5">
                  {/* Image with shine */}
                  <div className="flex-shrink-0">
                    <div
                      className={[
                        "w-20 h-20 rounded-xl overflow-hidden border-2 bg-muted/50",
                        isSelected ? `border-primary ring-4 ${grade.accent.ring}` : "border-border/50",
                      ].join(" ")}
                    >
                      <div className="relative w-full h-full group/image">
                        <img
                          src={grade.image}
                          alt={grade.name}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                        {/* Shine */}
                        <div className="pointer-events-none absolute inset-0">
                          <div className="absolute -inset-x-10 -top-1/2 h-full rotate-12 bg-gradient-to-r from-white/0 via-white/30 to-white/0 opacity-0 group-hover/image:opacity-100 transition-opacity duration-700" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon className="h-5 w-5 text-primary" />
                        <h3 className="text-lg md:text-xl font-bold truncate">{grade.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-[11px] font-medium border whitespace-nowrap ${grade.accent.chip}`}>
                          {grade.badge}
                        </span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{grade.description}</p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {grade.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-muted/70 text-muted-foreground text-xs rounded-md border border-border/50"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* Price + EMI + radio dot */}
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-base md:text-lg font-bold text-foreground">
                          {grade.price}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          AED {grade.monthlyEMI}/month
                        </div>
                      </div>

                      <div
                        className={[
                          "relative inline-flex h-7 w-12 items-center rounded-full border bg-background/60",
                          isSelected ? "border-primary/60" : "border-border",
                        ].join(" ")}
                        aria-hidden
                      >
                        <span
                          className={[
                            "absolute left-1 top-1 h-5 w-5 rounded-full transition-all",
                            isSelected ? `translate-x-5 ${grade.accent.dot}` : "translate-x-0 bg-muted",
                          ].join(" ")}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom selection glow */}
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 via-transparent to-primary/5"
                  />
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Progress hint */}
      <div className="mt-6">
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: prefersReducedMotion ? 0 : 1.2 }}
            className="h-full bg-gradient-to-r from-primary to-primary/60"
          />
        </div>
      </div>

      {/* Bottom spacer for mobile nav */}
      <div className="h-6" />
    </div>
  );
};

export default GradeStep;
