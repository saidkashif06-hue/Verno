import { useRef, useEffect } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Shared text reveal — a clip-path "curtain" wipe that uncovers text  */
/* left to right, with a slight rightward drift as it settles.         */
/* Used on every section title/eyebrow/paragraph after the hero.       */
/* ------------------------------------------------------------------ */

const setClipHidden = (targets) =>
  gsap.set(targets, { clipPath: "inset(0 100% 0 0)", x: -14 });

const revealClipText = (targets, opts = {}) =>
  gsap.to(targets, {
    clipPath: "inset(0 0% 0 0)",
    x: 0,
    duration: 0.9,
    ease: "power4.out",
    stagger: 0.1,
    ...opts,
  });

/* ------------------------------------------------------------------ */
/* Shared image bank — served from /public/Jourimg, same convention    */
/* as Hero and CategoryShowcase.                                       */
/* ------------------------------------------------------------------ */

const HERO_IMG = "/Jourimg/Heroimg.webp";

const STORY_IMG = "/Jourimg/aboutimg.webp";

const PILLARS = [
  {
    id: "material",
    eyebrow: "01 — Material",
    title: "Fabric first",
    text:
      "Every run starts at the mill, not the sketchbook. We source natural fibres woven for weight and drape, then build the silhouette around what the cloth can do.",
    img: "/Jourimg/piimg2.webp",
    fill: "#7fb0e0",
  },
  {
    id: "cut",
    eyebrow: "02 — Cut",
    title: "Pattern over trend",
    text:
      "Our patterns are refined across seasons, not reinvented every one. A jacket that fits well this year should still fit well the next.",
    img: "/Jourimg/piimg3.webp",
    fill: "#f6cfa0",
  },
  {
    id: "make",
    eyebrow: "03 — Make",
    title: "Small batch, close to home",
    text:
      "We work with a handful of family-run workshops we've kept for years, keeping runs small enough that every piece gets looked at twice.",
    img: "/Jourimg/piimg4.webp",
    fill: "#c9d4f7",
  },
];

const INSTAGRAM_POSTS = [
  {
    id: 1,
    img: "/Jourimg/piimg5.webp",
  },
  {
    id: 2,
    img: "/Jourimg/piimg1.webp",
  },
  {
    id: 3,
    img: "/Jourimg/piimg6.webp",
  },
];

/* ------------------------------------------------------------------ */
/* 1. Hero — image fills the left half at reduced opacity, blending    */
/*    into brand-black; copy sits on the right.                        */
/* ------------------------------------------------------------------ */

function AboutHero() {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const eyebrowRef = useRef(null);
  const titleRef = useRef(null);
  const paraRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Basic fade-in for the hero image, no scale/clip-path.
      gsap.fromTo(imageRef.current, { opacity: 0 }, { opacity: 0.7, duration: 1.2, ease: "power2.out" });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.2 });
      tl.fromTo(eyebrowRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 })
        .fromTo(titleRef.current, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.7 }, "-=0.25")
        .fromTo(paraRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
        .fromTo(ctaRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.35");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-[770px] w-full items-center overflow-hidden bg-brand-black "
    >
      {/* Image — full width, opacity graded so it's faint behind the copy and fuller on the right */}
      <div className="absolute inset-0">
        <img
          ref={imageRef}
          src={HERO_IMG}
          alt="Vern'o — the studio"
          className="h-full w-full object-cover"
        />
        {/* Fade the image out toward the copy on the left, and toward the section edges */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-transparent via-brand-black/50 to-brand-black" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-black/60 via-transparent to-brand-black/60" />
      </div>

      {/* Copy — left side */}
      <div className="relative z-10 mr-auto flex w-full flex-col justify-center px-6  sm:px-10 lg:w-[52%] lg:px-16 xl:px-20">
        <span
          ref={eyebrowRef}
          className="font-montserrat text-xs font-medium uppercase tracking-[0.25em] text-brand-blue-400"
        >
          About Vern'o
        </span>

        <h1
          ref={titleRef}
          className="mt-5 font-grotesk text-4xl font-bold leading-[1.1] text-brand-gray-100 sm:text-5xl lg:text-[3.4rem]"
        >
          Menswear built to
          <br />
          outlast the season
        </h1>

        <p
          ref={paraRef}
          className="mt-6 max-w-md font-montserrat text-[15px] leading-relaxed text-brand-gray-300"
        >
          Vern'o started in a single rented studio with one question: what
          would clothing look like if it were designed to be worn, not just
          photographed once and forgotten. Every collection since has been
          an answer.
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
            href="#our-story"
            className="font-montserrat text-sm font-medium text-brand-gray-200 underline decoration-brand-blue-700 decoration-1 underline-offset-4 transition-colors duration-300 hover:text-brand-blue-300"
          >
            Read our story
          </a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Our Story — a single large image tile. Hover reveals a color     */
/*    overlay with a plain fade (no clip-path), copy fades up on       */
/*    scroll.                                                          */
/* ------------------------------------------------------------------ */

function OurStory() {
  const sectionRef = useRef(null);
  const eyebrowRef = useRef(null);
  const titleRef = useRef(null);
  const paraRefs = useRef([]);
  paraRefs.current = [];
  const addParaRef = (el) => {
    if (el && !paraRefs.current.includes(el)) paraRefs.current.push(el);
  };

  const tileRef = useRef(null);
  const overlayRef = useRef(null);
  const overlayCopyRef = useRef(null);
  const cursorRef = useRef(null);
  const cursorQuickTo = useRef(null);

  useEffect(() => {
    if (!cursorRef.current) return;
    cursorQuickTo.current = {
      x: gsap.quickTo(cursorRef.current, "x", { duration: 0.35, ease: "power3.out" }),
      y: gsap.quickTo(cursorRef.current, "y", { duration: 0.35, ease: "power3.out" }),
    };
  }, []);

  // Scroll-in reveal for image + copy — plain fade-in for the image,
  // no clip-path, no zoom.
  useEffect(() => {
    if (!sectionRef.current) return;
    const img = tileRef.current.querySelector("[data-story-img]");

    gsap.set(img, { opacity: 0 });
    setClipHidden([eyebrowRef.current, titleRef.current, ...paraRefs.current]);

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 75%",
      once: true,
      onEnter: () => {
        gsap.to(img, { opacity: 1, duration: 0.9, ease: "power2.out" });
        revealClipText([eyebrowRef.current, titleRef.current, ...paraRefs.current]);
      },
    });

    return () => st.kill();
  }, []);

  const handleEnter = (e) => {
    gsap.to(overlayRef.current, { opacity: 1, duration: 0.4, ease: "power2.out" });
    gsap.to(overlayCopyRef.current, { opacity: 1, y: 0, duration: 0.4, delay: 0.1, ease: "power2.out" });
    gsap.to(cursorRef.current, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" });
  };

  const handleMove = (e) => {
    cursorQuickTo.current?.x(e.clientX);
    cursorQuickTo.current?.y(e.clientY);
  };

  const handleLeave = () => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.35, ease: "power2.in" });
    gsap.to(overlayCopyRef.current, { opacity: 0, y: 10, duration: 0.25, ease: "power2.in" });
    gsap.to(cursorRef.current, { opacity: 0, scale: 0.5, duration: 0.25, ease: "power2.in" });
  };

  return (
    <section
      id="our-story"
      ref={sectionRef}
      className="w-full bg-brand-black px-6 py-24 sm:px-10 lg:px-16 xl:px-20"
    >
      {/* Custom cursor — mint circle, tracks pointer over the story tile */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-50 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full opacity-0"
        style={{ willChange: "transform", backgroundColor: "#b8f5df" }}
      >
        <ArrowUpRight size={26} strokeWidth={2} className="text-brand-black" />
      </div>

      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Image tile — left */}
        <div className="lg:order-1">
          <a
            href="/shop"
            ref={tileRef}
            onMouseEnter={handleEnter}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            className="group relative block h-[380px] w-full cursor-none overflow-hidden rounded-2xl border border-brand-gray-700 bg-brand-gray-800 shadow-xl shadow-black/30 sm:h-[460px] lg:h-[560px]"
          >
            <img
              data-story-img
              src={STORY_IMG}
              alt="Inside the Vern'o studio"
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-black/70 via-transparent to-transparent" />

            <div
              ref={overlayRef}
              className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-start p-6 opacity-0 sm:p-8"
              style={{ backgroundColor: "#7fb0e0" }}
            >
              <div ref={overlayCopyRef} className="opacity-0">
                <span className="font-montserrat text-[11px] font-medium uppercase tracking-[0.22em] text-brand-black/70">
                  Since 2016
                </span>
                <h3 className="mt-2 font-grotesk text-2xl font-semibold leading-[1.1] text-brand-black sm:text-3xl">
                  Still cut in-house
                </h3>
                <p className="mt-3 max-w-[26ch] font-montserrat text-sm leading-relaxed text-brand-black/80">
                  Every pattern still starts on the same worktable, cut by hand
                  before a single stitch goes in.
                </p>
              </div>
            </div>
          </a>

          {/* Caption below the tile */}
          <div className="mt-4 flex items-baseline justify-between gap-4">
            <h4 className="font-grotesk text-lg font-semibold text-brand-gray-100">
              The Wooster Street studio
            </h4>
            <span className="whitespace-nowrap font-montserrat text-xs uppercase tracking-[0.15em] text-brand-gray-400">
              Est. 2016
            </span>
          </div>
        </div>

        {/* Copy — right */}
        <div className="lg:order-2 lg:pt-3">
          <span
            ref={eyebrowRef}
            className="inline-block font-montserrat text-xs font-medium uppercase tracking-[0.25em] text-brand-blue-400"
          >
            Our Story
          </span>

          <h2
            ref={titleRef}
            className="mt-4 font-grotesk text-3xl font-bold leading-[1.15] text-brand-gray-100 sm:text-4xl lg:text-5xl"
          >
            Ten years of getting the basics right
          </h2>

          <p
            ref={addParaRef}
            className="mt-6 font-montserrat text-[15px] leading-relaxed text-brand-gray-300"
          >
            We opened Vern'o's first studio with three sewing machines and a
            conviction that most menswear was being made too fast, from
            fabric too thin. The early collections were small — a handful of
            shirts, one jacket, sold out of a single rail.
          </p>

          <p
            ref={addParaRef}
            className="mt-4 font-montserrat text-[15px] leading-relaxed text-brand-gray-300"
          >
            A decade later the process hasn't really changed, we've just
            gotten better at it. Same close relationships with our mills,
            same small production runs, same refusal to chase a trend we
            won't still like next year.
          </p>

          <a
            href="/shop"
            className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-brand-gray-100 px-6 py-3.5 font-montserrat text-sm font-medium text-brand-black transition-colors duration-300 hover:bg-brand-blue-300"
          >
            Shop the collection
            <ArrowUpRight size={16} strokeWidth={2} />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Pillars — three cards, image + text. Images fade in on scroll,   */
/*    no clip-path wipe, with the shared mint custom cursor.           */
/* ------------------------------------------------------------------ */

function Pillars() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const eyebrowRef = useRef(null);
  const titleRef = useRef(null);
  const dividerRef = useRef(null);

  const cursorRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const isOverCard = useRef(false);
  const cursorQuickTo = useRef(null);

  const showCursor = () => {
    isOverCard.current = true;
    gsap.to(cursorRef.current, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" });
  };

  const hideCursor = () => {
    isOverCard.current = false;
    gsap.to(cursorRef.current, { opacity: 0, scale: 0.5, duration: 0.25, ease: "power2.in" });
  };

  // Fixed, viewport-space cursor tracking the pointer across the section
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
      const overCard = !!el?.closest("[data-pillar]");
      if (overCard && !isOverCard.current) showCursor();
      if (!overCard && isOverCard.current) hideCursor();
    };

    const onMouseMove = (e) => {
      updatePosition(e.clientX, e.clientY);
      syncHoverState(e.clientX, e.clientY);
    };

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

  // Header entrance
  useEffect(() => {
    if (!sectionRef.current) return;

    setClipHidden([eyebrowRef.current, titleRef.current]);
    gsap.set(dividerRef.current, { scaleX: 0, transformOrigin: "left center" });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: sectionRef.current, start: "top 78%", once: true },
      defaults: { ease: "power4.out" },
    });

    tl.to(titleRef.current, { clipPath: "inset(0 0% 0 0)", x: 0, duration: 0.9 })
      .to(dividerRef.current, { scaleX: 1, duration: 0.7, ease: "power2.inOut" }, "-=0.5")
      .to(eyebrowRef.current, { clipPath: "inset(0 0% 0 0)", x: 0, duration: 0.7 }, "-=0.6");

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, []);

  // Card reveal — plain fade-in for each image, no clip-path, no zoom.
  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll("[data-pillar]");
    const triggers = [];

    cards.forEach((card, i) => {
      const image = card.querySelector("[data-pillar-img]");
      const eyebrow = card.querySelector("[data-pillar-eyebrow]");
      const title = card.querySelector("[data-pillar-title]");
      const text = card.querySelector("[data-pillar-text]");

      gsap.set(image, { opacity: 0 });
      setClipHidden([eyebrow, title, text]);

      const trigger = ScrollTrigger.create({
        trigger: card,
        start: "top 88%",
        once: true,
        onEnter: () => {
          gsap.to(image, { opacity: 1, duration: 0.8, ease: "power2.out", delay: i * 0.1 });
          revealClipText([eyebrow, title, text], { delay: i * 0.1 + 0.15 });
        },
      });
      triggers.push(trigger);
    });

    return () => triggers.forEach((t) => t.kill());
  }, []);

  // Hover interaction — blur image + reveal overlay label
  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll("[data-pillar]");
    const cleanups = [];

    cards.forEach((card) => {
      const image = card.querySelector("[data-pillar-img]");
      const overlay = card.querySelector("[data-pillar-overlay]");
      const overlayLabel = card.querySelector("[data-pillar-overlay-label]");

      gsap.set(image, { filter: "blur(0px)", scale: 1 });
      gsap.set(overlay, { opacity: 0 });
      gsap.set(overlayLabel, { opacity: 0, y: 12 });

      const onEnter = () => {
        gsap.to(image, { filter: "blur(6px)", scale: 1.04, duration: 0.6, ease: "power3.out" });
        gsap.to(overlay, { opacity: 1, duration: 0.4, ease: "power2.out" });
        gsap.to(overlayLabel, { opacity: 1, y: 0, duration: 0.5, delay: 0.1, ease: "power3.out" });
      };

      const onLeave = () => {
        gsap.to(image, { filter: "blur(0px)", scale: 1, duration: 0.5, ease: "power3.out" });
        gsap.to(overlay, { opacity: 0, duration: 0.3, ease: "power2.in" });
        gsap.to(overlayLabel, { opacity: 0, y: 12, duration: 0.3, ease: "power2.in" });
      };

      card.addEventListener("mouseenter", onEnter);
      card.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        card.removeEventListener("mouseenter", onEnter);
        card.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-brand-black px-6 py-24 sm:px-10 lg:px-16 xl:px-20">
      {/* Custom cursor — shared across the three pillar cards */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-50 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full opacity-0"
        style={{ willChange: "transform", backgroundColor: "#b8f5df" }}
      >
        <ArrowUpRight size={26} strokeWidth={2} className="text-brand-black" />
      </div>

      <div className="text-center">
        <span
          ref={eyebrowRef}
          className="inline-block font-montserrat text-xs font-medium uppercase tracking-[0.25em] text-brand-blue-400"
        >
          What We Stand For
        </span>
        <h2
          ref={titleRef}
          className="mt-4 font-grotesk text-3xl font-bold leading-none text-brand-gray-100 sm:text-4xl lg:text-5xl"
        >
          Three things we won't compromise on
        </h2>
      </div>

      <div ref={dividerRef} className="mx-auto mt-10 max-w-3xl border-t border-brand-gray-700" />

      <div ref={gridRef} className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {PILLARS.map((p) => (
          <a href="#" key={p.id} data-pillar className="group block cursor-none">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-brand-gray-800">
              <img
                data-pillar-img
                src={p.img}
                alt={p.title}
                loading="lazy"
                className="h-full w-full object-cover will-change-transform"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-black/85 via-brand-black/20 to-transparent" />

              {/* Hover overlay */}
              <div
                data-pillar-overlay
                className="pointer-events-none absolute inset-0 flex items-center justify-center bg-brand-black/40"
              >
                <span
                  data-pillar-overlay-label
                  className="font-montserrat text-xs font-medium uppercase tracking-[0.3em] text-brand-gray-100"
                >
                  View More
                </span>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-6">
                <span
                  data-pillar-eyebrow
                  className="inline-block font-montserrat text-[11px] font-medium uppercase tracking-[0.22em] text-brand-blue-300"
                >
                  {p.eyebrow}
                </span>
                <h3
                  data-pillar-title
                  className="mt-2 font-grotesk text-xl font-semibold leading-[1.15] text-brand-gray-100 sm:text-2xl"
                >
                  {p.title}
                </h3>
              </div>
            </div>

            <p data-pillar-text className="mt-4 font-montserrat text-[14px] leading-relaxed text-brand-gray-300">
              {p.text}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}
/* ------------------------------------------------------------------ */
/* 4. Follow Us — Instagram grid. Images fade in on scroll; hover      */
/*    overlay is a plain fade, no clip-path circle.                    */
/* ------------------------------------------------------------------ */

function FollowUs() {
  const sectionRef = useRef(null);
  const eyebrowRef = useRef(null);
  const titleRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    setClipHidden([eyebrowRef.current, titleRef.current]);
    gsap.set(ctaRef.current, { opacity: 0, y: 16 });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
      defaults: { ease: "power4.out" },
    });

    tl.to(eyebrowRef.current, { clipPath: "inset(0 0% 0 0)", x: 0, duration: 0.7 })
      .to(titleRef.current, { clipPath: "inset(0 0% 0 0)", x: 0, duration: 0.9 }, "-=0.5")
      .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.35");

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-brand-black px-6 py-24 sm:px-10 lg:px-16 xl:px-20">
      <div className="flex flex-col items-center text-center">
        <span
          ref={eyebrowRef}
          className="inline-block font-montserrat text-xs font-medium uppercase tracking-[0.25em] text-brand-blue-400"
        >
          @verno.studio
        </span>
        <h2
          ref={titleRef}
          className="mt-4 font-grotesk text-3xl font-bold leading-none text-brand-gray-100 sm:text-4xl lg:text-5xl"
        >
          Follow us on Instagram
        </h2>
        <a
          ref={ctaRef}
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          className="mt-7 inline-flex cursor-pointer items-center gap-2 rounded-full bg-brand-gray-100 px-6 py-3.5 font-montserrat text-sm font-medium text-brand-black transition-colors duration-300 hover:bg-brand-blue-300"
        >
          <FaInstagram size={16} />
          View profile
        </a>
      </div>

      <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {INSTAGRAM_POSTS.map((post) => (
          <InstagramTile key={post.id} post={post} />
        ))}

        {/* Fourth tile — CTA card instead of a post image */}
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          className="group relative flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border border-brand-gray-700 bg-brand-gray-800 transition-colors duration-300 hover:border-brand-blue-400 hover:bg-brand-gray-800/70"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-gray-600 text-brand-gray-100 transition-colors duration-300 group-hover:border-brand-blue-400 group-hover:text-brand-blue-300">
            <FaInstagram size={20} />
          </span>
          <span className="font-montserrat text-sm font-medium text-brand-gray-100">
            Follow us on Instagram
          </span>
          <span className="font-montserrat text-xs text-brand-gray-400">
            @verno.studio
          </span>
        </a>
      </div>
    </section>
  );
}

function InstagramTile({ post }) {
  const rootRef = useRef(null);
  const overlayRef = useRef(null);
  const iconRef = useRef(null);

  // Plain fade-in for the image on scroll, no clip-path, no zoom.
  useEffect(() => {
    if (!rootRef.current) return;
    const img = rootRef.current.querySelector("[data-ig-img]");
    gsap.set(img, { opacity: 0 });

    const st = ScrollTrigger.create({
      trigger: rootRef.current,
      start: "top 90%",
      once: true,
      onEnter: () => gsap.to(img, { opacity: 1, duration: 0.8, ease: "power2.out" }),
    });

    return () => st.kill();
  }, []);

  const handleEnter = () => {
    gsap.to(overlayRef.current, { opacity: 1, duration: 0.35, ease: "power2.out" });
    gsap.to(iconRef.current, { opacity: 1, scale: 1, duration: 0.3, delay: 0.05, ease: "power2.out" });
  };

  const handleLeave = () => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, ease: "power2.in" });
    gsap.to(iconRef.current, { opacity: 0, scale: 0.6, duration: 0.2, ease: "power2.in" });
  };

  return (
    <a
      href="https://instagram.com"
      target="_blank"
      rel="noreferrer"
      ref={rootRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="group relative block aspect-square w-full cursor-pointer overflow-hidden bg-brand-gray-800"
    >
      <img
        data-ig-img
        src={post.img}
        alt="Vern'o on Instagram"
        loading="lazy"
        className="h-full w-full object-cover"
      />

      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-brand-blue-600/70 opacity-0"
      >
        <div ref={iconRef} className="opacity-0" style={{ transform: "scale(0.6)" }}>
          <FaInstagram size={30} className="text-brand-gray-100" />
        </div>
      </div>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function About() {
  return (
    <main className="w-full bg-brand-black">
      <AboutHero />
      <OurStory />
      <Pillars />
      <FollowUs />
    </main>
  );
}
