
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight, Search, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { VehicleModel } from "@/types/vehicle";
import { useIsMobile } from "@/hooks/use-mobile";

interface VehicleFAQProps {
  vehicle: VehicleModel;
}

const VehicleFAQ: React.FC<VehicleFAQProps> = ({ vehicle }) => {
  const [activeCategory, setActiveCategory] = useState("General");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryIndex, setCategoryIndex] = useState(0);
  const isMobile = useIsMobile();

  const categories = ["General", "Performance", "Safety", "Technology", "Maintenance", "Financing"];

  const faqData = {
    General: [
      {
        question: `What makes the ${vehicle.name} special?`,
        answer: `The ${vehicle.name} combines cutting-edge hybrid technology with exceptional reliability and comfort. It features Toyota's latest Hybrid Synergy Drive system for optimal fuel efficiency.`
      },
      {
        question: "What colors are available?",
        answer: "The vehicle is available in Pearl White, Midnight Black, Silver Metallic, Deep Blue, and Ruby Red with various interior options."
      },
      {
        question: "What is the warranty coverage?",
        answer: "Toyota provides a comprehensive 5-year/100,000km warranty with 24/7 roadside assistance and free scheduled maintenance for the first 3 years."
      }
    ],
    Performance: [
      {
        question: "What is the fuel economy?",
        answer: "The hybrid version achieves an impressive 25.2 km/L in city driving conditions, making it one of the most fuel-efficient vehicles in its class."
      },
      {
        question: "How powerful is the engine?",
        answer: "The hybrid system produces a combined 218 HP, providing smooth acceleration and responsive performance while maintaining excellent fuel efficiency."
      }
    ],
    Safety: [
      {
        question: "What safety features are included?",
        answer: "Toyota Safety Sense 3.0 comes standard, including Pre-Collision System, Lane Departure Alert, Dynamic Radar Cruise Control, and Automatic High Beams."
      },
      {
        question: "What is the safety rating?",
        answer: "The vehicle has earned a 5-star NCAP safety rating, demonstrating exceptional protection for occupants in various crash scenarios."
      }
    ],
    Technology: [
      {
        question: "What infotainment features are available?",
        answer: "The vehicle features a 12.3-inch touchscreen with wireless Apple CarPlay & Android Auto, premium JBL audio system, and cloud-based navigation."
      },
      {
        question: "Is remote connectivity available?",
        answer: "Yes, Toyota Connect app allows remote vehicle monitoring, climate control, door lock/unlock, and maintenance scheduling from your smartphone."
      }
    ],
    Maintenance: [
      {
        question: "How often does it need servicing?",
        answer: "Regular maintenance is recommended every 10,000km or 6 months. The hybrid system requires minimal additional maintenance compared to conventional vehicles."
      },
      {
        question: "Are parts readily available?",
        answer: "Yes, Toyota has an extensive parts network across the UAE with genuine parts availability and certified technicians at all service centers."
      }
    ],
    Financing: [
      {
        question: "What financing options are available?",
        answer: "We offer conventional financing, Islamic financing (Sharia-compliant), leasing options, and balloon payment plans with competitive rates starting from 3.5%."
      },
      {
        question: "What is the minimum down payment?",
        answer: "Down payment starts from 0% for qualified customers, with flexible terms up to 7 years. Trade-in vehicles are accepted for down payment."
      }
    ]
  };

  const currentFAQs = faqData[activeCategory as keyof typeof faqData] || [];
  const filteredFAQs = currentFAQs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const nextCategory = () => {
    setCategoryIndex((prev) => (prev + 1) % categories.length);
    setActiveCategory(categories[(categoryIndex + 1) % categories.length]);
  };

  const prevCategory = () => {
    const newIndex = (categoryIndex - 1 + categories.length) % categories.length;
    setCategoryIndex(newIndex);
    setActiveCategory(categories[newIndex]);
  };

  return (
    <section className="py-8 lg:py-16 bg-muted/30">
      <div className="toyota-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 lg:mb-12"
        >
          <h2 className="text-2xl lg:text-4xl font-black text-foreground mb-4">
            Frequently Asked{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
              Questions
            </span>
          </h2>
          <p className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about the {vehicle.name}.
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3"
            />
          </div>
        </div>

        {/* Category Filter */}
        {isMobile ? (
          <motion.div 
            className="flex items-center justify-between mb-8 px-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <button
              onClick={prevCategory}
              className="p-2 bg-white rounded-full shadow-lg border min-h-[44px] min-w-[44px]"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="text-center">
              <h3 className="font-bold text-lg">{activeCategory}</h3>
              <div className="flex space-x-2 mt-2 justify-center">
                {categories.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === categoryIndex ? 'bg-primary' : 'bg-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={nextCategory}
              className="p-2 bg-white rounded-full shadow-lg border min-h-[44px] min-w-[44px]"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </motion.div>
        ) : (
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-white rounded-lg p-1 shadow-sm border">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeCategory === category
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* FAQ List - Swipeable on Mobile */}
        <div className="max-w-4xl mx-auto">
          {isMobile ? (
            <div className="overflow-x-auto scrollbar-hide">
              <motion.div 
                className="flex space-x-4 pb-4"
                style={{ width: `${filteredFAQs.length * 320}px` }}
              >
                {filteredFAQs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="w-80 flex-shrink-0"
                  >
                    <Card className="h-full">
                      <CardContent className="p-0">
                        <button
                          onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                          className="w-full p-6 text-left hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-base pr-4">{faq.question}</h3>
                            <motion.div
                              animate={{ rotate: expandedFAQ === index ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            </motion.div>
                          </div>
                        </button>
                        
                        <AnimatePresence>
                          {expandedFAQ === index && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-6">
                                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-0">
                      <button
                        onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                        className="w-full p-6 text-left hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg pr-4">{faq.question}</h3>
                          <motion.div
                            animate={{ rotate: expandedFAQ === index ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          </motion.div>
                        </div>
                      </button>
                      
                      <AnimatePresence>
                        {expandedFAQ === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6">
                              <p className="text-muted-foreground leading-relaxed text-base">{faq.answer}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No FAQs found matching your search.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default VehicleFAQ;
