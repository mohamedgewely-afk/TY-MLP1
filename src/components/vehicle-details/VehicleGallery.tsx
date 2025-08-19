
// FULL SCI-FI DASHBOARD VERSION
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Volume2, VolumeX, BatteryCharging, GaugeCircle, Zap, TimerReset, Navigation, Gauge } from "lucide-react";
import Lottie from "lottie-react";
import sparksAnimation from "../animations/sparks.json";
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
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/f6516ca6-e2fd-4869-bfff-20532eda7b71/renditions/63c413af-8759-4581-a01b-905989f7d391?binary=true&mformat=true",
    description: "Whispers through wind with a roar that only the soul hears.",
    audio: "/audio/celestis.mp3",
    video: "/videos/celestis.mp4",
    story: [
      "Born in the wind tunnels of a forgotten desert.",
      "Crafted with nanostructures that sing in silence.",
      "The Celestis X became the legend every night driver whispers about."
    ],
    specs: {
      horsepower: "620 hp",
      torque: "800 Nm",
      range: "520 km",
      zeroToSixty: "2.9s",
      topSpeed: "310 km/h",
      battery: "100 kWh",
    },
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
    if (globalAudioOn) {
      globalAudioRef.current?.play();
    } else {
      globalAudioRef.current?.pause();
    }
  }, [globalAudioOn]);

  return (
    <section className="relative w-full bg-gradient-to-b from-black via-zinc-900 to-black text-white py-16 px-4 md:px-12 overflow-hidden">
      <audio ref={globalAudioRef} loop src="/audio/global-theme.mp3" className="hidden" />

      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={() => setGlobalAudioOn(!globalAudioOn)}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
        >
          {globalAudioOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
        </button>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/30 via-transparent to-black absolute inset-0 z-0 animate-pulse" />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto mb-16">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-indigo-100 glow">The Soul of Machines</h2>
        <p className="mt-4 text-lg text-indigo-300/80">
          A dashboard beyond time. Experience your machine like never before.
        </p>
      </div>

      <div className="relative z-10 flex justify-center pb-6">
        {vehicles.map((car, index) => (
          <ParallaxCard
            key={car.id}
            car={car}
            onClick={() => setSelected(index)}
          />
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
      className="min-w-[90vw] max-w-5xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-black rounded-3xl border border-indigo-600/30 overflow-hidden group transition-all duration-500 shadow-xl hover:shadow-indigo-500/50 relative"
      whileHover={{ scale: 1.015 }}
      style={{ x, y, rotateX, rotateY }}
      drag
      dragElastic={0.18}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onClick={onClick}
    >
      <Lottie
        animationData={sparksAnimation}
        loop
        autoplay
        className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
      />

      <div className="relative">
        <img
          src={car.image}
          alt={car.name}
          className="w-full h-96 object-cover object-center group-hover:brightness-110 transition duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
      </div>

      <div className="p-6 relative z-10">
        <h3 className="text-3xl font-semibold text-white glow mb-1">{car.name}</h3>
        <p className="text-indigo-400 text-sm mb-4 font-mono tracking-wide uppercase">
          {car.subtitle}
        </p>
        <p className="text-white/80 text-sm mb-6 italic max-w-lg">{car.description}</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(car.specs).map(([key, val], i) => (
            <motion.div
              key={key}
              className="flex items-center gap-3 text-sm bg-gradient-to-br from-indigo-900/30 via-black/10 to-zinc-800/10 backdrop-blur-sm rounded-lg p-3 border border-indigo-400/10 shadow-sm"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.12, duration: 0.5, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              {specIcons[key] ?? <Zap className="text-indigo-400 w-5 h-5" />}
              <div className="flex flex-col">
                <span className="uppercase text-[10px] text-indigo-300 tracking-wide">{key}</span>
                <span className="font-semibold text-indigo-100 text-base">{val}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <button className="mt-6 inline-flex items-center gap-2 text-indigo-300 hover:text-indigo-100 transition text-sm font-semibold">
          Enter the Realm
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

function Modal({ car, onClose }: { car: CarData; onClose: () => void }) {
  const [chapter, setChapter] = useState(0);
  const hasNext = chapter < car.story.length - 1;
  const hasPrev = chapter > 0;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <div className="relative bg-zinc-950 rounded-3xl max-w-5xl w-full mx-4 shadow-2xl">
        <button
          className="absolute top-4 right-4 text-white text-xl"
          onClick={onClose}
        >
          ✕
        </button>

        <video
          src={car.video}
          autoPlay
          muted
          loop
          className="w-full h-96 object-cover rounded-t-3xl"
        />

        <div className="p-6 space-y-4">
          <h2 className="text-3xl font-bold text-white glow">{car.name}</h2>
          <p className="text-indigo-400 text-sm font-mono uppercase">{car.subtitle}</p>
          <p className="text-white/80 text-base italic">{car.story[chapter]}</p>

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setChapter((prev) => Math.max(0, prev - 1))}
              disabled={!hasPrev}
              className="text-sm px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white disabled:opacity-30"
            >
              ◀ Previous
            </button>

            <button
              onClick={() => setChapter((prev) => Math.min(car.story.length - 1, prev + 1))}
              disabled={!hasNext}
              className="text-sm px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white disabled:opacity-30"
            >
              Next ▶
            </button>
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
