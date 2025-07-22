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
    <div className="space-y-6 toyota-spacing-md pb-6">
      {/* Model Year Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold text-foreground text-center">{t('builder.modelYear')}</h3>
        <div className="grid grid-cols-2 gap-3">
          {modelYears.map((year, i) => (
            <motion.button
              key={year}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.2 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setConfig(prev => ({ ...prev, modelYear: year }))}
              className={`toyota-spacing-md toyota-border-radius-lg border-2 transition-all toyota-transform-minimal ${
                config.modelYear === year
                  ? 'border-toyota-red bg-toyota-red/5 toyota-shadow-md'
                  : 'border-border bg-card hover:border-toyota-red/30'
              }`}
            >
              <Calendar className={`h-6 w-6 mx-auto mb-2 ${config.modelYear === year ? 'text-toyota-red' : 'text-muted-foreground'}`} />
              <div className="text-lg font-semibold text-center">{year}</div>
              <div className="text-xs font-medium text-center mt-1 text-toyota-red">
                {year === "2025" ? "Latest Technology" : "Proven Reliability"}
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Engine Selection */}
      {config.modelYear && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-foreground text-center">{t('builder.engine')}</h3>
          <div className="space-y-3">
            {engines.map((engine, i) => (
              <motion.button
                key={engine.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.2 }}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setConfig(prev => ({ ...prev, engine: engine.name }))}
                className="w-full"
              >
                <Card 
                  className={`transition-all duration-200 border-2 ${
                    config.engine === engine.name
                      ? 'border-toyota-red toyota-shadow-md'
                      : 'border-border hover:border-toyota-red/30'
                  }`}
                >
                  <CardContent className="p-0">
                    <div 
                      className={`${
                        config.engine === engine.name
                          ? 'toyota-gradient-primary text-white'
                          : 'bg-muted/30'
                      } toyota-spacing-sm`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`toyota-spacing-sm toyota-border-radius ${
                              config.engine === engine.name
                                ? 'bg-white/20'
                                : 'bg-background'
                            }`}
                          >
                            {engine.icon}
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm">{engine.name}</h4>
                            <div className="flex items-center mt-1">
                              <Badge className={engine.color}>
                                {engine.badge}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        {engine.price > 0 && (
                          <div className="text-right">
                            <div className="text-sm font-semibold">
                              +AED {engine.price.toLocaleString()}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="toyota-spacing-sm grid grid-cols-3 gap-2">
                      <div className="text-center toyota-spacing-xs toyota-border-radius bg-muted/30">
                        <div className="text-xs text-muted-foreground">Power</div>
                        <div className="font-semibold text-xs">{engine.power}</div>
                      </div>
                      <div className="text-center toyota-spacing-xs toyota-border-radius bg-muted/30">
                        <div className="text-xs text-muted-foreground">Torque</div>
                        <div className="font-semibold text-xs">{engine.torque}</div>
                      </div>
                      <div className="text-center toyota-spacing-xs toyota-border-radius bg-muted/30">
                        <div className="text-xs text-muted-foreground">Economy</div>
                        <div className="font-semibold text-xs">{engine.economy}</div>
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
