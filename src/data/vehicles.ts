
import { VehicleModel, PreOwnedVehicle } from "@/types/vehicle";

export const vehicles: VehicleModel[] = [
  {
    id: "camry-hybrid",
    name: "Toyota Camry Hybrid",
    image: "https://www.toyota.ae/-/media/Images/Toyota/Vehicles/Camry/2023/Hybrid/Camry-Hybrid-Exterior-1.jpg",
    mmeUrl: "https://www.toyota.ae/en/new-cars/camry",
    configureUrl: "/configure/camry-hybrid",
    price: 129900,
    category: "Hybrid",
    features: ["2.5L Hybrid Engine", "Advanced Safety", "Apple CarPlay/Android Auto"],
    specifications: {
      engine: "2.5L Dynamic Force 4-Cylinder Hybrid",
      transmission: "ECVT (Electronically Controlled Continuously Variable Transmission)",
      fuelEconomy: "4.5L/100km",
      safetyRating: "5-Star",
      warranty: "8-year Hybrid Battery Warranty"
    }
  },
  {
    id: "corolla-hybrid",
    name: "Toyota Corolla Hybrid",
    image: "https://www.toyota.ae/-/media/Images/Toyota/Vehicles/Corolla/2023/Hybrid/Corolla-Hybrid-Exterior-1.jpg",
    mmeUrl: "https://www.toyota.ae/en/new-cars/corolla",
    configureUrl: "/configure/corolla-hybrid",
    price: 94500,
    category: "Hybrid",
    features: ["1.8L Hybrid Engine", "Toyota Safety Sense", "Smart Connectivity"],
    specifications: {
      engine: "1.8L 4-Cylinder Hybrid",
      transmission: "ECVT",
      fuelEconomy: "3.8L/100km",
      safetyRating: "5-Star",
      warranty: "8-year Hybrid Battery Warranty"
    }
  },
  {
    id: "rav4-hybrid",
    name: "Toyota RAV4 Hybrid",
    image: "https://www.toyota.ae/-/media/Images/Toyota/Vehicles/RAV4/2023/Hybrid/RAV4-Hybrid-Exterior-1.jpg",
    mmeUrl: "https://www.toyota.ae/en/new-cars/rav4",
    configureUrl: "/configure/rav4-hybrid",
    price: 139900,
    category: "Hybrid",
    features: ["2.5L Hybrid Engine", "AWD System", "Panoramic Roof"],
    specifications: {
      engine: "2.5L Dynamic Force 4-Cylinder Hybrid",
      transmission: "ECVT with AWD",
      fuelEconomy: "4.7L/100km",
      safetyRating: "5-Star",
      warranty: "8-year Hybrid Battery Warranty"
    }
  },
  {
    id: "highlander-hybrid",
    name: "Toyota Highlander Hybrid",
    image: "https://www.toyota.ae/-/media/Images/Toyota/Vehicles/Highlander/2023/Exterior/Highlander-Exterior-1.jpg",
    mmeUrl: "https://www.toyota.ae/en/new-cars/highlander",
    configureUrl: "/configure/highlander-hybrid",
    price: 179900,
    category: "Hybrid",
    features: ["3.5L Hybrid V6", "7-Seater", "Premium Interior"],
    specifications: {
      engine: "3.5L V6 Hybrid",
      transmission: "ECVT with AWD",
      fuelEconomy: "6.7L/100km",
      safetyRating: "5-Star",
      warranty: "8-year Hybrid Battery Warranty"
    }
  },
  {
    id: "land-cruiser",
    name: "Toyota Land Cruiser",
    image: "https://www.toyota.ae/-/media/Images/Toyota/Vehicles/Land-Cruiser/2023/Exterior/Land-Cruiser-Exterior-1.jpg",
    mmeUrl: "https://www.toyota.ae/en/new-cars/land-cruiser",
    configureUrl: "/configure/land-cruiser",
    price: 249900,
    category: "SUV",
    features: ["5.7L V8 Engine", "Off-Road Technology", "Premium Comfort"],
    specifications: {
      engine: "5.7L V8",
      transmission: "8-Speed Automatic",
      fuelEconomy: "14.2L/100km",
      safetyRating: "5-Star",
      warranty: "5-year/100,000km"
    }
  },
  {
    id: "sequoia",
    name: "Toyota Sequoia",
    image: "https://www.toyota.ae/-/media/Images/Toyota/Vehicles/Sequoia/2023/Exterior/Sequoia-Exterior-1.jpg",
    mmeUrl: "https://www.toyota.ae/en/new-cars/sequoia",
    configureUrl: "/configure/sequoia",
    price: 219900,
    category: "SUV",
    features: ["5.7L V8 Engine", "8-Seater", "Premium Audio System"],
    specifications: {
      engine: "5.7L V8",
      transmission: "6-Speed Automatic",
      fuelEconomy: "15.7L/100km",
      safetyRating: "5-Star",
      warranty: "5-year/100,000km"
    }
  },
  {
    id: "prado",
    name: "Toyota Prado",
    image: "https://www.toyota.ae/-/media/Images/Toyota/Vehicles/Prado/2023/Exterior/Prado-Exterior-1.jpg",
    mmeUrl: "https://www.toyota.ae/en/new-cars/prado",
    configureUrl: "/configure/prado",
    price: 189900,
    category: "SUV",
    features: ["4.0L V6 Engine", "Multi-Terrain Select", "Kinetic Dynamic Suspension"],
    specifications: {
      engine: "4.0L V6",
      transmission: "6-Speed Automatic",
      fuelEconomy: "11.2L/100km",
      safetyRating: "5-Star",
      warranty: "5-year/100,000km"
    }
  },
  {
    id: "fortuner",
    name: "Toyota Fortuner",
    image: "https://www.toyota.ae/-/media/Images/Toyota/Vehicles/Fortuner/2023/Exterior/Fortuner-Exterior-1.jpg",
    mmeUrl: "https://www.toyota.ae/en/new-cars/fortuner",
    configureUrl: "/configure/fortuner",
    price: 149900,
    category: "SUV",
    features: ["2.7L Engine", "7-Seater", "Robust Construction"],
    specifications: {
      engine: "2.7L 4-Cylinder",
      transmission: "6-Speed Automatic",
      fuelEconomy: "10.2L/100km",
      safetyRating: "5-Star",
      warranty: "5-year/100,000km"
    }
  },
  {
    id: "avalon",
    name: "Toyota Avalon",
    image: "https://www.toyota.ae/-/media/Images/Toyota/Vehicles/Avalon/2023/Exterior/Avalon-Exterior-1.jpg",
    mmeUrl: "https://www.toyota.ae/en/new-cars/avalon",
    configureUrl: "/configure/avalon",
    price: 159900,
    category: "Sedan",
    features: ["3.5L V6 Engine", "Luxury Interior", "JBL Audio System"],
    specifications: {
      engine: "3.5L V6",
      transmission: "8-Speed Automatic",
      fuelEconomy: "9.4L/100km",
      safetyRating: "5-Star",
      warranty: "5-year/100,000km"
    }
  },
  {
    id: "camry",
    name: "Toyota Camry",
    image: "https://www.toyota.ae/-/media/Images/Toyota/Vehicles/Camry/2023/Exterior/Camry-Exterior-1.jpg",
    mmeUrl: "https://www.toyota.ae/en/new-cars/camry",
    configureUrl: "/configure/camry",
    price: 119900,
    category: "Sedan",
    features: ["2.5L Engine", "Dynamic Design", "Advanced Safety Features"],
    specifications: {
      engine: "2.5L 4-Cylinder",
      transmission: "8-Speed Automatic",
      fuelEconomy: "7.2L/100km",
      safetyRating: "5-Star",
      warranty: "5-year/100,000km"
    }
  },
  {
    id: "corolla",
    name: "Toyota Corolla",
    image: "https://www.toyota.ae/-/media/Images/Toyota/Vehicles/Corolla/2023/Exterior/Corolla-Exterior-1.jpg",
    mmeUrl: "https://www.toyota.ae/en/new-cars/corolla",
    configureUrl: "/configure/corolla",
    price: 84900,
    category: "Sedan",
    features: ["1.6L Engine", "Efficient Fuel Economy", "Spacious Interior"],
    specifications: {
      engine: "1.6L 4-Cylinder",
      transmission: "CVT",
      fuelEconomy: "6.0L/100km",
      safetyRating: "5-Star",
      warranty: "5-year/100,000km"
    }
  },
  {
    id: "yaris",
    name: "Toyota Yaris",
    image: "https://www.toyota.ae/-/media/Images/Toyota/Vehicles/Yaris/2023/Exterior/Yaris-Exterior-1.jpg",
    mmeUrl: "https://www.toyota.ae/en/new-cars/yaris",
    configureUrl: "/configure/yaris",
    price: 69900,
    category: "Sedan",
    features: ["1.5L Engine", "Compact Design", "Smart Technology"],
    specifications: {
      engine: "1.5L 4-Cylinder",
      transmission: "CVT",
      fuelEconomy: "5.8L/100km",
      safetyRating: "5-Star",
      warranty: "5-year/100,000km"
    }
  },
  {
    id: "gr-supra",
    name: "Toyota GR Supra",
    image: "https://www.toyota.ae/-/media/Images/Toyota/Vehicles/Supra/2023/Exterior/Supra-Exterior-1.jpg",
    mmeUrl: "https://www.toyota.ae/en/new-cars/gr-supra",
    configureUrl: "/configure/gr-supra",
    price: 249900,
    category: "GR Performance",
    features: ["3.0L Turbocharged Engine", "Sport-Tuned Suspension", "Racing Heritage"],
    specifications: {
      engine: "3.0L Turbocharged Inline-6",
      transmission: "8-Speed Sport Automatic",
      fuelEconomy: "8.2L/100km",
      safetyRating: "5-Star",
      warranty: "3-year/unlimited km"
    }
  },
  {
    id: "gr-yaris",
    name: "Toyota GR Yaris",
    image: "https://www.toyota.ae/-/media/Images/Toyota/Vehicles/GR-Yaris/2023/Exterior/GR-Yaris-Exterior-1.jpg",
    mmeUrl: "https://www.toyota.ae/en/new-cars/gr-yaris",
    configureUrl: "/configure/gr-yaris",
    price: 149900,
    category: "GR Performance",
    features: ["1.6L Turbocharged Engine", "All-Wheel Drive", "Rally Inspired"],
    specifications: {
      engine: "1.6L Turbocharged 3-Cylinder",
      transmission: "6-Speed Manual",
      fuelEconomy: "7.6L/100km",
      safetyRating: "5-Star",
      warranty: "3-year/unlimited km"
    }
  },
  {
    id: "hiace",
    name: "Toyota Hiace",
    image: "https://www.toyota.ae/-/media/Images/Toyota/Vehicles/Hiace/2023/Exterior/Hiace-Exterior-1.jpg",
    mmeUrl: "https://www.toyota.ae/en/new-cars/hiace",
    configureUrl: "/configure/hiace",
    price: 109900,
    category: "Commercial",
    features: ["2.7L Engine", "Versatile Cargo Space", "Comfortable Seating"],
    specifications: {
      engine: "2.7L 4-Cylinder",
      transmission: "6-Speed Automatic",
      fuelEconomy: "10.4L/100km",
      safetyRating: "4-Star",
      warranty: "3-year/100,000km"
    }
  },
  {
    id: "hilux",
    name: "Toyota Hilux",
    image: "https://www.toyota.ae/-/media/Images/Toyota/Vehicles/Hilux/2023/Exterior/Hilux-Exterior-1.jpg",
    mmeUrl: "https://www.toyota.ae/en/new-cars/hilux",
    configureUrl: "/configure/hilux",
    price: 99900,
    category: "Commercial",
    features: ["2.4L Diesel Engine", "Tough Construction", "Advanced 4x4 Capability"],
    specifications: {
      engine: "2.4L Diesel",
      transmission: "6-Speed Automatic",
      fuelEconomy: "8.4L/100km",
      safetyRating: "5-Star",
      warranty: "5-year/100,000km"
    }
  },
  {
    id: "bz4x",
    name: "Toyota bZ4X",
    image: "https://www.toyota.ae/-/media/Images/Toyota/Vehicles/BZ4X/2023/Exterior/BZ4X-Exterior-1.jpg",
    mmeUrl: "https://www.toyota.ae/en/new-cars/bz4x",
    configureUrl: "/configure/bz4x",
    price: 159900,
    category: "Electric",
    features: ["Electric Powertrain", "Fast Charging", "Advanced Tech"],
    specifications: {
      engine: "Electric Motor",
      transmission: "Single-Speed",
      fuelEconomy: "Electric Range 450km",
      safetyRating: "5-Star",
      warranty: "8-year Battery Warranty"
    }
  },
  {
    id: "crown",
    name: "Toyota Crown",
    image: "https://www.toyota.ae/-/media/Images/Toyota/Vehicles/Crown/2023/Exterior/Crown-Exterior-1.jpg",
    mmeUrl: "https://www.toyota.ae/en/new-cars/crown",
    configureUrl: "/configure/crown",
    price: 189900,
    category: "Hybrid",
    features: ["2.4L Hybrid Turbo", "AWD System", "Premium Experience"],
    specifications: {
      engine: "2.4L Turbocharged Hybrid",
      transmission: "ECVT with AWD",
      fuelEconomy: "5.7L/100km",
      safetyRating: "5-Star",
      warranty: "8-year Hybrid Battery Warranty"
    }
  },
  {
    id: "mirai",
    name: "Toyota Mirai",
    image: "https://www.toyota.ae/-/media/Images/Toyota/Vehicles/Mirai/2023/Exterior/Mirai-Exterior-1.jpg",
    mmeUrl: "https://www.toyota.ae/en/new-cars/mirai",
    configureUrl: "/configure/mirai",
    price: 219900,
    category: "Hydrogen",
    features: ["Hydrogen Fuel Cell", "Zero Emissions", "Future Technology"],
    specifications: {
      engine: "Hydrogen Fuel Cell Electric",
      transmission: "Single-Speed",
      fuelEconomy: "Hydrogen Range 650km",
      safetyRating: "5-Star",
      warranty: "8-year Fuel Cell Warranty"
    }
  },
  {
    id: "venza",
    name: "Toyota Venza",
    image: "https://www.toyota.ae/-/media/Images/Toyota/Vehicles/Venza/2023/Exterior/Venza-Exterior-1.jpg",
    mmeUrl: "https://www.toyota.ae/en/new-cars/venza",
    configureUrl: "/configure/venza",
    price: 149900,
    category: "Hybrid",
    features: ["2.5L Hybrid Engine", "Star Gaze Panoramic Roof", "Luxury Crossover"],
    specifications: {
      engine: "2.5L 4-Cylinder Hybrid",
      transmission: "ECVT with AWD",
      fuelEconomy: "5.2L/100km",
      safetyRating: "5-Star",
      warranty: "8-year Hybrid Battery Warranty"
    }
  },
  {
    id: "gr86",
    name: "Toyota GR86",
    image: "https://www.toyota.ae/-/media/Images/Toyota/Vehicles/GR86/2023/Exterior/GR86-Exterior-1.jpg",
    mmeUrl: "https://www.toyota.ae/en/new-cars/gr86",
    configureUrl: "/configure/gr86",
    price: 139900,
    category: "GR Performance",
    features: ["2.4L Boxer Engine", "Rear-Wheel Drive", "Sports Car Handling"],
    specifications: {
      engine: "2.4L Boxer 4-Cylinder",
      transmission: "6-Speed Manual/Automatic",
      fuelEconomy: "8.8L/100km",
      safetyRating: "5-Star",
      warranty: "3-year/unlimited km"
    }
  }
];

export const preOwnedVehicles: PreOwnedVehicle[] = [
  {
    id: "po-001",
    model: "Toyota Land Cruiser",
    make: "Toyota",
    image: "https://www.toyota.ae/-/media/Images/Toyota/Used-Cars/Land-Cruiser.jpg",
    description: "Well-maintained Toyota Land Cruiser with full service history",
    year: 2021,
    price: 198000,
    mileage: 35000,
    certified: true,
    bodyType: "SUV",
    color: "White",
    transmission: "Automatic",
    features: ["Leather Seats", "Navigation System", "Parking Sensors", "Bluetooth", "Sunroof"]
  },
  {
    id: "po-002",
    model: "Toyota Camry",
    make: "Toyota",
    image: "https://www.toyota.ae/-/media/Images/Toyota/Used-Cars/Camry.jpg",
    description: "Low mileage Toyota Camry in excellent condition",
    year: 2022,
    price: 89000,
    mileage: 22000,
    certified: true,
    bodyType: "Sedan",
    color: "Silver",
    transmission: "Automatic",
    features: ["Backup Camera", "Bluetooth", "Keyless Entry", "Cruise Control"]
  },
  {
    id: "po-003",
    model: "Toyota Prado",
    make: "Toyota",
    image: "https://www.toyota.ae/-/media/Images/Toyota/Used-Cars/Prado.jpg",
    description: "Toyota Prado with premium package and additional features",
    year: 2020,
    price: 145000,
    mileage: 48000,
    certified: true,
    bodyType: "SUV",
    color: "Black",
    transmission: "Automatic",
    features: ["Leather Seats", "Navigation System", "Parking Sensors", "Sunroof", "Third Row Seating"]
  },
  {
    id: "po-004",
    model: "Toyota Corolla",
    make: "Toyota",
    image: "https://www.toyota.ae/-/media/Images/Toyota/Used-Cars/Corolla.jpg",
    description: "Fuel-efficient Toyota Corolla with original paint",
    year: 2022,
    price: 72000,
    mileage: 18000,
    certified: true,
    bodyType: "Sedan",
    color: "Blue",
    transmission: "Automatic",
    features: ["Bluetooth", "Backup Camera", "USB Ports", "Apple CarPlay"]
  },
  {
    id: "po-005",
    model: "Toyota RAV4",
    make: "Toyota",
    image: "https://www.toyota.ae/-/media/Images/Toyota/Used-Cars/RAV4.jpg",
    description: "One-owner Toyota RAV4 with warranty remaining",
    year: 2021,
    price: 95000,
    mileage: 30000,
    certified: false,
    bodyType: "Crossover",
    color: "Red",
    transmission: "Automatic",
    features: ["All-Wheel Drive", "Parking Sensors", "Heated Seats", "Lane Departure Warning"]
  },
  {
    id: "po-006",
    model: "Toyota Fortuner",
    make: "Toyota",
    image: "https://www.toyota.ae/-/media/Images/Toyota/Used-Cars/Fortuner.jpg",
    description: "Toyota Fortuner with dealer service history and extras",
    year: 2020,
    price: 112000,
    mileage: 42000,
    certified: true,
    bodyType: "SUV",
    color: "White",
    transmission: "Automatic",
    features: ["7-Seater", "Parking Sensors", "Roof Rails", "Alloy Wheels"]
  },
  {
    id: "po-007",
    model: "Toyota Highlander",
    make: "Toyota",
    image: "https://www.toyota.ae/-/media/Images/Toyota/Used-Cars/Highlander.jpg",
    description: "Toyota Highlander with premium features and third-row seating",
    year: 2019,
    price: 105000,
    mileage: 55000,
    certified: false,
    bodyType: "SUV",
    color: "Gray",
    transmission: "Automatic",
    features: ["Third Row Seating", "Leather Interior", "Panoramic Roof", "Premium Sound System"]
  },
  {
    id: "po-008",
    model: "Toyota Yaris",
    make: "Toyota",
    image: "https://www.toyota.ae/-/media/Images/Toyota/Used-Cars/Yaris.jpg",
    description: "Economical Toyota Yaris in great condition",
    year: 2021,
    price: 58000,
    mileage: 25000,
    certified: true,
    bodyType: "Hatchback",
    color: "White",
    transmission: "Automatic",
    features: ["Bluetooth", "USB Ports", "Keyless Entry", "Fuel Efficient"]
  }
];

export const heroSlides = [
  {
    id: "hero-1",
    title: "Experience Hybrid Innovation",
    subtitle: "Driving towards a greener future with Toyota Hybrid technology",
    image: "https://www.toyota.ae/-/media/Images/Toyota/Hybrid/Hybrid-Hero-1.jpg",
    ctaText: "Explore Hybrid Models",
    ctaLink: "/hybrid",
    isHybrid: true
  },
  {
    id: "hero-2",
    title: "The All-New Land Cruiser",
    subtitle: "Legendary capability, reimagined for modern adventure",
    image: "https://www.toyota.ae/-/media/Images/Toyota/Home/Land-Cruiser-Hero.jpg",
    ctaText: "Discover More",
    ctaLink: "/land-cruiser"
  },
  {
    id: "hero-3",
    title: "Summer Offers",
    subtitle: "Special deals across the Toyota range for a limited time",
    image: "https://www.toyota.ae/-/media/Images/Toyota/Home/Summer-Offers-Hero.jpg",
    ctaText: "View Offers",
    ctaLink: "/offers"
  },
  {
    id: "hero-4",
    title: "All-Electric bZ4X",
    subtitle: "Experience the future of mobility with Toyota's first all-electric SUV",
    image: "https://www.toyota.ae/-/media/Images/Toyota/Hybrid/Electric-Hero-1.jpg",
    ctaText: "Explore Electric",
    ctaLink: "/electric"
  },
  {
    id: "hero-5",
    title: "GR Performance Series",
    subtitle: "Toyota's racing DNA brought to the streets with Gazoo Racing",
    image: "https://www.toyota.ae/-/media/Images/Toyota/GR/GR-Hero-1.jpg",
    ctaText: "Discover GR",
    ctaLink: "/gr"
  }
];

