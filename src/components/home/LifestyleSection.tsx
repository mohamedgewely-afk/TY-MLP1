
import React from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface LifestyleCardProps {
  title: string;
  description: string;
  image: string;
  link: string;
  index: number;
}

const LifestyleCard: React.FC<LifestyleCardProps> = ({
  title,
  description,
  image,
  link,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full">
        <div className="h-60 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
          <Button
            variant="link"
            className="p-0 text-toyota-red hover:text-toyota-darkred"
            asChild
          >
            <a href={link} className="flex items-center">
              Learn More <ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const LifestyleSection: React.FC = () => {
  const lifestyleCards = [
    {
      title: "Adventure Ready",
      description:
        "Explore the UAE's dramatic landscapes with Toyota's rugged SUVs built for any terrain.",
      image: "https://www.toyota.ae/-/media/Images/Toyota/Lifestyle/Adventure.jpg",
      link: "/lifestyle/adventure",
    },
    {
      title: "Family First",
      description:
        "Spacious, safe, and reliable vehicles designed with your family's comfort in mind.",
      image: "https://www.toyota.ae/-/media/Images/Toyota/Lifestyle/Family.jpg",
      link: "/lifestyle/family",
    },
    {
      title: "Eco Conscious",
      description:
        "Hybrid technology that reduces emissions without compromising on performance.",
      image: "https://www.toyota.ae/-/media/Images/Toyota/Lifestyle/Hybrid.jpg",
      link: "/lifestyle/eco",
    },
  ];

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="toyota-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Your Toyota Lifestyle
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Toyota isn't just about cars — it's about enhancing your lifestyle. Discover how our vehicles fit perfectly into your world.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {lifestyleCards.map((card, index) => (
            <LifestyleCard key={card.title} {...card} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button
            asChild
            size="lg"
            className="bg-toyota-red hover:bg-toyota-darkred"
          >
            <a href="/lifestyle">Explore Toyota Lifestyle</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default LifestyleSection;
