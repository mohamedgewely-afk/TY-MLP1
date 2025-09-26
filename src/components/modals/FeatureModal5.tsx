import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, ChevronDown, ChevronRight, HelpCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface Media {
  imageUrl?: string;
  videoUrl?: string;
  poster?: string;
  caption?: string;
}

interface Feature {
  id: string;
  title: string;
  description?: string;
  media: Media;
  stats?: Array<{ label: string; value: string }>;
  badge?: string;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface FeatureModal5Props {
  isOpen: boolean;
  onClose: () => void;
  feature?: Feature;
}

// FAQ Accordion Modal - Comprehensive information
const FeatureModal5: React.FC<FeatureModal5Props> = ({
  isOpen,
  onClose,
  feature
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const prefersReducedMotion = useReducedMotion();

  // Default feature if none provided
  const defaultFeature: Feature = {
    id: 'efficiency',
    title: 'Eco Innovation',
    description: 'Leading the way in sustainable mobility with cutting-edge hybrid and electric technology.',
    media: {
      imageUrl: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/c4e12e8a-9dec-46b0-bf28-79b0ce12d68a/renditions/46932519-51bd-485e-bf16-cf1204d3226a?binary=true&mformat=true',
      caption: 'Sustainable by design'
    },
    stats: [
      { label: 'Efficiency', value: '4.5L/100km' },
      { label: 'Emissions', value: 'Low CO₂' },
      { label: 'Range', value: '850 km' }
    ],
    badge: 'Eco'
  };

  const currentFeature = feature || defaultFeature;

  const faqData: FAQItem[] = [
    {
      id: 'hybrid-how',
      question: 'How does the hybrid system work?',
      answer: 'Our hybrid system seamlessly combines a gasoline engine with electric motors to optimize fuel efficiency and performance. The system automatically switches between electric and gasoline power based on driving conditions.',
      category: 'technology'
    },
    {
      id: 'fuel-economy',
      question: 'What kind of fuel economy can I expect?',
      answer: 'The Land Cruiser hybrid achieves approximately 10.0L/100km in combined driving conditions, representing a significant improvement over traditional V8 engines while maintaining full capability.',
      category: 'efficiency'
    },
    {
      id: 'maintenance',
      question: 'Is hybrid maintenance more expensive?',
      answer: 'Hybrid vehicles often require less maintenance due to reduced wear on the gasoline engine. The hybrid battery is covered by an 8-year/195,000km warranty for peace of mind.',
      category: 'maintenance'
    },
    {
      id: 'performance',
      question: 'Does the hybrid system affect performance?',
      answer: 'Not at all. The hybrid system actually enhances performance by providing instant torque from the electric motors, resulting in smoother acceleration and better responsiveness.',
      category: 'performance'
    },
    {
      id: 'charging',
      question: 'Do I need to plug in the hybrid?',
      answer: 'No, this is a self-charging hybrid. The battery is recharged through regenerative braking and the gasoline engine. No external charging is required.',
      category: 'technology'
    },
    {
      id: 'warranty',
      question: 'What warranty covers the hybrid components?',
      answer: 'Hybrid components are covered by our comprehensive 8-year/195,000km hybrid battery warranty, plus the standard 3-year/100,000km vehicle warranty.',
      category: 'warranty'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Topics' },
    { id: 'technology', label: 'Technology' },
    { id: 'efficiency', label: 'Efficiency' },
    { id: 'performance', label: 'Performance' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'warranty', label: 'Warranty' }
  ];

  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] p-0 bg-white border-none">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: prefersReducedMotion ? 0.1 : 0.3 }}
          className="flex flex-col h-full"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{currentFeature.title}</h2>
                <p className="text-muted-foreground">{currentFeature.description}</p>
              </div>
              {currentFeature.badge && (
                <Badge className="bg-brand-primary text-white">
                  {currentFeature.badge}
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="p-6 border-b bg-muted/30">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search frequently asked questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2 overflow-x-auto">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={`whitespace-nowrap ${
                      selectedCategory === category.id 
                        ? 'bg-brand-primary hover:bg-brand-primary/90' 
                        : ''
                    }`}
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No questions found</h3>
                <p className="text-muted-foreground">Try adjusting your search or category filter.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFAQs.map((faq, index) => {
                  const isExpanded = expandedItems.includes(faq.id);
                  
                  return (
                    <motion.div
                      key={faq.id}
                      initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleExpanded(faq.id)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground mb-1">{faq.question}</h4>
                          <Badge variant="outline" className="text-xs">
                            {categories.find(c => c.id === faq.category)?.label}
                          </Badge>
                        </div>
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        </motion.div>
                      </button>
                      
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: prefersReducedMotion ? 0.1 : 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="p-4 pt-0 border-t bg-muted/20">
                              <p className="text-muted-foreground leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t p-4 bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filteredFAQs.length} of {faqData.length} questions
              </div>
              <Button variant="outline" size="sm">
                Contact Expert
              </Button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default FeatureModal5;