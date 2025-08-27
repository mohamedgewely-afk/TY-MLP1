
import React, { useMemo, memo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { VehicleModel } from '@/types/vehicle';
import { cn } from '@/lib/utils';

interface VirtualizedVehicleListProps {
  vehicles: VehicleModel[];
  renderItem: (vehicle: VehicleModel, index: number) => React.ReactNode;
  itemHeight?: number;
  overscan?: number;
  className?: string;
}

const VirtualizedVehicleList: React.FC<VirtualizedVehicleListProps> = memo(({
  vehicles,
  renderItem,
  itemHeight = 300,
  overscan = 5,
  className = ''
}) => {
  const parentRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: vehicles.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight,
    overscan
  });

  const virtualItems = useMemo(() => rowVirtualizer.getVirtualItems(), [rowVirtualizer]);

  if (vehicles.length === 0) {
    return (
      <div className={cn('flex items-center justify-center p-8', className)}>
        <p className="text-muted-foreground">No vehicles found</p>
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className={cn('overflow-auto', className)}
      style={{
        height: `400px`, // Fixed height for virtualization
      }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map((virtualItem) => {
          const vehicle = vehicles[virtualItem.index];
          return (
            <div
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              {renderItem(vehicle, virtualItem.index)}
            </div>
          );
        })}
      </div>
    </div>
  );
});

VirtualizedVehicleList.displayName = 'VirtualizedVehicleList';

export default VirtualizedVehicleList;
