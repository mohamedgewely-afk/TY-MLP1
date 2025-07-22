
import React from "react";
import { motion } from "framer-motion";
import ToyotaGradeCards from "../ToyotaGradeCards";

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
  return (
    <div className="space-y-4">
      <ToyotaGradeCards config={config} setConfig={setConfig} />
    </div>
  );
};

export default GradeCarouselStep;
