
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Camera, Brain, Sliders, X } from 'lucide-react';
import VisualSearch from './VisualSearch';
import { useAIRecommendations } from '@/hooks/use-ai-recommendations';
import { VehicleModel } from '@/types/vehicle';
import { hapticFeedback } from '@/utils/haptic';

interface EnhancedSearchProps {
  onResults: (results: VehicleModel[]) => void;
  onClose: () => void;
}

const EnhancedSearch: React.FC<EnhancedSearchProps> = ({ onResults, onClose }) => {
  const [searchMode, setSearchMode] = useState<'ai' | 'visual' | null>(null);
  const [preferences, setPreferences] = useState({
    budget: [50000, 200000],
    familySize: 2,
    usage: 'city',
    fuelType: 'hybrid'
  });
  
  const { recommendations, isLoading, generateRecommendations } = useAIRecommendations();

  const handleAISearch = () => {
    hapticFeedback.medium();
    generateRecommendations({
      dailyCommute: preferences.usage,
      weekendActivities: ['leisure'],
      familySize: preferences.familySize,
      budgetRange: preferences.budget as [number, number],
      fuelPreference: preferences.fuelType,
      priorityFeatures: ['safety', 'efficiency']
    });
  };

  const handleModeSelect = (mode: 'ai' | 'visual') => {
    hapticFeedback.selection();
    setSearchMode(mode);
  };

  if (searchMode === 'visual') {
    return <VisualSearch onResults={onResults} onClose={() => setSearchMode(null)} />;
  }

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
        className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Smart Vehicle Search</h3>
            <p className="text-sm text-gray-500">Find your perfect Toyota match</p>
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
          {!searchMode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 gap-4">
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-toyota-red"
                  onClick={() => handleModeSelect('ai')}
                >
                  <CardContent className="p-6 text-center">
                    <Brain className="h-12 w-12 text-toyota-red mx-auto mb-4" />
                    <h4 className="font-bold text-lg mb-2">AI Recommendations</h4>
                    <p className="text-sm text-gray-600">Answer a few questions to get personalized vehicle suggestions</p>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-500"
                  onClick={() => handleModeSelect('visual')}
                >
                  <CardContent className="p-6 text-center">
                    <Camera className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                    <h4 className="font-bold text-lg mb-2">Visual Search</h4>
                    <p className="text-sm text-gray-600">Upload a lifestyle photo to find matching vehicles</p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {searchMode === 'ai' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Budget Range (AED)</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={preferences.budget[0]}
                      onChange={(e) => setPreferences(prev => ({
                        ...prev,
                        budget: [parseInt(e.target.value) || 0, prev.budget[1]]
                      }))}
                      className="flex-1 px-3 py-2 border rounded-lg"
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      value={preferences.budget[1]}
                      onChange={(e) => setPreferences(prev => ({
                        ...prev,
                        budget: [prev.budget[0], parseInt(e.target.value) || 0]
                      }))}
                      className="flex-1 px-3 py-2 border rounded-lg"
                      placeholder="Max"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Family Size</label>
                  <select
                    value={preferences.familySize}
                    onChange={(e) => setPreferences(prev => ({
                      ...prev,
                      familySize: parseInt(e.target.value)
                    }))}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value={1}>Just me</option>
                    <option value={2}>Couple</option>
                    <option value={4}>Small family (3-4)</option>
                    <option value={6}>Large family (5+)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Primary Usage</label>
                  <select
                    value={preferences.usage}
                    onChange={(e) => setPreferences(prev => ({
                      ...prev,
                      usage: e.target.value
                    }))}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="city">City driving</option>
                    <option value="highway">Highway commuting</option>
                    <option value="mixed">Mixed usage</option>
                    <option value="adventure">Off-road/Adventure</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Fuel Preference</label>
                  <select
                    value={preferences.fuelType}
                    onChange={(e) => setPreferences(prev => ({
                      ...prev,
                      fuelType: e.target.value
                    }))}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="hybrid">Hybrid</option>
                    <option value="gasoline">Gasoline</option>
                    <option value="efficiency">Most efficient</option>
                  </select>
                </div>
              </div>

              <Button
                onClick={handleAISearch}
                disabled={isLoading}
                className="w-full bg-toyota-red text-white"
              >
                {isLoading ? (
                  <>
                    <Brain className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Find My Perfect Toyota
                  </>
                )}
              </Button>

              {recommendations.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Top Recommendations:</h4>
                  {recommendations.slice(0, 3).map((rec) => (
                    <Card key={rec.vehicle.name} className="border-green-200 bg-green-50">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium">{rec.vehicle.name}</h5>
                            <p className="text-sm text-gray-600">AED {rec.vehicle.price.toLocaleString()}</p>
                            <p className="text-xs text-green-700 mt-1">
                              {rec.reasons[0]}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-green-600">
                              {rec.score}% match
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button
                    onClick={() => onResults(recommendations.map(r => r.vehicle))}
                    className="w-full"
                    variant="outline"
                  >
                    View All Results
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default EnhancedSearch;
