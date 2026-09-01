import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { JOURNAL_POSTS } from "./journalData";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Header — eyebrow + clip-path title wipe, matching every other       */
/* section header on the site.                                        */
/* ------------------------------------------------------------------ */

function JournalHeader() {
  const sectionRef = useRef(null);
  const eyebrowRef = useRef(null);
  const titleRef = useRef(null);
  const paraRef = useRef(null);
  const dividerRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.set([eyebrowRef.current, paraRef.current], { opacity: 0, y: 16 });
    gsap.set(titleRef.current, { clipPath: "inset(0 100% 0 0)" });
    gsap.set(dividerRef.current, { scaleX: 0, transformOrigin: "left center" });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.1 });
    tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.5 })
      .to(titleRef.current, { clipPath: "inset(0 0% 0 0)", duration: 0.75 }, "-=0.25")
      .to(paraRef.current, { opacity: 1, y: 0, duration: 0.5 }, "-=0.35")
      .to(dividerRef.current, { scaleX: 1, duration: 0.7, ease: "power2.inOut" }, "-=0.3");
  }, []);

  return (
    <div ref={sectionRef} className="px-6 pb-14 py-40 sm:px-10 lg:px-16 xl:px-20">
      <span
        ref={eyebrowRef}
        className="font-montserrat text-xs font-medium uppercase tracking-[0.25em] text-brand-blue-400"
      >
        The Journal
      </span>

      <h1
        ref={titleRef}
        className="mt-4 font-grotesk text-4xl font-bold leading-[1.1] text-brand-gray-100 sm:text-5xl lg:text-[3.4rem]"
      >
        Notes on craft, cloth
        <br />
        and the way we work
      </h1>

      <p ref={paraRef} className="mt-6 max-w-lg font-montserrat text-[15px] leading-relaxed text-brand-gray-300">
        Field notes from the studio — on fabric, fit, the people we work
        with, and the ideas behind each collection.
      </p>

      <div ref={dividerRef} className="mt-12 border-t border-brand-gray-700" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Card grid — each card's cover image fills the tile as a true        */
/* background, with a clip-path wipe reveal on scroll. Normal cursor   */
/* throughout, no custom pointer.                                      */
/* ------------------------------------------------------------------ */

function JournalGrid() {
  const gridRef = useRef(null);

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll("[data-journal-card]");
    const triggers = [];

    cards.forEach((card, i) => {
      const clip = card.querySelector("[data-journal-clip]");
      const zoom = card.querySelector("[data-journal-zoom]");
      const text = card.querySelector("[data-journal-text]");
      const col = i % 3;

      gsap.set(clip, { clipPath: "inset(0% 0% 100% 0%)" });
      gsap.set(zoom, { scale: 1.12 });
      gsap.set(text, { opacity: 0, y: 12 });

      const trigger = ScrollTrigger.create({
        trigger: card,
        start: "top 88%",
        once: true,
        onEnter: () => {
          gsap.to(clip, {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1,
            ease: "power3.out",
            delay: col * 0.08,
          });
          gsap.to(zoom, {
            scale: 1,
            duration: 1.3,
            ease: "power3.out",
            delay: col * 0.08,
          });
          gsap.to(text, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            delay: col * 0.08 + 0.28,
          });
        },
      });
      triggers.push(trigger);
    });

    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <div className="px-6 pb-28 sm:px-10 lg:px-16 xl:px-20">
      <div ref={gridRef} className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {JOURNAL_POSTS.map((post) => (
          <Link
            to={`/journal/${post.slug}`}
            key={post.slug}
            data-journal-card
            className="group block cursor-pointer"
          >
            <div
              data-journal-clip
              className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-brand-gray-800"
            >
              <div
                data-journal-zoom
                className="h-full w-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                style={{ backgroundImage: `url(${post.cover})` }}
                role="img"
                aria-label={post.title}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-black/80 via-brand-black/10 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-95" />
              <span className="absolute right-3 top-3 flex h-8 w-8 translate-y-1 items-center justify-center rounded-full bg-brand-gray-100 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <ArrowUpRight size={16} strokeWidth={2} className="text-brand-black" />
              </span>
              <span className="absolute left-3 top-3 rounded-full bg-brand-black/70 px-3 py-1.5 font-montserrat text-[10px] font-medium uppercase tracking-[0.18em] text-brand-blue-300 backdrop-blur-sm">
                {post.category}
              </span>
            </div>

            <div data-journal-text className="mt-4">
              <div className="flex items-center gap-2 font-montserrat text-[12px] text-brand-gray-400">
                <span>{post.date}</span>
                <span className="h-1 w-1 rounded-full bg-brand-gray-600" />
                <span>{post.readTime}</span>
              </div>
              <h3 className="mt-2 font-grotesk text-lg font-semibold leading-snug text-brand-gray-100 transition-colors duration-300 group-hover:text-brand-blue-300 sm:text-xl">
                {post.title}
              </h3>
              <p className="mt-2 font-montserrat text-[13px] leading-relaxed text-brand-gray-400">
                {post.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Journal() {
  return (
    <main className="w-full bg-brand-black">
      <JournalHeader />
      <JournalGrid />
    </main>
  );
}
