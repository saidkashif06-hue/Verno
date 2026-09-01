import { useRef, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { JOURNAL_POSTS,getPostBySlug } from "./journalData";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Hero — cover image as a true full-bleed background, title + meta    */
/* overlaid at the base, back button and category pill at the top.     */
/* ------------------------------------------------------------------ */

function PostHero({ post }) {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const topRowRef = useRef(null);
  const titleRef = useRef(null);
  const metaRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(imageRef.current, { scale: 1.1 }, { scale: 1, duration: 1.4, ease: "power2.out" });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.15 });
      tl.fromTo(topRowRef.current, { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.5 })
        .fromTo(titleRef.current, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.75 }, "-=0.2")
        .fromTo(metaRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.4");
    }, sectionRef);

    return () => ctx.revert();
  }, [post.slug]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[520px] w-full overflow-hidden bg-brand-black sm:h-[600px] lg:h-[680px]"
    >
      <div
        ref={imageRef}
        className="absolute inset-0 h-full w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${post.cover})` }}
        role="img"
        aria-label={post.title}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/35 to-brand-black/55" />

      {/* Top row — back button + date */}
      <div
        ref={topRowRef}
        className="absolute inset-x-0 top-0 flex items-center justify-between px-6 py-6 sm:px-10 lg:px-16 xl:px-20"
      >
        <button
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-brand-black/60 text-brand-gray-100 backdrop-blur-sm transition-colors duration-300 hover:bg-brand-blue-600"
        >
          <ArrowLeft size={18} strokeWidth={2} />
        </button>
        <span className="font-montserrat text-xs font-medium text-brand-gray-300">{post.date}</span>
      </div>

      {/* Title block, bottom-left */}
      <div className="absolute inset-x-0 bottom-0 px-6 pb-10 sm:px-10 sm:pb-14 lg:px-16 lg:pb-16 xl:px-20">
        <span className="inline-block rounded-full bg-brand-blue-600 px-4 py-1.5 font-montserrat text-[11px] font-medium uppercase tracking-[0.18em] text-brand-gray-100">
          {post.category}
        </span>

        <h1
          ref={titleRef}
          className="mt-5 max-w-3xl font-grotesk text-3xl font-bold leading-[1.12] text-brand-gray-100 sm:text-4xl lg:text-5xl"
        >
          {post.title}
        </h1>

        <div ref={metaRef} className="mt-5 flex items-center gap-3 font-montserrat text-[13px] text-brand-gray-300">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gray-700 font-grotesk text-xs font-semibold text-brand-gray-100">
            {post.author
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </span>
          <span>{post.author}</span>
          <span className="h-1 w-1 rounded-full bg-brand-gray-600" />
          <span>{post.readTime}</span>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Body — main article column + a sidebar of other posts.              */
/* ------------------------------------------------------------------ */

function PostBody({ post }) {
  const contentRef = useRef(null);

  useEffect(() => {
    if (!contentRef.current) return;
    const blocks = contentRef.current.querySelectorAll("[data-reveal]");
    const triggers = [];

    blocks.forEach((block) => {
      gsap.set(block, { opacity: 0, y: 18 });
      const trigger = ScrollTrigger.create({
        trigger: block,
        start: "top 90%",
        once: true,
        onEnter: () => gsap.to(block, { opacity: 1, y: 0, duration: 0.65, ease: "power2.out" }),
      });
      triggers.push(trigger);
    });

    return () => triggers.forEach((t) => t.kill());
  }, [post.slug]);

  const otherPosts = JOURNAL_POSTS.filter((p) => p.slug !== post.slug).slice(0, 4);

  return (
    <div className="px-6 py-16 sm:px-10 lg:px-16 xl:px-20">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1fr_320px]">
        {/* Article */}
        <article ref={contentRef} className="max-w-2xl">
          <p data-reveal className="font-montserrat text-[17px] leading-relaxed text-brand-gray-200">
            {post.body.intro}
          </p>

          {post.body.sections.map((section, i) => (
            <div key={i} data-reveal className="mt-10">
              <h2 className="font-grotesk text-2xl font-semibold leading-snug text-brand-gray-100 sm:text-[1.7rem]">
                {section.heading}
              </h2>

              {section.paragraphs.map((p, j) => (
                <p key={j} className="mt-4 font-montserrat text-[15px] leading-relaxed text-brand-gray-300">
                  {p}
                </p>
              ))}

              {section.images && (
                <div className="mt-6">
                  <div className="grid grid-cols-2 gap-3">
                    {section.images.map((src, k) => (
                      <div key={k} className="aspect-[4/5] overflow-hidden rounded-lg bg-brand-gray-800">
                        <div
                          className="h-full w-full bg-cover bg-center"
                          style={{ backgroundImage: `url(${src})` }}
                          role="img"
                          aria-label={`${section.heading} detail`}
                        />
                      </div>
                    ))}
                  </div>
                  {section.caption && (
                    <p className="mt-3 font-montserrat text-[12px] italic text-brand-gray-500">
                      {section.caption}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}

          <div data-reveal className="mt-14 flex items-center justify-between border-t border-brand-gray-700 pt-8">
            <Link
              to="/journal"
              className="inline-flex cursor-pointer items-center gap-2 font-montserrat text-sm font-medium text-brand-gray-200 transition-colors duration-300 hover:text-brand-blue-300"
            >
              <ArrowLeft size={16} strokeWidth={2} />
              Back to the Journal
            </Link>
          </div>
        </article>

        {/* Sidebar — other posts */}
        <aside className="lg:pt-2">
          <span className="font-montserrat text-xs font-medium uppercase tracking-[0.22em] text-brand-blue-400">
            More from the Journal
          </span>

          <div className="mt-6 flex flex-col gap-5">
            {otherPosts.map((p) => (
              <Link to={`/journal/${p.slug}`} key={p.slug} className="group flex cursor-pointer items-center gap-4">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-brand-gray-800">
                  <div
                    className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${p.cover})` }}
                    role="img"
                    aria-label={p.title}
                  />
                </div>
                <div>
                  <span className="font-montserrat text-[10px] font-medium uppercase tracking-[0.15em] text-brand-blue-300">
                    {p.category}
                  </span>
                  <h4 className="mt-1 font-grotesk text-[13px] font-semibold leading-snug text-brand-gray-100 transition-colors duration-300 group-hover:text-brand-blue-300">
                    {p.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Keep reading — a related-posts grid at the foot of the page, same   */
/* clip-path reveal as the Journal index. Normal cursor throughout.    */
/* ------------------------------------------------------------------ */

function KeepReading({ post }) {
  const gridRef = useRef(null);

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll("[data-keepreading-card]");
    const triggers = [];

    cards.forEach((card, i) => {
      const clip = card.querySelector("[data-kr-clip]");
      const zoom = card.querySelector("[data-kr-zoom]");
      const text = card.querySelector("[data-kr-text]");

      gsap.set(clip, { clipPath: "inset(0% 0% 100% 0%)" });
      gsap.set(zoom, { scale: 1.12 });
      gsap.set(text, { opacity: 0, y: 12 });

      const trigger = ScrollTrigger.create({
        trigger: card,
        start: "top 90%",
        once: true,
        onEnter: () => {
          gsap.to(clip, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power3.out", delay: i * 0.09 });
          gsap.to(zoom, { scale: 1, duration: 1.3, ease: "power3.out", delay: i * 0.09 });
          gsap.to(text, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out", delay: i * 0.09 + 0.28 });
        },
      });
      triggers.push(trigger);
    });

    return () => triggers.forEach((t) => t.kill());
  }, [post.slug]);

  const related = JOURNAL_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="border-t border-brand-gray-700 px-6 py-20 sm:px-10 lg:px-16 xl:px-20">
      <h2 className="font-grotesk text-2xl font-bold text-brand-gray-100 sm:text-3xl">Keep reading</h2>

      <div ref={gridRef} className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-3">
        {related.map((p) => (
          <Link
            to={`/journal/${p.slug}`}
            key={p.slug}
            data-keepreading-card
            className="group block cursor-pointer"
          >
            <div
              data-kr-clip
              className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-brand-gray-800"
            >
              <div
                data-kr-zoom
                className="h-full w-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                style={{ backgroundImage: `url(${p.cover})` }}
                role="img"
                aria-label={p.title}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-black/70 via-transparent to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-95" />
              <span className="absolute left-3 top-3 rounded-full bg-brand-black/70 px-3 py-1.5 font-montserrat text-[10px] font-medium uppercase tracking-[0.18em] text-brand-blue-300 backdrop-blur-sm">
                {p.category}
              </span>
            </div>
            <div data-kr-text className="mt-4">
              <h3 className="font-grotesk text-lg font-semibold leading-snug text-brand-gray-100 transition-colors duration-300 group-hover:text-brand-blue-300">
                {p.title}
              </h3>
              <p className="mt-2 font-montserrat text-[13px] leading-relaxed text-brand-gray-400">{p.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function JournalPost() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <main className="flex min-h-[70vh] w-full flex-col items-center justify-center bg-brand-black px-6 text-center">
        <span className="font-montserrat text-xs font-medium uppercase tracking-[0.25em] text-brand-blue-400">
          404
        </span>
        <h1 className="mt-4 font-grotesk text-3xl font-bold text-brand-gray-100">This post doesn't exist</h1>
        <p className="mt-3 font-montserrat text-sm text-brand-gray-400">
          It may have been moved, or the link is off.
        </p>
        <Link
          to="/journal"
          className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-full bg-brand-gray-100 px-6 py-3.5 font-montserrat text-sm font-medium text-brand-black transition-colors duration-300 hover:bg-brand-blue-300"
        >
          <ArrowLeft size={16} strokeWidth={2} />
          Back to the Journal
        </Link>
      </main>
    );
  }

  return (
    <main className="w-full bg-brand-black">
      <PostHero post={post} />
      <PostBody post={post} />
      <KeepReading post={post} />
    </main>
  );
}
