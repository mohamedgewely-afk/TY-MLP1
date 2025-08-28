
import { EnhancedSceneData } from "@/types/gallery";

export const ENHANCED_GALLERY_DATA: EnhancedSceneData[] = [
  // Exterior Category
  {
    id: "lc-exterior-design",
    title: "Iconic Design Language",
    subtitle: "Bold. Commanding. Unmistakable.",
    scene: "Exterior",
    experienceType: "gallery",
    description: "Explore the Land Cruiser's distinctive design elements that command respect on any terrain.",
    media: {
      primaryImage: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/f6516ca6-e2fd-4869-bfff-20532eda7b71/renditions/63c413af-8759-4581-a01b-905989f7d391?binary=true&mformat=true",
      gallery: [
        "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/f6516ca6-e2fd-4869-bfff-20532eda7b71/renditions/63c413af-8759-4581-a01b-905989f7d391?binary=true&mformat=true",
        "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/cce498b4-5dab-4a8c-9684-ca2a175103b7/renditions/8b82d3c6-0df7-4252-b3cc-7977595ace57?binary=true&mformat=true"
      ]
    },
    specs: {
      "Ground Clearance": "230mm",
      "Approach Angle": "31°",
      "Departure Angle": "22°",
      "Body Type": "7-Seater SUV"
    },
    featured: true,
    tags: ["design", "exterior", "styling"]
  },
  {
    id: "lc-exterior-360",
    title: "360° Exterior Tour",
    subtitle: "Every angle tells a story",
    scene: "Exterior",
    experienceType: "360tour",
    description: "Take a complete walk around the Land Cruiser and discover design details from every perspective.",
    media: {
      primaryImage: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/f6516ca6-e2fd-4869-bfff-20532eda7b71/renditions/63c413af-8759-4581-a01b-905989f7d391?binary=true&mformat=true",
      tour360Url: "#360-tour"
    },
    ctaButtons: [
      { label: "Start 360° Tour", action: "start360", primary: true, icon: "RotateCcw" },
      { label: "View Gallery", action: "gallery", icon: "Images" }
    ],
    duration: "2-3 min",
    tags: ["360", "interactive", "exterior"]
  },

  // Urban Category
  {
    id: "lc-urban-lifestyle",
    title: "City Confidence",
    subtitle: "Luxury meets practicality",
    scene: "Urban",
    experienceType: "video",
    description: "Experience how the Land Cruiser seamlessly transitions from city streets to weekend adventures.",
    media: {
      primaryImage: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/cce498b4-5dab-4a8c-9684-ca2a175103b7/renditions/8b82d3c6-0df7-4252-b3cc-7977595ace57?binary=true&mformat=true",
      videoUrl: "#urban-video"
    },
    specs: {
      "Fuel Economy": "10.0L/100km",
      "Parking Assist": "360° Camera",
      "Urban Features": "Traffic Sign Recognition",
      "Comfort": "Climate Control"
    },
    ctaButtons: [
      { label: "Watch Video", action: "playVideo", primary: true, icon: "Play" },
      { label: "Book Test Drive", action: "testDrive", icon: "Calendar" }
    ],
    duration: "3:45",
    featured: true,
    tags: ["city", "lifestyle", "comfort"]
  },
  {
    id: "lc-urban-parking",
    title: "Smart Parking Solutions",
    subtitle: "Park with confidence anywhere",
    scene: "Urban",
    experienceType: "interactive",
    description: "Discover advanced parking assistance technologies that make city driving effortless.",
    media: {
      primaryImage: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/cce498b4-5dab-4a8c-9684-ca2a175103b7/renditions/8b82d3c6-0df7-4252-b3cc-7977595ace57?binary=true&mformat=true"
    },
    interactionData: {
      hotspots: [
        { x: 0.3, y: 0.6, title: "360° Camera", description: "Bird's eye view for tight spaces" },
        { x: 0.7, y: 0.4, title: "Parking Sensors", description: "Front and rear proximity alerts" },
        { x: 0.5, y: 0.8, title: "Auto Park", description: "Hands-free parallel parking" }
      ]
    },
    specs: {
      "360° Camera": "Multi-angle view",
      "Parking Sensors": "Front & Rear",
      "Auto Park": "Parallel & Perpendicular",
      "Display": "12.3\" Touchscreen"
    },
    difficulty: "beginner",
    tags: ["parking", "technology", "safety"]
  },

  // Capability Category
  {
    id: "lc-capability-offroad",
    title: "Conquer Any Terrain",
    subtitle: "Born for the impossible",
    scene: "Capability",
    experienceType: "video",
    description: "Witness the Land Cruiser's legendary off-road capabilities in the most challenging environments.",
    media: {
      primaryImage: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/f9670484-f03f-46ba-aac8-424889e779a0/renditions/ad34680c-160b-43a6-9785-541adba34a45?binary=true&mformat=true",
      videoUrl: "#offroad-video"
    },
    specs: {
      "4WD System": "Full-time with locking diffs",
      "Crawl Control": "5 speed settings",
      "Multi-Terrain": "6 driving modes",
      "Wading Depth": "700mm"
    },
    ctaButtons: [
      { label: "Watch Off-Road", action: "playVideo", primary: true, icon: "Play" },
      { label: "Learn Features", action: "features", icon: "Compass" }
    ],
    duration: "4:20",
    featured: true,
    tags: ["offroad", "capability", "adventure"]
  },
  {
    id: "lc-capability-comparison",
    title: "Before vs After Upgrades",
    subtitle: "See the enhancement difference",
    scene: "Capability",
    experienceType: "comparison",
    description: "Compare standard versus enhanced off-road configurations side by side.",
    media: {
      primaryImage: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/f9670484-f03f-46ba-aac8-424889e779a0/renditions/ad34680c-160b-43a6-9785-541adba34a45?binary=true&mformat=true"
    },
    interactionData: {
      comparison: {
        beforeImage: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/f9670484-f03f-46ba-aac8-424889e779a0/renditions/ad34680c-160b-43a6-9785-541adba34a45?binary=true&mformat=true",
        afterImage: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/f9670484-f03f-46ba-aac8-424889e779a0/renditions/ad34680c-160b-43a6-9785-541adba34a45?binary=true&mformat=true",
        beforeLabel: "Standard Configuration",
        afterLabel: "Enhanced Off-Road Package"
      }
    },
    specs: {
      "Standard": "Basic 4WD system",
      "Enhanced": "+ KDSS suspension",
      "Upgrade": "+ Locking differentials",
      "Premium": "+ Crawl Control"
    },
    tags: ["comparison", "upgrades", "configuration"]
  },

  // Interior Category
  {
    id: "lc-interior-luxury",
    title: "Crafted Interior",
    subtitle: "Where luxury meets functionality",
    scene: "Interior",
    experienceType: "gallery",
    description: "Step inside a meticulously crafted cabin designed for both comfort and capability.",
    media: {
      primaryImage: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/5ae14c90-6ca2-49dd-a596-e3e4b2bf449b/renditions/62240799-f5a0-4728-80b3-c928ff0d6985?binary=true&mformat=true",
      gallery: [
        "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/5ae14c90-6ca2-49dd-a596-e3e4b2bf449b/renditions/62240799-f5a0-4728-80b3-c928ff0d6985?binary=true&mformat=true"
      ]
    },
    specs: {
      "Seating": "Premium leather, 8-way power",
      "Display": "12.3\" infotainment",
      "Climate": "Tri-zone automatic",
      "Audio": "Premium JBL system"
    },
    featured: true,
    tags: ["luxury", "interior", "comfort"]
  },
  {
    id: "lc-interior-tech",
    title: "Technology Hub",
    subtitle: "Connected and intelligent",
    scene: "Interior",
    experienceType: "interactive",
    description: "Explore the advanced technology features that keep you connected and in control.",
    media: {
      primaryImage: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/5ae14c90-6ca2-49dd-a596-e3e4b2bf449b/renditions/62240799-f5a0-4728-80b3-c928ff0d6985?binary=true&mformat=true"
    },
    interactionData: {
      hotspots: [
        { x: 0.5, y: 0.4, title: "12.3\" Display", description: "Toyota Smart Connect with navigation" },
        { x: 0.3, y: 0.6, title: "Wireless Charging", description: "Qi-compatible smartphone charging" },
        { x: 0.7, y: 0.5, title: "Premium Audio", description: "14-speaker JBL sound system" }
      ]
    },
    specs: {
      "Connectivity": "Apple CarPlay & Android Auto",
      "Navigation": "Connected services",
      "Voice Control": "Natural language processing",
      "Updates": "Over-the-air capability"
    },
    difficulty: "intermediate",
    tags: ["technology", "connectivity", "infotainment"]
  },

  // Night Category
  {
    id: "lc-night-elegance",
    title: "After Dark Elegance",
    subtitle: "Sophisticated presence",
    scene: "Night",
    experienceType: "gallery",
    description: "Experience the Land Cruiser's commanding presence and sophisticated lighting design after sunset.",
    media: {
      primaryImage: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/0e241336-53f3-4bd0-8c67-61baf34bfdbd/renditions/cda649a1-788a-481d-a794-15dc2d9f7d64?binary=true&mformat=true",
      gallery: [
        "https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/0e241336-53f3-4bd0-8c67-61baf34bfdbd/renditions/cda649a1-788a-481d-a794-15dc2d9f7d64?binary=true&mformat=true"
      ]
    },
    specs: {
      "LED Headlights": "Adaptive beam control",
      "Ambient Lighting": "64-color interior",
      "Safety Lighting": "Automatic high beam",
      "Signature": "LED daytime running lights"
    },
    featured: true,
    tags: ["night", "lighting", "elegance"]
  },

  // Performance Category
  {
    id: "lc-performance-engine",
    title: "Power & Efficiency",
    subtitle: "V6 Twin-Turbo Excellence",
    scene: "Performance",
    experienceType: "feature-focus",
    description: "Discover the advanced engineering behind the Land Cruiser's powerful yet efficient engine.",
    media: {
      primaryImage: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/f6516ca6-e2fd-4869-bfff-20532eda7b71/renditions/63c413af-8759-4581-a01b-905989f7d391?binary=true&mformat=true"
    },
    specs: {
      "Engine": "3.5L V6 Twin-Turbo",
      "Power": "409 hp",
      "Torque": "650 Nm",
      "Transmission": "10-speed automatic"
    },
    ctaButtons: [
      { label: "Technical Details", action: "specs", primary: true, icon: "Settings" },
      { label: "Test Drive", action: "testDrive", icon: "Zap" }
    ],
    tags: ["performance", "engine", "power"]
  }
];

export const CATEGORY_DESCRIPTIONS = {
  "All": "Complete Land Cruiser experience collection",
  "Exterior": "Bold design that commands respect",
  "Urban": "City sophistication meets weekend adventure",
  "Capability": "Legendary off-road performance",
  "Interior": "Luxurious comfort and advanced technology",
  "Night": "Elegant presence after dark",
  "Performance": "Power, efficiency, and engineering excellence",
  "Safety": "Advanced protection and peace of mind",
  "Technology": "Connected, intelligent, and intuitive"
};

export const EXPERIENCE_TYPE_LABELS = {
  "gallery": "Photo Gallery",
  "video": "Video Experience",
  "360tour": "360° Tour",
  "comparison": "Compare",
  "interactive": "Interactive",
  "feature-focus": "Feature Focus"
};
