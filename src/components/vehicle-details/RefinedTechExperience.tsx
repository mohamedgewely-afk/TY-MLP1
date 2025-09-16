import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import type { VehicleModel } from "@/types/vehicle";
import { ChevronLeft, ChevronRight, X, Search, Wrench, Car } from "lucide-react";

/* ─────────────────────────────────────────────────────────
   TOYOTA BRANDED CINEMATIC EXPERIENCE (TRAILER STYLE + PARALLAX + IMAGE TRANSITIONS)
   - White immersive background for premium showroom feel
   - Toyota Red (#EB0A1E) accent for brand consistency
   - Trailer-style motion: sequential text & media reveals
   - Large images with parallax motion on scroll
   - Smooth crossfade/slide motion when switching features
   - Typography: bold sans for headlines, clean sans for body
   - CTAs: Toyota red luminous buttons with motion
────────────────────────────────────────────────────────── */
const TOYOTA = {
  radius: "rounded-2xl",
  focus: "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EB0A1E]",
  red: "#EB0A1E",
};

interface RefinedTechExperienceProps {
  vehicle: VehicleModel;
  onBuild?: () => void;
  onTestDrive?: () => void;
}
interface TechFeature {
  id: string;
  title: string;
  description: string;
  features: string[];
  media: { type: "image" | "video"; url: string; thumbnail?: string }[];
  engineSpecific?: string[];
  gradeSpecific?: { [key: string]: string[] };
}

const RefinedTechExperience: React.FC<RefinedTechExperienceProps> = ({ vehicle, onBuild, onTestDrive }) => {
  const [selectedEngine, setSelectedEngine] = useState<"3.5L" | "4.0L">("3.5L");
  const [selectedGrade, setSelectedGrade] = useState<string>("Base");
  const [selectedFeature, setSelectedFeature] = useState<number>(0);

  const engines = [
    { name: "3.5L", power: "268 HP", torque: "336 Nm" },
    { name: "4.0L", power: "301 HP", torque: "365 Nm" },
  ] as const;

  const getGradesForEngine = (engine: string) =>
    engine === "4.0L"
      ? ["Limited","Platinum","TRD","GR-S","Signature","Elite","Black","Ultimate"]
      : ["Base","SE","XLE","Limited","Sport","Premium","Executive"];
  const allGrades = useMemo(() => getGradesForEngine(selectedEngine), [selectedEngine]);

  const techFeatures: TechFeature[] = [
    {
      id: "hybrid-drive",
      title: "Hybrid Synergy Drive",
      description: "Advanced hybrid with instant electric response",
      features: ["Seamless transition","Regenerative braking","EV mode","Battery monitoring"],
      media: [{ type: "image", url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/e661ede5-10d4-43d3-b507-3e9cf54d1e51?binary=true&mformat=true" }],
    },
    {
      id: "safety-sense",
      title: "Toyota Safety Sense 3.0",
      description: "AI-powered collision prevention",
      features: ["Pre-Collision","Lane Departure","Radar Cruise","Road Sign Assist"],
      media: [{ type: "image", url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true" }],
    },
  ];

  const currentFeature = techFeatures[selectedFeature];
  const fullList = currentFeature.gradeSpecific?.[selectedGrade] || currentFeature.features;

  const [showAllMobile, setShowAllMobile] = useState(false);
  const featuresMobile = showAllMobile ? fullList : fullList.slice(0, 2);

  const handlePrev = useCallback(() => setSelectedFeature((p) => (p > 0 ? p - 1 : techFeatures.length - 1)), []);
  const handleNext = useCallback(() => setSelectedFeature((p) => (p < techFeatures.length - 1 ? p + 1 : 0)), []);

  const [gradeQuery, setGradeQuery] = useState("");
  const [showGradeSheet, setShowGradeSheet] = useState(false);

  const filteredGrades = useMemo(() => {
    const q = gradeQuery.trim().toLowerCase();
    return q ? allGrades.filter((g) => g.toLowerCase().includes(q)) : allGrades;
  }, [allGrades, gradeQuery]);

  const handleSelectGrade = (g: string) => {
    setSelectedGrade(g);
    setShowGradeSheet(false);
  };

  // Parallax motion for media container
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: mediaRef, offset: ["start 80%", "end 20%"] });
  const mediaY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1.05, 0.95]);

  const Media = ({ m, alt }: { m: TechFeature["media"][number]; alt: string }) => {
    if (!m) return <div className="w-full h-full bg-gray-200" />;
    if (m.type === "video") {
      return (
        <motion.video style={{ y: mediaY, scale: mediaScale }} className={`w-full h-full object-cover ${TOYOTA.radius}`} src={m.url} poster={m.thumbnail} playsInline muted autoPlay loop />
      );
    }
    return (
      <motion.img style={{ y: mediaY, scale: mediaScale }} className={`w-full h-full object-cover ${TOYOTA.radius}`} src={m.url} alt={alt} loading="lazy" decoding="async" />
    );
  };

  // Cinematic cut variants for image transitions
  const cut = {
    initial: { opacity: 0, scale: 1.03, filter: "blur(4px)" as any },
    animate: { opacity: 1, scale: 1, filter: "blur(0px)" as any, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, scale: 0.98, filter: "blur(4px)" as any, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  } as const;

  return (
    <section className="py-20 md:py-32 bg-white relative overflow-hidden text-black">
      <div className="toyota-container relative z-10">
        {/* Trailer-style header sequence */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.3 } } }}
          className="text-center mb-20"
        >
          <motion.h2
            variants={{ hidden: { opacity: 0, y: 50 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold"
          >
            Refined <span className="text-[#EB0A1E]">Technology</span> Experience
          </motion.h2>
          <motion.p
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-4 text-base md:text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Intelligent systems presented in a cinematic Toyota journey.
          </motion.p>
        </motion.div>

        {/* Main content with staggered animation */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.3 } } }}
          className="grid md:grid-cols-12 gap-12 items-start"
        >
          {/* Left: selectors + details */}
          <motion.div
            variants={{ hidden: { opacity: 0, x: -60 }, show: { opacity: 1, x: 0 } }}
            transition={{ duration: 0.8 }}
            className="md:col-span-5 space-y-6"
          >
            <div className={["p-6 bg-gray-50 border border-gray-200", TOYOTA.radius].join(" ")}>
              <div className="mb-4">
                <div className="text-xs uppercase tracking-wider text-gray-500">Engine</div>
                <div className="flex gap-3 mt-2">
                  {engines.map((e) => (
                    <button
                      key={e.name}
                      onClick={() => setSelectedEngine(e.name)}
                      className={["px-4 py-2 text-sm font-medium", TOYOTA.radius, selectedEngine===e.name?"bg-[#EB0A1E] text-white":"bg-white text-gray-800 border border-gray-300 hover:border-[#EB0A1E]"].join(" ")}
                    >{e.name}</button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-xs uppercase tracking-wider text-gray-500">Grade</div>
                <button
                  onClick={() => setShowGradeSheet(true)}
                  className={["mt-2 w-full text-left px-4 py-3 bg-white border border-gray-300 text-gray-800", TOYOTA.radius].join(" ")}
                >{selectedGrade}</button>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Highlights</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  {fullList.map((f) => (
                    <li key={f}>• {f}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onBuild}
                  className={["h-12 px-6 text-sm font-medium", TOYOTA.radius, "bg-[#EB0A1E] text-white hover:opacity-90"].join(" ")}
                >
                  <Wrench className="h-4 w-4 inline mr-2"/> Build & Configure
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onTestDrive}
                  className={["h-12 px-6 text-sm font-medium border border-[#EB0A1E] text-[#EB0A1E] hover:bg-[#EB0A1E] hover:text-white", TOYOTA.radius].join(" ")}
                >
                  <Car className="h-4 w-4 inline mr-2"/> Test Drive
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Right: media + carousel */}
          <motion.div
            variants={{ hidden: { opacity: 0, x: 60 }, show: { opacity: 1, x: 0 } }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="md:col-span-7 space-y-6"
          >
            <div ref={mediaRef} className={`relative aspect-[16/9] ${TOYOTA.radius} overflow-hidden`}>
              <AnimatePresence mode="wait">
                <motion.div key={selectedFeature} variants={cut} initial="initial" animate="animate" exit="exit" className="absolute inset-0 will-change-transform will-change-filter">
                  <Media m={currentFeature.media[0]} alt={currentFeature.title} />
                </motion.div>
              </AnimatePresence>
              <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }} onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md">
                <ChevronLeft className="h-6 w-6 text-gray-800" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }} onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md">
                <ChevronRight className="h-6 w-6 text-gray-800" />
              </motion.button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={currentFeature.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45 }}>
                <h3 className="text-2xl md:text-3xl font-bold mb-2">{currentFeature.title}</h3>
                <p className="text-gray-600 text-sm md:text-base max-w-2xl">{currentFeature.description}</p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>

      {/* Grade sheet for mobile */}
      <AnimatePresence>
        {showGradeSheet && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40 flex items-end" onClick={()=>setShowGradeSheet(false)}>
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "tween", duration: 0.25 }} className={`w-full bg-white text-black p-6 ${TOYOTA.radius}`} onClick={(e)=>e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold">Select Grade</h4>
                <button onClick={()=>setShowGradeSheet(false)}><X className="h-5 w-5"/></button>
              </div>
              <div className="mb-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input className="w-full pl-9 pr-3 py-2 bg-transparent border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400" placeholder="Search grade" value={gradeQuery} onChange={(e)=>setGradeQuery(e.target.value)} />
                </div>
              </div>
              <div className="max-h-[50vh] overflow-y-auto grid grid-cols-2 gap-2">
                {filteredGrades.map((g) => (
                  <button key={g} onClick={()=>handleSelectGrade(g)} className={`px-3 py-2 rounded-lg border ${selectedGrade===g?"bg-[#EB0A1E] text-white border-transparent":"border-gray-300 text-gray-800 hover:bg-gray-100"}`}>{g}</button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default RefinedTechExperience;
