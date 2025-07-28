import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Car, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from 'next/navigation';

interface MobileStickyNavProps {
  isVisible: boolean;
  onToggle: () => void;
}

const offers = [
  {
    id: "offer1",
    type: "Special",
    title: "Limited Time Offer on New Sedans",
    description: "Get up to 15% off on all new sedan models. Offer valid until end of this month.",
    discount: "15% Off",
    validUntil: "30/09/2024",
    isActive: true,
  },
  {
    id: "offer2",
    type: "Finance",
    title: "Low Interest Rate for First-Time Buyers",
    description: "Special financing options available for first-time car buyers. Apply now!",
    discount: "2.99% APR",
    validUntil: "31/12/2024",
    isActive: true,
  },
  {
    id: "offer3",
    type: "Service",
    title: "Free First Service for New Car Owners",
    description: "Enjoy a complimentary first service when you purchase a new vehicle.",
    discount: "Free",
    validUntil: "31/10/2024",
    isActive: false,
  },
];

const MobileStickyNav: React.FC<MobileStickyNavProps> = ({ isVisible, onToggle }) => {
  const navigate = useRouter().push;

  const getCurrentOffers = () => {
    return offers.filter(offer => offer.isActive);
  };

  const currentOffers = getCurrentOffers();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed bottom-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-md border-t border-gray-200/50 shadow-lg"
        >
          <div className="px-4 py-3 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-900">Quick Access</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                className="h-6 w-6 text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Enhanced Offers Carousel */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-gray-700">Current Offers</h4>
                <span className="text-xs text-gray-500">
                  {currentOffers.length} active
                </span>
              </div>
              
              <div className="relative">
                <div className="overflow-x-auto scrollbar-hide">
                  <div className="flex space-x-3 pb-2">
                    {currentOffers.map((offer) => (
                      <motion.div
                        key={offer.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="flex-shrink-0 basis-3/4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary" className="text-xs bg-primary/20 text-primary">
                            {offer.type}
                          </Badge>
                          <span className="text-xs text-gray-500">{offer.validUntil}</span>
                        </div>
                        <h5 className="font-bold text-sm text-gray-900 mb-1 line-clamp-1">
                          {offer.title}
                        </h5>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                          {offer.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary">
                            {offer.discount}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs px-2 py-1 h-6 border-primary/30 text-primary hover:bg-primary/10"
                          >
                            Details
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => navigate('/test-drive')}
                className="flex items-center justify-center space-x-2 bg-primary hover:bg-primary/90 text-white py-3 rounded-lg transition-all duration-200"
              >
                <Car className="h-4 w-4" />
                <span className="text-sm font-medium">Test Drive</span>
              </Button>
              
              <Button
                onClick={() => navigate('/enquire')}
                variant="outline"
                className="flex items-center justify-center space-x-2 border-primary/30 text-primary hover:bg-primary/10 py-3 rounded-lg transition-all duration-200"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Enquire</span>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileStickyNav;
