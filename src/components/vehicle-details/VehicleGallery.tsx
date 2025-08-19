// FULL SCI-FI DASHBOARD VERSION WITH MULTI-VEHICLE CAROUSEL, SWIPE, AUTOPLAY CINEMATIC
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Volume2, VolumeX, BatteryCharging, GaugeCircle, Zap, TimerReset, Navigation, Gauge, X } from "lucide-react";
import Lottie from "lottie-react";
import sparksAnimation from "../animations/sparks.json";
import { useSwipeable } from "@/hooks/use-swipeable";
import { VehicleModel } from "@/types/vehicle";

interface VehicleGalleryProps {
  vehicle: VehicleModel;
}

interface CarData {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  description: string;
  audio: string;
  video: string;
  story: string[];
  specs: {
    horsepower: string;
    torque: string;
    range: string;
    zeroToSixty: string;
    topSpeed: string;
    battery: string;
  };
  mmeUrl: string;
  configureUrl: string;
  price: number;
  category: string;
  features: string[];
}

const vehicles: CarData[] = [
  {
    id: "corolla-hybrid",
    name: "Corolla Hybrid",
    subtitle: "The Future of Efficiency",
    image: "/placeholder.svg",
    description: "Experience the perfect balance of performance and efficiency with our revolutionary hybrid technology.",
    audio: "/audio/corolla-theme.mp3",
    video: "/placeholder.svg",
    story: [
      "In the heart of innovation lies the Corolla Hybrid, where efficiency meets performance in perfect harmony.",
      "Every journey becomes an adventure with intelligent hybrid technology that adapts to your driving style.",
      "Discover a new dimension of automotive excellence where sustainability and power converge."
    ],
    specs: {
      horsepower: "121 HP",
      torque: "105 lb-ft",
      range: "614 miles",
      zeroToSixty: "10.6 sec",
      topSpeed: "112 mph",
      battery: "1.3 kWh"
    },
    mmeUrl: "/mme/corolla",
    configureUrl: "/configure/corolla",
    price: 25000,
    category: "Hybrid",
    features: ["Hybrid Technology", "Safety Sense 2.0", "Entune 3.0"]
  },
  {
    id: "prius-prime",
    name: "Prius Prime",
    subtitle: "Plug-in Perfection",
    image: "/placeholder.svg",
    description: "Step into tomorrow with our most advanced hybrid technology and all-electric driving capability.",
    audio: "/audio/prius-theme.mp3",
    video: "/placeholder.svg",
    story: [
      "The Prius Prime represents the pinnacle of hybrid evolution, offering pure electric driving for daily commutes.",
      "With advanced aerodynamics and cutting-edge technology, every mile is a statement of environmental consciousness.",
      "Experience the future today with seamless transitions between electric and hybrid modes."
    ],
    specs: {
      horsepower: "114 HP",
      torque: "105 lb-ft",
      range: "690 miles",
      zeroToSixty: "9.8 sec",
      topSpeed: "115 mph",
      battery: "8.8 kWh"
    },
    mmeUrl: "/mme/prius",
    configureUrl: "/configure/prius",
    price: 32000,
    category: "Plug-in Hybrid",
    features: ["Plug-in Hybrid", "Solar Roof", "Advanced Safety"]
  },
  {
    id: "rav4-hybrid",
    name: "RAV4 Hybrid",
    subtitle: "Adventure Electrified",
    image: "/placeholder.svg",
    description: "Unleash your adventurous spirit with hybrid power that takes you further on every trail.",
    audio: "/audio/rav4-theme.mp3",
    video: "/placeholder.svg",
    story: [
      "Where rugged capability meets hybrid efficiency, the RAV4 Hybrid opens new possibilities for exploration.",
      "Conquer any terrain with intelligent all-wheel drive and the confidence of hybrid reliability.",
      "Your next adventure awaits with the perfect blend of power, efficiency, and versatility."
    ],
    specs: {
      horsepower: "219 HP",
      torque: "163 lb-ft",
      range: "580 miles",
      zeroToSixty: "7.8 sec",
      topSpeed: "118 mph",
      battery: "1.6 kWh"
    },
    mmeUrl: "/mme/rav4",
    configureUrl: "/configure/rav4",
    price: 35000,
    category: "SUV Hybrid",
    features: ["AWD", "Adventure Ready", "Hybrid Power"]
  }
];

const specIcons: Record<string, JSX.Element> = {
  horsepower: <Zap className="text-indigo-400 w-5 h-5" />, 
  torque: <GaugeCircle className="text-indigo-400 w-5 h-5" />,
  range: <Navigation className="text-indigo-400 w-5 h-5" />, 
  zeroToSixty: <TimerReset className="text-indigo-400 w-5 h-5" />,
  topSpeed: <Gauge className="text-indigo-400 w-5 h-5" />, 
  battery: <BatteryCharging className="text-indigo-400 w-5 h-5" />,
};

export default function VehicleGallery({ vehicle }: VehicleGalleryProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [globalAudioOn, setGlobalAudioOn] = useState(false);
  const globalAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (globalAudioOn) globalAudioRef.current?.play();
    else globalAudioRef.current?.pause();
  }, [globalAudioOn]);

  // Auto open cinematic modal after 2s
  useEffect(() => {
    const timeout = setTimeout(() => setSelected(0), 2000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section className="relative w-full bg-black text-white py-16 px-4 md:px-12 overflow-hidden">
      <audio ref={globalAudioRef} loop src="/audio/global-theme.mp3" className="hidden" />
      <div className="absolute top-6 right-6 z-50">
        <button onClick={() => setGlobalAudioOn(!globalAudioOn)} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white">
          {globalAudioOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
        </button>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-black absolute inset-0 z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-600/10 via-transparent to-transparent animate-pulse" />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto mb-16">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight">The Soul of Machines</h2>
        <p className="mt-4 text-lg text-white/70">A dashboard beyond time. Experience your machine like never before.</p>
      </div>

      <div className="relative z-10 flex gap-10 overflow-x-auto snap-x snap-mandatory pb-6 scroll-smooth">
        {vehicles.map((car, index) => (
          <ParallaxCard key={car.id} car={car} onClick={() => setSelected(index)} />
        ))}
      </div>

      {selected !== null && (
        <Modal car={vehicles[selected]} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}

function ParallaxCard({ car, onClick }: { car: CarData; onClick: () => void }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

  return (
    <motion.div
      className="snap-center min-w-[85vw] md:min-w-[600px] bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-3xl border border-indigo-600/20 overflow-hidden group transition-all duration-500 shadow-lg hover:shadow-indigo-500/30 relative"
      whileHover={{ scale: 1.02 }}
      style={{ x, y, rotateX, rotateY }}
      drag dragElastic={0.18} dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onClick={onClick}
    >
      <Lottie animationData={sparksAnimation} loop autoplay className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" />
      <div className="relative">
        <img src={car.image} alt={car.name} className="w-full h-72 object-cover object-center group-hover:brightness-110 transition duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      </div>
      <div className="p-6 relative z-10">
        <h3 className="text-2xl font-semibold text-white shimmer">{car.name}</h3>
        <p className="text-indigo-400 text-sm mb-2">{car.subtitle}</p>
        <p className="text-white/80 text-sm mb-4">{car.description}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(car.specs).map(([key, val], i) => (
            <motion.div
              key={key}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur border border-white/10"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.5 }} viewport={{ once: true }}
            >
              {specIcons[key]}
              <div className="text-sm">
                <div className="uppercase text-indigo-300 text-[10px] tracking-wider">{key}</div>
                <div className="text-white font-semibold text-base">{val}</div>
              </div>
            </motion.div>
          ))}
        </div>
        <button className="mt-6 inline-flex items-center gap-2 text-indigo-300 hover:text-indigo-100 transition text-sm font-semibold">
          Enter the Realm <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

function Modal({ car, onClose }: { car: CarData; onClose: () => void }) {
  const [chapter, setChapter] = useState(0);
  const handlers = useSwipeable({ 
    onSwipeLeft: () => setChapter((c) => Math.min(car.story.length - 1, c + 1)), 
    onSwipeRight: () => setChapter((c) => Math.max(0, c - 1)) 
  });
  const hasNext = chapter < car.story.length - 1;
  const hasPrev = chapter > 0;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center" {...handlers}>
      <div className="relative bg-zinc-950 rounded-3xl max-w-5xl w-full mx-4 shadow-2xl overflow-hidden">
        <button className="absolute top-4 right-4 text-white z-50" onClick={onClose}><X className="w-6 h-6" /></button>
        <video src={car.video} autoPlay muted loop className="w-full h-96 object-cover rounded-t-3xl" />
        <div className="p-6 space-y-4">
          <h2 className="text-3xl font-bold text-white">{car.name}</h2>
          <p className="text-indigo-400 text-sm">{car.subtitle}</p>
          <p className="text-white/80 text-base italic">{car.story[chapter]}</p>
          <div className="flex justify-between items-center mt-4">
            <button onClick={() => setChapter((c) => Math.max(0, c - 1))} disabled={!hasPrev} className="text-sm px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white disabled:opacity-30">◀ Previous</button>
            <button onClick={() => setChapter((c) => Math.min(car.story.length - 1, c + 1))} disabled={!hasNext} className="text-sm px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white disabled:opacity-30">Next ▶</button>
          </div>
          <audio controls className="w-full mt-4">
            <source src={car.audio} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      </div>
    </div>
  );
}
