import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, X, Settings, Car, Palette, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { Grade } from '@/data/grades';

interface BuilderConfig {
  grade?: Grade;
  exteriorColor?: string;
  wheels?: string;
  interior?: string;
  packages?: string[];
}

interface CarBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle?: any;
  initialGrade?: string;
  onReserve?: (config: BuilderConfig) => void;
}

interface BuilderStep {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  component: React.ComponentType<any>;
}

const builderSteps: BuilderStep[] = [
  { id: 'grade', title: 'Choose Grade', subtitle: 'Select your trim level', icon: Car, component: GradeStep },
  { id: 'exterior', title: 'Exterior Color', subtitle: 'Pick your finish', icon: Palette, component: ExteriorStep },
  { id: 'wheels', title: 'Wheels & Tires', subtitle: 'Select wheel design', icon: Settings, component: WheelsStep },
  { id: 'interior', title: 'Interior', subtitle: 'Choose materials', icon: Car, component: InteriorStep },
  { id: 'packages', title: 'Options', subtitle: 'Add packages', icon: Wrench, component: PackagesStep },
];

// Step Components
function GradeStep({ config, onChange }: { config: BuilderConfig; onChange: (update: Partial<BuilderConfig>) => void }) {
  const grades = [
    { id: 'le', name: 'LE', price: 32500, features: ['Toyota Safety Sense 2.0', 'LED Headlights', 'Apple CarPlay'] },
    { id: 'xle', name: 'XLE', price: 35500, features: ['Moonroof', 'Heated Seats', 'Wireless Charging'] },
    { id: 'limited', name: 'Limited', price: 39500, features: ['Leather Interior', 'JBL Audio', 'Advanced Climate'] },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {grades.map((grade) => (
        <motion.div
          key={grade.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card className={cn(
            'cursor-pointer transition-all duration-200 border-2',
            config.grade?.id === grade.id ? 'border-brand-primary bg-brand-primary/5' : 'border-border hover:border-brand-primary/50'
          )}
          onClick={() => onChange({ grade })}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{grade.name}</h3>
                <Badge variant="secondary">${grade.price.toLocaleString()}</Badge>
              </div>
              <ul className="space-y-2">
                {grade.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm text-muted-foreground">
                    <Check className="h-4 w-4 mr-2 text-brand-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

function ExteriorStep({ config, onChange }: { config: BuilderConfig; onChange: (update: Partial<BuilderConfig>) => void }) {
  const colors = [
    { id: 'white', name: 'Pearl White', hex: '#FFFFFF', premium: false },
    { id: 'black', name: 'Midnight Black', hex: '#1a1a1a', premium: true },
    { id: 'silver', name: 'Silver Metallic', hex: '#C0C0C0', premium: false },
    { id: 'red', name: 'Supersonic Red', hex: '#EB0A1E', premium: true },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {colors.map((color) => (
        <motion.div
          key={color.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'relative cursor-pointer p-4 rounded-lg border-2 transition-all',
            config.exteriorColor === color.id ? 'border-brand-primary' : 'border-border hover:border-brand-primary/50'
          )}
          onClick={() => onChange({ exteriorColor: color.id })}
        >
          <div
            className="w-16 h-16 rounded-full mx-auto mb-3 shadow-lg"
            style={{ backgroundColor: color.hex }}
          />
          <div className="text-center">
            <p className="font-medium text-sm">{color.name}</p>
            {color.premium && <Badge variant="outline" className="mt-1 text-xs">Premium</Badge>}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function WheelsStep({ config, onChange }: { config: BuilderConfig; onChange: (update: Partial<BuilderConfig>) => void }) {
  const wheels = [
    { id: 'standard', name: '17" Alloy', price: 0 },
    { id: 'sport', name: '19" Sport', price: 1500 },
    { id: 'premium', name: '20" Premium', price: 2500 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {wheels.map((wheel) => (
        <Card
          key={wheel.id}
          className={cn(
            'cursor-pointer transition-all border-2',
            config.wheels === wheel.id ? 'border-brand-primary' : 'border-border hover:border-brand-primary/50'
          )}
          onClick={() => onChange({ wheels: wheel.id })}
        >
          <CardContent className="p-4 text-center">
            <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-3" />
            <h3 className="font-medium">{wheel.name}</h3>
            {wheel.price > 0 && <p className="text-sm text-muted-foreground">+${wheel.price}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function InteriorStep({ config, onChange }: { config: BuilderConfig; onChange: (update: Partial<BuilderConfig>) => void }) {
  const interiors = [
    { id: 'fabric', name: 'SofTex', price: 0 },
    { id: 'leather', name: 'Leather', price: 1200 },
    { id: 'premium', name: 'Premium Leather', price: 2400 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {interiors.map((interior) => (
        <Card
          key={interior.id}
          className={cn(
            'cursor-pointer transition-all border-2',
            config.interior === interior.id ? 'border-brand-primary' : 'border-border hover:border-brand-primary/50'
          )}
          onClick={() => onChange({ interior: interior.id })}
        >
          <CardContent className="p-4 text-center">
            <div className="w-full h-24 bg-muted rounded mb-3" />
            <h3 className="font-medium">{interior.name}</h3>
            {interior.price > 0 && <p className="text-sm text-muted-foreground">+${interior.price}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function PackagesStep({ config, onChange }: { config: BuilderConfig; onChange: (update: Partial<BuilderConfig>) => void }) {
  const packages = [
    { id: 'tech', name: 'Technology Package', price: 2500, features: ['Navigation', 'Premium Audio', 'HUD'] },
    { id: 'safety', name: 'Safety Package', price: 1800, features: ['Blind Spot', 'Rear Cross Traffic', 'Parking Assist'] },
    { id: 'luxury', name: 'Luxury Package', price: 3200, features: ['Ventilated Seats', 'Ambient Lighting', 'Power Tailgate'] },
  ];

  const togglePackage = (packageId: string) => {
    const currentPackages = config.packages || [];
    const newPackages = currentPackages.includes(packageId)
      ? currentPackages.filter(p => p !== packageId)
      : [...currentPackages, packageId];
    onChange({ packages: newPackages });
  };

  return (
    <div className="space-y-4">
      {packages.map((pkg) => (
        <Card
          key={pkg.id}
          className={cn(
            'cursor-pointer transition-all border-2',
            config.packages?.includes(pkg.id) ? 'border-brand-primary bg-brand-primary/5' : 'border-border hover:border-brand-primary/50'
          )}
          onClick={() => togglePackage(pkg.id)}
        >
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{pkg.name}</h3>
                <p className="text-brand-primary font-medium">+${pkg.price.toLocaleString()}</p>
              </div>
              <div className={cn(
                'w-6 h-6 rounded border-2 flex items-center justify-center',
                config.packages?.includes(pkg.id) ? 'border-brand-primary bg-brand-primary' : 'border-border'
              )}>
                {config.packages?.includes(pkg.id) && <Check className="w-4 h-4 text-white" />}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {pkg.features.map((feature, idx) => (
                <span key={idx} className="text-sm text-muted-foreground">{feature}</span>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

const CarBuilder: React.FC<CarBuilderProps> = ({
  isOpen,
  onClose,
  vehicle,
  initialGrade,
  onReserve
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [config, setConfig] = useState<BuilderConfig>({});
  const reduceMotion = useReducedMotionSafe();

  const updateConfig = (update: Partial<BuilderConfig>) => {
    setConfig(prev => ({ ...prev, ...update }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return !!config.grade;
      case 1: return !!config.exteriorColor;
      case 2: return !!config.wheels;
      case 3: return !!config.interior;
      default: return true;
    }
  };

  const calculateTotal = () => {
    let total = config.grade?.price || 0;
    // Add package costs
    const packages = config.packages || [];
    packages.forEach(pkg => {
      if (pkg === 'tech') total += 2500;
      if (pkg === 'safety') total += 1800;
      if (pkg === 'luxury') total += 3200;
    });
    return total;
  };

  const CurrentStepComponent = builderSteps[currentStep]?.component;

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
    >
      <div className="h-full overflow-auto">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Card className="bg-white dark:bg-gray-900">
            {/* Header */}
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Build & Price</h1>
                  <p className="text-muted-foreground">Customize your vehicle</p>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-6 w-6" />
                </Button>
              </div>
              
              {/* Progress */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Step {currentStep + 1} of {builderSteps.length}</span>
                  <span className="text-sm text-muted-foreground">{Math.round(((currentStep + 1) / builderSteps.length) * 100)}% Complete</span>
                </div>
                <Progress value={((currentStep + 1) / builderSteps.length) * 100} className="h-2" />
              </div>

              {/* Step Navigation */}
              <div className="hidden md:flex items-center justify-between mt-6">
                {builderSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.id} className="flex items-center">
                      <div className={cn(
                        'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors',
                        index <= currentStep ? 'border-brand-primary bg-brand-primary text-white' : 'border-muted'
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      {index < builderSteps.length - 1 && (
                        <div className={cn(
                          'w-16 h-0.5 mx-2 transition-colors',
                          index < currentStep ? 'bg-brand-primary' : 'bg-muted'
                        )} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-3">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold">{builderSteps[currentStep]?.title}</h2>
                    <p className="text-muted-foreground">{builderSteps[currentStep]?.subtitle}</p>
                  </div>
                  
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={reduceMotion ? {} : { opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduceMotion ? {} : { opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {CurrentStepComponent && (
                        <CurrentStepComponent config={config} onChange={updateConfig} />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Summary Sidebar */}
                <div className="lg:col-span-1">
                  <Card className="sticky top-4">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-4">Summary</h3>
                      <div className="space-y-3 text-sm">
                        {config.grade && (
                          <div className="flex justify-between">
                            <span>Grade:</span>
                            <span className="font-medium">{config.grade.name}</span>
                          </div>
                        )}
                        {config.exteriorColor && (
                          <div className="flex justify-between">
                            <span>Color:</span>
                            <span className="font-medium capitalize">{config.exteriorColor}</span>
                          </div>
                        )}
                        {config.wheels && (
                          <div className="flex justify-between">
                            <span>Wheels:</span>
                            <span className="font-medium capitalize">{config.wheels}</span>
                          </div>
                        )}
                        {config.interior && (
                          <div className="flex justify-between">
                            <span>Interior:</span>
                            <span className="font-medium capitalize">{config.interior}</span>
                          </div>
                        )}
                        {config.packages && config.packages.length > 0 && (
                          <div>
                            <div className="font-medium mb-1">Packages:</div>
                            {config.packages.map(pkg => (
                              <div key={pkg} className="text-xs text-muted-foreground ml-2">
                                • {pkg} Package
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="flex justify-between items-center font-semibold text-lg">
                        <span>Total:</span>
                        <span className="text-brand-primary">${calculateTotal().toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-muted/20">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                
                <div className="flex gap-3">
                  {currentStep === builderSteps.length - 1 ? (
                    <Button
                      onClick={() => onReserve?.(config)}
                      disabled={!canProceed()}
                      className="bg-brand-primary hover:bg-brand-primary/90"
                    >
                      Reserve Now - ${calculateTotal().toLocaleString()}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setCurrentStep(Math.min(builderSteps.length - 1, currentStep + 1))}
                      disabled={!canProceed()}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default CarBuilder;