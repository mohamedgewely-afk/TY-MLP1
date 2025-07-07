
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VehicleModel } from "@/types/vehicle";
import { 
  HelpCircle, ChevronDown, ChevronUp, Search, 
  MessageCircle, Phone, Mail, Clock, CheckCircle,
  Zap, Shield, Wrench, CreditCard, MapPin, Users
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface VehicleFAQProps {
  vehicle: VehicleModel;
}

const VehicleFAQ: React.FC<VehicleFAQProps> = ({ vehicle }) => {
  const [activeCategory, setActiveCategory] = useState("general");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const faqCategories = [
    { id: "general", name: "General", icon: <HelpCircle className="h-4 w-4" />, color: "from-blue-500 to-blue-600" },
    { id: "features", name: "Features", icon: <Zap className="h-4 w-4" />, color: "from-purple-500 to-purple-600" },
    { id: "safety", name: "Safety", icon: <Shield className="h-4 w-4" />, color: "from-green-500 to-green-600" },
    { id: "maintenance", name: "Service", icon: <Wrench className="h-4 w-4" />, color: "from-orange-500 to-orange-600" },
    { id: "financing", name: "Financing", icon: <CreditCard className="h-4 w-4" />, color: "from-red-500 to-red-600" },
    { id: "ownership", name: "Ownership", icon: <Users className="h-4 w-4" />, color: "from-teal-500 to-teal-600" }
  ];

  const faqs = {
    general: [
      {
        id: "hybrid-system",
        question: `How does the ${vehicle.name} hybrid system work?`,
        answer: "The Toyota Hybrid Synergy Drive seamlessly combines a gasoline engine with an electric motor to deliver optimal fuel efficiency and performance. The system automatically switches between electric and gasoline power based on driving conditions.",
        tags: ["Hybrid", "Technology", "Fuel Economy"]
      },
      {
        id: "fuel-economy",
        question: "What is the fuel economy of this vehicle?",
        answer: "The hybrid system delivers exceptional fuel economy of up to 25.2 km/L in city driving conditions, making it one of the most efficient vehicles in its class.",
        tags: ["Fuel", "Economy", "Efficiency"]
      },
      {
        id: "warranty",
        question: "What warranty coverage is included?",
        answer: "Your new Toyota comes with a comprehensive 3-year/100,000 km warranty, plus an 8-year/160,000 km hybrid battery warranty for complete peace of mind.",
        tags: ["Warranty", "Coverage", "Protection"]
      }
    ],
    features: [
      {
        id: "technology",
        question: "What technology features are included?",
        answer: "Standard features include Toyota Safety Sense 3.0, wireless Apple CarPlay/Android Auto, 12.3-inch touchscreen, premium audio system, and advanced driver assistance systems.",
        tags: ["Technology", "Safety", "Connectivity"]
      },
      {
        id: "interior",
        question: "What interior features can I expect?",
        answer: "Enjoy premium materials, heated/ventilated seats, dual-zone climate control, ambient lighting, and spacious cabin design with premium soft-touch surfaces throughout.",
        tags: ["Interior", "Comfort", "Luxury"]
      }
    ],
    safety: [
      {
        id: "safety-features",
        question: "What safety features are standard?",
        answer: "Toyota Safety Sense 3.0 includes Pre-Collision System, Lane Departure Alert, Dynamic Radar Cruise Control, and Automatic High Beams as standard equipment.",
        tags: ["Safety", "TSS", "Protection"]
      },
      {
        id: "safety-rating",
        question: "What is the safety rating?",
        answer: "This vehicle has earned a 5-star NCAP safety rating, demonstrating Toyota's commitment to protecting you and your passengers in all driving conditions.",
        tags: ["Rating", "NCAP", "Safety"]
      }
    ],
    maintenance: [
      {
        id: "service-schedule",
        question: "What is the recommended service schedule?",
        answer: "Toyota recommends service every 10,000 km or 6 months, whichever comes first. Our certified technicians use genuine Toyota parts to maintain your vehicle's performance and reliability.",
        tags: ["Service", "Maintenance", "Schedule"]
      },
      {
        id: "service-cost",
        question: "How much does regular maintenance cost?",
        answer: "Toyota offers competitive service packages starting from AED 299 for basic maintenance. Extended service plans are available for additional savings and convenience.",
        tags: ["Cost", "Service", "Package"]
      }
    ],
    financing: [
      {
        id: "financing-options",
        question: "What financing options are available?",
        answer: "We offer flexible financing with rates starting from 3.5% APR, lease options, and trade-in programs. Our finance team can customize a solution that fits your budget.",
        tags: ["Financing", "Lease", "APR"]
      },
      {
        id: "down-payment",
        question: "What is the minimum down payment required?",
        answer: "Down payments start from as low as 20% of the vehicle price. Special promotions may offer even lower down payment options for qualified buyers.",
        tags: ["Down Payment", "Financing", "Promotion"]
      }
    ],
    ownership: [
      {
        id: "owner-benefits",
        question: "What benefits do Toyota owners receive?",
        answer: "Toyota owners enjoy exclusive benefits including roadside assistance, complimentary service reminders, owner events, and access to the Toyota Owner's app for vehicle management.",
        tags: ["Benefits", "Owner", "Support"]
      },
      {
        id: "resale-value",
        question: "How well do Toyota vehicles hold their value?",
        answer: "Toyota vehicles consistently rank among the highest for resale value retention, with many models retaining 60-70% of their original value after 5 years.",
        tags: ["Resale", "Value", "Investment"]
      }
    ]
  };

  const filteredFAQs = faqs[activeCategory as keyof typeof faqs]?.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  return (
    <section className="py-12 lg:py-20 bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      <div className="toyota-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 lg:mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-4"
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            Frequently Asked Questions
          </motion.div>
          <h2 className="text-3xl lg:text-5xl font-black text-foreground mb-4 leading-tight">
            Got Questions About{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
              {vehicle.name}?
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about features, specifications, and ownership benefits.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto mb-8"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-3 rounded-xl border-2 focus:border-primary/50"
            />
          </div>
        </motion.div>

        {/* Category Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          {faqCategories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                activeCategory === category.id
                  ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
              }`}
            >
              {category.icon}
              <span className="ml-2">{category.name}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* FAQ Content */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {filteredFAQs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-200">
                    <CardContent className="p-0">
                      <motion.button
                        onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                        className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/30 transition-colors"
                        whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                      >
                        <div className="flex-1 pr-4">
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            {faq.question}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {faq.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <motion.div
                          animate={{ rotate: expandedFAQ === faq.id ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        </motion.div>
                      </motion.button>
                      
                      <AnimatePresence>
                        {expandedFAQ === faq.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6 border-t border-border/50">
                              <div className="pt-4 text-muted-foreground leading-relaxed">
                                {faq.answer}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredFAQs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🤔</div>
              <h3 className="text-xl font-semibold mb-2">No FAQs found</h3>
              <p className="text-muted-foreground">Try adjusting your search or selecting a different category.</p>
            </motion.div>
          )}
        </div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
              <p className="text-muted-foreground mb-6">
                Our expert team is here to help you with any additional questions about the {vehicle.name}.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button className="bg-primary hover:bg-primary/90">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Live Chat
                </Button>
                <Button variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Us
                </Button>
                <Button variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Support
                </Button>
              </div>
              <div className="flex items-center justify-center mt-4 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                Available 24/7 for your convenience
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default VehicleFAQ;
