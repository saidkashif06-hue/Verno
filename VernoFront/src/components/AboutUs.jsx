import { useEffect, useRef } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ABOUT_IMAGES = [
  "https://images.pexels.com/photos/3737576/pexels-photo-3737576.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/2897883/pexels-photo-2897883.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=1200",
];

export default function AboutUs() {
  const sectionRef = useRef(null);
  const textColRef = useRef(null); // wraps the whole left column — this is what we translate
  const eyebrowRef = useRef(null);
  const word1Ref = useRef(null);
  const word2Ref = useRef(null);
  const paraRef = useRef(null);
  const statsRef = useRef(null);
  const ctaRef = useRef(null);
  const imageWrapRef = useRef(null);
  const imageRefs = useRef([]);
  const cursorRef = useRef(null);
  const cursorQuickTo = useRef(null);
  const isOverVisual = useRef(false);

  imageRefs.current = [];
  const addImageRef = (el) => {
    if (el && !imageRefs.current.includes(el)) imageRefs.current.push(el);
  };

  // Scroll-triggered entrance — clip-path wipes for the heading, fades for the rest.
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([word1Ref.current, word2Ref.current], { clipPath: "inset(0 100% 0 0)" });
      gsap.set([eyebrowRef.current, paraRef.current, statsRef.current, ctaRef.current], {
        opacity: 0,
        y: 18,
      });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
        defaults: { ease: "power3.out" },
      });

      tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.5 })
        .to(word1Ref.current, { clipPath: "inset(0 0% 0 0)", duration: 0.75 }, "-=0.2")
        .to(word2Ref.current, { clipPath: "inset(0 0% 0 0)", duration: 0.75 }, "-=0.55")
        .to(paraRef.current, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
        .to(statsRef.current, { opacity: 1, y: 0, duration: 0.5 }, "-=0.35")
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
        .fromTo(
          imageWrapRef.current,
          { opacity: 0, scale: 1.06 },
          { opacity: 1, scale: 1, duration: 1, ease: "power2.out" },
          "-=0.7"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Scroll-linked "catch up" effect: the text column starts short (shorter than
  // the image) and, as the user scrolls through the section, it translates
  // downward until its bottom edge lines up with the bottom of the image —
  // then it naturally stops there because the scrub range ends. Desktop/lg only,
  // since the columns stack on smaller screens and this wouldn't make sense there.
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const tween = gsap.to(textColRef.current, {
        y: () => {
          const imgH = imageWrapRef.current?.offsetHeight || 0;
          const textH = textColRef.current?.offsetHeight || 0;
          return Math.max(imgH - textH, 0);
        },
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          end: "bottom 60%",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        tween.scrollTrigger && tween.scrollTrigger.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, []);

  // Custom cursor — mint pill with "About Us" + arrow, active anywhere over the section
  useEffect(() => {
    const section = sectionRef.current;
    const cursor = cursorRef.current;
    if (!section || !cursor) return;

    cursorQuickTo.current = {
      x: gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3.out" }),
      y: gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3.out" }),
    };

    const showCursor = () => {
      if (isOverVisual.current) return;
      isOverVisual.current = true;
      gsap.to(cursor, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" });
    };
    const hideCursor = () => {
      if (!isOverVisual.current) return;
      isOverVisual.current = false;
      gsap.to(cursor, { opacity: 0, scale: 0.5, duration: 0.25, ease: "power2.in" });
    };

    const onMouseEnter = (e) => {
      // jump straight to the pointer on entry so it doesn't glide in from a stale position
      gsap.set(cursor, { x: e.clientX, y: e.clientY });
      if (!e.target.closest("a, button, [role='button'], .cursor-pointer")) showCursor();
    };
    const onMouseMove = (e) => {
      cursorQuickTo.current.x(e.clientX);
      cursorQuickTo.current.y(e.clientY);

      const overClickable = !!e.target.closest("a, button, [role='button'], .cursor-pointer");
      if (overClickable) hideCursor();
      else showCursor();
    };
    const onMouseLeave = hideCursor;

    section.addEventListener("mouseenter", onMouseEnter);
    section.addEventListener("mousemove", onMouseMove, { passive: true });
    section.addEventListener("mouseleave", onMouseLeave);

    return () => {
      section.removeEventListener("mouseenter", onMouseEnter);
      section.removeEventListener("mousemove", onMouseMove);
      section.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  // Auto-crossfade slideshow through the 4 Pexels shots
  useEffect(() => {
    const images = imageRefs.current;
    if (!images.length) return;

    gsap.set(images, { opacity: 0, scale: 1.08 });
    gsap.set(images[0], { opacity: 1 });

    const tl = gsap.timeline({ repeat: -1 });
    images.forEach((img, i) => {
      const next = (i + 1) % images.length;
      tl.to(img, { scale: 1, duration: 4.5, ease: "power1.out" }, i === 0 ? 0 : "<")
        .to(images[i], { opacity: 0, duration: 1.2, ease: "power2.inOut" }, `+=2.6`)
        .to(images[next], { opacity: 1, duration: 1.2, ease: "power2.inOut" }, "<")
        .set(images[next], { scale: 1.08 }, "<")
        .to(images[next], { scale: 1, duration: 4.5, ease: "power1.out" }, "<");
    });

    return () => tl.kill();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full cursor-none bg-brand-black px-6 py-24 sm:px-10 lg:px-16 xl:px-20"
    >
      {/* Custom cursor — mint pill, "About Us" + arrow, follows pointer anywhere over the section */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-50 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 whitespace-nowrap rounded-full px-5 py-3 opacity-0"
        style={{ willChange: "transform", backgroundColor: "#b8f5df" }}
      >
        <span className="font-montserrat text-sm font-medium text-brand-black">About Us</span>
        <ArrowUpRight size={16} strokeWidth={2.25} className="text-brand-black" />
      </div>

      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Copy — this whole column translates down on scroll to "catch up" to the image */}
        <div ref={textColRef} className="order-2 lg:order-1" style={{ willChange: "transform" }}>
          <span
            ref={eyebrowRef}
            className="font-montserrat text-xs font-medium uppercase tracking-[0.25em] text-brand-blue-400"
          >
            About Vern'o
          </span>

          <h2 className="mt-5 font-grotesk text-3xl font-bold leading-[1.15] text-brand-gray-100 sm:text-4xl lg:text-[2.75rem]">
            <span ref={word1Ref} className="inline-block">
              Built on restraint,
            </span>{" "}
            <span ref={word2Ref} className="inline-block">
              worn without excess
            </span>
          </h2>

          <p
            ref={paraRef}
            className="mt-6 max-w-md font-montserrat text-[15px] leading-relaxed text-brand-gray-300"
          >
            Vern'o started as a small tailoring studio with one belief: clothing
            should earn its place in your wardrobe. Every piece we make is
            developed in-house, cut from considered fabrics, and tested against
            how men actually move through their day — not how they look standing
            still. No seasonal noise, no filler collections. Just menswear built
            to last past the trend cycle.
          </p>

          <div ref={statsRef} className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
            <div>
              <p className="font-grotesk text-2xl font-bold text-brand-gray-100">2019</p>
              <p className="mt-1 font-montserrat text-xs uppercase tracking-wide text-brand-gray-400">
                Founded
              </p>
            </div>
            <div>
              <p className="font-grotesk text-2xl font-bold text-brand-gray-100">100%</p>
              <p className="mt-1 font-montserrat text-xs uppercase tracking-wide text-brand-gray-400">
                In-house design
              </p>
            </div>
            <div>
              <p className="font-grotesk text-2xl font-bold text-brand-gray-100">12</p>
              <p className="mt-1 font-montserrat text-xs uppercase tracking-wide text-brand-gray-400">
                Countries shipped
              </p>
            </div>
          </div>

          <a
            ref={ctaRef}
            href="/about"
            className="group mt-9 inline-flex items-center gap-2 rounded-full bg-brand-blue-600 px-7 py-3.5 font-montserrat text-sm font-medium text-brand-gray-100 transition-colors duration-300 hover:bg-brand-blue-500"
          >
            Our full story
            <ArrowRight
              size={16}
              strokeWidth={2}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
        </div>

        {/* Visual — crossfading Pexels shots, custom cursor active over this area */}
        <div
          ref={imageWrapRef}
          className="relative order-1 aspect-[4/5] w-full overflow-hidden rounded-3xl bg-brand-gray-800 lg:order-2 lg:aspect-[3/4]"
        >
          {ABOUT_IMAGES.map((src, i) => (
            <img
              key={src}
              ref={addImageRef}
              src={src}
              alt={`Vern'o studio ${i + 1}`}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ))}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-black/60 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}
