import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehicleModel } from "@/types/vehicle";
import { vehicles } from "@/data/vehicles";
import { Link } from "react-router-dom";
import { useSwipeable } from "@/hooks/use-swipeable";
import { cn } from "@/lib/utils"; // if you have cn; else remove

interface RelatedVehiclesProps {
  currentVehicle: VehicleModel;
  className?: string;
  title?: string;
}

const AED = new Intl.NumberFormat("en-AE", { maximumFractionDigits: 0 });

const RelatedVehicles: React.FC<RelatedVehiclesProps> = ({
  currentVehicle,
  className,
  title = "You Might Also Like",
}) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Get vehicles in the same category or similar price range
  const relatedVehicles = React.useMemo(
    () =>
      vehicles
        .filter(
          (vehicle) =>
            vehicle.name !== currentVehicle.name &&
            (vehicle.category === currentVehicle.category ||
              Math.abs(vehicle.price - currentVehicle.price) < 30000)
        )
        .slice(0, 6),
    [currentVehicle]
  );

  // Enhanced car images for related vehicles (fallbacks / DAM samples)
  const enhancedVehicles = React.useMemo(() => {
    const carImages = [
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/a5bffab2-6c0d-4698-bfe7-b4ab7114ec03/items/718fe2b9-69dc-49cb-ab72-7a714fe09c7c/renditions/4afae9e9-eae7-4c29-b479-3e81915738fa?binary=true&mformat=true",
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b617024c-790e-4264-99ad-b567a5abd42f/items/050d2454-b898-4f27-996b-da16f414dc8e/renditions/b7523349-2c02-4fd7-b04b-d016375ef61c?binary=true&mformat=true",
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/1a74e5e6-9eda-4f96-8fdc-b058fcabcf91/items/beab9d5e-f876-416c-87d4-bff470a14bb6/renditions/24c3483d-c6f5-4232-b6a9-428586545c9e?binary=true&mformat=true",
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b376e31a-ea8e-4cfc-a37c-76facfe281fb/items/d62b7086-fa7a-4867-bf76-3243fc018d7b/renditions/10f89ffa-4588-4cf3-b421-379905d8d95c?binary=true&mformat=true",
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/9c85f040-9909-4849-a7ae-ec4ad5e58fc9/items/c3299bde-9daf-4e4c-b414-b6fd46451f1a/renditions/5625cce1-79a1-4c27-9782-1c159c91669c?binary=true&mformat=true",
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/aa687942-b6eb-4c47-b8c8-307ef0fbea09/items/362c4e6c-953c-4532-8b1b-e31dd9948f60/renditions/716f5b2f-42f4-4419-baa8-9e8207d332fd?binary=true&mformat=true",
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/60c33b57-b0c0-4c7d-8ac0-2e5e0b482da9/items/0fb9bbea-94e8-401f-ae80-138334d54472/renditions/df97b136-cd9b-4cc2-a5d8-467adfa27bfc?binary=true&mformat=true",
    ];

    return relatedVehicles.map((vehicle, index) => ({
      ...vehicle,
      image: (vehicle as any).image ?? carImages[index % carImages.length],
    }));
  }, [relatedVehicles]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const amount = direction === "left" ? -420 : 420;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  // Swipe support (mobile)
  const swipeableRef = useSwipeable({
    onSwipeLeft: () => scroll("right"),
    onSwipeRight: () => scroll("left"),
    threshold: 50,
    preventDefaultTouchmoveEvent: false,
  });

  // Bind both refs safely
  const bindScrollable = (el: HTMLDivElement | null) => {
    scrollContainerRef.current = el || null;
    if (swipeableRef && "current" in swipeableRef) {
      swipeableRef.current = el as any;
    }
  };

  if (!enhancedVehicles.length) return null;

  return (
    <section className={cn("py-12", className)}>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => scroll("left")}
            aria-label="Scroll related vehicles left"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => scroll("right")}
            aria-label="Scroll related vehicles right"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="relative">
        {/* Edge gradients to hint scrollability */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background to-transparent z-10 rounded-l-2xl" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent z-10 rounded-r-2xl" />

        <div
          ref={bindScrollable}
          className="
            flex gap-6 overflow-x-auto pb-4 pr-2 pl-2
            snap-x snap-mandatory
            scroll-smooth
            hide-scrollbar
          "
          style={{ scrollbarWidth: "none" }}
          role="listbox"
          aria-label="Related vehicles"
        >
          {enhancedVehicles.map((vehicle) => {
            const slug = vehicle.name.toLowerCase().replace(/\s+/g, "-");
            const href = `/vehicle/${slug}`;

            return (
              <article
                key={vehicle.name}
                className="
                  group relative flex-shrink-0
                  w-[85vw] max-w-[520px]
                  md:w-[420px] lg:w-[460px] xl:w-[500px]
                  snap-start
                  focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary
                  rounded-2xl
                "
                data-card="true"
                aria-label={`${vehicle.name} ${vehicle.category ?? ""}`}
              >
                <div
                  className="
                    bg-white dark:bg-gray-800 rounded-2xl overflow-hidden
                    shadow-sm hover:shadow-xl
                    ring-1 ring-black/5 dark:ring-white/10
                    transition-all duration-300
                  "
                >
                  {/* Media */}
                  <Link to={href} aria-label={`Open ${vehicle.name}`}>
                    <div className="relative w-full aspect-[16/9] bg-gray-50 dark:bg-gray-900">
                      <img
                        src={(vehicle as any).image}
                        alt={vehicle.name}
                        loading="lazy"
                        decoding="async"
                        className="
                          absolute inset-0 w-full h-full object-contain
                          transition-transform duration-300 group-hover:scale-[1.02]
                          [image-rendering:-webkit-optimize-contrast]
                        "
                      />
                      {/* subtle bottom gradient for text separation */}
                      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_-36px_48px_-36px_rgb(0_0_0_/0.25)] rounded-b-2xl" />
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
                          {vehicle.name}
                        </h3>
                        {vehicle.category ? (
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {vehicle.category}
                          </p>
                        ) : null}
                      </div>

                      {/* Price */}
                      <div className="text-right shrink-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          From
                        </p>
                        <p className="font-semibold text-toyota-red">
                          AED {AED.format(vehicle.price)}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex items-center gap-3">
                      <Button asChild className="w-full">
                        <Link to={href} aria-label={`View model ${vehicle.name}`}>
                          View model
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RelatedVehicles;
