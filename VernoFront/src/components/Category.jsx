import { useRef, useEffect } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TILES = [
  {
    id: "left",
    eyebrow: "Tailored Elegance",
    title: "Where craft meets confidence",
    img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200&auto=format&fit=crop",
    size: "large",
    fill: "#7fb0e0",
  },
  {
    id: "top-right",
    eyebrow: "Everyday Ease",
    title: "Refined layers for every day",
    img: "https://images.unsplash.com/photo-1618354691792-d1d42acfd860?q=80&w=900&auto=format&fit=crop",
    size: "small",
    fill: "#f6cfa0",
  },
  {
    id: "bottom-right",
    eyebrow: "Cold Weather",
    title: "Outerwear built for the season",
    img: "https://images.unsplash.com/photo-1544923246-77307dd654cb?q=80&w=900&auto=format&fit=crop",
    size: "small",
    fill: "#c9d4f7",
  },
];

const TITLE_CHIP_IMG =
  "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400";

function Tile({ tile, className = "", onCursorEnter, onCursorLeave, onCursorMove }) {
  const rootRef = useRef(null);
  const overlayRef = useRef(null);
  const overlayCopyRef = useRef(null);
  const lastPoint = useRef({ x: 50, y: 50 });

  // Scroll-in reveal (image zoom + copy fade), unrelated to the hover fill.
  useEffect(() => {
    if (!rootRef.current) return;
    const img = rootRef.current.querySelector("[data-tile-img]");
    const copy = rootRef.current.querySelectorAll("[data-tile-copy]");

    gsap.set(img, { scale: 1.12 });
    gsap.set(copy, { opacity: 0, y: 16 });

    const st = ScrollTrigger.create({
      trigger: rootRef.current,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(img, { scale: 1, duration: 1.1, ease: "power3.out" });
        gsap.to(copy, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.08, delay: 0.1 });
      },
    });

    return () => st.kill();
  }, []);

  const pointFromEvent = (e) => {
    const rect = rootRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    return { x, y };
  };

  const handleEnter = (e) => {
    const { x, y } = pointFromEvent(e);
    lastPoint.current = { x, y };

    gsap.set(overlayRef.current, { clipPath: `circle(0% at ${x}% ${y}%)` });
    gsap.to(overlayRef.current, {
      clipPath: `circle(140% at ${x}% ${y}%)`,
      duration: 0.55,
      ease: "power2.out",
    });
    gsap.to(overlayCopyRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      delay: 0.15,
      ease: "power2.out",
    });

    onCursorEnter?.();
  };

  const handleMove = (e) => {
    onCursorMove?.(e);
  };

  const handleLeave = () => {
    const { x, y } = lastPoint.current;
    gsap.to(overlayRef.current, {
      clipPath: `circle(0% at ${x}% ${y}%)`,
      duration: 0.4,
      ease: "power2.in",
    });
    gsap.to(overlayCopyRef.current, { opacity: 0, y: 10, duration: 0.25, ease: "power2.in" });

    onCursorLeave?.();
  };

  return (
    <a
      href="#"
      ref={rootRef}
      data-tile
      onMouseEnter={handleEnter}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`group relative block cursor-none overflow-hidden bg-brand-gray-800 ${className}`}
    >
      <img
        data-tile-img
        src={tile.img}
        alt={tile.title}
        loading="lazy"
        className="h-full w-full object-cover"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-black/85 via-brand-black/25 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
        <span
          data-tile-copy
          className="font-montserrat text-[11px] font-medium uppercase tracking-[0.22em] text-brand-blue-300"
        >
          {tile.eyebrow}
        </span>

        <h3
          data-tile-copy
          className={`mt-2 font-grotesk font-semibold leading-[1.15] text-brand-gray-100 ${
            tile.size === "large" ? "text-2xl sm:text-3xl lg:text-4xl" : "text-xl sm:text-2xl"
          }`}
        >
          {tile.title}
        </h3>

        <span
          data-tile-copy
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-blue-600 px-5 py-2.5 font-montserrat text-xs font-medium text-brand-gray-100"
        >
          Shop now
          <ArrowRight size={14} strokeWidth={2} />
        </span>
      </div>

      {/* Speedy color-fill overlay — expands from the cursor's entry point */}
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-6 sm:p-8"
        style={{ backgroundColor: tile.fill, clipPath: "circle(0% at 50% 50%)" }}
      >
        <div ref={overlayCopyRef} className="flex flex-1 flex-col justify-between opacity-0">
          <span className="font-montserrat text-[11px] font-medium uppercase tracking-[0.22em] text-brand-black/70">
            {tile.eyebrow}
          </span>

          <div className="flex items-end justify-between gap-4">
            <h3
              className={`font-grotesk font-semibold leading-[1.1] text-brand-black ${
                tile.size === "large" ? "text-2xl sm:text-3xl lg:text-4xl" : "text-xl sm:text-2xl"
              }`}
            >
              {tile.title}
            </h3>
            <ArrowUpRight
              size={28}
              strokeWidth={2}
              className="shrink-0 text-brand-black"
            />
          </div>
        </div>
      </div>
    </a>
  );
}

export default function CategoryShowcase() {
  const [left, topRight, bottomRight] = TILES;

  const sectionRef = useRef(null);
  const eyebrowRef = useRef(null);
  const word1Ref = useRef(null);
  const chipRef = useRef(null);
  const word2Ref = useRef(null);
  const ctaBtnRef = useRef(null);
  const dividerRef = useRef(null);

  const cursorRef = useRef(null);
  const cursorQuickTo = useRef(null);
  const isOverTile = useRef(false);

  useEffect(() => {
    if (!cursorRef.current) return;
    cursorQuickTo.current = {
      x: gsap.quickTo(cursorRef.current, "x", { duration: 0.35, ease: "power3.out" }),
      y: gsap.quickTo(cursorRef.current, "y", { duration: 0.35, ease: "power3.out" }),
    };
  }, []);

  // Header entrance — clip-path wipes for the title words and image chip,
  // fades for the eyebrow/CTA, a scaleX sweep for the divider. Plays once.
  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.set([eyebrowRef.current, ctaBtnRef.current], { opacity: 0, y: 16 });
    gsap.set([word1Ref.current, word2Ref.current], { clipPath: "inset(0 100% 0 0)" });
    gsap.set(chipRef.current, { clipPath: "inset(50% 50% 50% 50%)", scale: 0.6 });
    gsap.set(dividerRef.current, { scaleX: 0, transformOrigin: "left center" });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: sectionRef.current, start: "top 78%", once: true },
      defaults: { ease: "power3.out" },
    });

    tl.to(word1Ref.current, { clipPath: "inset(0 0% 0 0)", duration: 0.7 })
      .to(
        chipRef.current,
        { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 0.6, ease: "power2.out" },
        "-=0.45"
      )
      .to(word2Ref.current, { clipPath: "inset(0 0% 0 0)", duration: 0.7 }, "-=0.4")
      .to(ctaBtnRef.current, { opacity: 1, y: 0, duration: 0.5 }, "-=0.35")
      .to(dividerRef.current, { scaleX: 1, duration: 0.7, ease: "power2.inOut" }, "-=0.3")
      .to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.5 }, "-=0.35");

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, []);

  const moveCursor = (e) => {
    cursorQuickTo.current?.x(e.clientX);
    cursorQuickTo.current?.y(e.clientY);
  };

  const showCursor = () => {
    isOverTile.current = true;
    gsap.to(cursorRef.current, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" });
  };

  const hideCursor = () => {
    isOverTile.current = false;
    gsap.to(cursorRef.current, { opacity: 0, scale: 0.5, duration: 0.25, ease: "power2.in" });
  };

  return (
    <section
      ref={sectionRef}
      className="w-full bg-brand-black px-6 py-24 sm:px-10 lg:px-16 xl:px-20"
    >
      {/* Custom cursor — mint circle with arrow, follows pointer over tiles */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-50 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full opacity-0"
        style={{ willChange: "transform", backgroundColor: "#b8f5df" }}
      >
        <ArrowUpRight size={26} strokeWidth={2} className="text-brand-black" />
      </div>

      {/* Header — same treatment as New Arrivals: bold non-italic title with an inline chip */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="flex items-center font-grotesk text-4xl font-bold leading-none text-brand-gray-100 sm:text-5xl lg:text-6xl">
          <span ref={word1Ref} className="inline-block">
            Shop
          </span>
          <span
            ref={chipRef}
            className="mx-3 inline-block h-[0.85em] w-[0.85em] shrink-0 overflow-hidden rounded-2xl align-middle sm:mx-4"
          >
            <img src={TITLE_CHIP_IMG} alt="" className="h-full w-full object-cover" />
          </span>
          <span ref={word2Ref} className="inline-block">
            the edit
          </span>
        </h2>

        <a
          ref={ctaBtnRef}
          href="#"
          className="group inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-full bg-brand-gray-100 px-6 py-3.5 font-montserrat text-sm font-medium text-brand-black transition-colors duration-300 hover:bg-brand-blue-300"
        >
          View all categories
          <ArrowUpRight
            size={16}
            strokeWidth={2}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      </div>

      <div ref={dividerRef} className="mt-10 border-t border-brand-gray-700" />

      <div ref={eyebrowRef} className="mt-6 text-center">
        <span className="font-montserrat text-xs font-medium uppercase tracking-[0.25em] text-brand-blue-400">
          SS26 Collection
        </span>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
        {/* Left — one large tile */}
        <Tile
          tile={left}
          className="h-[320px] sm:h-[420px] lg:h-[600px]"
          onCursorEnter={showCursor}
          onCursorLeave={hideCursor}
          onCursorMove={moveCursor}
        />

        {/* Right — two tiles stacked, together matching the left tile's height */}
        <div className="grid grid-rows-2 gap-4 lg:gap-5 lg:h-[600px]">
          <Tile
            tile={topRight}
            className="h-[240px] sm:h-[290px] lg:h-auto"
            onCursorEnter={showCursor}
            onCursorLeave={hideCursor}
            onCursorMove={moveCursor}
          />
          <Tile
            tile={bottomRight}
            className="h-[240px] sm:h-[290px] lg:h-auto"
            onCursorEnter={showCursor}
            onCursorLeave={hideCursor}
            onCursorMove={moveCursor}
          />
        </div>
      </div>
    </section>
  );
}
