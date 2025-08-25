
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ArrowRight, Calculator, Zap, Shield, Smartphone, Wind, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { VehicleModel } from '@/types/vehicle';
import { useToast } from '@/hooks/use-toast';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface ConfigurationOption {
  id: string;
  name: string;
  price: number;
  description: string;
  selected?: boolean;
}

interface ConfigurationContext {
  type: 'performance' | 'safety' | 'connectivity' | 'efficiency' | 'comfort' | 'ownership';
  title: string;
  description: string;
  icon: React.ReactNode;
  options: ConfigurationOption[];
  benefits: string[];
  priceImpact?: number;
}

interface ConfigurationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueToBuilder: (selectedOptions: ConfigurationOption[]) => void;
  vehicle: VehicleModel;
  context: ConfigurationContext | null;
}

const ConfigurationPopup: React.FC<ConfigurationPopupProps> = ({
  isOpen,
  onClose,
  onContinueToBuilder,
  vehicle,
  context
}) => {
  const [selectedOptions, setSelectedOptions] = useState<ConfigurationOption[]>([]);
  const { toast } = useToast();

  // Early return if context is null
  if (!context) {
    return null;
  }

  // Initialize selected options when context changes
  React.useEffect(() => {
    if (context?.options) {
      setSelectedOptions(context.options.filter(opt => opt.selected) || []);
    }
  }, [context]);

  const toggleOption = useCallback((option: ConfigurationOption) => {
    setSelectedOptions(prev => {
      const exists = prev.find(opt => opt.id === option.id);
      if (exists) {
        return prev.filter(opt => opt.id !== option.id);
      } else {
        return [...prev, option];
      }
    });
  }, []);

  const calculateTotalPrice = useCallback(() => {
    const basePrice = vehicle.price;
    const optionsPrice = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
    return basePrice + optionsPrice;
  }, [vehicle.price, selectedOptions]);

  const calculateSavings = useCallback(() => {
    if (context.type === 'efficiency') {
      // Example: Hybrid saves fuel costs
      return selectedOptions.length > 0 ? 2400 : 0; // Annual fuel savings
    }
    return 0;
  }, [context.type, selectedOptions]);

  const handleContinueToBuilder = useCallback(() => {
    onContinueToBuilder(selectedOptions);
    toast({
      title: "Configuration Applied",
      description: `Your ${context.title.toLowerCase()} preferences have been saved.`,
    });
    onClose();
  }, [selectedOptions, onContinueToBuilder, context.title, toast, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden p-0">
        <VisuallyHidden>
          <h2>Configure {context.title}</h2>
          <p>Customize your {vehicle.name} {context.title.toLowerCase()} options</p>
        </VisuallyHidden>

        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 pb-4 border-b">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-toyota-red/10 rounded-lg">
                  {context.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{context.title}</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    {context.description}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Options */}
              <div className="space-y-3">
                <h4 className="font-semibold">Available Options</h4>
                {context.options.map((option) => {
                  const isSelected = selectedOptions.find(opt => opt.id === option.id);
                  
                  return (
                    <motion.div
                      key={option.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all duration-200 ${
                          isSelected 
                            ? 'ring-2 ring-toyota-red bg-toyota-red/5' 
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => toggleOption(option)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h5 className="font-medium">{option.name}</h5>
                                {option.price > 0 && (
                                  <Badge variant="secondary">
                                    +{option.price.toLocaleString()} AED
                                  </Badge>
                                )}
                                {isSelected && (
                                  <Badge className="bg-toyota-red">
                                    <Check className="h-3 w-3" />
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {option.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* Benefits */}
              {context.benefits.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Key Benefits</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {context.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 pt-4 border-t bg-muted/30">
            <div className="space-y-4">
              {/* Price Summary */}
              <div className="flex items-center justify-between text-sm">
                <span>Base Price:</span>
                <span>{vehicle.price.toLocaleString()} AED</span>
              </div>
              
              {selectedOptions.length > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span>Selected Options:</span>
                  <span>+{selectedOptions.reduce((sum, opt) => sum + opt.price, 0).toLocaleString()} AED</span>
                </div>
              )}

              {calculateSavings() > 0 && (
                <div className="flex items-center justify-between text-sm text-green-600">
                  <span>Annual Fuel Savings:</span>
                  <span>-{calculateSavings().toLocaleString()} AED</span>
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between font-semibold">
                <span>Total Price:</span>
                <span>{calculateTotalPrice().toLocaleString()} AED</span>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Maybe Later
                </Button>
                <Button
                  onClick={handleContinueToBuilder}
                  className="flex-1 bg-toyota-red hover:bg-toyota-darkred"
                >
                  Continue Building
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigurationPopup;
