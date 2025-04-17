
import React from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface VideoCardProps {
  title: string;
  description: string;
  videoSrc: string;
  link: string;
  delay: number;
}

const VideoCard: React.FC<VideoCardProps> = ({
  title,
  description,
  videoSrc,
  link,
  delay,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full">
        <div className="h-60 overflow-hidden bg-black">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-90"
            src={videoSrc}
          />
        </div>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
          <Button
            asChild
            className="bg-toyota-red hover:bg-toyota-darkred"
          >
            <a href={link} className="flex items-center">
              Explore {title} <ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const PerformanceSection: React.FC = () => {
  const performanceVideos = [
    {
      title: "GR Supra",
      description:
        "Experience pure driving excitement with the legendary Supra, reborn for the modern era with track-tuned performance.",
      videoSrc: "https://www.toyota.ae/-/media/Videos/GR/Supra-Performance.mp4",
      link: "/gr/supra",
    },
    {
      title: "GR Yaris",
      description:
        "Rally-bred and road-legal, the GR Yaris delivers exhilarating performance in a compact package.",
      videoSrc: "https://www.toyota.ae/-/media/Videos/GR/Yaris-Performance.mp4",
      link: "/gr/yaris",
    },
  ];

  return (
    <section className="py-16 bg-black text-white">
      <div className="toyota-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            TOYOTA GAZOO Racing
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Born on the racetrack, built for the road. Discover Toyota's high-performance GR series, engineered for pure driving excitement.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {performanceVideos.map((video, index) => (
            <VideoCard key={video.title} {...video} delay={index * 0.1} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-black"
          >
            <a href="/gr">Explore All GR Models</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default PerformanceSection;
