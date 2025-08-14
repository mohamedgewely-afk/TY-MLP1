import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, Car, Search, Heart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';

interface MobileStickyNavProps {
  className?: string;
}

const MobileStickyNav: React.FC<MobileStickyNavProps> = ({ className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState('new-cars');
  const isMobile = useIsMobile();

  // Don't render on desktop
  if (!isMobile) {
    return null;
  }

  const categories = [
    {
      id: 'new-cars',
      label: 'New Cars',
      vehicles: [
        {
          name: 'Camry',
          price: 'AED 89,900',
          image: 'https://aepprddxamb01.corp.al-futtaim.com/dx/api/dam/v1/collections/7ad6ef76-e142-4094-b47d-965dcd346141/items/c39a5591-c85a-413a-b9e5-f980f1f24d4d/renditions/d5414b58-6e06-451d-9309-3233fe8a7002?binary=true',
          slug: 'camry'
        },
        {
          name: 'Corolla',
          price: 'AED 69,900',
          image: 'https://aepprddxamb01.corp.al-futtaim.com/dx/api/dam/v1/collections/6668562b-e7cf-4230-9deb-900d5e8e2e53/items/f48d6e38-6f33-40c3-8e91-4bdf59fb3e60/renditions/505ee681-e3d2-41f3-95a5-c7b856a50048?binary=true',
          slug: 'corolla'
        },
        {
          name: 'RAV4',
          price: 'AED 104,900',
          image: 'https://aepprddxamb01.corp.al-futtaim.com/dx/api/dam/v1/collections/a5bffab2-6c0d-4698-bfe7-b4ab7114ec03/items/a8dbfe08-2cd5-4952-acf7-8dae2e49666d/renditions/bd938484-6fd4-4dc0-b0c9-8523c356964e?binary=true',
          slug: 'rav4-hybrid'
        },
        {
          name: 'Highlander',
          price: 'AED 149,900',
          image: 'https://aepprddxamb01.corp.al-futtaim.com/dx/api/dam/v1/collections/367b679d-7e64-4a14-bda0-a0ce1e8d1ce2/items/cfda750d-3631-4ad0-9489-25af5af99ec5/renditions/31f4c813-0a0e-4eaa-b1c2-151268277b59?binary=true',
          slug: 'highlander'
        },
        {
          name: 'Prius',
          price: 'AED 99,900',
          image: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/187049c6-862a-49e6-a109-e2340652f3cd/items/a6d44ead-2ed7-4760-b9a5-c74462c8b13e/renditions/0871895b-d3bf-42e2-a91c-9e696b410e8d?binary=true&mformat=true',
          slug: 'prius'
        },
        {
          name: 'Land Cruiser',
          price: 'AED 234,900',
          image: 'https://aepprddxamb01.corp.al-futtaim.com/dx/api/dam/v1/collections/155ca245-b83a-4c78-beb3-c294b97544a3/items/abdc9c2f-4fbc-4d9d-92c2-4eac0d713d96/renditions/9aacd1cf-1c24-4e3a-9874-db036dde2fdc?binary=true',
          slug: 'land-cruiser'
        },
        {
          name: 'Yaris',
          price: 'AED 54,900',
          image: 'https://aepprddxamb01.corp.al-futtaim.com/dx/api/dam/v1/collections/b3eac42b-e400-4e0d-ab76-6c8a2df8f465/items/53649561-b41b-457a-8d6b-5a1d779f4cd6/renditions/2c3c9289-09f7-420e-8587-3e6ae42a5567?binary=true',
          slug: 'yaris'
        },
        {
          name: 'Fortuner',
          price: 'AED 124,900',
          image: 'https://aepprddxamb01.corp.al-futtaim.com/dx/api/dam/v1/collections/30fe3af9-5e61-403a-a2ed-eb0e9f0b3ca0/items/354a55f3-7aa4-43f6-a98f-9265a1ea8257/renditions/6c61ac4b-7466-4e58-962d-bbfeff425cff?binary=true',
          slug: 'fortuner'
        },
        {
          name: 'Hiace',
          price: 'AED 79,900',
          image: 'https://aepprddxamb01.corp.al-futtaim.com/dx/api/dam/v1/collections/62cfa484-93ad-4230-821a-8096c177027e/items/4568b91a-823f-42d7-9f16-eac193cce140/renditions/ca79f885-d1af-4cfc-aed4-9763209ffec3?binary=true',
          slug: 'hiace'
        }
      ]
    },
    {
      id: 'offers',
      label: 'Offers',
      vehicles: []
    },
    {
      id: 'pre-owned',
      label: 'Pre-Owned',
      vehicles: []
    },
    {
      id: 'services',
      label: 'Services',
      vehicles: []
    }
  ];

  return (
    <>
      {/* Main Navigation Bar */}
      <motion.div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg safe-area-pb ${className}`}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        <div className="grid grid-cols-5 h-16">
          {/* Home */}
          <Link
            to="/"
            className="flex flex-col items-center justify-center space-y-1 hover:bg-gray-50 transition-colors"
          >
            <div className="p-1">
              <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="text-xs text-gray-600">Home</span>
          </Link>

          {/* Search */}
          <button className="flex flex-col items-center justify-center space-y-1 hover:bg-gray-50 transition-colors">
            <div className="p-1">
              <Search className="h-5 w-5 text-gray-600" />
            </div>
            <span className="text-xs text-gray-600">Search</span>
          </button>

          {/* Menu (Center) */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex flex-col items-center justify-center space-y-1 hover:bg-gray-50 transition-colors relative"
          >
            <motion.div
              className="p-2 bg-primary rounded-full"
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isExpanded ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-5 w-5 text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-5 w-5 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            <span className="text-xs text-primary font-medium">Menu</span>
          </button>

          {/* Favorites */}
          <button className="flex flex-col items-center justify-center space-y-1 hover:bg-gray-50 transition-colors relative">
            <div className="p-1">
              <Heart className="h-5 w-5 text-gray-600" />
            </div>
            <span className="text-xs text-gray-600">Favorites</span>
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs p-0 flex items-center justify-center">
              3
            </Badge>
          </button>

          {/* Test Drive */}
          <Link
            to="/test-drive"
            className="flex flex-col items-center justify-center space-y-1 hover:bg-gray-50 transition-colors"
          >
            <div className="p-1">
              <Car className="h-5 w-5 text-gray-600" />
            </div>
            <span className="text-xs text-gray-600">Test Drive</span>
          </Link>
        </div>
      </motion.div>

      {/* Expanded Menu Overlay */}
      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* Expanded Content */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-16 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[70vh] overflow-hidden"
            >
              {/* Handle */}
              <div className="flex justify-center py-3">
                <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
              </div>

              {/* Categories */}
              <div className="px-4 pb-2">
                <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                        activeCategory === category.id
                          ? 'bg-white text-primary shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="overflow-y-auto pb-safe">
                <AnimatePresence mode="wait">
                  {categories.map((category) => {
                    if (category.id !== activeCategory) return null;

                    return (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="px-4"
                      >
                        {category.id === 'new-cars' && category.vehicles.length > 0 && (
                          <div className="space-y-3">
                            {category.vehicles.map((vehicle, index) => (
                              <motion.div
                                key={vehicle.slug}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <Link
                                  to={`/vehicle/${vehicle.slug}`}
                                  onClick={() => setIsExpanded(false)}
                                  className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                                >
                                  <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                    <img
                                      src={vehicle.image}
                                      alt={vehicle.name}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = '/placeholder.svg';
                                      }}
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-gray-900 truncate">
                                      {vehicle.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                      Starting from {vehicle.price}
                                    </p>
                                  </div>
                                  <ChevronUp className="h-5 w-5 text-gray-400 transform -rotate-90 group-hover:text-primary transition-colors" />
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        )}

                        {category.id === 'offers' && (
                          <div className="text-center py-12">
                            <div className="text-6xl mb-4">🎉</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              Special Offers
                            </h3>
                            <p className="text-gray-500 mb-6">
                              Discover amazing deals on Toyota vehicles
                            </p>
                            <Button className="bg-primary hover:bg-primary/90">
                              View All Offers
                            </Button>
                          </div>
                        )}

                        {category.id === 'pre-owned' && (
                          <div className="text-center py-12">
                            <div className="text-6xl mb-4">🚗</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              Pre-Owned Vehicles
                            </h3>
                            <p className="text-gray-500 mb-6">
                              Quality certified pre-owned Toyota vehicles
                            </p>
                            <Link to="/pre-owned">
                              <Button 
                                className="bg-primary hover:bg-primary/90"
                                onClick={() => setIsExpanded(false)}
                              >
                                Browse Pre-Owned
                              </Button>
                            </Link>
                          </div>
                        )}

                        {category.id === 'services' && (
                          <div className="space-y-3">
                            {[
                              { name: 'Service Booking', icon: '🔧', description: 'Schedule your vehicle service' },
                              { name: 'Parts & Accessories', icon: '⚙️', description: 'Genuine Toyota parts' },
                              { name: 'Warranty', icon: '🛡️', description: 'Comprehensive coverage' },
                              { name: 'Insurance', icon: '📋', description: 'Protect your investment' },
                              { name: 'Roadside Assistance', icon: '🚨', description: '24/7 support' },
                            ].map((service, index) => (
                              <motion.div
                                key={service.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer"
                              >
                                <div className="text-2xl">{service.icon}</div>
                                <div className="flex-1">
                                  <h3 className="font-medium text-gray-900">
                                    {service.name}
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    {service.description}
                                  </p>
                                </div>
                                <ChevronUp className="h-5 w-5 text-gray-400 transform -rotate-90 group-hover:text-primary transition-colors" />
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileStickyNav;
