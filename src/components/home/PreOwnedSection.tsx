
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Check, Award } from "lucide-react";
import { cn } from "@/lib/utils";

// Sample pre-owned vehicles
const preOwnedVehicles = [
  {
    id: 1,
    name: "Toyota Camry",
    year: 2022,
    mileage: 15000,
    price: 24500,
    image: "https://www.toyota.ae/-/media/project/tme/tjae/toyota-ae/showroom/npp/camry/camry-hero-full.jpg",
    features: ["Leather Seats", "Navigation System", "Reverse Camera"]
  },
  {
    id: 2,
    name: "Toyota Land Cruiser",
    year: 2021,
    mileage: 22000,
    price: 65000,
    image: "https://www.toyota.ae/-/media/project/tme/tjae/toyota-ae/showroom/npp/land-cruiser/lc-300-hero-full.jpg",
    features: ["Premium Audio", "7 Seater", "Parking Sensors"]
  },
  {
    id: 3,
    name: "Toyota RAV4",
    year: 2022,
    mileage: 18000,
    price: 28900,
    image: "https://www.toyota.ae/-/media/project/tme/tjae/toyota-ae/showroom/npp/rav4/rav4-hero-full.jpg",
    features: ["Hybrid Engine", "Panoramic Roof", "Lane Assist"]
  }
];

const PreOwnedSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="toyota-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-4 text-gray-900">
            Toyota Certified Pre-Owned
          </h2>
          <p className="text-gray-600 max-w-3xl">
            Discover premium quality pre-owned Toyota vehicles with comprehensive inspections and warranty coverage. Experience Toyota reliability at an exceptional value.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {preOwnedVehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 bg-toyota-red text-white px-3 py-1 text-sm font-semibold">
                  {vehicle.year}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {vehicle.name}
                </h3>
                <div className="flex justify-between mb-4 text-gray-600">
                  <span>{vehicle.mileage.toLocaleString()} km</span>
                  <span className="font-semibold text-toyota-red">
                    AED {vehicle.price.toLocaleString()}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  {vehicle.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-gray-700 text-sm">
                      <Check className="h-4 w-4 mr-2 text-toyota-red" />
                      {feature}
                    </div>
                  ))}
                </div>
                <Button
                  asChild
                  className="w-full mt-2 bg-toyota-red hover:bg-toyota-darkred"
                >
                  <Link to={`/pre-owned/${vehicle.id}`}>
                    View Details
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: <Shield className="h-12 w-12 text-toyota-red" />,
              title: "Toyota Certified",
              description:
                "Each certified pre-owned vehicle undergoes a rigorous 160-point quality assurance inspection"
            },
            {
              icon: <Award className="h-12 w-12 text-toyota-red" />,
              title: "Extended Warranty",
              description:
                "Enjoy peace of mind with our comprehensive warranty on all certified pre-owned vehicles"
            },
            {
              icon: <Check className="h-12 w-12 text-toyota-red" />,
              title: "Service History",
              description:
                "Complete service history and documentation provided with every certified pre-owned vehicle"
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={cn(
                "p-6 rounded-lg",
                index === 0 ? "bg-gray-900 text-white" : "bg-white"
              )}
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className={index === 0 ? "text-gray-300" : "text-gray-600"}>
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button
            asChild
            className="bg-toyota-red hover:bg-toyota-darkred"
            size="lg"
          >
            <Link to="/pre-owned" className="flex items-center">
              Browse All Pre-Owned Vehicles
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PreOwnedSection;
