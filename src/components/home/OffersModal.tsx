
import React from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Gift, Calendar, Percent, Car, Clock } from "lucide-react";

interface OffersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OffersModal: React.FC<OffersModalProps> = ({ isOpen, onClose }) => {
  const offers = [
    {
      id: 1,
      title: "0% Interest Rate",
      description: "Get 0% interest rate for the first 12 months on selected models",
      discount: "0% APR",
      validUntil: "Dec 31, 2024",
      terms: "Valid for UAE residents with approved credit",
      icon: <Percent className="h-6 w-6" />,
      color: "from-green-500 to-emerald-500"
    },
    {
      id: 2,
      title: "Cash Back Offer",
      description: "Receive up to AED 15,000 cash back on new vehicle purchases",
      discount: "Up to AED 15,000",
      validUntil: "Jan 15, 2025",
      terms: "Applicable on select models, cannot be combined with other offers",
      icon: <Gift className="h-6 w-6" />,
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 3,
      title: "Extended Warranty",
      description: "Complimentary 2-year extended warranty on all new purchases",
      discount: "Free 2 Years",
      validUntil: "Dec 31, 2024",
      terms: "Covers major components, terms and conditions apply",
      icon: <Clock className="h-6 w-6" />,
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 4,
      title: "Trade-In Bonus",
      description: "Extra AED 5,000 trade-in value for your old vehicle",
      discount: "AED 5,000 Bonus",
      validUntil: "Jan 31, 2025",
      terms: "Subject to vehicle evaluation and condition",
      icon: <Car className="h-6 w-6" />,
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogTitle className="sr-only">Current Offers</DialogTitle>
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Current Offers</h2>
              <p className="text-muted-foreground">Limited time deals on Toyota vehicles</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Offers Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offers.map((offer, index) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${offer.color} text-white`}>
                        {offer.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-2">{offer.title}</h3>
                        <Badge className={`bg-gradient-to-r ${offer.color} text-white border-0`}>
                          {offer.discount}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {offer.description}
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-primary" />
                        <span className="text-muted-foreground">Valid until: </span>
                        <span className="font-medium ml-1">{offer.validUntil}</span>
                      </div>
                      
                      <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                        <strong>Terms:</strong> {offer.terms}
                      </div>
                      
                      <Button className="w-full" variant="outline">
                        Apply This Offer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-center bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold text-foreground mb-3">Ready to Save?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Contact our sales team to learn more about these exclusive offers and find the perfect deal for your next Toyota.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Contact Sales Team
              </Button>
              <Button size="lg" variant="outline">
                Schedule Test Drive
              </Button>
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OffersModal;
