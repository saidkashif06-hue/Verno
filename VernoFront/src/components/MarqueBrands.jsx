import { useEffect, useRef } from "react";
import gsap from "gsap";

// Swap these for real logo SVGs/images from /public later —
// for now these are styled text logotypes as placeholders.
const BRANDS = [
  "GQ",
  "ESQUIRE",
  "MR PORTER",
  "VOGUE MAN",
  "FORBES",
  "HIGHSNOBIETY",
  "ELLE MAN",
  "MONOCLE",
];

export default function MarqueeBrands() {
  const trackRef = useRef(null);

  useEffect(() => {
    if (!trackRef.current) return;

    // Track holds two copies of the list back to back — animating it
    // exactly -50% and looping creates a seamless infinite scroll.
    const tween = gsap.to(trackRef.current, {
      xPercent: -50,
      duration: 22,
      ease: "none",
      repeat: -1,
    });

    return () => tween.kill();
  }, []);

  const handleEnter = () => gsap.to(trackRef.current, { timeScale: 0.25, duration: 0.4 });
  const handleLeave = () => gsap.to(trackRef.current, { timeScale: 1, duration: 0.4 });

  return (
    <section className="border-y border-white/5 bg-brand-navy/40 py-10">
     
      <div
        className="relative w-full overflow-hidden"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        {/* Edge fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-brand-navy/90 to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-brand-navy/90 to-transparent sm:w-28" />

        <div ref={trackRef} className="flex w-max items-center gap-16 sm:gap-24">
          {[...BRANDS, ...BRANDS].map((brand, i) => (
            <span
              key={`${brand}-${i}`}
              className="font-grotesk text-xl font-semibold uppercase tracking-wide text-brand-gray-300 opacity-70 transition-opacity duration-300 hover:opacity-100 sm:text-2xl"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
