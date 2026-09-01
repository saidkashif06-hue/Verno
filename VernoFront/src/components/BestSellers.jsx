import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Placeholder product data — swap image/name/price with real product photography & catalog data.
const PRODUCTS = [
  {
    id: "p1",
    name: "Oxford Weave Shirt",
    price: "$128",
    image:
      "https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "p2",
    name: "Tailored Wool Trouser",
    price: "$164",
    image:
      "https://images.pexels.com/photos/1300550/pexels-photo-1300550.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "p3",
    name: "Merino Crew Knit",
    price: "$142",
    image:
      "https://images.pexels.com/photos/2043590/pexels-photo-2043590.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "p4",
    name: "Overshirt Jacket",
    price: "$210",
    image:
      "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "p5",
    name: "Straight Fit Chino",
    price: "$118",
    image:
      "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "p6",
    name: "Textured Zip Jacket",
    price: "$236",
    image:
      "https://images.pexels.com/photos/2703202/pexels-photo-2703202.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

export default function BestSellers() {
  const sectionRef = useRef(null);
  const eyebrowRef = useRef(null);
  const word1Ref = useRef(null);
  const word2Ref = useRef(null);
  const paraRef = useRef(null);
  const ctaRef = useRef(null);
  const railWrapRef = useRef(null); // pinned viewport for the horizontal rail
  const trackRef = useRef(null); // the row that translates on x
  const cardRefs = useRef([]);

  cardRefs.current = [];
  const addCardRef = (el) => {
    if (el && !cardRefs.current.includes(el)) cardRefs.current.push(el);
  };

  // Entrance — same clip-path heading wipe + fade-up pattern used across the site
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([word1Ref.current, word2Ref.current], { clipPath: "inset(0 100% 0 0)" });
      gsap.set([eyebrowRef.current, paraRef.current, ctaRef.current], { opacity: 0, y: 18 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
        defaults: { ease: "power3.out" },
      });

      tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.5 })
        .to(word1Ref.current, { clipPath: "inset(0 0% 0 0)", duration: 0.75 }, "-=0.2")
        .to(word2Ref.current, { clipPath: "inset(0 0% 0 0)", duration: 0.75 }, "-=0.55")
        .to(paraRef.current, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Center-focus coverflow: the rail pins in the viewport while the track's
  // x-translation is tied to vertical scroll progress (scrub), and side padding
  // on the track lets the first/last card reach dead-center. On every scroll
  // update we measure each card's distance from the rail's horizontal center and
  // scale it down + blur it + fade it the further it sits from the middle — so
  // whichever card is centered reads large and sharp, and its neighbors recede.
  useEffect(() => {
    const wrap = railWrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    const ctx = gsap.context(() => {
      const getDistance = () => track.scrollWidth - wrap.offsetWidth;

      const setSidePadding = () => {
        const card = cardRefs.current[0];
        if (!card) return;
        const pad = Math.max((wrap.offsetWidth - card.offsetWidth) / 2, 0);
        track.style.paddingLeft = `${pad}px`;
        track.style.paddingRight = `${pad}px`;
      };
      setSidePadding();

      const updateEmphasis = () => {
        const wrapRect = wrap.getBoundingClientRect();
        const centerX = wrapRect.left + wrapRect.width / 2;
        cardRefs.current.forEach((card) => {
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.left + rect.width / 2;
          const dist = Math.abs(cardCenter - centerX);
          const norm = gsap.utils.clamp(0, 1, dist / (wrapRect.width / 2.2));
          gsap.set(card, {
            scale: gsap.utils.interpolate(1, 0.76, norm),
            opacity: gsap.utils.interpolate(1, 0.4, norm),
            filter: `blur(${gsap.utils.interpolate(0, 7, norm)}px)`,
          });
        });
      };

      const scrollTween = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          start: "top 15%",
          end: () => "+=" + getDistance(),
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: () => {
            setSidePadding();
            updateEmphasis();
          },
          onUpdate: updateEmphasis,
        },
      });

      // Per-card clip-path reveal on the image, timed to horizontal position via
      // containerAnimation — same wipe technique used on the heading above.
      cardRefs.current.forEach((card) => {
        const img = card.querySelector("[data-reveal-img]");
        if (!img) return;
        gsap.fromTo(
          img,
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              containerAnimation: scrollTween,
              start: "left 95%",
              end: "left 55%",
              scrub: true,
            },
          }
        );
      });

      requestAnimationFrame(updateEmphasis);
      window.addEventListener("resize", updateEmphasis);
      return () => window.removeEventListener("resize", updateEmphasis);
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-brand-black px-6 py-24 sm:px-10 lg:px-16 xl:px-20">
      {/* Header row — eyebrow + clip-path heading, matches the About Us title pattern */}
      <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
        <div>
          <span
            ref={eyebrowRef}
            className="font-montserrat text-xs font-medium uppercase tracking-[0.25em] text-brand-blue-400"
          >
            Best Sellers
          </span>

          <h2 className="mt-5 font-grotesk text-3xl font-bold leading-[1.15] text-brand-gray-100 sm:text-4xl lg:text-[2.75rem]">
            <span ref={word1Ref} className="inline-block">
              Worn most,
            </span>{" "}
            <span ref={word2Ref} className="inline-block">
              chosen first
            </span>
          </h2>

          <p
            ref={paraRef}
            className="mt-6 max-w-md font-montserrat text-[15px] leading-relaxed text-brand-gray-300"
          >
            The pieces that keep coming back into rotation — picked by repeat
            customers, not a marketing calendar.
          </p>
        </div>

        <a
          ref={ctaRef}
          href="/shop"
          className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-blue-600 px-7 py-3.5 font-montserrat text-sm font-medium text-brand-gray-100 transition-colors duration-300 hover:bg-brand-blue-500"
        >
          Shop All
          <ArrowRight
            size={16}
            strokeWidth={2}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </a>
      </div>

      {/* Pinned coverflow rail — center card large & sharp, neighbors scaled + blurred */}
      <div ref={railWrapRef} className="relative mt-14 overflow-hidden">
        <div ref={trackRef} className="flex w-max items-center gap-6">
          {PRODUCTS.map((product) => (
            <a
              key={product.id}
              ref={addCardRef}
              href={`/products/${product.id}`}
              className="w-[72vw] shrink-0 sm:w-[52vw] md:w-[40vw] lg:w-[32vw] xl:w-[28vw]"
              style={{ willChange: "transform, filter" }}
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-brand-gray-800">
                <img
                  data-reveal-img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </div>
              <div className="mt-4 flex items-start justify-between gap-3">
                <p className="font-montserrat text-sm font-medium text-brand-gray-100">
                  {product.name}
                </p>
                <p className="font-montserrat text-sm text-brand-gray-400">{product.price}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
