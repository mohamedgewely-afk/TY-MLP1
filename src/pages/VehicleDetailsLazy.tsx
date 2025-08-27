
import React, { Suspense } from 'react';
import EnhancedLoading from '@/components/ui/enhanced-loading';

// Lazy load heavy components for better code splitting
const VehicleDetails = React.lazy(() => import('./VehicleDetails'));
const EnhancedHeroSection = React.lazy(() => import('@/components/vehicle-details/EnhancedHeroSection'));
const VirtualShowroom = React.lazy(() => import('@/components/vehicle-details/VirtualShowroom'));
const CarBuilder = React.lazy(() => import('@/components/vehicle-details/CarBuilder'));

// Export the lazy-loaded version
export default function VehicleDetailsLazy() {
  return (
    <Suspense fallback={
      <div className="min-h-screen">
        <EnhancedLoading 
          variant="branded" 
          text="Loading vehicle details..."
          className="h-screen"
        />
      </div>
    }>
      <VehicleDetails />
    </Suspense>
  );
}

// Export individual lazy components for more granular loading
export const LazyEnhancedHeroSection = (props: any) => (
  <Suspense fallback={<EnhancedLoading variant="skeleton" className="h-96" />}>
    <EnhancedHeroSection {...props} />
  </Suspense>
);

export const LazyVirtualShowroom = (props: any) => (
  <Suspense fallback={<EnhancedLoading variant="skeleton" className="h-64" />}>
    <VirtualShowroom {...props} />
  </Suspense>
);

export const LazyCarBuilder = (props: any) => (
  <Suspense fallback={<EnhancedLoading variant="skeleton" className="h-96" />}>
    <CarBuilder {...props} />
  </Suspense>
);
