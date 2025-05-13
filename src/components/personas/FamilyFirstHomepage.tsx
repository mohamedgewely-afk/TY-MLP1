
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePersona } from "@/contexts/PersonaContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { vehicles } from "@/data/vehicles";
import { Link } from "react-router-dom";
import PersonalizedHero from "@/components/home/PersonalizedHero";
import {
  Car,
  Bookmark,
  Shield,
  Users,
  ChevronRight,
  CheckCircle,
  ThumbsUp,
  Heart,
  Star,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VehicleModel } from "@/types/vehicle";
import { useToast } from "@/hooks/use-toast";

const FamilyFirstHomepage: React.FC = () => {
  const { personaData } = usePersona();
  const { toast } = useToast();
  const [savedVehicles, setSavedVehicles] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("suv");

  // Filter vehicles that are good for families
  const familyVehicles = vehicles.filter(
    (v) =>
      v.category === "SUV" ||
      v.category === "Minivan" ||
      v.features.some((f) => f.includes("Family") || f.includes("Safety"))
  );

  // Group vehicles by category for tabs
  const vehicleCategories = Array.from(
    new Set(familyVehicles.map((v) => v.category))
  );

  // Family priorities animation
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  const handleSaveVehicle = (vehicle: VehicleModel) => {
    if (savedVehicles.includes(vehicle.name)) {
      setSavedVehicles(savedVehicles.filter((v) => v !== vehicle.name));
      toast({
        title: "Vehicle removed",
        description: `${vehicle.name} has been removed from your saved vehicles.`,
        variant: "default",
      });
    } else {
      setSavedVehicles([...savedVehicles, vehicle.name]);
      toast({
        title: "Vehicle saved",
        description: `${vehicle.name} has been added to your saved vehicles.`,
        variant: "default",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Personalized Hero Section */}
      <PersonalizedHero />

      {/* Family Priorities Section */}
      <section className="py-16 bg-white">
        <div className="toyota-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Your Family's Priorities
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Toyota understands what matters most to families. Explore vehicles and
              features designed with your loved ones in mind.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {[
              {
                title: "Safety First",
                description:
                  "Toyota Safety Sense™ comes standard on new Toyota models, providing peace of mind for your family journeys.",
                icon: <Shield className="h-10 w-10 text-white" />,
                color: "bg-persona-family-primary",
                iconBg: "bg-persona-family-accent",
              },
              {
                title: "Spacious Comfort",
                description:
                  "Ample room for everyone and everything, with thoughtfully designed interiors for maximum comfort.",
                icon: <Users className="h-10 w-10 text-white" />,
                color: "bg-white",
                iconBg: "bg-persona-family-primary",
                border: "border border-gray-200",
              },
              {
                title: "Entertainment",
                description:
                  "Keep everyone entertained with the latest connectivity and entertainment options for all ages.",
                icon: <ThumbsUp className="h-10 w-10 text-white" />,
                color: "bg-white",
                iconBg: "bg-persona-family-accent",
                border: "border border-gray-200",
              },
              {
                title: "Long-Term Value",
                description:
                  "Toyota's legendary reliability means your family vehicle will be dependable for years to come.",
                icon: <CheckCircle className="h-10 w-10 text-white" />,
                color: "bg-persona-family-primary",
                iconBg: "bg-persona-family-accent",
              },
            ].map((priority, index) => (
              <motion.div
                key={priority.title}
                variants={itemVariants}
                className={cn(
                  "rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow",
                  priority.color,
                  priority.border
                )}
              >
                <div className="p-8">
                  <div
                    className={cn(
                      "w-20 h-20 rounded-full flex items-center justify-center mb-6",
                      priority.iconBg
                    )}
                  >
                    {priority.icon}
                  </div>
                  <h3
                    className={cn(
                      "text-xl font-bold mb-3",
                      priority.color === "bg-white"
                        ? "text-gray-900"
                        : "text-white"
                    )}
                  >
                    {priority.title}
                  </h3>
                  <p
                    className={cn(
                      "text-sm",
                      priority.color === "bg-white"
                        ? "text-gray-600"
                        : "text-white/80"
                    )}
                  >
                    {priority.description}
                  </p>
                </div>

                {/* Visual enhancement with curved shape */}
                <div className="relative h-4 overflow-hidden">
                  <div
                    className={cn(
                      "absolute bottom-0 left-0 right-0 h-8 -mb-4 rounded-[50%]",
                      priority.color === "bg-white"
                        ? "bg-white"
                        : "bg-persona-family-primary"
                    )}
                  ></div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Recommended Vehicles Section */}
      <section className="py-16 bg-gray-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="familyPattern"
                patternUnits="userSpaceOnUse"
                width="60"
                height="60"
                patternTransform="rotate(45)"
              >
                <path
                  d="M10 10C15 10 15 5 20 5C25 5 25 10 30 10C35 10 35 5 40 5C45 5 45 10 50 10"
                  fill="none"
                  stroke="#4A6DA7"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#familyPattern)" />
          </svg>
        </div>

        <div className="toyota-container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10"
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Perfect for Your Family
              </h2>
              <p className="text-gray-600">
                Vehicles selected to match your family's needs
              </p>
            </div>

            <div className="mt-4 md:mt-0">
              <Button
                asChild
                variant="outline"
                className="border-persona-family-primary text-persona-family-primary hover:bg-persona-family-primary hover:text-white"
              >
                <Link to="/new-cars" className="flex items-center">
                  View All Family Vehicles
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </motion.div>

          <Tabs
            defaultValue="suv"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="bg-white rounded-full p-1 border border-gray-200 w-fit mb-8">
              {vehicleCategories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category.toLowerCase()}
                  className="rounded-full data-[state=active]:bg-persona-family-primary data-[state=active]:text-white"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            {vehicleCategories.map((category) => (
              <TabsContent
                key={category}
                value={category.toLowerCase()}
                className="mt-0"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {familyVehicles
                    .filter((v) => v.category === category)
                    .map((vehicle, index) => (
                      <FamilyVehicleCard
                        key={vehicle.name}
                        vehicle={vehicle}
                        index={index}
                        isSaved={savedVehicles.includes(vehicle.name)}
                        onSave={() => handleSaveVehicle(vehicle)}
                      />
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Family Features Guide */}
      <section className="py-16 bg-white">
        <div className="toyota-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Toyota Family Features Guide
              </h2>
              <p className="text-gray-600 mb-8">
                Discover thoughtfully designed features that make family life easier,
                safer, and more enjoyable - from child-friendly technology to clever
                storage solutions.
              </p>

              <div className="space-y-6">
                {[
                  {
                    title: "Child Safety",
                    description:
                      "LATCH child seat anchors, rear door child locks, and advanced safety systems to protect your most precious cargo.",
                    icon: <Shield className="h-6 w-6 text-persona-family-primary" />,
                  },
                  {
                    title: "Flexible Space",
                    description:
                      "Configurable seating and cargo arrangements adapt to your family's changing needs and adventures.",
                    icon: <Car className="h-6 w-6 text-persona-family-primary" />,
                  },
                  {
                    title: "Convenience Features",
                    description:
                      "Hands-free power liftgates, easy-clean surfaces, and abundant cup holders make family life on the go simpler.",
                    icon: <ThumbsUp className="h-6 w-6 text-persona-family-primary" />,
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start"
                  >
                    <div className="bg-persona-family-primary/10 p-3 rounded-full mr-4">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8">
                <Button
                  asChild
                  className="bg-persona-family-primary hover:bg-persona-family-primary/90"
                >
                  <Link to="/family-features" className="flex items-center">
                    Download Family Guide <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3]">
                <img
                  src="https://www.toyota.ae/-/media/Images/Toyota/Sections-homepage/Desktop/family-hero.jpg"
                  alt="Toyota Family Features"
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-persona-family-accent text-white border-none">
                      Family Guide
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Smart Features for Modern Families
                  </h3>
                  <p className="text-white/80 text-sm">
                    See how Toyota's thoughtful design makes a difference in your
                    daily family routine.
                  </p>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-persona-family-accent/20 rounded-full z-[-1]" />
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-persona-family-primary/20 rounded-full z-[-1]" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Family Adventure Planning */}
      <section className="py-16 bg-persona-family-primary/10 relative overflow-hidden">
        <div className="toyota-container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-block bg-persona-family-accent/20 rounded-full px-4 py-1 mb-4">
              <span className="text-persona-family-primary font-medium text-sm">
                Plan Your Next Adventure
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Family Road Trips Made Easy
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Create memories that will last a lifetime with these family-friendly
              destinations and road trip tips.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Beach Getaways",
                description: "Perfect coastal destinations for family fun and relaxation",
                image: "https://images.unsplash.com/photo-1471922694854-ff1b63b20054",
                link: "/family-trips/beach",
              },
              {
                title: "National Parks",
                description: "Explore nature's wonders with kid-friendly hiking trails",
                image: "https://images.unsplash.com/photo-1519395612667-3b754d7b9086",
                link: "/family-trips/parks",
              },
              {
                title: "City Adventures",
                description: "Urban explorations with museums and family attractions",
                image: "https://images.unsplash.com/photo-1517760444937-f6397edcbbcd",
                link: "/family-trips/city",
              },
            ].map((destination, index) => (
              <motion.div
                key={destination.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all group"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={`${destination.image}?auto=format&fit=crop&w=600&q=80`}
                    alt={destination.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-persona-family-primary transition-colors">
                    {destination.title}
                  </h3>
                  <p className="text-gray-600 mb-6">{destination.description}</p>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-persona-family-primary text-persona-family-primary hover:bg-persona-family-primary hover:text-white"
                  >
                    <Link to={destination.link}>
                      Explore <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/trip-planner"
              className="inline-flex items-center text-persona-family-primary hover:text-persona-family-primary/80 font-medium"
            >
              Use our Family Trip Planner Tool <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

interface FamilyVehicleCardProps {
  vehicle: VehicleModel;
  index: number;
  isSaved: boolean;
  onSave: () => void;
}

const FamilyVehicleCard: React.FC<FamilyVehicleCardProps> = ({
  vehicle,
  index,
  isSaved,
  onSave,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow group">
        <div className="relative h-48">
          <img
            src={vehicle.image}
            alt={vehicle.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              onSave();
            }}
            className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors hover:bg-white"
            aria-label={isSaved ? "Remove from saved" : "Save vehicle"}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                isSaved
                  ? "fill-persona-family-primary text-persona-family-primary"
                  : "text-gray-600"
              )}
            />
          </button>

          {/* Family recommendation badge */}
          <div className="absolute top-3 left-3">
            <Badge className="bg-persona-family-primary text-white border-none px-3 py-1 flex items-center gap-1">
              <Star className="h-3 w-3" fill="white" />
              Family Pick
            </Badge>
          </div>

          {/* Price label */}
          <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-sm rounded-md px-3 py-1">
            <span className="text-sm font-medium text-gray-900">
              From AED {vehicle.price.toLocaleString()}
            </span>
          </div>
        </div>

        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-bold text-lg text-gray-900 group-hover:text-persona-family-primary transition-colors">
                {vehicle.name}
              </h3>
              <p className="text-sm text-gray-500">{vehicle.category}</p>
            </div>
            <Badge
              variant="outline"
              className="text-xs border-persona-family-accent text-persona-family-accent"
            >
              {vehicle.features[0]}
            </Badge>
          </div>

          <div className="mb-4">
            {vehicle.features.slice(0, 3).map((feature, idx) => (
              <div key={idx} className="flex items-center text-sm text-gray-600 mb-1">
                <CheckCircle className="h-3 w-3 text-persona-family-primary mr-2 flex-shrink-0" />
                {feature}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              asChild
              className="flex-1 bg-persona-family-primary hover:bg-persona-family-primary/90"
            >
              <Link to={`/vehicle/${vehicle.name.toLowerCase().replace(/\s+/g, "-")}`}>
                Details
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex-1 border-persona-family-primary text-persona-family-primary hover:bg-persona-family-primary hover:text-white"
            >
              <Link to="/test-drive">Test Drive</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FamilyFirstHomepage;
