import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HERO_IMAGES = ["/heroimg1.webp", "/heroimg2.webp", "/heroimg3.webp"];

// Inline title chip cycles through its own set of shots, sourced from Pexels.
const TITLE_IMAGES = [
  "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/2897883/pexels-photo-2897883.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400",
];

export default function Hero() {
  const sectionRef = useRef(null);
  const eyebrowRef = useRef(null);
  const titleRef = useRef(null);
  const paraRef = useRef(null);
  const ctaRef = useRef(null);
  const imageWrapRef = useRef(null);
  const imageRefs = useRef([]);
  const titleImgRef = useRef(null);
  const titleImgIndex = useRef(-1);

  imageRefs.current = [];
  const addImageRef = (el) => {
    if (el && !imageRefs.current.includes(el)) imageRefs.current.push(el);
  };

  // Scroll-triggered entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
        defaults: { ease: "power3.out" },
      });

      tl.fromTo(eyebrowRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 })
        .fromTo(titleRef.current, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.7 }, "-=0.25")
        .fromTo(paraRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
        .fromTo(ctaRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.35")
        .fromTo(
          imageWrapRef.current,
          { opacity: 0, scale: 1.04 },
          { opacity: 1, scale: 1, duration: 1, ease: "power2.out" },
          "-=0.6"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Auto-crossfade slideshow
  useEffect(() => {
    const images = imageRefs.current;
    if (!images.length) return;

    gsap.set(images, { opacity: 0 });
    gsap.set(images[0], { opacity: 1 });

    const tl = gsap.timeline({ repeat: -1 });
    images.forEach((_, i) => {
      const next = (i + 1) % images.length;
      tl.to(images[i], { opacity: 0, duration: 1.2, ease: "power2.inOut" }, `+=3`)
        .to(images[next], { opacity: 1, duration: 1.2, ease: "power2.inOut" }, "<");
    });

    return () => tl.kill();
  }, []);

  // Scroll-scrub: the inline chip in the title cycles through the same
  // lookbook shots as the background, tied to scroll position through the section.
  useEffect(() => {
    if (!sectionRef.current || !titleImgRef.current) return;

    const setFrame = (i) => {
      if (i === titleImgIndex.current) return;
      titleImgIndex.current = i;
      gsap.to(titleImgRef.current, {
        opacity: 0,
        duration: 0.12,
        onComplete: () => {
          titleImgRef.current.src = TITLE_IMAGES[i];
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
        const i = Math.min(TITLE_IMAGES.length - 1, Math.floor(self.progress * TITLE_IMAGES.length));
        setFrame(i);
      },
    });

    return () => st.kill();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-[900px] w-full items-center overflow-hidden bg-brand-black py-50"
    >
      {/* Background — image fills the entire section */}
      <div ref={imageWrapRef} className="absolute inset-0 h-full w-full">
        {HERO_IMAGES.map((src, i) => (
          <img
            key={src}
            ref={addImageRef}
            src={src}
            alt={`Vern'o lookbook ${i + 1}`}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ))}

        {/* Scrim — darkest on the left where the text sits, fades out toward the right */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brand-black/90 via-brand-black/55 to-brand-black/10" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-black/70 via-transparent to-transparent lg:bg-none" />
      </div>

      {/* Copy — sits over the left side of the image */}
      <div className="relative z-10 flex w-full flex-col justify-center px-6 py-32 sm:px-10 lg:w-[50%] lg:px-16 xl:px-20">
        <span
          ref={eyebrowRef}
          className="font-montserrat text-xs font-medium uppercase tracking-[0.25em] text-brand-blue-400"
        >
          Vern'o — SS26 Collection
        </span>

        <h1
          ref={titleRef}
          className="mt-5 flex flex-wrap items-center font-grotesk text-4xl font-bold leading-[1.1] text-brand-gray-100 sm:text-5xl lg:text-[3.4rem]"
        >
          Tailored
          <span className="mx-2.5 inline-block h-[0.8em] w-[0.8em] shrink-0 overflow-hidden rounded-xl align-middle sm:mx-3">
            <img
              ref={titleImgRef}
              src={TITLE_IMAGES[0]}
              alt=""
              className="h-full w-full object-cover"
            />
          </span>
          for modern man
        </h1>

        <p
          ref={paraRef}
          className="mt-6 max-w-md font-montserrat text-[15px] leading-relaxed text-brand-gray-300"
        >
          Vern'o is built on restraint — clean lines, considered fabrics, and
          silhouettes that hold their shape long after trends move on. Every
          piece is cut for how you actually move through your day, from the
          studio to the street. No excess, no noise, just clothing designed
          to work as hard as you do. This is menswear stripped back to what
          matters.
        </p>

        <div ref={ctaRef} className="mt-9 flex items-center gap-5">
          <a
            href="/shop"
            className="group flex items-center gap-2 rounded-full bg-brand-blue-600 px-7 py-3.5 font-montserrat text-sm font-medium text-brand-gray-100 transition-colors duration-300 hover:bg-brand-blue-500"
          >
            Shop the collection
            <ArrowRight
              size={16}
              strokeWidth={2}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
          <a
            href="/about"
            className="font-montserrat text-sm font-medium text-brand-gray-200 underline decoration-brand-blue-700 decoration-1 underline-offset-4 transition-colors duration-300 hover:text-brand-blue-300"
          >
            Our story
          </a>
        </div>
      </div>
    </section>
  );
}
