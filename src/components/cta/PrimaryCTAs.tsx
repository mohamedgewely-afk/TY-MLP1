import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Car, 
  Calendar, 
  Wrench, 
  ArrowRightLeft, 
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PrimaryCTAsProps {
  onReserve: () => void;
  onTestDrive: () => void;
  onService: () => void;
  onTradeIn: () => void;
  title?: string;
  subtitle?: string;
  className?: string;
}

const PrimaryCTAs: React.FC<PrimaryCTAsProps> = ({
  onReserve,
  onTestDrive,
  onService,
  onTradeIn,
  title = "Your Toyota Journey Starts Here",
  subtitle = "Choose your next step and let us guide you through a seamless experience",
  className = ""
}) => {
  const prefersReducedMotion = useReducedMotion();

  const ctaActions = [
    {
      id: 'reserve',
      title: 'Reserve Online',
      subtitle: 'Secure Your Vehicle',
      description: 'Reserve your preferred vehicle with a refundable deposit. Priority delivery and exclusive benefits included.',
      icon: Car,
      primaryColor: 'bg-[#EB0A1E]',
      benefits: ['Priority Delivery', 'Refundable Deposit', 'Price Protection', 'VIP Treatment'],
      estimatedTime: '5 minutes',
      buttonText: 'Reserve Now',
      action: onReserve
    },
    {
      id: 'test-drive',
      title: 'Book Test Drive',
      subtitle: 'Experience Excellence',
      description: 'Schedule a personalized test drive at your convenience. Standard or extended experience available.',
      icon: Calendar,
      primaryColor: 'bg-blue-600',
      benefits: ['Flexible Scheduling', 'Extended Options', 'Expert Guidance', 'Multiple Locations'],
      estimatedTime: '3 minutes',
      buttonText: 'Schedule Drive',
      action: onTestDrive
    },
    {
      id: 'service',
      title: 'Service Booking',
      subtitle: 'Expert Care',
      description: 'Keep your Toyota in perfect condition with our certified service technicians and genuine parts.',
      icon: Wrench,
      primaryColor: 'bg-green-600',
      benefits: ['Certified Technicians', 'Genuine Parts', 'Express Service', 'Warranty Protection'],
      estimatedTime: '4 minutes',
      buttonText: 'Book Service',
      action: onService
    },
    {
      id: 'trade-in',
      title: 'Trade-In Value',
      subtitle: 'Get Top Dollar',
      description: 'Get an instant estimate for your current vehicle and apply the value toward your new Toyota.',
      icon: ArrowRightLeft,
      primaryColor: 'bg-purple-600',
      benefits: ['Instant Estimate', 'Fair Market Value', 'Seamless Process', 'Tax Benefits'],
      estimatedTime: '2 minutes',
      buttonText: 'Get Value',
      action: onTradeIn
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
        delayChildren: prefersReducedMotion ? 0 : 0.2
      }
    }
  };

  const cardVariants = {
    hidden: prefersReducedMotion ? {} : { opacity: 0, y: 30 },
    visible: prefersReducedMotion ? { opacity: 1 } : { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <section className={cn("py-16 lg:py-24 bg-muted/30", className)}>
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? { duration: 0.1 } : { duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl lg:text-5xl font-light tracking-tight mb-4">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* CTA Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {ctaActions.map((action, index) => {
            const Icon = action.icon;
            
            return (
              <motion.div
                key={action.id}
                variants={cardVariants}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 group border-2 hover:border-[#EB0A1E]/20">
                  <CardHeader className="text-center pb-4">
                    <div className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110",
                      action.primaryColor
                    )}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <CardTitle className="text-xl mb-2">{action.title}</CardTitle>
                    <Badge variant="secondary" className="mb-3">
                      {action.subtitle}
                    </Badge>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {action.description}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Benefits */}
                    <div className="space-y-2">
                      {action.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Time estimate */}
                    <div className="flex items-center text-xs text-muted-foreground pt-2 border-t">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Takes {action.estimatedTime}</span>
                    </div>
                    
                    {/* CTA Button */}
                    <Button 
                      className={cn(
                        "w-full mt-4 text-white transition-all duration-300",
                        action.primaryColor,
                        "hover:shadow-lg hover:-translate-y-0.5"
                      )}
                      onClick={action.action}
                    >
                      {action.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom Info */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? { duration: 0.1 } : { duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12 pt-8 border-t"
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              <span>Call: 1-800-GO-TOYOTA</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              <span>Email: support@toyota.com</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              <span>Find Dealer Nearby</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PrimaryCTAs;