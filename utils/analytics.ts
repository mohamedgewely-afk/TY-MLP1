type EventProps = Record<string, any>;
export const analytics = {
  track: (event: string, props?: EventProps) => {
    if (typeof window !== "undefined") {
      (window as any).__VEHICLE_ANALYTICS__ = (window as any).__VEHICLE_ANALYTICS__ || [];
      (window as any).__VEHICLE_ANALYTICS__.push({ event, props, ts: Date.now() });
    }
  },
};