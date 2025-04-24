import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { VehicleModel } from "@/types/vehicle";
import { X, Info, DollarSign, Calendar, Percent } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

export interface FinanceCalculatorProps {
  vehicle: VehicleModel;
  isOpen: boolean;
  onClose: () => void;
}

const FinanceCalculator: React.FC<FinanceCalculatorProps> = ({ vehicle, isOpen, onClose }) => {
  const [downPayment, setDownPayment] = useState(Math.round(vehicle.price * 0.2));
  const [loanTerm, setLoanTerm] = useState(60); // 5 years in months
  const [interestRate, setInterestRate] = useState(3.99);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const { toast } = useToast();

  // Calculate loan details
  React.useEffect(() => {
    const principal = vehicle.price - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const monthlyPaymentValue = 
      (principal * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / 
      (Math.pow(1 + monthlyRate, loanTerm) - 1);
    
    const totalPayments = monthlyPaymentValue * loanTerm;
    const totalInterestValue = totalPayments - principal;
    
    setMonthlyPayment(monthlyPaymentValue);
    setTotalInterest(totalInterestValue);
    setTotalCost(totalPayments + downPayment);
  }, [vehicle.price, downPayment, loanTerm, interestRate]);

  const handleDownPaymentChange = (value: number[]) => {
    setDownPayment(value[0]);
  };

  const handleLoanTermChange = (value: number[]) => {
    setLoanTerm(value[0]);
  };

  const handleInterestRateChange = (value: number[]) => {
    setInterestRate(value[0]);
  };

  const handleDownPaymentInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value.replace(/,/g, ''), 10);
    if (!isNaN(value) && value >= 0 && value <= vehicle.price) {
      setDownPayment(value);
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Finance Calculation Saved",
      description: "Your finance calculation has been saved. A Toyota representative will contact you shortly.",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Finance Calculator</DialogTitle>
          <DialogDescription>
            Estimate your monthly payments for the {vehicle.name}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vehicle Information */}
            <div className="space-y-4">
              <div className="aspect-video overflow-hidden rounded-md">
                <img 
                  src={vehicle.image} 
                  alt={vehicle.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg">{vehicle.name}</h3>
                <p className="text-gray-500 dark:text-gray-400">{vehicle.category}</p>
                <p className="text-xl font-bold mt-2">AED {vehicle.price.toLocaleString()}</p>
              </div>
            </div>

            {/* Calculator Results */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-lg">Estimated Payment</h3>
              
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600 dark:text-gray-400">Monthly Payment:</span>
                <span className="text-xl font-bold">
                  AED {Math.round(monthlyPayment).toLocaleString()}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Down Payment:</span>
                  <span>AED {downPayment.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Loan Amount:</span>
                  <span>AED {(vehicle.price - downPayment).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Loan Term:</span>
                  <span>{Math.floor(loanTerm / 12)} years ({loanTerm} months)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Interest Rate:</span>
                  <span>{interestRate.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Interest:</span>
                  <span>AED {Math.round(totalInterest).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Total Cost:</span>
                  <span>AED {Math.round(totalCost).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Calculator Controls */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="downPayment" className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Down Payment
                </Label>
                <div className="relative">
                  <DollarSign className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <Input
                    id="downPaymentInput"
                    value={downPayment.toLocaleString()}
                    onChange={handleDownPaymentInput}
                    className="pl-8 w-32 text-right"
                  />
                </div>
              </div>
              <Slider
                id="downPayment"
                min={0}
                max={vehicle.price}
                step={1000}
                value={[downPayment]}
                onValueChange={handleDownPaymentChange}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>AED 0</span>
                <span>AED {vehicle.price.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="loanTerm" className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Loan Term
                </Label>
                <span className="text-sm font-medium">
                  {Math.floor(loanTerm / 12)} years ({loanTerm} months)
                </span>
              </div>
              <Slider
                id="loanTerm"
                min={12}
                max={84}
                step={12}
                value={[loanTerm]}
                onValueChange={handleLoanTermChange}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>1 year</span>
                <span>7 years</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="interestRate" className="flex items-center">
                  <Percent className="h-4 w-4 mr-1" />
                  Interest Rate
                </Label>
                <span className="text-sm font-medium">{interestRate.toFixed(2)}%</span>
              </div>
              <Slider
                id="interestRate"
                min={1}
                max={10}
                step={0.25}
                value={[interestRate]}
                onValueChange={handleInterestRateChange}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>1%</span>
                <span>10%</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500 flex items-start">
            <Info className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
            <p>
              This calculator provides an estimate only. Actual terms may vary based on credit approval, 
              down payment, and other factors. Contact your Toyota dealer for personalized financing options.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Save & Contact Me
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FinanceCalculator;
