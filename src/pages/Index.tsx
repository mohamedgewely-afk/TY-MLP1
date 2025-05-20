
import React from "react";
import { usePersona } from "@/contexts/PersonaContext";
import PersonaSelector from "@/components/home/PersonaSelector";
import PersonalizedHero from "@/components/home/PersonalizedHero";
import QuickLinks from "@/components/home/QuickLinks";
import PersonaBadge from "@/components/home/PersonaBadge";
import PersonaHomePage from "@/components/home/PersonaHomePage";

const Index: React.FC = () => {
  const { personaData, selectedPersona } = usePersona();
  const [showSelector, setShowSelector] = React.useState(true);

  const handlePersonaSelect = () => {
    setShowSelector(false);
  };

  // When a persona is selected and selector is hidden, show the persona-specific homepage
  if (personaData && !showSelector) {
    return (
      <div className="min-h-screen">
        <PersonaHomePage />
        <PersonaBadge />
      </div>
    );
  }

  // Show persona selector if no persona selected or if selector is explicitly shown
  if (!personaData || showSelector) {
    return (
      <div className="min-h-screen">
        <PersonaSelector onSelect={handlePersonaSelect} />
      </div>
    );
  }

  // Fallback to personalized content (original implementation)
  return (
    <div className="min-h-screen">
      <PersonalizedHero />
      <QuickLinks />
      <PersonaBadge />

      {/* Featured Vehicles Section */}
      <section className="py-16 bg-white">
        <div className="toyota-container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Featured <span className="text-toyota-red">Vehicles</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Vehicle Cards */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <img 
                  src="/images/vehicles/camry.jpg" 
                  alt="Toyota Camry" 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-0 right-0 bg-toyota-red text-white px-3 py-1 text-sm font-bold">
                  New
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Toyota Camry</h3>
                <p className="text-gray-600 mb-4">The sophisticated sedan with advanced features and elegant design.</p>
                <div className="flex justify-between items-center">
                  <span className="text-toyota-red font-bold">Starting at $25,945</span>
                  <button className="bg-toyota-red hover:bg-red-700 text-white px-4 py-2 rounded">
                    Explore
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <img 
                  src="/images/vehicles/rav4.jpg" 
                  alt="Toyota RAV4" 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-0 right-0 bg-green-600 text-white px-3 py-1 text-sm font-bold">
                  Hybrid
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Toyota RAV4</h3>
                <p className="text-gray-600 mb-4">The versatile SUV that's ready for your next adventure.</p>
                <div className="flex justify-between items-center">
                  <span className="text-toyota-red font-bold">Starting at $26,975</span>
                  <button className="bg-toyota-red hover:bg-red-700 text-white px-4 py-2 rounded">
                    Explore
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <img 
                  src="/images/vehicles/tacoma.jpg" 
                  alt="Toyota Tacoma" 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 text-sm font-bold">
                  Popular
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Toyota Tacoma</h3>
                <p className="text-gray-600 mb-4">The rugged pickup built for work and play.</p>
                <div className="flex justify-between items-center">
                  <span className="text-toyota-red font-bold">Starting at $27,250</span>
                  <button className="bg-toyota-red hover:bg-red-700 text-white px-4 py-2 rounded">
                    Explore
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <button className="bg-toyota-red hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold inline-flex items-center">
              View All Vehicles
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </section>
      
      {/* Special Offers Section */}
      <section className="py-16 bg-gray-100">
        <div className="toyota-container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Special <span className="text-toyota-red">Offers</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <img 
                  src="/images/offers/financing.jpg" 
                  alt="Financing Offer" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">0% APR Financing</h3>
                  <p className="mb-4">Available on select models for qualified buyers.</p>
                  <button className="bg-toyota-red hover:bg-red-700 text-white px-4 py-2 rounded">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <img 
                  src="/images/offers/lease.jpg" 
                  alt="Lease Offer" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">$199/month Lease</h3>
                  <p className="mb-4">On new Corolla models with $2,999 due at signing.</p>
                  <button className="bg-toyota-red hover:bg-red-700 text-white px-4 py-2 rounded">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <button className="bg-toyota-red hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold inline-flex items-center">
              View All Offers
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </section>
      
      {/* Performance Section */}
      <section className="py-16 bg-black text-white">
        <div className="toyota-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Experience <span className="text-toyota-red">Performance</span>
              </h2>
              <p className="text-lg mb-8">
                Toyota's performance lineup delivers exhilaration on the road and track. 
                From the nimble GR86 to the legendary Supra, discover vehicles engineered 
                for pure driving pleasure.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-toyota-red hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold">
                  Explore GR Models
                </button>
                <button className="border border-white hover:bg-white hover:text-black text-white px-6 py-3 rounded-lg font-bold transition-colors duration-300">
                  Performance Specs
                </button>
              </div>
            </div>
            <div>
              <img 
                src="/images/performance/gr-supra.jpg" 
                alt="Toyota GR Supra" 
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Pre-Owned Section */}
      <section className="py-16 bg-white">
        <div className="toyota-container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
            Toyota <span className="text-toyota-red">Certified Pre-Owned</span>
          </h2>
          <p className="text-lg text-center mb-12 max-w-3xl mx-auto">
            Quality, value, and peace of mind come standard with every Toyota Certified Pre-Owned vehicle.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="bg-gray-100 rounded-full p-6 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-toyota-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">12-Month/12,000-Mile Warranty</h3>
              <p className="text-gray-600">
                Comprehensive coverage that gives you confidence in your certified pre-owned Toyota.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="bg-gray-100 rounded-full p-6 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-toyota-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">160-Point Quality Assurance</h3>
              <p className="text-gray-600">
                Each vehicle undergoes a comprehensive inspection to ensure quality and reliability.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="bg-gray-100 rounded-full p-6 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-toyota-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">7-Day/1,000-Mile Exchange</h3>
              <p className="text-gray-600">
                If you're not satisfied, exchange your vehicle within 7 days or 1,000 miles.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <button className="bg-toyota-red hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold inline-flex items-center">
              Browse Certified Pre-Owned
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </section>
      
      {/* Owner Benefits Section */}
      <section className="py-16 bg-gray-100">
        <div className="toyota-container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Toyota <span className="text-toyota-red">Owner Benefits</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="bg-toyota-red/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-toyota-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">ToyotaCare</h3>
              <p className="text-gray-600">
                No-cost maintenance plan and 24-hour roadside assistance for 2 years or 25,000 miles.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="bg-toyota-red/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-toyota-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Toyota App</h3>
              <p className="text-gray-600">
                Manage your vehicle, schedule service, and access remote features from your smartphone.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="bg-toyota-red/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-toyota-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Financing Options</h3>
              <p className="text-gray-600">
                Flexible financing and lease options tailored to your needs and budget.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="bg-toyota-red/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-toyota-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Genuine Parts</h3>
              <p className="text-gray-600">
                Toyota Genuine Parts are designed specifically for your vehicle to ensure optimal performance.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action Section */}
      <section className="py-20 bg-toyota-red text-white">
        <div className="toyota-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Toyota?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover the perfect Toyota for your lifestyle. Build your vehicle, schedule a test drive, or find a dealer near you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-white text-toyota-red hover:bg-gray-100 px-6 py-3 rounded-lg font-bold">
              Build & Price
            </button>
            <button className="bg-transparent hover:bg-white/10 border-2 border-white text-white px-6 py-3 rounded-lg font-bold">
              Schedule Test Drive
            </button>
            <button className="bg-transparent hover:bg-white/10 border-2 border-white text-white px-6 py-3 rounded-lg font-bold">
              Find a Dealer
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
