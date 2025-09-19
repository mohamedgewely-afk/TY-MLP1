
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ArrowUpDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Grade {
  name: string;
  description: string;
  price: number;
  monthlyFrom: number;
  badge: string;
  badgeColor: string;
  image: string;
  features: string[];
  specs: {
    engine: string;
    power: string;
    torque: string;
    transmission: string;
    acceleration: string;
    fuelEconomy: string;
  };
}

interface ComparisonItem {
  label: string;
  getValue: (grade: Grade) => string;
}

interface CollapsibleComparisonSectionProps {
  title: string;
  items: ComparisonItem[];
  grades: Grade[];
  showOnlyDifferences: boolean;
  defaultOpen?: boolean;
}

const CollapsibleComparisonSection: React.FC<CollapsibleComparisonSectionProps> = ({
  title,
  items,
  grades,
  showOnlyDifferences,
  defaultOpen = false
}) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  const hasDifferences = (getValue: (grade: Grade) => string, selectedGrades: Grade[]) => {
    const values = selectedGrades.map(getValue);
    return new Set(values).size > 1;
  };

  const filteredItems = showOnlyDifferences 
    ? items.filter(item => hasDifferences(item.getValue, grades))
    : items;

  if (showOnlyDifferences && filteredItems.length === 0) return null;

  const differenceCount = items.filter(item => hasDifferences(item.getValue, grades)).length;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-4 px-2 hover:bg-muted/50 rounded-lg transition-colors group">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold">{title}</h3>
          {showOnlyDifferences && differenceCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {differenceCount} differences
            </Badge>
          )}
        </div>
        <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 px-2 pb-4"
          >
            {filteredItems.map(item => {
              const hasDiff = hasDifferences(item.getValue, grades);
              
              return (
                <div key={item.label} className="space-y-2">
                  <div className={`font-medium flex items-center gap-2 text-sm ${hasDiff ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {item.label}
                    {hasDiff && <ArrowUpDown className="h-3 w-3" />}
                  </div>
                  
                  {isMobile ? (
                    <div className="space-y-2">
                      {grades.map((grade, idx) => (
                        <div key={idx} className={`text-sm p-3 rounded-lg border ${hasDiff ? 'bg-muted font-medium border-border' : 'bg-background border-muted text-muted-foreground'}`}>
                          <div className="flex justify-between items-start">
                            <span className="font-medium text-primary">{grade.name}:</span>
                            <span className="text-right flex-1 ml-2">{item.getValue(grade)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={`grid gap-4 py-2 ${`grid-cols-${grades.length}`}`}>
                      {grades.map((grade, idx) => (
                        <div key={idx} className={`text-sm ${hasDiff ? 'font-medium bg-muted p-3 rounded-lg' : 'text-muted-foreground p-2'}`}>
                          {item.getValue(grade)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CollapsibleComparisonSection;
