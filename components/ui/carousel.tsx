"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"

import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

/**
 * Blocks carousel, on Embla. Slides sit edge to edge with a 16px gap; the
 * previous and next controls are outline icon buttons and CarouselDots
 * shows where you are, with the current slide drawn as a short ink pill.
 *
 * Controls hang outside the slides by default. To place them elsewhere (for
 * example in a header row), pass className="static" and lay them out yourself.
 */

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  scrollTo: (index: number) => void
  canScrollPrev: boolean
  canScrollNext: boolean
  /** Index of the selected snap point. */
  selectedIndex: number
  /** Number of snap points (pages), not necessarily the number of slides. */
  snapCount: number
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins
  )
  // Embla is the source of truth: read its state as an external store, encoded
  // as one string so the snapshot stays stable between events.
  const subscribe = React.useCallback(
    (onChange: () => void) => {
      if (!api) return () => {}
      api.on("reInit", onChange)
      api.on("select", onChange)
      return () => {
        api.off("reInit", onChange)
        api.off("select", onChange)
      }
    },
    [api]
  )
  const snapshot = React.useSyncExternalStore(
    subscribe,
    () =>
      api
        ? [
            Number(api.canScrollPrev()),
            Number(api.canScrollNext()),
            api.selectedScrollSnap(),
            api.scrollSnapList().length,
          ].join(":")
        : "0:0:0:0",
    () => "0:0:0:0"
  )
  const [prevFlag, nextFlag, selectedIndex, snapCount] = snapshot
    .split(":")
    .map(Number)
  const canScrollPrev = prevFlag === 1
  const canScrollNext = nextFlag === 1

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = React.useCallback(() => {
    api?.scrollNext()
  }, [api])

  const scrollTo = React.useCallback(
    (index: number) => {
      api?.scrollTo(index)
    },
    [api]
  )

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const prevKey = orientation === "vertical" ? "ArrowUp" : "ArrowLeft"
      const nextKey = orientation === "vertical" ? "ArrowDown" : "ArrowRight"
      if (event.key === prevKey) {
        event.preventDefault()
        scrollPrev()
      } else if (event.key === nextKey) {
        event.preventDefault()
        scrollNext()
      }
    },
    [orientation, scrollPrev, scrollNext]
  )

  React.useEffect(() => {
    if (api && setApi) setApi(api)
  }, [api, setApi])

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api,
        opts,
        orientation,
        scrollPrev,
        scrollNext,
        scrollTo,
        canScrollPrev,
        canScrollNext,
        selectedIndex,
        snapCount,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn("group/carousel relative", className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        data-orientation={orientation}
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div
      ref={carouselRef}
      className="overflow-hidden"
      data-slot="carousel-content"
    >
      <div
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  )
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  const { orientation } = useCarousel()

  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  )
}

const controls = {
  previous: {
    icon: ChevronLeftIcon,
    label: "Previous Slide",
    horizontal: "inset-y-0 -left-12 my-auto",
    vertical: "-top-12 left-1/2 -translate-x-1/2 rotate-90",
  },
  next: {
    icon: ChevronRightIcon,
    label: "Next Slide",
    horizontal: "inset-y-0 -right-12 my-auto",
    vertical: "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
  },
} as const

/** The previous or next button: an outline icon button outside the slides. */
function CarouselControl({
  direction,
  className,
  variant = "outline",
  size = "icon-sm",
  ...props
}: React.ComponentProps<typeof Button> & {
  direction: keyof typeof controls
}) {
  const { orientation, scrollPrev, scrollNext, canScrollPrev, canScrollNext } =
    useCarousel()
  const { icon: Icon, label, horizontal, vertical } = controls[direction]
  const previous = direction === "previous"

  return (
    <Button
      data-slot={`carousel-${direction}`}
      variant={variant}
      size={size}
      className={cn(
        "absolute touch-manipulation disabled:opacity-35",
        orientation === "horizontal" ? horizontal : vertical,
        className
      )}
      disabled={previous ? !canScrollPrev : !canScrollNext}
      onClick={previous ? scrollPrev : scrollNext}
      {...props}
    >
      <Icon />
      <span className="sr-only">{label}</span>
    </Button>
  )
}

function CarouselPrevious(props: React.ComponentProps<typeof Button>) {
  return <CarouselControl direction="previous" {...props} />
}

function CarouselNext(props: React.ComponentProps<typeof Button>) {
  return <CarouselControl direction="next" {...props} />
}

/**
 * One dot per page. The current page stretches into a short ink pill.
 * On a dark panel pass tone="inverse".
 */
function CarouselDots({
  className,
  tone = "default",
  ...props
}: React.ComponentProps<"div"> & { tone?: "default" | "inverse" }) {
  const { snapCount, selectedIndex, scrollTo } = useCarousel()

  if (snapCount < 2) return null

  return (
    <div
      data-slot="carousel-dots"
      data-tone={tone}
      className={cn("flex items-center justify-center gap-1", className)}
      {...props}
    >
      {Array.from({ length: snapCount }, (_, index) => {
        const selected = index === selectedIndex
        return (
          <button
            key={index}
            type="button"
            data-slot="carousel-dot"
            data-selected={selected || undefined}
            aria-label={`Go to slide ${index + 1} of ${snapCount}`}
            aria-current={selected ? "true" : undefined}
            onClick={() => scrollTo(index)}
            className="group/dot grid h-6 min-w-4 place-items-center rounded-full outline-none focus-visible:focus-ring"
          >
            <span
              aria-hidden="true"
              className={cn(
                "block h-1.5 w-1.5 rounded-full transition-[width,background-color] duration-(--duration-base) ease-out",
                tone === "inverse"
                  ? "bg-panel-foreground/30 group-hover/dot:bg-panel-foreground/60"
                  : "bg-border-strong group-hover/dot:bg-muted-foreground",
                selected &&
                  (tone === "inverse"
                    ? "w-5 bg-panel-foreground group-hover/dot:bg-panel-foreground"
                    : "w-5 bg-foreground group-hover/dot:bg-foreground")
              )}
            />
          </button>
        )
      })}
    </div>
  )
}

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
  useCarousel,
}
