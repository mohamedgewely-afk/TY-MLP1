import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehicleModel } from "@/types/vehicle";
import { vehicles } from "@/data/vehicles";
import { Link } from "react-router-dom";
import { useSwipeable } from "@/hooks/use-swipeable";

interface RelatedVehiclesProps {
  currentVehicle: VehicleModel;
}

const CARD_GAP_PX = 24; // Tailwind space-x-6

const RelatedVehicles: React.FC<RelatedVehiclesProps> = ({ currentVehicle }) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  // Get vehicles in the same category or similar price range
  const relatedVehicles = React.useMemo(
    () =>
      vehicles
        .filter(
          (v) =>
            v.name !== currentVehicle.name &&
            (v.category === currentVehicle.category ||
              Math.abs(v.price - currentVehicle.price) < 30000)
        )
        .slice(0, 6),
    [currentVehicle]
  );

  // Enhanced car images for related vehicles (you can replace with real DAM per model)
  const enhancedVehicles = React.useMemo(() => {
    const carImages = [
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/a5bffab2-6c0d-4698-bfe7-b4ab7114ec03/items/718fe2b9-69dc-49cb-ab72-7a714fe09c7c/renditions/4afae9e9-eae7-4c29-b479-3e81915738fa?binary=true&mformat=true",
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b617024c-790e-4264-99ad-b567a5abd42f/items/050d2454-b898-4f27-996b-da16f414dc8e/renditions/b7523349-2c02-4fd7-b04b-d016375ef61c?binary=true&mformat=true",
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/1a74e5e6-9eda-4f96-8fdc-b058fcabcf91/items/beab9d5e-f876-416c-87d4-bff470a14bb6/renditions/24c3483d-c6f5-4232-b6a9-428586545c9e?binary=true&mformat=true",
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b376e31a-ea8e-4cfc-a37c-76facfe281fb/items/d62b7086-fa7a-4867-bf76-3243fc018d7b/renditions/10f89ffa-4588-4cf3-b421-379905d8d95c?binary=true&mformat=true",
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/9c85f040-9909-4849-a7ae-ec4ad5e58fc9/items/c3299bde-9daf-4e4c-b414-b6fd46451f1a/renditions/5625cce1-79a1-4c27-9782-1c159c91669c?binary=true&mformat=true",
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/aa687942-b6eb-4c47-b8c8-307ef0fbea09/items/362c4e6c-953c-4532-8b1b-e31dd9948f60/renditions/716f5b2f-42f4-4419-baa8-9e8207d332fd?binary=true&mformat=true",
    ];
    return relatedVehicles.map((vehicle, index) => ({
      ...vehicle,
      image: carImages[index % carImages.length],
    }));
  }, [relatedVehicles]);

  const updateScrollState = React.useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < maxScrollLeft - 1);
  }, []);

  React.useEffect(() => {
    updateScrollState();
    const el = scrollContainerRef.current;
    if (!el) return;
    const onScroll = () => updateScrollState();
    el.addEventListener("scroll", onScroll, { passive: true });
    const onResize = () => updateScrollState();
    window.addEventListener("resize", onResize);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [updateScrollState]);

  const scrollByCards = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    // Scroll by ~1.25 cards
    const oneCard =
      (el.querySelector<HTMLElement>("[data-card]")?.offsetWidth || 360) +
      CARD_GAP_PX;
    const amount = direction === "left" ? -oneCard * 1.25 : oneCard * 1.25;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  // Keyboard arrows support when container is focused
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollByCards("left");
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollByCards("right");
    }
  };

  // Swipe support
  const swipeableRef = useSwipeable({
    onSwipeLeft: () => scrollByCards("right"),
    onSwipeRight: () => scrollByCards("left"),
    threshold: 50,
    preventDefaultTouchmoveEvent: false,
  });

  return (
    <div className="toyota-container py-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          You Might Also Like
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => scrollByCards("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => scrollByCards("right")}
            disabled={!canScrollRight}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="relative">
        {/* Left/Right edge fade */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10" />

        <div
          ref={(el) => {
            scrollContainerRef.current = el;
            if (swipeableRef.current !== el) swipeableRef.current = el;
          }}
          tabIndex={0}
          onKeyDown={onKeyDown}
          className="
            relative overflow-x-auto pb-4
            snap-x snap-mandatory
            hide-scrollbar
            scroll-smooth
          "
          style={{ scrollbarWidth: "none" }}
          aria-label="Related vehicles"
          role="listbox"
        >
          <div className="flex space-x-6">
            {enhancedVehicles.map((vehicle) => {
              const slug = vehicle.name.toLowerCase().replace(/\s+/g, "-");
              return (
                <Link
                  key={vehicle.name}
                  to={`/vehicle/${slug}`}
                  data-card
                  className="
                    flex-shrink-0
                    w-[85vw] max-w-[520px]
                    md:w-[420px] lg:w-[460px] xl:w-[500px]
                    snap-start
                    focus:outline-none
                    card-zoom-effect
                  "
                  role="option"
                  aria-label={`${vehicle.name} - ${vehicle.category}`}
                  prefetch="intent"
                >
                  <div
                    className="
                      bg-white dark:bg-gray-800 rounded-2xl overflow-hidden
                      shadow-md hover:shadow-xl focus:shadow-xl
                      transition-all duration-300 group
                      ring-1 ring-black/5 dark:ring-white/10
                    "
                  >
                    {/* Aspect-ratio box (16:9) with object-contain to show full image */}
                    <div className="relative w-full aspect-[16/9] bg-gray-50 dark:bg-gray-900">
                      <img
                        src={vehicle.image}
                        alt={vehicle.name}
                        loading="lazy"
                        decoding="async"
                        className="
                          absolute inset-0 w-full h-full object-contain
                          transition-transform duration-300 group-hover:scale-[1.02]
                          [image-rendering:-webkit-optimize-contrast]
                        "
                      />
                      {/* subtle shadow vignette for depth */}
                      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_-30px_40px_-30px_rgb(0_0_0_/0.25)] rounded-b-2xl" />
                    </div>

                    <div className="p-5">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-0.5 line-clamp-1">
                        {vehicle.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
                        {vehicle.category}
                      </p>
                      <p className="font-semibold text-toyota-red">
                        From AED {vehicle.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Floating chevrons on large screens */}
        <div className="hidden md:block">
          <Button
            variant="secondary"
            size="icon"
            className="
              absolute top-1/2 -translate-y-1/2 left-2 z-20 rounded-full
              shadow-md
            "
            onClick={() => scrollByCards("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="
              absolute top-1/2 -translate-y-1/2 right-2 z-20 rounded-full
              shadow-md
            "
            onClick={() => scrollByCards("right")}
            disabled={!canScrollRight}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RelatedVehicles;
