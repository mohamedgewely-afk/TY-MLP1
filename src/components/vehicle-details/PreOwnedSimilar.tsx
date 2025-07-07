
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VehicleModel } from "@/types/vehicle";
import { 
  Calendar, Gauge, Fuel, MapPin, Star, ArrowRight, Award,
  Clock, CheckCircle, Shield
} from "lucide-react";

interface PreOwnedSimilarProps {
  currentVehicle: VehicleModel;
}

const PreOwnedSimilar: React.FC<PreOwnedSimilarProps> = ({ currentVehicle }) => {
  // Mock pre-owned similar vehicles data
  const preOwnedVehicles = [
    {
      id: 1,
      name: `${currentVehicle.name.split(' ')[1]} 2022`,
      year: 2022,
      mileage: "45,000 km",
      price: Math.round(currentVehicle.price * 0.7),
      originalPrice: Math.round(currentVehicle.price * 0.85),
      rating: 4.8,
      location: "Dubai, UAE",
      certification: "Toyota Certified",
      warranty: "12 months",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/e661ede5-10d4-43d3-b507-3e9cf54d1e51?binary=true&mformat=true",
      features: ["Hybrid Engine", "Premium Interior", "Safety Sense 2.0"]
    },
    {
      id: 2,
      name: `${currentVehicle.name.split(' ')[1]} 2021`,
      year: 2021,
      mileage: "62,000 km",
      price: Math.round(currentVehicle.price * 0.6),
      originalPrice: Math.round(currentVehicle.price * 0.75),
      rating: 4.6,
      location: "Abu Dhabi, UAE",
      certification: "Toyota Certified",
      warranty: "12 months",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true",
      features: ["Excellent Condition", "Full Service History", "Single Owner"]
    },
    {
      id: 3,
      name: `${currentVehicle.name.split(' ')[1]} 2020`,
      year: 2020,
      mileage: "78,000 km",
      price: Math.round(currentVehicle.price * 0.5),
      originalPrice: Math.round(currentVehicle.price * 0.65),
      rating: 4.5,
      location: "Sharjah, UAE",
      certification: "Toyota Certified",
      warranty: "6 months",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/aa9464a6-1f26-4dd0-a3a1-b246f02db11d/renditions/b8ac9e21-da97-4c00-9efc-276d36d797c2?binary=true&mformat=true",
      features: ["Great Value", "Well Maintained", "All Records Available"]
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-muted/30 to-background">
      <div className="toyota-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full text-sm font-medium mb-6">
            <Award className="h-4 w-4 mr-2" />
            Toyota Certified Pre-Owned
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-black text-foreground mb-6 leading-tight">
            Similar{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
              Pre-Owned Models
            </span>
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover certified pre-owned {currentVehicle.name.split(' ')[1]} models with Toyota's quality assurance 
            and comprehensive warranty coverage.
          </p>
        </motion.div>

        {/* Pre-Owned Vehicles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {preOwnedVehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <Card className="h-full overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group">
                <div className="relative">
                  <img 
                    src={vehicle.image} 
                    alt={vehicle.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-green-600 text-white">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {vehicle.certification}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current mr-1" />
                      <span className="text-xs font-semibold">{vehicle.rating}</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>

                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{vehicle.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {vehicle.year}
                      </div>
                      <div className="flex items-center">
                        <Gauge className="h-4 w-4 mr-1" />
                        {vehicle.mileage}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{vehicle.location}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-foreground">
                        AED {vehicle.price.toLocaleString()}
                      </span>
                      {vehicle.originalPrice > vehicle.price && (
                        <span className="text-sm text-muted-foreground line-through">
                          AED {vehicle.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-green-600">
                      <Shield className="h-4 w-4 mr-1" />
                      {vehicle.warranty} warranty included
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Key Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {vehicle.features.map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-2">
                    <Button className="flex-1 group/btn">
                      View Details
                      <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Clock className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12 lg:mt-16"
        >
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Looking for More Options?</h3>
              <p className="text-muted-foreground mb-6">
                Browse our complete collection of certified pre-owned vehicles with Toyota's 
                quality guarantee and comprehensive inspection.
              </p>
              <Button size="lg" className="w-full md:w-auto">
                View All Pre-Owned Vehicles
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default PreOwnedSimilar;
