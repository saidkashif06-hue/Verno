import { useEffect, useRef } from "react";
import { Star } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Placeholder testimonials — swap quote/name/role with real customer reviews.
// Avatars are auto-generated initials (ui-avatars.com) as stand-ins for real photos.
const ROW_1 = [
  { name: "Daniel Reyes", role: "Verified Buyer", quote: "The Oxford shirt fits like it was actually made for someone who moves, not a mannequin. Three years in and it still looks new." },
  { name: "Marcus Webb", role: "Verified Buyer", quote: "Ordered the wool trouser on a whim. It's now the only pair I reach for when I need to look put-together fast." },
  { name: "Ethan Cole", role: "Verified Buyer", quote: "No filler collections, no seasonal noise — just genuinely well-made basics. Refreshing in this space." },
  { name: "Ryan Patel", role: "Verified Buyer", quote: "Fabric quality is a full tier above what I was paying for elsewhere at the same price point." },
  { name: "Jordan Kim", role: "Verified Buyer", quote: "Shipped to me in under a week even internationally. Packaging alone told me this was a considered brand." },
];

const ROW_2 = [
  { name: "Alex Turner", role: "Verified Buyer", quote: "The overshirt jacket has replaced three other jackets in my rotation. Versatile in a way I didn't expect." },
  { name: "Sam Okafor", role: "Verified Buyer", quote: "Customer service actually resolved my sizing issue in one email. Rare these days." },
  { name: "Leo Martinez", role: "Verified Buyer", quote: "Built to last past the trend cycle isn't just a tagline — I've had pieces for two years with zero wear issues." },
  { name: "Noah Bennett", role: "Verified Buyer", quote: "The knit holds its shape wash after wash. Small detail that makes a big difference over time." },
  { name: "Owen Brooks", role: "Verified Buyer", quote: "Cut for how I actually move through my day, exactly as advertised. Didn't expect that to matter this much." },
];

function TestimonialCard({ name, role, quote }) {
  return (
    <div className="w-[320px] shrink-0 rounded-2xl border border-brand-gray-800 bg-brand-gray-900 p-6 sm:w-[380px]">
      <div className="flex gap-1 text-brand-blue-400">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
        ))}
      </div>

      <p className="mt-4 font-montserrat text-[14px] leading-relaxed text-brand-gray-300">
        "{quote}"
      </p>

      <div className="mt-6 flex items-center gap-3">
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=b8f5df&color=0a0a0a&bold=true`}
          alt={name}
          className="h-10 w-10 rounded-full"
          draggable={false}
        />
        <div>
          <p className="font-montserrat text-sm font-medium text-brand-gray-100">{name}</p>
          <p className="font-montserrat text-xs text-brand-gray-400">{role}</p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const sectionRef = useRef(null);
  const eyebrowRef = useRef(null);
  const word1Ref = useRef(null);
  const word2Ref = useRef(null);
  const paraRef = useRef(null);
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);
  const tweensRef = useRef([]);

  // Entrance — same clip-path heading wipe + fade-up pattern used across the site
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([word1Ref.current, word2Ref.current], { clipPath: "inset(0 100% 0 0)" });
      gsap.set([eyebrowRef.current, paraRef.current], { opacity: 0, y: 18 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
        defaults: { ease: "power3.out" },
      });

      tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.5 })
        .to(word1Ref.current, { clipPath: "inset(0 0% 0 0)", duration: 0.75 }, "-=0.2")
        .to(word2Ref.current, { clipPath: "inset(0 0% 0 0)", duration: 0.75 }, "-=0.55")
        .to(paraRef.current, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Dual-direction infinite marquee. Each row renders its testimonial set twice
  // back to back, then loops the x position from 0% to -50% (or the reverse) so
  // the seam is invisible — row 1 drifts rightward, row 2 drifts leftward.
  useEffect(() => {
    tweensRef.current = [];

    const rows = [
      { el: row1Ref.current, direction: "right" },
      { el: row2Ref.current, direction: "left" },
    ];

    rows.forEach(({ el, direction }) => {
      if (!el) return;
      const setWidth = el.scrollWidth / 2;
      const speedPxPerSecond = 34;
      const duration = setWidth / speedPxPerSecond;

      const tween =
        direction === "right"
          ? gsap.fromTo(el, { xPercent: -50 }, { xPercent: 0, duration, ease: "none", repeat: -1 })
          : gsap.fromTo(el, { xPercent: 0 }, { xPercent: -50, duration, ease: "none", repeat: -1 });

      tweensRef.current.push(tween);
    });

    return () => tweensRef.current.forEach((t) => t.kill());
  }, []);

  const pauseAll = () => tweensRef.current.forEach((t) => t.pause());
  const resumeAll = () => tweensRef.current.forEach((t) => t.play());

  return (
    <section ref={sectionRef} className="w-full overflow-hidden bg-brand-black py-24">
      <div className="px-6 sm:px-10 lg:px-16 xl:px-20">
        <span
          ref={eyebrowRef}
          className="font-montserrat text-xs font-medium uppercase tracking-[0.25em] text-brand-blue-400"
        >
          Testimonials
        </span>

        <h2 className="mt-5 max-w-xl font-grotesk text-3xl font-bold leading-[1.15] text-brand-gray-100 sm:text-4xl lg:text-[2.75rem]">
          <span ref={word1Ref} className="inline-block">
            Worn by them,
          </span>{" "}
          <span ref={word2Ref} className="inline-block">
            not just made by us
          </span>
        </h2>

        <p
          ref={paraRef}
          className="mt-6 max-w-md font-montserrat text-[15px] leading-relaxed text-brand-gray-300"
        >
          A few words from people who've actually lived in the pieces, past the
          first wash.
        </p>
      </div>

      {/* Row 1 — drifts right */}
      <div
        className="mt-14 w-full"
        onMouseEnter={pauseAll}
        onMouseLeave={resumeAll}
      >
        <div ref={row1Ref} className="flex w-max gap-5" style={{ willChange: "transform" }}>
          {[...ROW_1, ...ROW_1].map((t, i) => (
            <TestimonialCard key={`r1-${i}`} {...t} />
          ))}
        </div>
      </div>

      {/* Row 2 — drifts left */}
      <div
        className="mt-5 w-full"
        onMouseEnter={pauseAll}
        onMouseLeave={resumeAll}
      >
        <div ref={row2Ref} className="flex w-max gap-5" style={{ willChange: "transform" }}>
          {[...ROW_2, ...ROW_2].map((t, i) => (
            <TestimonialCard key={`r2-${i}`} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}
