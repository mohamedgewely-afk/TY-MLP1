
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const HomeTechnologySection = () => {
  const technologies = [
    {
      id: "tech-1",
      title: "Toyota Safety Sense™",
      description: "Advanced suite of safety features designed to support your awareness on the road",
      image: "https://global.toyota/pages/powertrain/images/toyota-safety-sense.jpg",
      link: "/technology/safety"
    },
    {
      id: "tech-2",
      title: "Hybrid Technology",
      description: "Experience Toyota's advanced hybrid systems that combine efficiency with performance",
      image: "https://global.toyota/pages/news/images/2021/10/15/1200/20211015_01_10_s.jpg",
      link: "/technology/hybrid"
    },
    {
      id: "tech-3",
      title: "Connected Services",
      description: "Stay connected to your vehicle with smart technology that enhances your driving experience",
      image: "https://global.toyota/pages/news/images/2023/06/05/001/20230605_01_38_s.jpg",
      link: "/technology/connected"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="toyota-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Innovative Technology
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Toyota is committed to developing technology that improves your driving experience and helps create a more sustainable future
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group overflow-hidden rounded-lg shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10" />
              <img
                src={tech.image}
                alt={tech.title}
                className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                <h3 className="text-2xl font-bold text-white mb-2">{tech.title}</h3>
                <p className="text-gray-200 mb-6">{tech.description}</p>
                <Button 
                  variant="outline" 
                  className="w-full border-white text-white hover:bg-white hover:text-gray-900 transition-colors"
                  asChild
                >
                  <a href={tech.link} className="flex items-center justify-center">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeTechnologySection;
