"use client";
import React, { useEffect, useRef, useState, createContext, useContext } from "react";
import { IconArrowNarrowLeft, IconArrowNarrowRight, IconX } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";

/* ---------- utils ---------- */
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
const isBrowser = typeof window !== "undefined";

/* ---------- outside click hook (fallback if your project hook differs) ---------- */
function useOutsideClick<T extends HTMLElement>(ref: React.RefObject<T>, handler: () => void) {
  useEffect(() => {
    function listener(e: MouseEvent) {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler();
    }
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}

/* ---------- Context ---------- */
interface CarouselProps {
  items: React.JSX.Element[];
  initialScroll?: number;
  /** amount of px to scroll on arrow click (defaults to cardWidth + gap) */
  scrollByPx?: number;
}

type VehicleCardT = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  content?: React.ReactNode;
};

export const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
}>({
  onCardClose: () => {},
  currentIndex: 0,
});

/* ========================================================================== */
/*                                Carousel                                    */
/* ========================================================================== */
export const Carousel = ({ items, initialScroll = 0, scrollByPx }: CarouselProps) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // card width & gap must match the classes used below on the card wrapper
  const CARD_WIDTH = isBrowser && window.innerWidth < 768 ? 320 : 380; // wider than before
  const GAP = isBrowser && window.innerWidth < 768 ? 12 : 16;

  useEffect(() => {
    if (!viewportRef.current) return;
    viewportRef.current.scrollLeft = initialScroll;
    checkScrollability();
    // observe size changes to keep arrows accurate
    const ro = new ResizeObserver(checkScrollability);
    ro.observe(viewportRef.current);
    if (isBrowser) window.addEventListener("resize", checkScrollability);
    return () => {
      ro.disconnect();
      if (isBrowser) window.removeEventListener("resize", checkScrollability);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkScrollability = () => {
    const el = viewportRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  const handleScroll = () => checkScrollability();

  const scrollLeft = () => {
    const el = viewportRef.current;
    if (!el) return;
    el.scrollBy({ left: -(scrollByPx ?? CARD_WIDTH + GAP), behavior: "smooth" });
  };

  const scrollRight = () => {
    const el = viewportRef.current;
    if (!el) return;
    el.scrollBy({ left: (scrollByPx ?? CARD_WIDTH + GAP), behavior: "smooth" });
  };

  const handleCardClose = (index: number) => {
    const el = viewportRef.current;
    if (!el) return;
    const target = (CARD_WIDTH + GAP) * Math.max(0, index - 1);
    el.scrollTo({ left: target, behavior: "smooth" });
    setCurrentIndex(index);
  };

  return (
    <CarouselContext.Provider value={{ onCardClose: handleCardClose, currentIndex }}>
      <div className="relative w-full">
        {/* Left fade */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute left-0 top-0 z-20 h-full w-10 bg-gradient-to-r from-white to-transparent dark:from-neutral-950",
            !canScrollLeft && "opacity-0"
          )}
        />
        {/* Right fade */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute right-0 top-0 z-20 h-full w-10 bg-gradient-to-l from-white to-transparent dark:from-neutral-950",
            !canScrollRight && "opacity-0"
          )}
        />

        <div className="relative w-full">
          <div
            ref={viewportRef}
            onScroll={handleScroll}
            className={cn(
              // horizontal layout with multiple cards visible
              "flex w-full snap-x snap-mandatory gap-3 md:gap-4 overflow-x-auto scroll-smooth py-6 md:py-8",
              // hide scrollbars cross-browser
              "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            )}
          >
            {/* Use full width; remove max-w clamps that squeezed to one card */}
            <div className="flex min-w-full items-stretch">
              {items.map((item, index) => (
                <motion.div
                  key={"card" + index}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.06 * index, ease: "easeOut" }}
                  // fixed basis ensures multiple cards appear in viewport
                  className={cn(
                    "snap-start flex-none",
                    // Bigger cards: width matches CARD_WIDTH above
                    "w-[320px] md:w-[380px]",
                    "mx-1"
                  )}
                >
                  {item}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Arrows */}
          <div className="pointer-events-none absolute inset-x-0 -top-3 md:-top-4 flex items-center justify-end gap-2 px-4">
            <button
              type="button"
              aria-label="Scroll left"
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              className={cn(
                "pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200 disabled:opacity-40 dark:bg-neutral-800 dark:hover:bg-neutral-700"
              )}
            >
              <IconArrowNarrowLeft className="h-6 w-6 text-gray-700 dark:text-gray-200" />
            </button>
            <button
              type="button"
              aria-label="Scroll right"
              onClick={scrollRight}
              disabled={!canScrollRight}
              className={cn(
                "pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200 disabled:opacity-40 dark:bg-neutral-800 dark:hover:bg-neutral-700"
              )}
            >
              <IconArrowNarrowRight className="h-6 w-6 text-gray-700 dark:text-gray-200" />
            </button>
          </div>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

/* ========================================================================== */
/*                               VehicleCard                                   */
/*  - Bigger, clearer text                                                     */
/*  - layoutId keys aligned                                                    */
/*  - modal scroll lock fixed                                                  */
/* ========================================================================== */
export const VehicleCard = ({
  card,
  index,
  layout = false,
}: {
  card: VehicleCardT;
  index: number;
  layout?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { onCardClose } = useContext(CarouselContext);

  const AED = new Intl.NumberFormat("en-AE", { maximumFractionDigits: 0 });

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") handleClose();
    }
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  useOutsideClick(containerRef, () => handleClose());

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    onCardClose(index);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[60]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              ref={containerRef}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              layoutId={layout ? `card-${card.id}` : undefined}
              className="relative z-[70] mx-auto my-8 w-[min(92vw,900px)] rounded-3xl bg-white p-5 md:p-8 shadow-xl dark:bg-neutral-900"
            >
              <button
                type="button"
                aria-label="Close"
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black"
                onClick={handleClose}
              >
                <IconX className="h-5 w-5" />
              </button>

              <motion.p
                layoutId={layout ? `category-${card.id}` : undefined}
                className="text-xs font-semibold uppercase tracking-wide text-neutral-600 dark:text-neutral-300"
              >
                {card.category}
              </motion.p>
              <motion.h3
                layoutId={layout ? `title-${card.id}` : undefined}
                className="mt-1 text-2xl font-bold text-neutral-900 md:text-4xl dark:text-white"
              >
                {card.name}
              </motion.h3>
              <div className="mt-2 text-lg font-bold text-red-600">AED {AED.format(card.price)}</div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800">
                  <BlurImage
                    src={card.image}
                    alt={card.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="rounded-2xl bg-gray-50 p-5 dark:bg-neutral-800">
                  {card.content || (
                    <>
                      <p className="text-sm leading-6 text-neutral-700 dark:text-neutral-300">
                        Discover the perfect blend of performance, style, and innovation with the {card.name}. Experience luxury driving at its finest.
                      </p>
                      <div className="mt-5 flex flex-wrap gap-3">
                        <button className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200">
                          View Details
                        </button>
                        <button className="rounded-lg border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-700">
                          Schedule Test Drive
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Card (bigger) */}
      <motion.button
        type="button"
        onClick={handleOpen}
        layoutId={layout ? `card-${card.id}` : undefined}
        className={cn(
          "group relative flex h-[360px] w-[320px] flex-col justify-end overflow-hidden rounded-2xl md:h-[420px] md:w-[380px]",
          "bg-neutral-900 text-left shadow-sm transition-all duration-300 hover:shadow-lg"
        )}
      >
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
        <div className="relative z-20 p-4 md:p-5">
          <motion.p
            layoutId={layout ? `category-${card.id}` : undefined}
            className="text-[11px] font-semibold uppercase tracking-wider text-white/80"
          >
            {card.category}
          </motion.p>
          <motion.p
            layoutId={layout ? `title-${card.id}` : undefined}
            className="mt-0.5 line-clamp-2 text-lg font-bold leading-tight text-white md:text-xl"
          >
            {card.name}
          </motion.p>
          <div className="mt-2">
            <span className="text-[11px] text-white/70">From</span>
            <div className="text-sm font-semibold text-white">AED {AED.format(card.price)}</div>
          </div>
        </div>
        <BlurImage
          src={card.image}
          alt={card.name}
          className="absolute inset-0 z-0 h-full w-full scale-100 object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </motion.button>
    </>
  );
};

/* ========================================================================== */
/*                               BlurImage                                     */
/* ========================================================================== */
export const BlurImage = ({
  height,
  width,
  src,
  className,
  alt,
  fill,
  ...rest
}: {
  height?: number;
  width?: number;
  src: string;
  className?: string;
  alt?: string;
  fill?: boolean;
  [key: string]: any;
}) => {
  const [isLoading, setLoading] = useState(true);
  return (
    <img
      className={cn(
        "transition duration-300",
        isLoading ? "blur-sm" : "blur-0",
        fill ? "h-full w-full object-cover" : "",
        className
      )}
      onLoad={() => setLoading(false)}
      src={src || "/placeholder.svg"}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      alt={alt || "Vehicle image"}
      {...rest}
    />
  );
};

/* ========================================================================== */
/*                           Example wrapper export                            */
/* ========================================================================== */
const RelatedVehicles = () => {
  return <div>Related Vehicles Component</div>;
};
export default RelatedVehicles;
