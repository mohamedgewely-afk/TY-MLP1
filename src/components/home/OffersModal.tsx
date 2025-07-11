
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { X, Clock, FileText, Phone, Mail } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  validUntil: string;
  image: string;
  category: string;
  terms: string[];
}

interface OffersModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOffer?: Offer | null;
}

const OffersModal: React.FC<OffersModalProps> = ({ isOpen, onClose, selectedOffer }) => {
  const isMobile = useIsMobile();

  if (!selectedOffer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-none ${isMobile ? 'w-[95vw] h-[90vh]' : 'w-[80vw] h-[80vh]'} p-0 overflow-hidden`}>
        <div className="relative h-full flex flex-col">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Content */}
          <div className={`flex-1 ${isMobile ? 'flex flex-col' : 'grid grid-cols-2'} overflow-hidden`}>
            {/* Left Side - Image */}
            <div className={`relative ${isMobile ? 'h-1/3' : 'h-full'} overflow-hidden`}>
              <img
                src={selectedOffer.image}
                alt={selectedOffer.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute top-4 left-4">
                <Badge className="bg-white/95 text-gray-900 shadow-md">
                  {selectedOffer.category}
                </Badge>
              </div>
              <div className="absolute top-4 right-16">
                <Badge className="bg-primary text-primary-foreground shadow-md font-bold text-lg px-4 py-2">
                  {selectedOffer.discount}
                </Badge>
              </div>
            </div>

            {/* Right Side - Details */}
            <div className={`${isMobile ? 'flex-1 p-4' : 'p-8'} overflow-y-auto`}>
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <h2 className={`font-black text-foreground mb-3 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
                    {selectedOffer.title}
                  </h2>
                  <p className={`text-muted-foreground leading-relaxed ${isMobile ? 'text-sm' : 'text-base'}`}>
                    {selectedOffer.description}
                  </p>
                </div>

                {/* Validity */}
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-semibold text-foreground">Valid Until</div>
                        <div className="text-primary font-bold">{selectedOffer.validUntil}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Terms & Conditions */}
                <div>
                  <h3 className="font-bold text-foreground mb-3 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Terms & Conditions
                  </h3>
                  <ul className="space-y-2">
                    {selectedOffer.terms.map((term, index) => (
                      <li key={index} className={`flex items-start space-x-2 ${isMobile ? 'text-sm' : 'text-base'}`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{term}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contact Information */}
                <Card className="bg-muted/30">
                  <CardContent className="p-4">
                    <h4 className="font-bold text-foreground mb-3">Need More Information?</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 text-primary" />
                        <span className={`text-muted-foreground ${isMobile ? 'text-sm' : 'text-base'}`}>
                          Call: +971 4 123 4567
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="h-4 w-4 text-primary" />
                        <span className={`text-muted-foreground ${isMobile ? 'text-sm' : 'text-base'}`}>
                          Email: offers@toyota.ae
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className={`${isMobile ? 'space-y-3' : 'grid grid-cols-2 gap-4'} pt-4`}>
                  <Button className="w-full" size={isMobile ? "default" : "lg"}>
                    Apply Now
                  </Button>
                  <Button variant="outline" className="w-full" size={isMobile ? "default" : "lg"}>
                    Schedule Visit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OffersModal;
