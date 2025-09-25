import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, ChevronDown, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface FeatureModal5Props {
  isOpen: boolean;
  onClose: () => void;
}

const FeatureModal5: React.FC<FeatureModal5Props> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const prefersReducedMotion = useReducedMotion();

  const faqs: FAQ[] = [
    {
      id: 'efficiency-1',
      question: 'How does the hybrid system improve fuel efficiency?',
      answer: 'The hybrid system combines a gasoline engine with electric motors to optimize fuel consumption. During city driving, the electric motor can power the vehicle alone, while highway driving uses the most efficient combination of both power sources.',
      category: 'efficiency'
    },
    {
      id: 'efficiency-2',
      question: 'What is the expected fuel economy?',
      answer: 'Our hybrid models achieve up to 4.5L/100km in combined driving conditions, representing a significant improvement over conventional gasoline engines.',
      category: 'efficiency'
    },
    {
      id: 'tech-1',
      question: 'How does regenerative braking work?',
      answer: 'When you brake or coast, the electric motor acts as a generator, converting the vehicle\'s kinetic energy back into electricity to recharge the battery. This process helps extend the electric driving range.',
      category: 'technology'
    },
    {
      id: 'maintenance-1',
      question: 'What maintenance is required for hybrid vehicles?',
      answer: 'Hybrid vehicles require similar maintenance to conventional vehicles, with some additional benefits like reduced brake wear due to regenerative braking. The hybrid battery is designed to last the lifetime of the vehicle.',
      category: 'maintenance'
    }
  ];

  const categories = ['all', 'efficiency', 'technology', 'maintenance'];

  const filteredFAQs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      >
        <div className="h-full flex items-center justify-center p-4">
          <motion.div
            initial={prefersReducedMotion ? {} : { scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={prefersReducedMotion ? {} : { scale: 0.9, opacity: 0 }}
            transition={prefersReducedMotion ? { duration: 0.1 } : { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
                <p className="text-muted-foreground">Everything you need to know</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Category Filter */}
            <div className="p-6 border-b">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? "bg-[#EB0A1E] hover:bg-[#EB0A1E]/90" : ""}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* FAQ Content */}
            <div className="p-6 overflow-auto max-h-[60vh]">
              <Accordion type="single" collapsible className="w-full">
                {filteredFAQs.map((faq, index) => (
                  <motion.div
                    key={faq.id}
                    initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={prefersReducedMotion ? { duration: 0.1 } : { delay: index * 0.1, duration: 0.3 }}
                  >
                    <AccordionItem value={faq.id}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-start gap-3">
                          <HelpCircle className="h-5 w-5 text-[#EB0A1E] mt-0.5 flex-shrink-0" />
                          <span>{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-8 text-muted-foreground">
                          {faq.answer}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-muted/20">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredFAQs.length} questions
                </p>
                <Button onClick={onClose}>Close</Button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FeatureModal5;