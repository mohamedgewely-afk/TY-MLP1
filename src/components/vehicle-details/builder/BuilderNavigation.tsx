import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BuilderNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevStep: () => void;
  onNextStep: () => void;
}

const fadeSlide = (dir: "left" | "right") => ({
  initial: { opacity: 0, x: dir === "left" ? -12 : 12, scale: 0.96 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: dir === "left" ? -12 : 12, scale: 0.96 },
  transition: { duration: 0.22, ease: "easeOut" },
});

const baseBtn =
  "p-4 rounded-full backdrop-blur-2xl border transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40";
const activeBtn =
  "bg-black/80 border-white/20 text-white shadow-[0_0_18px_rgba(0,0,0,0.45)] hover:scale-110 hover:shadow-[0_0_26px_rgba(0,0,0,0.6)]";

const BuilderNavigation: React.FC<BuilderNavigationProps> = ({
  currentStep,
  totalSteps,
  onPrevStep,
  onNextStep,
}) => {
  const canPrev = currentStep > 1;
  const canNext = currentStep < totalSteps;

  return (
    <>
      <AnimatePresence initial={false} mode="popLayout">
        {canPrev && (
          <motion.button
            key="prev"
            aria-label="Previous Step"
            className={`absolute left-8 top-1/2 -translate-y-1/2 z-20 ${baseBtn} ${activeBtn}`}
            {...fadeSlide("left")}
            whileHover={{ x: -6 }}
            whileTap={{ scale: 0.92 }}
            onClick={onPrevStep}
          >
            <ChevronLeft className="h-7 w-7" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false} mode="popLayout">
        {canNext && (
          <motion.button
            key="next"
            aria-label="Next Step"
            className={`absolute right-8 top-1/2 -translate-y-1/2 z-20 ${baseBtn} ${activeBtn}`}
            {...fadeSlide("right")}
            whileHover={{ x: 6 }}
            whileTap={{ scale: 0.92 }}
            onClick={onNextStep}
          >
            <ChevronRight className="h-7 w-7" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default BuilderNavigation;
