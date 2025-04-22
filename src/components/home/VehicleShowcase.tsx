
import React from "react";
import { motion } from "framer-motion";
import VehicleCard from "./VehicleCard";
import { Button } from "@/components/ui/button";
import { VehicleModel } from "@/types/vehicle";
import { TestTube, Mail, Phone } from "lucide-react";

interface VehicleShowcaseProps {
  title: string;
  vehicles: VehicleModel[];
  compareList: string[];
  onCompare: (vehicle: VehicleModel) => void;
  onQuickView: (vehicle: VehicleModel) => void;
}

const VehicleShowcase: React.FC<VehicleShowcaseProps> = ({
  title,
  vehicles,
  compareList,
  onCompare,
  onQuickView,
}) => {
  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <div className="toyota-container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white"
        >
          {title}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <VehicleCard
                vehicle={vehicle}
                isCompared={compareList.includes(vehicle.name)}
                onCompare={() => onCompare(vehicle)}
                onQuickView={() => onQuickView(vehicle)}
                actionButtons={
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href={`/test-drive?model=${encodeURIComponent(vehicle.name)}`}>
                        <TestTube className="mr-1 h-4 w-4" /> Test Drive
                      </a>
                    </Button>
                    <Button size="sm" className="w-full" asChild>
                      <a href={`/enquire?model=${encodeURIComponent(vehicle.name)}`}>
                        <Mail className="mr-1 h-4 w-4" /> Enquire
                      </a>
                    </Button>
                  </div>
                }
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VehicleShowcase;
