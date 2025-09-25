
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Upload, X, Sparkles, Search } from 'lucide-react';
import { VehicleModel } from '@/types/vehicle';
import { vehicles } from '@/data/vehicles';

interface VisualSearchProps {
  onResults: (results: VehicleModel[]) => void;
  onClose: () => void;
}

const lifestyleMatches = {
  'family': ['Camry Hybrid', 'Highlander', 'Sienna'],
  'adventure': ['RAV4', 'Highlander', '4Runner'],
  'urban': ['Corolla', 'Prius', 'Camry'],
  'luxury': ['Avalon', 'Lexus ES', 'Lexus GS'],
  'performance': ['GR Supra', 'GR Corolla', 'Camry TRD']
};

const VisualSearch: React.FC<VisualSearchProps> = ({ onResults, onClose }) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        analyzeImage();
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = () => {
    setIsAnalyzing(true);
    
    // Simulate AI image analysis
    setTimeout(() => {
      const lifestyles = Object.keys(lifestyleMatches);
      const detectedLifestyle = lifestyles[Math.floor(Math.random() * lifestyles.length)];
      const matchedVehicles = lifestyleMatches[detectedLifestyle as keyof typeof lifestyleMatches];
      
      setAnalysisResult(detectedLifestyle);
      
      const results = vehicles.filter(vehicle => 
        matchedVehicles.some(match => vehicle.name.includes(match))
      );
      
      setTimeout(() => {
        setIsAnalyzing(false);
        onResults(results);
      }, 1000);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Visual Search</h3>
            <p className="text-sm text-gray-500">Upload your lifestyle photo to find matching vehicles</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-full h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {!uploadedImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Upload a photo of your lifestyle</p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-toyota-red text-white"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Photo
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-xs text-gray-500">
                <div>• Family photos</div>
                <div>• Adventure scenes</div>
                <div>• Urban lifestyle</div>
                <div>• Work commute</div>
              </div>
            </motion.div>
          )}

          {uploadedImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="relative">
                <img
                  src={uploadedImage}
                  alt="Uploaded lifestyle"
                  className="w-full h-48 object-cover rounded-xl"
                />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <Sparkles className="h-8 w-8 animate-spin mx-auto mb-2" />
                      <p className="text-sm">Analyzing your lifestyle...</p>
                    </div>
                  </div>
                )}
              </div>

              {analysisResult && !isAnalyzing && (
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <Search className="h-5 w-5 text-green-600 mr-2" />
                      <div>
                        <p className="font-medium text-green-800">
                          Detected: {analysisResult.charAt(0).toUpperCase() + analysisResult.slice(1)} lifestyle
                        </p>
                        <p className="text-sm text-green-600">Finding perfect matches...</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </motion.div>
    </motion.div>
  );
};

export default VisualSearch;
