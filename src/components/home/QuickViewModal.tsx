
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { VehicleModel } from '@/types/vehicle';
import { ArrowRight, Check, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface QuickViewModalProps {
  vehicle: VehicleModel | null;
  isOpen: boolean;
  onClose: () => void;
  onCompare: (vehicle: VehicleModel) => void;
  isCompared: boolean;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({
  vehicle,
  isOpen,
  onClose,
  onCompare,
  isCompared
}) => {
  if (!vehicle) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{vehicle.name}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <img 
              src={vehicle.image} 
              alt={vehicle.name} 
              className="w-full h-48 object-cover rounded-md"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-1">{vehicle.name}</h3>
            <p className="text-sm text-gray-500 mb-2">{vehicle.category}</p>
            <p className="text-2xl font-bold mb-4">AED {vehicle.price.toLocaleString()}</p>
            <div className="space-y-2 mb-4">
              <p className="text-sm">
                <strong>Engine:</strong> {vehicle.features[0] || "N/A"}
              </p>
              <p className="text-sm">
                <strong>Key Feature:</strong> {vehicle.features[1] || "N/A"}
              </p>
            </div>
            <div className="flex flex-col space-y-2">
              <Button asChild className="w-full">
                <Link to={`/vehicle/${encodeURIComponent(vehicle.name.toLowerCase())}`} className="w-full flex items-center justify-center">
                  View Details <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button 
                variant={isCompared ? "outline" : "secondary"} 
                onClick={() => onCompare(vehicle)}
                className="w-full"
              >
                {isCompared ? (
                  <>
                    <Check className="mr-2 h-4 w-4" /> Added to Compare
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" /> Add to Compare
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewModal;
