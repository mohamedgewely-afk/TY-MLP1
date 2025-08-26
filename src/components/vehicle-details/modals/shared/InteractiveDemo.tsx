
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InteractiveDemoProps {
  title: string;
  description: string;
  demoSteps: {
    id: string;
    title: string;
    description: string;
    image: string;
    duration?: number;
  }[];
  autoPlay?: boolean;
}

const InteractiveDemo: React.FC<InteractiveDemoProps> = ({
  title,
  description,
  demoSteps,
  autoPlay = false
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  React.useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % demoSteps.length);
    }, demoSteps[currentStep]?.duration || 3000);

    return () => clearInterval(interval);
  }, [isPlaying, currentStep, demoSteps]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <div className="relative bg-muted rounded-2xl overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="aspect-video relative"
          >
            <img
              src={demoSteps[currentStep]?.image}
              alt={demoSteps[currentStep]?.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h4 className="text-xl font-bold mb-2">
                {demoSteps[currentStep]?.title}
              </h4>
              <p className="text-white/90">
                {demoSteps[currentStep]?.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Play/Pause Control */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 right-4 h-12 w-12"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </Button>
      </div>

      {/* Step Navigation */}
      <div className="flex justify-center gap-2">
        {demoSteps.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentStep(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentStep ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default InteractiveDemo;
