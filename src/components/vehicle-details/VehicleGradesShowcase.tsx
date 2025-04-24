
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VehicleModel } from '@/types/vehicle';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';

interface VehicleGradesShowcaseProps {
  vehicle: VehicleModel;
}

const VehicleGradesShowcase = ({ vehicle }: VehicleGradesShowcaseProps) => {
  const [compareGrades, setCompareGrades] = useState<boolean>(false);
  const [selectedGrade, setSelectedGrade] = useState<string>('');

  // Sample grades data - would come from API in real app
  const grades = [
    {
      id: 'base',
      name: `${vehicle.name} LE`,
      price: vehicle.price,
      image: vehicle.image,
      popular: false,
      features: [
        'LED Headlights',
        '17" Alloy Wheels',
        '8" Touchscreen Display',
        'Toyota Safety Sense™ 2.5+',
        'Apple CarPlay® & Android Auto™',
        'Dual-Zone Automatic Climate Control'
      ]
    },
    {
      id: 'mid',
      name: `${vehicle.name} SE`,
      price: vehicle.price * 1.15,
      image: 'https://global.toyota/pages/news/images/2023/11/28/2000/20231128_01_09_s.jpg',
      popular: true,
      features: [
        'LED Headlights',
        '18" Machined-Finish Alloy Wheels',
        'Sport-Tuned Suspension',
        'Toyota Safety Sense™ 2.5+',
        'Apple CarPlay® & Android Auto™',
        'Dual-Zone Automatic Climate Control',
        'Leather-Wrapped Steering Wheel',
        'Sport SofTex®-Trimmed Seats'
      ]
    },
    {
      id: 'premium',
      name: `${vehicle.name} XLE`,
      price: vehicle.price * 1.3,
      image: 'https://global.toyota/pages/news/images/2023/11/28/2000/20231128_01_07_s.jpg',
      popular: false,
      features: [
        'LED Headlights & Taillights',
        '18" Alloy Wheels',
        '9" Touchscreen Display',
        'Toyota Safety Sense™ 2.5+',
        'Apple CarPlay® & Android Auto™',
        'Leather-Trimmed Seats',
        'Heated Front Seats',
        'Wireless Smartphone Charging',
        'Power Moonroof',
        'Blind Spot Monitor with Rear Cross-Traffic Alert'
      ]
    },
    {
      id: 'hybrid',
      name: `${vehicle.name} Hybrid`,
      price: vehicle.price * 1.4,
      image: 'https://global.toyota/pages/news/images/2021/07/15/1330/20210715_01_12_s.jpg',
      popular: false,
      features: [
        'Hybrid Powertrain',
        'LED Headlights & Daytime Running Lights',
        '18" Alloy Wheels',
        '9" Touchscreen Display',
        'Toyota Safety Sense™ 2.5+',
        'Apple CarPlay® & Android Auto™',
        'Leather-Trimmed Seats',
        'Heated Front Seats',
        'Wireless Smartphone Charging',
        'Power Moonroof',
        'Blind Spot Monitor with Rear Cross-Traffic Alert',
        'Smart Key System with Push Button Start'
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-12"
    >
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Available Grades
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Choose the perfect {vehicle.name} to fit your lifestyle
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setCompareGrades(!compareGrades)}
          className="self-start md:self-center"
        >
          {compareGrades ? 'Hide Comparison' : 'Compare All Grades'}
        </Button>
      </div>

      {!compareGrades ? (
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {grades.map((grade, index) => (
              <CarouselItem key={grade.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="overflow-hidden h-full flex flex-col">
                  <div className="relative">
                    {grade.popular && (
                      <Badge className="absolute top-3 right-3 bg-toyota-red">
                        Most Popular
                      </Badge>
                    )}
                    <img
                      src={grade.image}
                      alt={grade.name}
                      className="w-full h-52 object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{grade.name}</CardTitle>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      AED {grade.price.toLocaleString()}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Key Features:</h3>
                    <ul className="space-y-2 text-sm">
                      {grade.features.slice(0, 5).map((feature) => (
                        <li key={feature} className="flex items-start">
                          <Check className="h-4 w-4 text-toyota-red mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                      {grade.features.length > 5 && (
                        <li className="text-toyota-red text-sm">
                          +{grade.features.length - 5} more features
                        </li>
                      )}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full bg-toyota-red hover:bg-toyota-darkred">
                      <a href={`/configure/${vehicle.name.toLowerCase().replace(/\s+/g, '-')}/grade/${grade.id}`}>
                        Configure This Grade <ChevronRight className="h-4 w-4 ml-1" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-8 gap-2">
            <CarouselPrevious className="relative inset-auto" />
            <CarouselNext className="relative inset-auto" />
          </div>
        </Carousel>
      ) : (
        <div className="overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="p-4 text-left">Grade</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left" colSpan={2}>Key Features</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade) => (
                <tr key={grade.id} className="border-b dark:border-gray-700">
                  <td className="p-4">
                    <div className="font-bold">{grade.name}</div>
                    {grade.popular && <Badge className="mt-1 bg-toyota-red">Most Popular</Badge>}
                  </td>
                  <td className="p-4">
                    <div className="font-bold">AED {grade.price.toLocaleString()}</div>
                  </td>
                  <td className="p-4" colSpan={2}>
                    <ul className="grid grid-cols-2 gap-2">
                      {grade.features.slice(0, 6).map((feature) => (
                        <li key={feature} className="flex items-start">
                          <Check className="h-4 w-4 text-toyota-red mr-1 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-4 text-center">
                    <Button asChild className="bg-toyota-red hover:bg-toyota-darkred">
                      <a href={`/configure/${vehicle.name.toLowerCase().replace(/\s+/g, '-')}/grade/${grade.id}`}>
                        Configure
                      </a>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default VehicleGradesShowcase;
