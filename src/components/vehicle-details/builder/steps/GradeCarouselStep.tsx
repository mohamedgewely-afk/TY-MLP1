
import React from "react";
import { motion } from "framer-motion";
import Enhanced3DGradeCards from "../Enhanced3DGradeCards";
import { useIsMobile } from "@/hooks/use-mobile";

interface BuilderConfig {
  modelYear: string;
  engine: string;
  grade: string;
  exteriorColor: string;
  interiorColor: string;
  accessories: string[];
}

interface GradeCarouselStepProps {
  config: BuilderConfig;
  setConfig: React.Dispatch<React.SetStateAction<BuilderConfig>>;
}

const GradeCarouselStep: React.FC<GradeCarouselStepProps> = ({ config, setConfig }) => {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-4">
      <Enhanced3DGradeCards config={config} setConfig={setConfig} />
    </div>
  );
};

export default GradeCarouselStep;
