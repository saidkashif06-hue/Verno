import { useState, useMemo, useRef, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CATEGORIES = ["All", "Hoodies", "T-Shirts", "Jackets", "Knitwear", "Accessories"];

const SIZES_APPAREL = ["XS", "S", "M", "L", "XL"];
const SIZES_ONE = ["One Size"];
const SIZES_SHOE = ["7", "8", "9", "10", "11"];

const PRODUCTS = [
  {
    id: 1,
    name: "Vern'o Striped Polo — Navy",
    price: "$68",
    category: "T-Shirts",
    img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop",
    sizes: SIZES_APPAREL,
  },
  {
    id: 2,
    name: "Vern'o Court Sneaker — Blue",
    price: "$124",
    category: "Accessories",
    img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    sizes: SIZES_SHOE,
  },
  {
    id: 3,
    name: "Vern'o Track Jacket — Navy",
    price: "$142",
    category: "Jackets",
    img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop",
    sizes: SIZES_APPAREL,
  },
  {
    id: 4,
    name: "Vern'o Pique Tee — Fog Grey",
    price: "$54",
    category: "T-Shirts",
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
    sizes: SIZES_APPAREL,
  },
  {
    id: 5,
    name: "Vern'o Wool Beanie — Navy",
    price: "$38",
    category: "Accessories",
    img: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=800&auto=format&fit=crop",
    sizes: SIZES_ONE,
  },
  {
    id: 6,
    name: "Vern'o Pullover Hoodie — Slate",
    price: "$96",
    category: "Hoodies",
    img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop",
    sizes: SIZES_APPAREL,
  },
  {
    id: 7,
    name: "Vern'o Graphic Crewneck — Chalk",
    price: "$78",
    category: "Knitwear",
    img: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop",
    sizes: SIZES_APPAREL,
  },
  {
    id: 8,
    name: "Vern'o Colourblock Sweatshirt",
    price: "$88",
    category: "Hoodies",
    img: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop",
    sizes: SIZES_APPAREL,
  },
];

export default function NewArrivals() {
  const [active, setActive] = useState("All");
  const [selectedSizes, setSelectedSizes] = useState({});
  const gridRef = useRef(null);
  const sectionRef = useRef(null);
  const titleImgRef = useRef(null);
  const titleImgIndex = useRef(-1);
  const eyebrowRef = useRef(null);
  const newWordRef = useRef(null);
  const arrivalsWordRef = useRef(null);
  const chipRef = useRef(null);
  const ctaBtnRef = useRef(null);
  const dividerRef = useRef(null);
  const cursorRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const isOverCard = useRef(false);
  const cursorQuickTo = useRef(null);

  const pickSize = (e, productId, size) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const showCursor = () => {
    isOverCard.current = true;
    gsap.to(cursorRef.current, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" });
  };

  const hideCursor = () => {
    isOverCard.current = false;
    gsap.to(cursorRef.current, { opacity: 0, scale: 0.5, duration: 0.25, ease: "power2.in" });
  };

  // Fixed, viewport-space cursor that tracks the real pointer at all times,
  // including while the page scrolls under a stationary mouse.
  useEffect(() => {
    if (!cursorRef.current) return;

    cursorQuickTo.current = {
      x: gsap.quickTo(cursorRef.current, "x", { duration: 0.35, ease: "power3.out" }),
      y: gsap.quickTo(cursorRef.current, "y", { duration: 0.35, ease: "power3.out" }),
    };

    const updatePosition = (x, y) => {
      mousePos.current = { x, y };
      cursorQuickTo.current.x(x);
      cursorQuickTo.current.y(y);
    };

    const syncHoverState = (x, y) => {
      const el = document.elementFromPoint(x, y);
      const overCard = !!el?.closest("[data-card]");
      if (overCard && !isOverCard.current) showCursor();
      if (!overCard && isOverCard.current) hideCursor();
    };

    const onMouseMove = (e) => {
      updatePosition(e.clientX, e.clientY);
      syncHoverState(e.clientX, e.clientY);
    };

    // Re-check hover state on scroll — the mouse hasn't moved but the
    // element underneath it has, same as native cursor behaviour.
    const onScroll = () => {
      const { x, y } = mousePos.current;
      syncHoverState(x, y);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Scroll-scrub: the small image inline in the title cycles through
  // product shots as the section moves through the viewport.
  useEffect(() => {
    if (!sectionRef.current || !titleImgRef.current) return;

    const setFrame = (i) => {
      if (i === titleImgIndex.current) return;
      titleImgIndex.current = i;
      gsap.to(titleImgRef.current, {
        opacity: 0,
        duration: 0.12,
        onComplete: () => {
          titleImgRef.current.src = PRODUCTS[i].img;
          gsap.to(titleImgRef.current, { opacity: 1, duration: 0.18 });
        },
      });
    };

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        const i = Math.min(PRODUCTS.length - 1, Math.floor(self.progress * PRODUCTS.length));
        setFrame(i);
      },
    });

    return () => st.kill();
  }, []);

  // Header entrance — clip-path wipes for the title words and image chip,
  // fades for the eyebrow/CTA, a scaleX sweep for the divider. Plays once.
  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.set([eyebrowRef.current, ctaBtnRef.current], { opacity: 0, y: 16 });
    gsap.set([newWordRef.current, arrivalsWordRef.current], {
      clipPath: "inset(0 100% 0 0)",
    });
    gsap.set(chipRef.current, { clipPath: "inset(50% 50% 50% 50%)", scale: 0.6 });
    gsap.set(dividerRef.current, { scaleX: 0, transformOrigin: "left center" });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: sectionRef.current, start: "top 78%", once: true },
      defaults: { ease: "power3.out" },
    });

    tl.to(newWordRef.current, { clipPath: "inset(0 0% 0 0)", duration: 0.7 })
      .to(
        chipRef.current,
        { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 0.6, ease: "power2.out" },
        "-=0.45"
      )
      .to(arrivalsWordRef.current, { clipPath: "inset(0 0% 0 0)", duration: 0.7 }, "-=0.4")
      .to(ctaBtnRef.current, { opacity: 1, y: 0, duration: 0.5 }, "-=0.35")
      .to(dividerRef.current, { scaleX: 1, duration: 0.7, ease: "power2.inOut" }, "-=0.3")
      .to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.5 }, "-=0.35");

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, []);

  const filtered = useMemo(
    () => (active === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === active)),
    [active]
  );

  // Card reveal — each image wipes open via clip-path with a slight zoom-out
  // as it scrolls into view; the name/price fade up a beat after.
  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll("[data-card]");
    const triggers = [];

    cards.forEach((card, i) => {
      const clip = card.querySelector("[data-card-clip]");
      const zoom = card.querySelector("[data-card-zoom]");
      const text = card.querySelector("[data-card-text]");
      const col = i % 4;

      gsap.set(clip, { clipPath: "inset(0% 0% 100% 0%)" });
      gsap.set(zoom, { scale: 1.15 });
      gsap.set(text, { opacity: 0, y: 14 });

      const trigger = ScrollTrigger.create({
        trigger: card,
        start: "top 88%",
        once: true,
        onEnter: () => {
          gsap.to(clip, {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.9,
            ease: "power3.out",
            delay: col * 0.06,
          });
          gsap.to(zoom, {
            scale: 1,
            duration: 1.1,
            ease: "power3.out",
            delay: col * 0.06,
          });
          gsap.to(text, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            delay: col * 0.06 + 0.3,
          });
        },
      });
      triggers.push(trigger);
    });

    return () => triggers.forEach((t) => t.kill());
  }, [active]);

  return (
    <section ref={sectionRef} className="w-full bg-brand-black px-6 py-24 sm:px-10 lg:px-16 xl:px-20">
      {/* Custom cursor — fixed to viewport, tracks pointer everywhere including through scroll */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-50 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full opacity-0"
        style={{ willChange: "transform", backgroundColor: "#b8f5df" }}
      >
        <ArrowUpRight size={26} strokeWidth={2} className="text-brand-black" />
      </div>

      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="flex items-center font-grotesk text-4xl font-bold leading-none text-brand-gray-100 sm:text-5xl lg:text-6xl">
          <span ref={newWordRef} className="inline-block">
            New
          </span>
          <span
            ref={chipRef}
            className="mx-3 inline-block h-[0.85em] w-[0.85em] shrink-0 overflow-hidden rounded-2xl align-middle sm:mx-4"
          >
            <img
              ref={titleImgRef}
              src={PRODUCTS[0].img}
              alt=""
              className="h-full w-full object-cover"
            />
          </span>
          <span ref={arrivalsWordRef} className="inline-block">
            Arrivals
          </span>
        </h2>

        <a
          ref={ctaBtnRef}
          href="#"
          className="group inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-full bg-brand-gray-100 px-6 py-3.5 font-montserrat text-sm font-medium text-brand-black transition-colors duration-300 hover:bg-brand-blue-300"
        >
          Explore full collection
          <ArrowUpRight
            size={16}
            strokeWidth={2}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      </div>

      <div ref={dividerRef} className="mt-10 border-t border-brand-gray-700" />

      {/* Eyebrow */}
      <div ref={eyebrowRef} className="mt-6 text-center">
        <span className="font-montserrat text-xs font-medium uppercase tracking-[0.25em] text-brand-blue-400">
          SS26 Collection
        </span>
      </div>

      {/* Category filters */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        {CATEGORIES.map((cat) => {
          const isActive = active === cat;
          return (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`rounded-full border px-5 py-2 font-montserrat text-xs font-medium uppercase tracking-[0.12em] transition-colors duration-300 ${
                isActive
                  ? "border-brand-blue-500 bg-brand-blue-600 text-brand-gray-100"
                  : "border-brand-gray-700 text-brand-gray-300 hover:border-brand-blue-500 hover:text-brand-blue-300"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Product grid */}
      <div ref={gridRef} className="mt-14 grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((p) => (
          <a href="#" key={p.id} data-card className="group block cursor-none">
            <div data-card-clip className="relative aspect-[3/4] w-full overflow-hidden bg-brand-gray-800">
              <div data-card-zoom className="h-full w-full">
                <img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-black/70 via-brand-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="absolute right-3 top-3 flex h-8 w-8 translate-y-1 items-center justify-center rounded-full bg-brand-gray-100 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <ArrowUpRight size={16} strokeWidth={2} className="text-brand-black" />
              </span>

              {/* Size selector — slides up on hover */}
              <div className="absolute inset-x-0 bottom-0 translate-y-full p-3 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                <div className="flex flex-wrap gap-1.5">
                  {p.sizes.map((size) => {
                    const isSelected = selectedSizes[p.id] === size;
                    return (
                      <button
                        key={size}
                        onClick={(e) => pickSize(e, p.id, size)}
                        className={`flex h-8 min-w-[2rem] items-center justify-center rounded-full border px-2 font-montserrat text-[11px] font-medium uppercase tracking-wide transition-colors duration-200 cursor-none ${
                          isSelected
                            ? "border-brand-blue-500 bg-brand-blue-600 text-brand-gray-100"
                            : "border-brand-gray-100/30 bg-brand-black/60 text-brand-gray-100 backdrop-blur-sm hover:border-brand-blue-400 hover:bg-brand-blue-600/80"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div data-card-text className="mt-3.5 flex items-start justify-between gap-3">
              <p className="font-montserrat text-[13px] leading-snug text-brand-gray-300">
                {p.name}
                {selectedSizes[p.id] && (
                  <span className="ml-1.5 text-brand-blue-300">· {selectedSizes[p.id]}</span>
                )}
              </p>
              <span className="whitespace-nowrap font-montserrat text-[13px] font-medium text-brand-gray-100">
                {p.price}
              </span>
            </div>
          </a>
        ))}

        {filtered.length === 0 && (
          <p className="col-span-full py-16 text-center font-montserrat text-sm text-brand-gray-400">
            No pieces in this category yet — check back soon.
          </p>
        )}
      </div>
    </section>
  );
}
