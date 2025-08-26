
import { Gauge, Shield, Smartphone, Wind, Award, PencilRuler } from "lucide-react";

export interface VehicleSlide {
  key: string;
  title: string;
  subtitle: string;
  image: string;
  icon: JSX.Element;
  meta: string[];
  cta: {
    label: string;
    onClick: () => void;
  };
}

export const createVehicleSlides = (
  galleryImages: string[],
  setIsBookingOpen: (open: boolean) => void,
  navigate: (path: string) => void,
  setIsFinanceOpen: (open: boolean) => void,
  setIsCarBuilderOpen: (open: boolean) => void
): VehicleSlide[] => [
  {
    key: "performance",
    title: "Performance",
    subtitle: "Immediate response with confident control.",
    image: galleryImages[2],
    icon: <Gauge className="h-5 w-5" />,
    meta: ["Smooth acceleration", "Balanced handling", "Quiet cabin"],
    cta: { label: "Feel it – Test Drive", onClick: () => setIsBookingOpen(true) },
  },
  {
    key: "safety",
    title: "Safety Sense",
    subtitle: "Proactive protection, 360° awareness.",
    image: galleryImages[1],
    icon: <Shield className="h-5 w-5" />,
    meta: ["Adaptive systems", "Collision assist", "Lane guidance"],
    cta: { label: "See Safety Suite", onClick: () => navigate("/safety") },
  },
  {
    key: "connected",
    title: "Connected Life",
    subtitle: "Wireless Apple CarPlay & Android Auto.",
    image: galleryImages[0],
    icon: <Smartphone className="h-5 w-5" />,
    meta: ["Voice control", "Remote start", "OTA‑ready"],
    cta: { label: "Explore Connectivity", onClick: () => navigate("/connect") },
  },
  {
    key: "comfort",
    title: "Comfort & Climate",
    subtitle: "Dual‑zone control and clean air tech.",
    image: galleryImages[1],
    icon: <Wind className="h-5 w-5" />,
    meta: ["HEPA filtration", "Whisper quiet", "Smart venting"],
    cta: { label: "Inside the Cabin", onClick: () => navigate("/interior") },
  },
  {
    key: "ownership",
    title: "Ownership",
    subtitle: "Clear pricing, finance made simple.",
    image: galleryImages[2],
    icon: <Award className="h-5 w-5" />,
    meta: ["Flexible EMI", "Trade‑in support", "Top‑rated service"],
    cta: { label: "Calculate EMI", onClick: () => setIsFinanceOpen(true) },
  },
  {
    key: "build",
    title: "Build & Offers",
    subtitle: "Pick your trim, colors, accessories.",
    image: galleryImages[0],
    icon: <PencilRuler className="h-5 w-5" />,
    meta: ["Live price", "Compare trims", "Limited‑time offers"],
    cta: { label: "Start Building", onClick: () => setIsCarBuilderOpen(true) },
  },
];
