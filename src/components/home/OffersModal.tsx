import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

interface OffersModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOffer?: any;
}

const OffersModal: React.FC<OffersModalProps> = ({ isOpen, onClose, selectedOffer }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interestedVehicle: selectedOffer?.title || '',
    message: ''
  });

  const isMobile = useIsMobile();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
    onClose(); // Close the modal after submission
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={`${
          isMobile 
            ? 'w-[95vw] h-[85vh] max-w-none' 
            : 'w-[80vw] h-[80vh] max-w-6xl'
        } overflow-hidden p-0`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex-shrink-0 p-6 border-b bg-gradient-to-r from-primary to-primary/80 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {selectedOffer ? selectedOffer.title : 'Special Offers'}
                </h2>
                <p className="text-white/90">
                  {selectedOffer 
                    ? 'Complete the form below to claim this exclusive offer' 
                    : 'Discover our latest promotions and deals'
                  }
                </p>
              </div>
              <Button
                onClick={onClose}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {selectedOffer ? (
              <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} h-full`}>
                {/* Offer Details */}
                <div className="p-6 bg-gradient-to-br from-primary/5 to-primary/10">
                  <div className="sticky top-0">
                    <div className="mb-6">
                      <Badge className="bg-primary text-white mb-4 px-3 py-1">
                        {selectedOffer.category}
                      </Badge>
                      <h3 className="text-2xl font-bold mb-3">{selectedOffer.title}</h3>
                      <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                        {selectedOffer.description}
                      </p>
                    </div>

                    {selectedOffer.features && (
                      <div className="mb-6">
                        <h4 className="font-semibold mb-3 text-lg">What's Included:</h4>
                        <ul className="space-y-3">
                          {selectedOffer.features.map((feature: string, index: number) => (
                            <li key={index} className="flex items-start space-x-3">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm leading-relaxed">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="bg-white p-4 rounded-lg border border-primary/20">
                      <div className="text-center">
                        <div className="text-3xl font-black text-primary mb-2">
                          {selectedOffer.discount}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Valid until {selectedOffer.validUntil}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Form with Better Spacing */}
                <div className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-5">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-base"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-base"
                          placeholder="Enter your email address"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-base"
                          placeholder="+971 XX XXX XXXX"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="interestedVehicle" className="block text-sm font-medium mb-2">
                          Interested Vehicle
                        </label>
                        <input
                          type="text"
                          id="interestedVehicle"
                          value={formData.interestedVehicle}
                          onChange={(e) => setFormData(prev => ({ ...prev, interestedVehicle: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-base"
                          placeholder="e.g., Toyota Camry Hybrid"
                        />
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-2">
                          Additional Message
                        </label>
                        <textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-base resize-none"
                          placeholder="Any specific requirements or questions..."
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button 
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-4 text-lg h-14"
                      >
                        Claim This Offer
                      </Button>
                      <p className="text-center text-sm text-muted-foreground mt-3">
                        Our team will contact you within 24 hours
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <h3 className="text-xl font-bold mb-4">No Offer Selected</h3>
                <p className="text-muted-foreground">Please select an offer to view details.</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OffersModal;
