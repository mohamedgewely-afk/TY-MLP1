
import { Persona, PersonaType } from "@/types/persona";

export const personas: Record<PersonaType & string, Persona> = {
  "family-first": {
    id: "family-first",
    title: "Family First",
    icon: "👨‍👩‍👧‍👦",
    description: "Safety, space, and comfort for the whole family",
    colorScheme: {
      primary: "#4A6DA7",
      secondary: "#8FB0EA",
      accent: "#F2C94C",
      background: "bg-blue-50",
    },
    headlineText: "Room for Everyone, Safety for All",
    subheadlineText: "Discover Toyota hybrids built with your family's comfort and security in mind",
    ctaText: "Explore Family-Friendly Models",
    backgroundImage: "",
    quickLinks: [
      { title: "Safety Features", href: "#safety" },
      { title: "Cargo Space", href: "#cargo" },
      { title: "3rd Row Options", href: "#seating" },
      { title: "Child Safety", href: "#child-safety" }
    ],
    highlightedSections: ["safety", "comfort", "space"],
    buttonTextStyle: "Build Your Family Toyota",
    fontFamily: "'Nunito', sans-serif",
    animationStyle: "fade",
    borderStyle: "rounded-xl border-2 border-blue-300",
    iconSet: [
      { name: "shield", color: "#4A6DA7" },
      { name: "users", color: "#4A6DA7" },
      { name: "home", color: "#4A6DA7" }
    ],
    soundEffect: "/sounds/family-select.mp3",
    backgroundPattern: "radial-gradient(circle at 50% 50%, rgba(143, 176, 234, 0.1) 0%, transparent 80%)",
    headerStyle: "bold",
    mobileNavStyle: "expanded",
    cardStyle: "rounded",
    recommendedVehicleTypes: ["SUV", "Van", "Hybrid", "Highlander", "RAV4"],
    recommendedFeatures: ["Safety", "Space", "Seating", "Storage", "Entertainment"],
    valuePropositions: [
      "Maximum safety for your loved ones",
      "Spacious interiors for growing families",
      "Flexible seating arrangements",
      "Child-friendly features",
      "Long-term reliability"
    ],
    personalityTraits: ["nurturing", "protective", "practical", "community-oriented"],
    interactionStyle: "supportive",
    contentDensity: "balanced",
    preferredColors: ["blue", "teal", "neutral"],
    terminology: {
      vehicle: "family car",
      features: "family-friendly features",
      power: "reliable performance",
      efficiency: "cost-effective efficiency",
      technology: "smart technology",
      design: "thoughtful design",
      comfort: "family comfort"
    }
  },
  "tech-enthusiast": {
    id: "tech-enthusiast",
    title: "Tech Enthusiast",
    icon: "⚡",
    description: "Cutting-edge features and advanced technology",
    colorScheme: {
      primary: "#6B38FB",
      secondary: "#9F7AFF",
      accent: "#00D4FF",
      background: "bg-purple-50",
    },
    headlineText: "Technology That Moves You Forward",
    subheadlineText: "Experience the future of driving with Toyota's advanced hybrid technology",
    ctaText: "Discover Tech Features",
    backgroundImage: "",
    quickLinks: [
      { title: "Connectivity", href: "#connectivity" },
      { title: "Driver Assist", href: "#driver-assist" },
      { title: "Hybrid Tech", href: "#hybrid-tech" },
      { title: "Smart Systems", href: "#smart-systems" }
    ],
    highlightedSections: ["technology", "connectivity", "innovation"],
    buttonTextStyle: "Build Your Tech Ride",
    fontFamily: "'Roboto Mono', monospace",
    animationStyle: "zoom",
    borderStyle: "rounded-md border-l-4 border-purple-500 shadow-lg",
    iconSet: [
      { name: "zap", color: "#6B38FB" },
      { name: "wifi", color: "#6B38FB" },
      { name: "settings", color: "#6B38FB" }
    ],
    soundEffect: "/sounds/tech-select.mp3",
    cursorStyle: "cursor-tech",
    backgroundPattern: "linear-gradient(135deg, rgba(107, 56, 251, 0.05) 25%, transparent 25%, transparent 50%, rgba(107, 56, 251, 0.05) 50%, rgba(107, 56, 251, 0.05) 75%, transparent 75%, transparent);",
    headerStyle: "technical",
    mobileNavStyle: "tabbed",
    cardStyle: "glass",
    recommendedVehicleTypes: ["Hybrid", "Electric", "GR Performance", "Prius", "Mirai"],
    recommendedFeatures: ["Technology", "Connectivity", "Interface", "Audio", "Automation"],
    valuePropositions: [
      "Cutting-edge vehicle technology",
      "Advanced connectivity features",
      "Intelligent driver assistance",
      "State-of-the-art infotainment",
      "Data-driven performance"
    ],
    personalityTraits: ["innovative", "analytical", "forward-thinking", "detail-oriented"],
    interactionStyle: "technical",
    contentDensity: "dense",
    preferredColors: ["purple", "blue", "neon"],
    terminology: {
      vehicle: "machine",
      features: "specifications",
      power: "performance metrics",
      efficiency: "optimization",
      technology: "tech stack",
      design: "engineering",
      comfort: "ergonomics"
    }
  },
  "eco-warrior": {
    id: "eco-warrior",
    title: "Eco Warrior",
    icon: "🌿",
    description: "Sustainable driving with minimal environmental impact",
    colorScheme: {
      primary: "#2E7D32",
      secondary: "#81C784",
      accent: "#CDDC39",
      background: "bg-green-50",
    },
    headlineText: "Drive Green, Live Clean",
    subheadlineText: "Toyota hybrids helping you reduce your carbon footprint without compromise",
    ctaText: "Explore Eco Options",
    backgroundImage: "",
    quickLinks: [
      { title: "Efficiency", href: "#efficiency" },
      { title: "CO2 Reduction", href: "#emissions" },
      { title: "Materials", href: "#sustainable-materials" },
      { title: "Energy Recovery", href: "#energy-recovery" }
    ],
    highlightedSections: ["efficiency", "sustainability", "hybrid-technology"],
    buttonTextStyle: "Choose Sustainable Driving",
    fontFamily: "'Montserrat', sans-serif",
    animationStyle: "slide",
    borderStyle: "rounded-full border-2 border-green-300",
    iconSet: [
      { name: "leaf", color: "#2E7D32" },
      { name: "sun", color: "#2E7D32" },
      { name: "wind", color: "#2E7D32" }
    ],
    soundEffect: "/sounds/eco-select.mp3",
    backgroundPattern: "linear-gradient(to right, rgba(46, 125, 50, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(46, 125, 50, 0.03) 1px, transparent 1px)",
    headerStyle: "natural",
    mobileNavStyle: "floating",
    cardStyle: "bordered",
    recommendedVehicleTypes: ["Hybrid", "Electric", "Prius", "Corolla Hybrid", "RAV4 Hybrid"],
    recommendedFeatures: ["Efficiency", "Electric", "Emissions", "Regenerative", "Sustainable"],
    valuePropositions: [
      "Reduced carbon footprint",
      "Superior fuel efficiency",
      "Environmentally friendly materials",
      "Cleaner emissions technology",
      "Sustainable driving philosophy"
    ],
    personalityTraits: ["conscious", "responsible", "forward-thinking", "principled"],
    interactionStyle: "supportive",
    contentDensity: "balanced",
    preferredColors: ["green", "earth tones", "natural"],
    terminology: {
      vehicle: "eco-vehicle",
      features: "sustainable features",
      power: "clean power",
      efficiency: "eco-efficiency",
      technology: "green technology",
      design: "sustainable design",
      comfort: "responsible comfort"
    }
  },
  "urban-explorer": {
    id: "urban-explorer",
    title: "Urban Explorer",
    icon: "🌆",
    description: "Nimble city driving with style and convenience",
    colorScheme: {
      primary: "#455A64",
      secondary: "#78909C",
      accent: "#FF5722",
      background: "bg-slate-50",
    },
    headlineText: "Smart, Silent, City-Ready",
    subheadlineText: "Navigate city streets with confidence in a Toyota hybrid designed for urban life",
    ctaText: "View City-Smart Models",
    backgroundImage: "",
    quickLinks: [
      { title: "Parking Assist", href: "#parking" },
      { title: "City Mileage", href: "#mileage" },
      { title: "Maneuverability", href: "#handling" },
      { title: "Traffic Features", href: "#traffic" }
    ],
    highlightedSections: ["compact", "urban", "efficiency"],
    buttonTextStyle: "Find Your City Companion",
    fontFamily: "'Poppins', sans-serif",
    animationStyle: "bounce",
    borderStyle: "border-none shadow-lg rounded-lg",
    iconSet: [
      { name: "map-pin", color: "#455A64" },
      { name: "compass", color: "#455A64" },
      { name: "coffee", color: "#455A64" }
    ],
    soundEffect: "/sounds/urban-select.mp3",
    backgroundPattern: "radial-gradient(circle at 100% 100%, rgba(69, 90, 100, 0.08) 0, rgba(69, 90, 100, 0.08) 3px, transparent 0)",
    headerStyle: "sophisticated",
    mobileNavStyle: "compact",
    cardStyle: "sharp",
    recommendedVehicleTypes: ["Compact", "Sedan", "Hatchback", "Corolla", "Yaris"],
    recommendedFeatures: ["Parking", "Navigation", "Fuel Economy", "Safety", "Maneuverability"],
    valuePropositions: [
      "Perfect for tight city spaces",
      "Excellent urban maneuverability",
      "Smart city navigation features",
      "Traffic-optimized driving modes",
      "Stylish urban design aesthetics"
    ],
    personalityTraits: ["trendy", "adaptable", "efficient", "stylish"],
    interactionStyle: "efficient",
    contentDensity: "balanced",
    preferredColors: ["slate", "orange", "concrete"],
    terminology: {
      vehicle: "city car",
      features: "urban features",
      power: "responsive power",
      efficiency: "city efficiency",
      technology: "smart technology",
      design: "urban styling",
      comfort: "city comfort"
    }
  },
  "business-commuter": {
    id: "business-commuter",
    title: "Business Commuter",
    icon: "🚗",
    description: "Elegant design with premium comfort for daily drives",
    colorScheme: {
      primary: "#263238",
      secondary: "#546E7A",
      accent: "#90A4AE",
      background: "bg-gray-50",
    },
    headlineText: "Elevate Your Daily Commute",
    subheadlineText: "Make every business trip a pleasure with Toyota's sophisticated hybrid sedans",
    ctaText: "Discover Business Models",
    backgroundImage: "",
    quickLinks: [
      { title: "Comfort Features", href: "#comfort" },
      { title: "Fuel Economy", href: "#economy" },
      { title: "Executive Options", href: "#executive" },
      { title: "Connected Services", href: "#connected" }
    ],
    highlightedSections: ["comfort", "luxury", "efficiency"],
    buttonTextStyle: "Configure Your Business Toyota",
    fontFamily: "'Inter', sans-serif",
    animationStyle: "slide",
    borderStyle: "border-b-2 border-gray-500 rounded-none",
    iconSet: [
      { name: "briefcase", color: "#263238" },
      { name: "clock", color: "#263238" },
      { name: "phone", color: "#263238" }
    ],
    soundEffect: "/sounds/business-select.mp3",
    backgroundPattern: "linear-gradient(to right, rgba(144, 164, 174, 0.05) 1px, transparent 1px)",
    headerStyle: "minimal",
    mobileNavStyle: "drawer",
    cardStyle: "minimal",
    recommendedVehicleTypes: ["Sedan", "Executive", "Premium", "Camry", "Avalon"],
    recommendedFeatures: ["Comfort", "Economy", "Connectivity", "Quiet", "Premium"],
    valuePropositions: [
      "Executive-level comfort features",
      "Professional styling and appearance",
      "Optimal work-life integration features",
      "Impressive client transportation experience",
      "Business efficiency focus"
    ],
    personalityTraits: ["professional", "efficient", "refined", "practical"],
    interactionStyle: "efficient",
    contentDensity: "balanced",
    preferredColors: ["navy", "gray", "black"],
    terminology: {
      vehicle: "executive vehicle",
      features: "premium features",
      power: "confident performance",
      efficiency: "business efficiency",
      technology: "professional technology",
      design: "executive design",
      comfort: "premium comfort"
    }
  },
  "weekend-adventurer": {
    id: "weekend-adventurer",
    title: "Weekend Adventurer",
    icon: "🏕️",
    description: "Versatile vehicles ready for off-road exploration",
    colorScheme: {
      primary: "#BF360C",
      secondary: "#FF8A65",
      accent: "#FFD54F",
      background: "bg-orange-50",
    },
    headlineText: "Weekdays to Weekends, Road to Off-Road",
    subheadlineText: "Toyota hybrids built to take you farther, wherever your adventures lead",
    ctaText: "Find Adventure-Ready Models",
    backgroundImage: "",
    quickLinks: [
      { title: "Off-Road Capability", href: "#off-road" },
      { title: "Adventure Features", href: "#features" },
      { title: "Cargo Solutions", href: "#cargo" },
      { title: "Recreational Towing", href: "#towing" }
    ],
    highlightedSections: ["adventure", "capability", "durability"],
    buttonTextStyle: "Build Your Adventure Vehicle",
    fontFamily: "'Barlow', sans-serif",
    animationStyle: "flip",
    borderStyle: "border-2 border-dashed border-orange-400 rounded-lg",
    iconSet: [
      { name: "compass", color: "#BF360C" },
      { name: "mountain", color: "#BF360C" },
      { name: "tent", color: "#BF360C" }
    ],
    soundEffect: "/sounds/adventure-select.mp3",
    backgroundPattern: "repeating-linear-gradient(45deg, rgba(255, 138, 101, 0.05), rgba(255, 138, 101, 0.05) 10px, transparent 10px, transparent 20px)",
    headerStyle: "playful",
    mobileNavStyle: "expanded",
    cardStyle: "floating",
    recommendedVehicleTypes: ["SUV", "Truck", "Off-Road", "Land Cruiser", "4Runner"],
    recommendedFeatures: ["AWD", "Terrain", "Towing", "Clearance", "Storage"],
    valuePropositions: [
      "Genuine off-road capability",
      "Adventure-ready versatility",
      "Durable construction for rough terrain",
      "Recreational equipment compatibility",
      "Weekend escape enabler"
    ],
    personalityTraits: ["adventurous", "spirited", "resilient", "freedom-loving"],
    interactionStyle: "playful",
    contentDensity: "sparse",
    preferredColors: ["orange", "earth tones", "rust"],
    terminology: {
      vehicle: "adventure vehicle",
      features: "capability features",
      power: "off-road power",
      efficiency: "range and endurance",
      technology: "trail technology",
      design: "rugged design",
      comfort: "all-terrain comfort"
    }
  }
};
