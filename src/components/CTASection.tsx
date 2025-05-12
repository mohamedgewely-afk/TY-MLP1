
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Car, Calendar, Phone, Mail, ArrowRight } from "lucide-react";

interface CTASectionProps {
  title: string;
  description: string;
  primaryCTA: {
    text: string;
    link: string;
    icon?: React.ReactNode;
  };
  secondaryCTA?: {
    text: string;
    link: string;
    icon?: React.ReactNode;
  };
  background?: "gradient" | "light" | "dark" | "red";
  alignment?: "left" | "center";
  imageUrl?: string;
}

const CTASection: React.FC<CTASectionProps> = ({
  title,
  description,
  primaryCTA,
  secondaryCTA,
  background = "gradient",
  alignment = "center",
  imageUrl,
}) => {
  // Define background styles based on the prop
  const getBgStyles = () => {
    switch (background) {
      case "gradient":
        return "bg-gradient-to-r from-slate-900 to-slate-800 text-white";
      case "light":
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white";
      case "dark":
        return "bg-slate-900 text-white";
      case "red":
        return "bg-toyota-red text-white";
      default:
        return "bg-gradient-to-r from-slate-900 to-slate-800 text-white";
    }
  };

  // Define container alignment
  const containerAlignment = alignment === "center" ? "text-center" : "text-left";

  // Define button alignment
  const buttonAlignment = alignment === "center" 
    ? "justify-center" 
    : "justify-start";

  return (
    <div className={`py-16 ${getBgStyles()}`}>
      <div className={`toyota-container ${containerAlignment} relative overflow-hidden`}>
        {/* Optional background image with overlay */}
        {imageUrl && (
          <div 
            className="absolute inset-0 opacity-15 bg-cover bg-center"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        )}
        
        <div className="relative z-10">
          {/* Content section */}
          <div className="max-w-3xl mx-auto">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              {title}
            </motion.h2>
            
            <motion.p 
              className="text-lg mb-8 opacity-90"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              {description}
            </motion.p>
            
            {/* CTA buttons */}
            <motion.div 
              className={`flex flex-col sm:flex-row gap-4 ${buttonAlignment}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <Button 
                size="lg" 
                className={background === "red" ? "bg-white text-toyota-red hover:bg-gray-100" : "bg-toyota-red hover:bg-toyota-darkred"} 
                asChild
              >
                <a href={primaryCTA.link}>
                  {primaryCTA.icon}
                  <span>{primaryCTA.text}</span>
                </a>
              </Button>
              
              {secondaryCTA && (
                <Button 
                  variant="outline" 
                  size="lg" 
                  className={background === "light" ? "border-gray-300" : "border-white/30 text-white hover:bg-white/10"} 
                  asChild
                >
                  <a href={secondaryCTA.link}>
                    {secondaryCTA.icon}
                    <span>{secondaryCTA.text}</span>
                  </a>
                </Button>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Predefined CTA sections for common use cases
export const TestDriveCTA: React.FC = () => (
  <CTASection
    title="Experience Toyota Today"
    description="Book a test drive at your nearest dealer and discover the quality, comfort and performance of our vehicles."
    primaryCTA={{
      text: "Book a Test Drive",
      link: "/test-drive",
      icon: <Car className="mr-2 h-5 w-5" />
    }}
    secondaryCTA={{
      text: "Find a Dealer",
      link: "/dealers",
      icon: <ArrowRight className="ml-2 h-5 w-5" />
    }}
    background="red"
  />
);

export const ContactCTA: React.FC = () => (
  <CTASection
    title="Have Questions? We're Here to Help"
    description="Our customer service team is ready to assist you with any queries about our vehicles, services, or financing options."
    primaryCTA={{
      text: "Call Us",
      link: "/contact",
      icon: <Phone className="mr-2 h-5 w-5" />
    }}
    secondaryCTA={{
      text: "Send Enquiry",
      link: "/enquire",
      icon: <Mail className="mr-2 h-5 w-5" />
    }}
    background="light"
    alignment="center"
  />
);

export const ServiceCTA: React.FC = () => (
  <CTASection
    title="Keep Your Toyota in Perfect Condition"
    description="Regular maintenance is essential for your vehicle's performance, safety, and reliability. Book a service appointment today."
    primaryCTA={{
      text: "Book a Service",
      link: "/service",
      icon: <Calendar className="mr-2 h-5 w-5" />
    }}
    background="gradient"
    imageUrl="/images/service-background.jpg"
  />
);

export default CTASection;
