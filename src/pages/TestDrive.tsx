
import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import ToyotaLayout from "@/components/ToyotaLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { vehicles, preOwnedVehicles } from "@/data/vehicles";
import { CalendarIcon, ArrowLeft, Check } from "lucide-react";

const TestDrive = () => {
  const [searchParams] = useSearchParams();
  const modelParam = searchParams.get("model");
  const isPreowned = searchParams.get("preowned") === "true";
  const vehicleId = searchParams.get("id");
  
  const [selectedModel, setSelectedModel] = useState(modelParam || "");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState<string | undefined>(undefined);
  const [location, setLocation] = useState<string | undefined>(undefined);
  const [step, setStep] = useState(1);
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  
  const { toast } = useToast();
  
  // Form fields
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  // Available time slots
  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
  ];

  // Available dealership locations
  const locations = [
    "Toyota Dubai - Sheikh Zayed Road",
    "Toyota Abu Dhabi - Airport Road",
    "Toyota Sharjah - Al Wahda Street",
    "Toyota Ajman - Sheikh Rashid Bin Saeed Al Maktoum St"
  ];

  // Update form data
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle next step
  const handleNext = () => {
    if (step === 1 && !date) {
      toast({
        title: "Please select a date",
        variant: "destructive",
      });
      return;
    }
    
    if (step === 2 && !timeSlot) {
      toast({
        title: "Please select a time slot",
        variant: "destructive",
      });
      return;
    }
    
    if (step === 3 && (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !location)) {
      toast({
        title: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    setStep(step - 1);
  };

  // Handle form submission
  const handleSubmit = () => {
    setFormStatus("submitting");
    
    // Simulate API call
    setTimeout(() => {
      setFormStatus("success");
      toast({
        title: "Test Drive Booked",
        description: `Your test drive for ${selectedModel} has been scheduled.`,
      });
    }, 1500);
  };

  return (
    <ToyotaLayout>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
        <div className="toyota-container max-w-3xl mx-auto">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Home</Link>
          </Button>
          
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl overflow-hidden">
            <div className="p-6 md:p-8">
              <h1 className="text-3xl font-bold mb-2">Book a Test Drive</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {selectedModel 
                  ? `Schedule a test drive for the ${selectedModel}`
                  : "Select a vehicle and schedule your test drive"
                }
              </p>
              
              {formStatus === "success" ? (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                    <Check className="h-8 w-8 text-green-600 dark:text-green-300" />
                  </div>
                  <h2 className="text-2xl font-semibold mb-2">Test Drive Confirmed!</h2>
                  <p className="mb-2 text-gray-600 dark:text-gray-300">
                    Your test drive has been scheduled for:
                  </p>
                  <p className="text-lg font-medium mb-1">
                    {date && format(date, "EEEE, MMMM d, yyyy")} at {timeSlot}
                  </p>
                  <p className="mb-6 text-gray-600 dark:text-gray-300">
                    Location: {location}
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    You'll receive a confirmation email shortly with all the details.
                  </p>
                  <Button asChild>
                    <Link to="/">Return to Home</Link>
                  </Button>
                </div>
              ) : (
                <div>
                  {/* Progress Indicator */}
                  <div className="flex justify-between mb-8">
                    {[1, 2, 3].map((s) => (
                      <div key={s} className="flex flex-col items-center">
                        <div 
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            s < step ? "bg-green-500 text-white" : 
                            s === step ? "bg-toyota-red text-white" : 
                            "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {s < step ? <Check className="h-5 w-5" /> : s}
                        </div>
                        <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                          {s === 1 ? "Date" : s === 2 ? "Time" : "Details"}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Step 1: Select Vehicle and Date */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="model">Vehicle Model</Label>
                        <Select 
                          value={selectedModel} 
                          onValueChange={(value) => setSelectedModel(value)}
                          required
                        >
                          <SelectTrigger id="model">
                            <SelectValue placeholder="Select a vehicle model" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">-- Select a Model --</SelectItem>
                            {!isPreowned ? (
                              vehicles.map((vehicle) => (
                                <SelectItem key={vehicle.name} value={vehicle.name}>
                                  {vehicle.name}
                                </SelectItem>
                              ))
                            ) : (
                              preOwnedVehicles.map((vehicle) => (
                                <SelectItem key={vehicle.id} value={vehicle.model}>
                                  {vehicle.model} ({vehicle.year})
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Select a Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              disabled={(date) => {
                                // Disable dates in the past and Sundays
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                return date < today || date.getDay() === 0;
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <p className="text-xs text-gray-500">
                          * Sundays are not available for test drives
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Step 2: Select Time */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-4">
                          Select a time slot for {date && format(date, "MMMM d, yyyy")}
                        </h3>
                        
                        <div className="grid grid-cols-3 gap-2">
                          {timeSlots.map((time) => (
                            <Button
                              key={time}
                              type="button"
                              variant={timeSlot === time ? "default" : "outline"}
                              className={`
                                flex items-center justify-center h-12
                                ${timeSlot === time ? "bg-toyota-red hover:bg-toyota-darkred" : ""}
                              `}
                              onClick={() => setTimeSlot(time)}
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Step 3: Personal Details */}
                  {step === 3 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input 
                            id="firstName" 
                            name="firstName" 
                            value={formData.firstName} 
                            onChange={handleChange} 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input 
                            id="lastName" 
                            name="lastName" 
                            value={formData.lastName} 
                            onChange={handleChange} 
                            required 
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input 
                            id="phone" 
                            name="phone" 
                            type="tel" 
                            value={formData.phone} 
                            onChange={handleChange} 
                            required 
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="location">Preferred Location</Label>
                        <Select
                          value={location}
                          onValueChange={setLocation}
                          required
                        >
                          <SelectTrigger id="location">
                            <SelectValue placeholder="Select a dealership" />
                          </SelectTrigger>
                          <SelectContent>
                            {locations.map((loc) => (
                              <SelectItem key={loc} value={loc}>
                                {loc}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-medium text-sm mb-2">
                          Booking Summary
                        </h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex">
                            <span className="w-24 text-gray-600 dark:text-gray-400">Vehicle:</span>
                            <span className="font-medium">{selectedModel}</span>
                          </li>
                          <li className="flex">
                            <span className="w-24 text-gray-600 dark:text-gray-400">Date:</span>
                            <span className="font-medium">{date && format(date, "MMMM d, yyyy")}</span>
                          </li>
                          <li className="flex">
                            <span className="w-24 text-gray-600 dark:text-gray-400">Time:</span>
                            <span className="font-medium">{timeSlot}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between mt-8">
                    {step > 1 ? (
                      <Button type="button" variant="outline" onClick={handlePrevious}>
                        Back
                      </Button>
                    ) : (
                      <Button type="button" variant="outline" asChild>
                        <Link to="/">Cancel</Link>
                      </Button>
                    )}
                    
                    <Button 
                      type="button" 
                      onClick={handleNext}
                      disabled={formStatus === "submitting"}
                    >
                      {step < 3 ? "Next" : (formStatus === "submitting" ? "Booking..." : "Confirm Booking")}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ToyotaLayout>
  );
};

export default TestDrive;
