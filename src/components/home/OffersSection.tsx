
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Offer {
  id: string;
  title: string;
  description: string;
  image: string;
  validUntil: string;
  badge?: string;
  link: string;
}

const offers: Offer[] = [
  {
    id: "offer-1",
    title: "0% APR on New Camry Models",
    description: "Take advantage of 0% APR financing for 60 months on all 2025 Camry models, plus $1,000 Toyota Cash Back.",
    image: "https://www.toyota.ae/-/media/project/tme/tjae/toyota-ae/showroom/npp/camry/camry-hero-full.jpg",
    validUntil: "2025-05-31",
    badge: "Limited Time",
    link: "/offers/camry-finance"
  },
  {
    id: "offer-2",
    title: "Land Cruiser Service Package",
    description: "Purchase a new Land Cruiser and receive 3 years of complimentary maintenance and roadside assistance.",
    image: "https://www.toyota.ae/-/media/project/tme/tjae/toyota-ae/showroom/npp/land-cruiser/lc-300-hero-full.jpg",
    validUntil: "2025-06-15",
    badge: "Premium",
    link: "/offers/land-cruiser-service"
  },
  {
    id: "offer-3",
    title: "Corolla Cross Hybrid Special",
    description: "Get AED 10,000 discount on all Corolla Cross Hybrid models plus free window tinting and floor mats.",
    image: "https://www.toyota.ae/-/media/project/tme/tjae/toyota-ae/showroom/npp/corolla-cross/corolla-cross-hero-full.jpg",
    validUntil: "2025-05-15",
    badge: "Eco Friendly",
    link: "/offers/corolla-cross-hybrid"
  },
  {
    id: "offer-4",
    title: "RAV4 Adventure Package",
    description: "Purchase a new RAV4 and receive the Adventure Package including roof rack, all-weather mats, and more at no extra cost.",
    image: "https://www.toyota.ae/-/media/project/tme/tjae/toyota-ae/showroom/npp/rav4/rav4-hero-full.jpg",
    validUntil: "2025-06-30",
    link: "/offers/rav4-adventure"
  }
];

const OffersSection: React.FC = () => {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="toyota-container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
            >
              Special Offers
            </motion.h2>
            <p className="text-gray-600 dark:text-gray-400">
              Exclusive deals and promotions available for a limited time
            </p>
          </div>
          <Button variant="outline" className="mt-4 md:mt-0" asChild>
            <Link to="/offers">
              View All Offers <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {offers.map((offer, index) => (
              <CarouselItem key={offer.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="h-full"
                >
                  <Card className="h-full flex flex-col overflow-hidden">
                    <div className="relative">
                      {offer.badge && (
                        <Badge className="absolute top-2 right-2 bg-toyota-red text-white">
                          {offer.badge}
                        </Badge>
                      )}
                      <img
                        src={offer.image}
                        alt={offer.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl">{offer.title}</CardTitle>
                      <CardDescription>Valid until {new Date(offer.validUntil).toLocaleDateString()}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-gray-600 dark:text-gray-400">
                        {offer.description}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-toyota-red hover:bg-toyota-darkred" asChild>
                        <Link to={offer.link}>
                          Learn More <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-1" />
          <CarouselNext className="right-1" />
        </Carousel>
      </div>
    </section>
  );
};

export default OffersSection;
