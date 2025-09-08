import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";

interface VehicleFAQSectionProps {
  vehicle: VehicleModel;
  className?: string;
}

/**
 * Minimal FAQ Section:
 * - No header/hero
 * - No category filters
 * - No mobile carousel
 * - No footer CTA
 * - Just an animated collapsible list of Q&As
 */
const VehicleFAQSection: React.FC<VehicleFAQSectionProps> = ({ vehicle, className }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Keep your existing Q&A content; you can externalize this if needed
  const faqs = [
    {
      category: "Vehicle Features",
      question: `What are the key features of the ${vehicle.name}?`,
      answer:
        `The ${vehicle.name} comes with Toyota Safety Sense 3.0, advanced infotainment system, premium audio, wireless connectivity, and comprehensive driver assistance features. It also includes LED lighting, dual-zone climate control, and premium interior materials.`,
    },
    {
      category: "Vehicle Features",
      question: "Does it come with hybrid technology?",
      answer:
        "Yes, the hybrid variant features Toyota's advanced Hybrid Synergy Drive system, delivering exceptional fuel efficiency of up to 25.2 km/L while maintaining powerful performance with 218 HP combined output.",
    },
    {
      category: "Vehicle Features",
      question: "What safety features are included?",
      answer:
        "Standard safety features include Pre-Collision System, Lane Departure Alert with Steering Assist, Dynamic Radar Cruise Control, Automatic High Beams, and Blind Spot Monitor with Cross-Traffic Alert.",
    },
    {
      category: "Vehicle Features",
      question: "What infotainment options are available?",
      answer:
        "The vehicle features a 12.3-inch touchscreen display with wireless Apple CarPlay and Android Auto, premium JBL audio system, cloud-based navigation, and Toyota's Remote Connect services.",
    },
    {
      category: "Maintenance",
      question: "What is the recommended service interval?",
      answer:
        "We recommend servicing every 10,000 km or 6 months, whichever comes first. This ensures optimal performance and maintains your warranty coverage.",
    },
    {
      category: "Maintenance",
      question: "Where can I get my vehicle serviced?",
      answer:
        "You can service your vehicle at any authorized Toyota service center across the UAE. We have over 25 locations offering genuine parts and certified technicians.",
    },
    {
      category: "Maintenance",
      question: "What maintenance is covered under warranty?",
      answer:
        "Basic maintenance items like oil changes, filter replacements, and routine inspections are covered for the first 2 years or 40,000 km under our comprehensive warranty program.",
    },
    {
      category: "Warranty",
      question: "What warranty is provided?",
      answer:
        "All new Toyota vehicles come with a 3-year/100,000 km comprehensive warranty, plus an additional 2-year extended warranty option. Hybrid components are covered for 8 years/195,000 km.",
    },
    {
      category: "Warranty",
      question: "Does the warranty cover hybrid components?",
      answer:
        "Yes, hybrid system components including the battery, inverter, and electric motors are covered under our exclusive 8-year/195,000 km Hybrid Vehicle Warranty.",
    },
    {
      category: "Financing",
      question: "What financing options are available?",
      answer:
        "We offer conventional loans, Islamic financing (Sharia-compliant), balloon payment plans, and leasing options. Interest rates start from 3.5% APR with flexible terms up to 7 years.",
    },
    {
      category: "Financing",
      question: "Can I trade in my current vehicle?",
      answer:
        "Absolutely! We offer competitive trade-in values for your current vehicle. Our team will provide a free evaluation and apply the value towards your new purchase.",
    },
    {
      category: "Financing",
      question: "What documents do I need for financing?",
      answer:
        "You'll need a valid UAE driving license, Emirates ID, salary certificate, bank statements for the last 3 months, and a down payment. Our finance team will guide you through the process.",
    },
  ];

  return (
    <section className={["py-8 lg:py-12", className].filter(Boolean).join(" ")}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-4">
          <AnimatePresence>
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.18 }}
                >
                  <Card className="overflow-hidden border hover:shadow-md transition-shadow">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${index}`}
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="w-full text-left"
                    >
                      <CardContent className="p-5 md:p-6">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <Badge variant="outline" className="mb-2 text-xs">
                              {faq.category}
                            </Badge>
                            <h3 className="text-base md:text-lg font-semibold text-foreground leading-tight line-clamp-2">
                              {faq.question}
                            </h3>
                          </div>
                          <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="shrink-0"
                          >
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          </motion.div>
                        </div>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              id={`faq-panel-${index}`}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.22 }}
                              className="overflow-hidden"
                            >
                              <div className="pt-4 border-t border-border mt-4">
                                <p className="text-muted-foreground leading-relaxed">
                                  {faq.answer}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </button>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default VehicleFAQSection;
