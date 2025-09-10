import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehicleModel } from "@/types/vehicle";
import { vehicles } from "@/data/vehicles";
import { Link } from "react-router-dom";
import { useSwipeable } from "@/hooks/use-swipeable";
import { cn } from "@/lib/utils";

interface RelatedVehiclesProps {
  currentVehicle: VehicleModel;
  className?: string;
  title?: string;
}

const AED = new Intl.NumberFormat("en-AE", { maximumFractionDigits: 0 });

const FALLBACKS = [
  "https://dam.alfuttaim.com/dx/api/dam/v1/collections/e6cd7f93-d348-444b-9525-42b7ea441e99/items/da1e230a-67ae-4564-813e-fc2e7413879e/renditions/181a04c5-0892-4dff-aff2-82a3a4395f79?binary=true&mformat=true",
  "https://dam.alfuttaim.com/dx/api/dam/v1/collections/d4d16181-611d-43ed-9af4-fa2469645028/items/2c0d9643-2b2e-4b69-b7d5-322fa0f537a7/renditions/f48ef8f7-1be3-4d17-8267-f3a5896617ea?binary=true&mformat=true",
  "https://dam.alfuttaim.com/dx/api/dam/v1/collections/d4d16181-611d-43ed-9af4-fa2469645028/items/57c0be94-a250-45cf-b4cb-6e91c2911ad7/renditions/8eea1c4d-54ec-4d07-80cc-cf35dcaff8d5?binary=true&mformat=true",
  "https://dam.alfuttaim.com/dx/api/dam/v1/collections/d4d16181-611d-43ed-9af4-fa2469645028/items/180b2e84-1d38-470a-b760-955a158aad11/renditions/77a92a10-8a19-4158-b983-d312e81983c6?binary=true&mformat=true",
];

const RelatedVehicles: React.FC<RelatedVehiclesProps> = ({
  currentVehicle,
  className,
  title = "You Might Also Like",
}) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Show ALL cars in the same category (no price rule / no cap)
  const relatedVehicles = React.useMemo(
    () =>
      vehicles.filter(
        (v) => v.id !== currentVehicle.id && v.category === currentVehicle.category
      ),
    [currentVehicle]
  );

  const enhancedVehicles = React.useMemo(
    () =>
      relatedVehicles.map((v, i) => ({
        ...v,
        image: v.image && v.image.trim() ? v.image : FALLBACKS[i % FALLBACKS.length],
      })),
    [relatedVehicles]
  );

  const scroll = (dir: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const amount = dir === "left" ? -640 : 640; // tuned for tablet/desktop
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  const swipeableRef = useSwipeable({
    onSwipeLeft: () => scroll("right"),
    onSwipeRight: () => scroll("left"),
    threshold: 20, // more responsive on mobile
    preventDefaultTouchmoveEvent: false,
  });

  const bindScrollable = (el: HTMLDivElement | null) => {
    scrollContainerRef.current = el || null;
    if (swipeableRef && "current" in swipeableRef) {
      (swipeableRef as any).current = el;
    }
  };

  if (!enhancedVehicles.length) return null;

  return (
    <section className={cn("py-10 md:py-12", className)}>
      {/* Wider centered container */}
      <div className="max-w-screen-2xl mx-auto px-4">
        <div className="mb-5 md:mb-6 flex items-center justify-between gap-3">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          {/* Hide arrows on mobile to avoid overlap; show from md+ */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => scroll("left")}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => scroll("right")}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="relative">
          {/* Edge gradients */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 md:w-12 bg-gradient-to-r from-background to-transparent z-10 rounded-l-2xl" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 md:w-12 bg-gradient-to-l from-background to-transparent z-10 rounded-r-2xl" />

          <div
            ref={bindScrollable}
            className="
              flex justify-center gap-5 md:gap-8 overflow-x-auto
              pb-24 md:pb-8 pr-[8vw] pl-[8vw] md:px-4
              snap-x snap-mandatory
              scroll-smooth hide-scrollbar
            "
            // helps center-snap and peek edges on mobile
            style={{ scrollbarWidth: "none", scrollPaddingLeft: "12vw", scrollPaddingRight: "12vw" }}
            role="listbox"
            aria-label="Related vehicles"
          >
            {enhancedVehicles.map((vehicle) => {
              const slug = vehicle.id;
              const href = `/vehicle/${slug}`;

              return (
                <article
                  key={vehicle.id}
                  className="
                    group relative flex-shrink-0
                    w-[86vw] max-w-[520px]
                    sm:w-[70vw] sm:max-w-[560px]
                    md:w-[560px] lg:w-[680px] xl:w-[760px]
                    snap-center rounded-2xl
                  "
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl ring-1 ring-black/5 dark:ring-white/10 transition-all duration-300 hover:-translate-y-[2px]">
                    <Link to={href} aria-label={`Open ${vehicle.name}`}>
                      {/* Tighter mobile aspect so card isn't too tall */}
                      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-gray-50 dark:bg-gray-900">
                        <img
                          src={vehicle.image}
                          alt={vehicle.name}
                          loading="lazy"
                          decoding="async"
                          sizes="(max-width: 640px) 86vw, (max-width: 768px) 70vw, 680px"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_-36px_48px_-40px_rgb(0_0_0_/0.28)] rounded-b-2xl" />
                      </div>
                    </Link>

                    <div className="p-4 sm:p-5 md:p-6">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-lg sm:text-xl md:text-2xl text-gray-900 dark:text-white truncate">
                            {vehicle.name}
                          </h3>
                          {vehicle.category && (
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                              {vehicle.category}
                            </p>
                          )}
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
                            From
                          </p>
                          <p className="font-semibold text-toyota-red text-sm sm:text-base">
                            AED {AED.format(vehicle.price)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 sm:mt-5">
                        <Link
                          to={href}
                          className="
                            inline-flex w-full items-center justify-center rounded-lg sm:rounded-xl
                            px-4 py-2.5 sm:px-5 sm:py-3
                            bg-primary text-primary-foreground font-medium
                            hover:opacity-90 transition-opacity
                          "
                          aria-label={`View model ${vehicle.name}`}
                        >
                          View model
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Mobile-only subtle swipe hint (optional) */}
          <div className="md:hidden absolute -bottom-1 left-1/2 -translate-x-1/2 text-[11px] text-gray-500 dark:text-gray-400 select-none">
            Swipe to explore →
          </div>
        </div>
      </div>
    </section>
  );
};

export default RelatedVehicles;
