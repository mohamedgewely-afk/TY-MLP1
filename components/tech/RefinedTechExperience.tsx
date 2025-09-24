import React from "react";
import { motion } from "framer-motion";
import { placeholderImage } from "../../utils/dam";

export const RefinedTechExperience: React.FC<{ title?: string; body?: string; image?: string }> = ({ title = "Technology", body = "An editorial view into the tech that powers your journey.", image }) => {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.42 }}>
          <img src={image || placeholderImage(1200, 800, "Tech")} alt="Tech imagery" className="w-full rounded-lg object-cover" loading="lazy" />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.42 }}>
          <h3 className="text-2xl font-semibold text-white">{title}</h3>
          <p className="mt-4 text-white/70">{body}</p>
          <div className="mt-6 border-t border-white/6 pt-4 text-white/60">Never crop focal points — imagery is presented in safe aspect ratios and responsive containers.</div>
        </motion.div>
      </div>
    </section>
  );
};