
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const HomeGalleryShowcase = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const galleryImages = [
    {
      src: "https://global.toyota/pages/news/images/2023/11/28/2000/20231128_01_30_s.jpg",
      alt: "Camry interior technology",
      category: "Interior"
    },
    {
      src: "https://global.toyota/pages/models/images/gallery/new_camry_23/exterior/exterior_01_800x447.jpg",
      alt: "Camry exterior front view",
      category: "Exterior"
    },
    {
      src: "https://global.toyota/pages/news/images/2023/08/02/2000/landcruiser250_20230802_01_40_s.jpg",
      alt: "Land Cruiser off-road action",
      category: "Adventure"
    },
    {
      src: "https://global.toyota/pages/news/images/2023/06/02/2000/20230602_01_09_s.jpg",
      alt: "Crown dashboard view",
      category: "Interior"
    },
    {
      src: "https://global.toyota/pages/news/images/2023/02/13/001/20230213_01_02_s.jpg",
      alt: "Prius driving on mountain road",
      category: "Driving"
    },
    {
      src: "https://global.toyota/pages/news/images/2023/04/25/001/20230425_01_05_s.jpg",
      alt: "Highlander family adventure",
      category: "Lifestyle"
    }
  ];

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="toyota-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Toyota Gallery
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Experience our vehicles through stunning visuals that highlight design, technology, and lifestyle
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.src}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative cursor-pointer group overflow-hidden rounded-lg"
              onClick={() => setSelectedImage(image.src)}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                  View Larger
                </Button>
              </div>
              <Badge className="absolute top-3 right-3 bg-toyota-red">{image.category}</Badge>
            </motion.div>
          ))}
        </div>

        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
            <div className="relative">
              <Button
                variant="outline"
                size="icon"
                className="absolute top-2 right-2 rounded-full bg-black/50 hover:bg-black/80 border-none"
                onClick={() => setSelectedImage(null)}
              >
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
              
              {selectedImage && (
                <img 
                  src={selectedImage} 
                  alt="Gallery showcase" 
                  className="w-full h-auto rounded-lg shadow-2xl"
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default HomeGalleryShowcase;
