
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, Zap, Gauge } from "lucide-react";

interface BuilderConfig {
  modelYear: string;
  engine: string;
  grade: string;
  exteriorColor: string;
  interiorColor: string;
  accessories: string[];
}

interface ModelYearEngineStepProps {
  config: BuilderConfig;
  setConfig: React.Dispatch<React.SetStateAction<BuilderConfig>>;
}

const ModelYearEngineStep: React.FC<ModelYearEngineStepProps> = ({ config, setConfig }) => {
  const { t } = useLanguage();
  const modelYears = ["2024", "2025"];
  
  const engines = [
    {
      name: "3.5L V6",
      power: "268 HP",
      torque: "336 Nm",
      economy: "11.2 km/L",
      price: 0,
      badge: "Standard",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: <Gauge className="h-5 w-5" />
    },
    {
      name: "4.0L V6", 
      power: "301 HP",
      torque: "365 Nm",
      economy: "9.8 km/L",
      price: 5000,
      badge: "Performance",
      color: "bg-red-100 text-red-800 border-red-200",
      icon: <Zap className="h-5 w-5" />
    },
    {
      name: "2.5L Hybrid",
      power: "218 HP",
      torque: "300 Nm",
      economy: "19.5 km/L",
      price: 3000,
      badge: "Eco",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: <Calendar className="h-5 w-5" />
    }
  ];

  return (
    <div className="space-y-6 p-4 pb-6">
      {/* Model Year Selection - Enhanced 3D Cards */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-4"
      >
        <h3 className="text-xl font-bold text-foreground text-center mb-4">{t('builder.modelYear')}</h3>
        <div className="grid grid-cols-2 gap-4">
          {modelYears.map((year, i) => (
            <motion.button
              key={year}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              whileHover={{ 
                scale: 1.05, 
                y: -5,
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.2 } 
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setConfig(prev => ({ ...prev, modelYear: year }))}
              className={`p-6 rounded-2xl border-2 transition-all transform-gpu ${
                config.modelYear === year
                  ? 'border-primary bg-primary/5 shadow-xl shadow-primary/10'
                  : 'border-border bg-card hover:border-primary/40 hover:bg-muted/30'
              }`}
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              <motion.div
                animate={config.modelYear === year ? {
                  y: [0, -5, 0],
                  rotateZ: [0, 2, 0],
                  transition: { duration: 2, repeat: Infinity }
                } : {}}
              >
                <Calendar className={`h-8 w-8 mx-auto mb-3 ${config.modelYear === year ? 'text-primary' : 'text-muted-foreground'}`} />
                <div className="text-xl font-bold text-center">{year}</div>
                <div className="text-sm font-medium text-center mt-2 text-primary">
                  {year === "2025" ? "Latest Technology" : "Proven Reliability"}
                </div>
              </motion.div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Engine Selection - Enhanced with 3D Effects */}
      {config.modelYear && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-bold text-foreground text-center mb-4">{t('builder.engine')}</h3>
          <div className="space-y-4">
            {engines.map((engine, i) => (
              <motion.button
                key={engine.name}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                whileHover={{ 
                  scale: 1.02, 
                  x: 5,
                  transition: { duration: 0.2 } 
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setConfig(prev => ({ ...prev, engine: engine.name }))}
                className="w-full"
              >
                <Card 
                  className={`h-full transition-all duration-300 overflow-hidden border-2 ${
                    config.engine === engine.name
                      ? 'border-primary shadow-lg shadow-primary/10'
                      : 'border-border hover:border-primary/30'
                  }`}
                >
                  <CardContent className="p-0">
                    <div 
                      className={`bg-gradient-to-r ${
                        config.engine === engine.name
                          ? 'from-primary/20 to-primary/5'
                          : 'from-muted/30 to-transparent'
                      } p-4`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <motion.div
                            className={`p-2 rounded-full ${
                              config.engine === engine.name
                                ? 'bg-primary/20'
                                : 'bg-muted'
                            }`}
                            whileHover={{ rotate: 15 }}
                            animate={config.engine === engine.name ? {
                              rotate: [0, 10, 0],
                              transition: { duration: 2, repeat: Infinity }
                            } : {}}
                          >
                            {engine.icon}
                          </motion.div>
                          <div>
                            <h4 className="font-bold">{engine.name}</h4>
                            <div className="flex items-center mt-1">
                              <Badge className={engine.color}>
                                {engine.badge}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        {engine.price > 0 && (
                          <div className="text-right">
                            <div className="text-sm font-bold text-primary">
                              +AED {engine.price.toLocaleString()}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="p-4 grid grid-cols-3 gap-2">
                      <div className="text-center p-2 rounded-lg bg-muted/30">
                        <div className="text-xs text-muted-foreground mb-1">Power</div>
                        <div className="font-bold text-sm">{engine.power}</div>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-muted/30">
                        <div className="text-xs text-muted-foreground mb-1">Torque</div>
                        <div className="font-bold text-sm">{engine.torque}</div>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-muted/30">
                        <div className="text-xs text-muted-foreground mb-1">Economy</div>
                        <div className="font-bold text-sm">{engine.economy}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ModelYearEngineStep;
