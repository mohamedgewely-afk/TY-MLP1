// FINAL VERSION: Spec animations tied to scroll depth using framer-motion scroll progress
import { motion, useMotionValue, useTransform, useInView, useScroll } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Volume2, VolumeX, BatteryCharging, GaugeCircle, Zap, TimerReset, Navigation, Gauge, X, ChevronDown } from "lucide-react";
import Lottie from "lottie-react";
import sparksAnimation from "../animations/sparks.json";
import { useSwipeable } from "react-swipeable";
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
}

const vehicles: CarData[] = [
  {
    id: "1",
    name: "Celestis X",
    subtitle: "The Silent Thunder",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/f6516ca6-e2fd-4869-bfff-20532eda7b71/renditions/63c413af-8759-4581-a01b-905989f7d391?binary=true&mformat=true",
    description: "Whispers through wind with a roar that only the soul hears.",
    audio: "/audio/celestis.mp3",
    video: "/videos/celestis.mp4",
    story: ["Born in the wind tunnels of a forgotten desert.", "Crafted with nanostructures that sing in silence.", "The Celestis X became the legend every night driver whispers about."],
    specs: { horsepower: "620 hp", torque: "800 Nm", range: "520 km", zeroToSixty: "2.9s", topSpeed: "300 km/h", battery: "100 kWh" },
  },
  {
    id: "2",
    name: "Nebula R",
    subtitle: "Starborne Velocity",
    image: "https://images.unsplash.com/photo-1624228912050-20e2de8f4ecf?auto=format&fit=crop&w=1950&q=80",
    description: "Forged in orbital silence. Thrives in acceleration.",
    audio: "/audio/nebula.mp3",
    video: "/videos/nebula.mp4",
    story: ["Designed by a team that engineered satellite launchers.", "Its plasma-composite frame reduces weight beyond limits.", "The Nebula R redefined terrestrial velocity."],
    specs: { horsepower: "700 hp", torque: "900 Nm", range: "610 km", zeroToSixty: "2.4s", topSpeed: "340 km/h", battery: "110 kWh" },
  },
  {
    id: "3",
    name: "Volt Mirage",
    subtitle: "The Vanishing Pulse",
    image: "https://images.unsplash.com/photo-1603393079325-d7b87e9e1b8f?auto=format&fit=crop&w=1950&q=80",
    description: "Disappears before your eyes. Feels like a whisper.",
    audio: "/audio/mirage.mp3",
    video: "/videos/mirage.mp4",
    story: ["Born from optical illusion R&D.", "The Volt Mirage uses light-bending panels.", "It became known as the invisible thrill."],
    specs: { horsepower: "560 hp", torque: "760 Nm", range: "480 km", zeroToSixty: "3.2s", topSpeed: "280 km/h", battery: "90 kWh" },
  },
  {
    id: "4",
    name: "Orion Prime",
    subtitle: "Command From the Cosmos",
    image: "https://images.unsplash.com/photo-1617882586515-7e27c3923f49?auto=format&fit=crop&w=1950&q=80",
    description: "A cruiser reborn with interstellar DNA.",
    audio: "/audio/orion.mp3",
    video: "/videos/orion.mp4",
    story: ["The Orion Prime was sculpted using Martian rover tech.", "Equipped with gravitational dampening.", "No ride has ever felt smoother at any speed."],
    specs: { horsepower: "850 hp", torque: "1050 Nm", range: "700 km", zeroToSixty: "2.1s", topSpeed: "360 km/h", battery: "120 kWh" },
  },
  {
    id: "5",
    name: "Nova Geist",
    subtitle: "The Electric Phantom",
    image: "https://images.unsplash.com/photo-1616441006784-f1f1ff57e67d?auto=format&fit=crop&w=1950&q=80",
    description: "A silhouette in the night. Pure silence, pure power.",
    audio: "/audio/nova.mp3",
    video: "/videos/nova.mp4",
    story: ["Engineered in moonlight.", "The Nova Geist glides like smoke.", "A phantom experience, undetectable to radar."],
    specs: { horsepower: "610 hp", torque: "850 Nm", range: "590 km", zeroToSixty: "2.7s", topSpeed: "310 km/h", battery: "95 kWh" },
  },
  {
    id: "6",
    name: "Stratus V",
    subtitle: "The Sky Runner",
    image: "https://images.unsplash.com/photo-1632457992562-2d39ed63c7cf?auto=format&fit=crop&w=1950&q=80",
    description: "Glides through air with zero drag instincts.",
    audio: "/audio/stratus.mp3",
    video: "/videos/stratus.mp4",
    story: ["Wind tunnel tested by jet engineers.", "Redefined what automotive aerodynamics means.", "The Stratus V — light as air, sharp as thought."],
    specs: { horsepower: "590 hp", torque: "770 Nm", range: "550 km", zeroToSixty: "2.6s", topSpeed: "295 km/h", battery: "102 kWh" },
  },
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

  const currentBackground = vehicles[selected ?? 0]?.image;

  return (
    <section className="relative w-full bg-black text-white py-16 px-4 md:px-12 overflow-hidden">
      <audio ref={globalAudioRef} loop src="/audio/global-theme.mp3" className="hidden" />
      <div className="absolute top-6 right-6 z-50">
        <button onClick={() => setGlobalAudioOn(!globalAudioOn)} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white">
          {globalAudioOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
        </button>
      </div>

      <div className="absolute inset-0 -z-10 transition-all duration-1000" style={{ backgroundImage: `url(${currentBackground})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.08 }} />

      <div className="absolute inset-0 pointer-events-none">
        <div className="bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-black absolute inset-0 z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-600/10 via-transparent to-transparent animate-pulse" />
      </div>

      <div className="sticky top-10 z-10 text-center max-w-4xl mx-auto mb-16">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight">The Soul of Machines</h2>
        <p className="mt-4 text-lg text-white/70">A dashboard beyond time. Experience your machine like never before.</p>
        <p className="mt-2 text-sm text-indigo-300">Swipe a model → Tap for cinematic journey</p>
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
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({ target: ref });
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1]);
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      className={`snap-center min-w-[85vw] md:min-w-[600px] bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-3xl border border-indigo-600/20 overflow-hidden group transition-all duration-500 shadow-lg hover:shadow-indigo-500/30 relative ${expanded ? 'max-h-[1000px]' : 'max-h-[600px]'}`}
      whileHover={{ scale: 1.02 }}
      style={{ x, y, rotateX, rotateY }}
      drag dragElastic={0.18} dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
    >
      <Lottie animationData={sparksAnimation} loop autoplay className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" />
      <div className="relative cursor-pointer" onClick={onClick}>
        <img src={car.image} alt={car.name} className="w-full h-72 object-cover object-center group-hover:brightness-110 transition duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      </div>
      <div className="p-6 relative z-10" ref={ref}>
        <h3 className="text-2xl font-semibold text-white shimmer">{car.name}</h3>
        <p className="text-indigo-400 text-sm mb-2">{car.subtitle}</p>
        <p className="text-white/80 text-sm mb-4 line-clamp-3">{car.description}</p>
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
          style={{ scale, opacity }}
        >
          {Object.entries(car.specs).map(([key, val]) => (
            <div key={key} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur border border-white/10">
              {specIcons[key]}
              <div className="text-sm">
                <div className="uppercase text-indigo-300 text-[10px] tracking-wider">{key}</div>
                <div className="text-white font-semibold text-base">{val}</div>
              </div>
            </div>
          ))}
        </motion.div>
        <button onClick={() => setExpanded(!expanded)} className="mt-6 inline-flex items-center gap-2 text-indigo-300 hover:text-indigo-100 transition text-sm font-semibold">
          {expanded ? 'Collapse' : 'Expand'} Specs <ChevronDown className={`w-4 h-4 transform transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
        <button onClick={onClick} className="block mt-4 text-white/80 hover:text-white text-sm underline">Enter the Realm</button>
      </div>
    </motion.div>
  );
}
