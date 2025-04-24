
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, DollarSign, Car, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VehicleModel } from "@/types/vehicle";

interface FinanceCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: VehicleModel;
}

const FinanceCalculator: React.FC<FinanceCalculatorProps> = ({ 
  isOpen, 
  onClose, 
  vehicle 
}) => {
  const [vehiclePrice, setVehiclePrice] = useState<number>(vehicle.price);
  const [downPayment, setDownPayment] = useState<number>(vehicle.price * 0.2);
  const [downPaymentPercentage, setDownPaymentPercentage] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(4.5);
  const [loanTerm, setLoanTerm] = useState<number>(60);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);

  // Calculate monthly payment and totals
  useEffect(() => {
    // Calculate loan amount
    const loanAmount = vehiclePrice - downPayment;
    
    if (loanAmount <= 0) {
      setMonthlyPayment(0);
      setTotalPayment(downPayment);
      setTotalInterest(0);
      return;
    }
    
    // Convert annual interest rate to monthly rate
    const monthlyRate = interestRate / 100 / 12;
    
    // Calculate monthly payment using the formula: 
    // P = A * i * (1 + i)^n / ((1 + i)^n - 1)
    // where A is the loan amount, i is the monthly interest rate, and n is the number of months
    const payment = loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / 
      (Math.pow(1 + monthlyRate, loanTerm) - 1);
    
    // Handle edge cases
    const calculatedPayment = isNaN(payment) || !isFinite(payment) ? 0 : payment;
    
    setMonthlyPayment(calculatedPayment);
    setTotalPayment(calculatedPayment * loanTerm + downPayment);
    setTotalInterest(calculatedPayment * loanTerm - loanAmount);
  }, [vehiclePrice, downPayment, interestRate, loanTerm]);

  // Handle down payment changes
  const handleDownPaymentChange = (value: number) => {
    setDownPayment(value);
    setDownPaymentPercentage((value / vehiclePrice) * 100);
  };

  // Handle down payment percentage changes
  const handleDownPaymentPercentageChange = (value: number[]) => {
    const percentage = value[0];
    setDownPaymentPercentage(percentage);
    setDownPayment((percentage / 100) * vehiclePrice);
  };

  // Handle loan term changes
  const handleLoanTermChange = (value: number[]) => {
    setLoanTerm(value[0]);
  };

  // Handle interest rate changes
  const handleInterestRateChange = (value: number[]) => {
    setInterestRate(value[0]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm p-4">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Finance Calculator - {vehicle.name}
              </h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <Tabs defaultValue="standard">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="standard">Standard Loan</TabsTrigger>
                <TabsTrigger value="balloon">Balloon Payment</TabsTrigger>
              </TabsList>
              
              <TabsContent value="standard">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Calculator Inputs */}
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="vehiclePrice" className="flex justify-between mb-2">
                        <span>Vehicle Price</span>
                        <span>AED {vehiclePrice.toLocaleString()}</span>
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="vehiclePrice"
                          type="number"
                          value={vehiclePrice}
                          onChange={(e) => setVehiclePrice(Number(e.target.value))}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="downPayment" className="flex justify-between mb-2">
                        <span>Down Payment ({downPaymentPercentage.toFixed(0)}%)</span>
                        <span>AED {downPayment.toLocaleString()}</span>
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="downPayment"
                          type="number"
                          value={downPayment}
                          onChange={(e) => handleDownPaymentChange(Number(e.target.value))}
                          className="pl-10 mb-3"
                        />
                      </div>
                      <Slider
                        value={[downPaymentPercentage]}
                        min={0}
                        max={50}
                        step={1}
                        onValueChange={handleDownPaymentPercentageChange}
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0%</span>
                        <span>50%</span>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="interestRate" className="flex justify-between mb-2">
                        <span>Interest Rate</span>
                        <span>{interestRate.toFixed(2)}%</span>
                      </Label>
                      <Slider
                        id="interestRate"
                        value={[interestRate]}
                        min={1}
                        max={10}
                        step={0.1}
                        onValueChange={handleInterestRateChange}
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>1.00%</span>
                        <span>10.00%</span>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="loanTerm" className="flex justify-between mb-2">
                        <span>Loan Term</span>
                        <span>{loanTerm} months ({Math.floor(loanTerm / 12)} years)</span>
                      </Label>
                      <Slider
                        id="loanTerm"
                        value={[loanTerm]}
                        min={12}
                        max={84}
                        step={12}
                        onValueChange={handleLoanTermChange}
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>1 year</span>
                        <span>7 years</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Results */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">
                      Estimated Payments
                    </h3>
                    
                    <div className="space-y-6">
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Monthly Payment
                        </h4>
                        <div className="text-3xl font-bold text-toyota-red">
                          AED {monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Loan Amount:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            AED {(vehiclePrice - downPayment).toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Down Payment:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            AED {downPayment.toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Total Interest:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            AED {totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </span>
                        </div>
                        
                        <div className="flex justify-between border-t pt-4">
                          <span className="text-gray-600 dark:text-gray-300">Total Cost:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            AED {totalPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-100 dark:bg-gray-600 p-4 rounded text-sm">
                        <p className="text-gray-600 dark:text-gray-300">
                          * This is only an estimate. Contact our finance team for a personalized offer.
                        </p>
                      </div>
                      
                      <Button className="w-full bg-toyota-red hover:bg-toyota-darkred">
                        Apply for Financing
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="balloon">
                <div className="p-6 text-center bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                    Balloon Payment Financing
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    A balloon payment option allows you to defer a portion of your vehicle's cost until the end of the loan term, 
                    resulting in lower monthly payments.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Please contact our finance specialists for a personalized balloon payment plan.
                  </p>
                  <Button className="bg-toyota-red hover:bg-toyota-darkred">
                    Contact Finance Team
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default FinanceCalculator;
