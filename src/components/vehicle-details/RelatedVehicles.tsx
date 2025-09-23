"use client"
import React, { useEffect, useRef, useState, createContext, useContext } from "react"
import { IconArrowNarrowLeft, IconArrowNarrowRight, IconX } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { useOutsideClick } from "@/hooks/use-outside-click"

interface CarouselProps {
  items: React.JSX.Element[]
  initialScroll?: number
}

type VehicleCard = {
  id: string
  name: string
  category: string
  price: number
  image: string
  content?: React.ReactNode
}

export const CarouselContext = createContext<{
  onCardClose: (index: number) => void
  currentIndex: number
}>({
  onCardClose: () => {},
  currentIndex: 0,
})

export const Carousel = ({ items, initialScroll = 0 }: CarouselProps) => {
  const carouselRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll
      checkScrollability()
    }
  }, [initialScroll])

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth)
    }
  }

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -280, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 280, behavior: "smooth" })
    }
  }

  const handleCardClose = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = isMobile() ? 280 : 320
      const gap = isMobile() ? 4 : 8
      const scrollPosition = (cardWidth + gap) * (index + 1)
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      })
      setCurrentIndex(index)
    }
  }

  const isMobile = () => {
    return window && window.innerWidth < 768
  }

  return (
    <CarouselContext.Provider value={{ onCardClose: handleCardClose, currentIndex }}>
      <div className="relative w-full">
        <div
          className="flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth py-6 [scrollbar-width:none] md:py-10"
          ref={carouselRef}
          onScroll={checkScrollability}
        >
          <div className={cn("absolute right-0 z-[1000] h-auto w-[5%] overflow-hidden bg-gradient-to-l")}></div>

          <div className={cn("flex flex-row justify-start gap-4 pl-4", "mx-auto max-w-7xl")}>
            {items.map((item, index) => (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: 0.1 * index,
                    ease: "easeOut",
                    once: true,
                  },
                }}
                key={"card" + index}
                className="rounded-2xl last:pr-[5%] md:last:pr-[33%]"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="mr-10 flex justify-end gap-2">
          <button
            className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50 hover:bg-gray-200 transition-colors"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
          >
            <IconArrowNarrowLeft className="h-6 w-6 text-gray-500" />
          </button>
          <button
            className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50 hover:bg-gray-200 transition-colors"
            onClick={scrollRight}
            disabled={!canScrollRight}
          >
            <IconArrowNarrowRight className="h-6 w-6 text-gray-500" />
          </button>
        </div>
      </div>
    </CarouselContext.Provider>
  )
}

export const VehicleCard = ({
  card,
  index,
  layout = false,
}: {
  card: VehicleCard
  index: number
  layout?: boolean
}) => {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { onCardClose, currentIndex } = useContext(CarouselContext)

  const AED = new Intl.NumberFormat("en-AE", { maximumFractionDigits: 0 })

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose()
      }
    }

    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open])

  useOutsideClick(containerRef, () => handleClose())

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    onCardClose(index)
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 h-screen overflow-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 h-full w-full bg-black/80 backdrop-blur-lg"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              ref={containerRef}
              layoutId={layout ? `card-${card.name}` : undefined}
              className="relative z-[60] mx-auto my-10 h-fit max-w-4xl rounded-3xl bg-white p-4 font-sans md:p-10 dark:bg-neutral-900"
            >
              <button
                className="sticky top-4 right-0 ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-black dark:bg-white"
                onClick={handleClose}
              >
                <IconX className="h-6 w-6 text-neutral-100 dark:text-neutral-900" />
              </button>
              <motion.p
                layoutId={layout ? `category-${card.name}` : undefined}
                className="text-base font-medium text-black dark:text-white"
              >
                {card.category}
              </motion.p>
              <motion.p
                layoutId={layout ? `title-${card.name}` : undefined}
                className="mt-4 text-2xl font-semibold text-neutral-700 md:text-4xl dark:text-white"
              >
                {card.name}
              </motion.p>
              <div className="mt-4 text-xl font-bold text-red-600">AED {AED.format(card.price)}</div>
              <div className="py-6">
                {card.content || (
                  <div className="bg-gray-50 dark:bg-neutral-800 p-6 rounded-2xl">
                    <p className="text-neutral-600 dark:text-neutral-400 text-base">
                      Discover the perfect blend of performance, style, and innovation with the {card.name}. Experience
                      luxury driving at its finest.
                    </p>
                    <div className="mt-6 flex gap-4">
                      <button className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                        View Details
                      </button>
                      <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Schedule Test Drive
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <motion.button
        layoutId={layout ? `card-${card.name}` : undefined}
        onClick={handleOpen}
        className="group relative z-10 flex h-64 w-72 flex-col items-start justify-end overflow-hidden rounded-2xl bg-gray-100 md:h-80 md:w-80 dark:bg-neutral-900 hover:shadow-xl transition-all duration-300"
      >
        <div className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="relative z-40 p-4 w-full">
          <motion.p
            layoutId={layout ? `category-${card.category}` : undefined}
            className="text-left font-sans text-xs font-medium text-white/80 md:text-sm uppercase tracking-wide"
          >
            {card.category}
          </motion.p>
          <motion.p
            layoutId={layout ? `title-${card.name}` : undefined}
            className="mt-1 text-left font-sans text-lg font-bold text-white md:text-xl leading-tight"
          >
            {card.name}
          </motion.p>
          <div className="mt-2 text-left">
            <span className="text-xs text-white/60">From</span>
            <div className="text-sm font-semibold text-white md:text-base">AED {AED.format(card.price)}</div>
          </div>
        </div>
        <BlurImage
          src={card.image}
          alt={card.name}
          fill
          className="absolute inset-0 z-10 object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </motion.button>
    </>
  )
}

export const BlurImage = ({
  height,
  width,
  src,
  className,
  alt,
  fill,
  ...rest
}: {
  height?: number
  width?: number
  src: string
  className?: string
  alt?: string
  fill?: boolean
  [key: string]: any
}) => {
  const [isLoading, setLoading] = useState(true)
  return (
    <img
      className={cn(
        "transition duration-300",
        isLoading ? "blur-sm" : "blur-0",
        fill ? "h-full w-full object-cover" : "",
        className,
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
  )
}

const RelatedVehicles = () => {
  return <div>Related Vehicles Component</div>;
};

export default RelatedVehicles;