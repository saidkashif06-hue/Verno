import { useState, useRef, useEffect } from "react";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CONTACT_DETAILS = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@verno.com",
    href: "mailto:hello@verno.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+1 (555) 014 0192",
    href: "tel:+15550140192",
  },
  {
    icon: MapPin,
    label: "Studio",
    value: "148 Wooster St, New York, NY",
    href: "https://maps.google.com/?q=148+Wooster+St+New+York",
  },
];

const SOCIALS = [
  { icon: FaFacebookF, href: "https://facebook.com", label: "Facebook" },
  { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
  { icon: FaLinkedinIn, href: "https://linkedin.com", label: "LinkedIn" },
];

const SUBJECTS = ["General enquiry", "Order support", "Wholesale", "Press"];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: SUBJECTS[0], message: "" });
  const [submitted, setSubmitted] = useState(false);

  const sectionRef = useRef(null);
  const eyebrowRef = useRef(null);
  const titleWordRefs = useRef([]);
  const introRef = useRef(null);
  const dividerRef = useRef(null);
  const formColRef = useRef(null);
  const detailsColRef = useRef(null);

  titleWordRefs.current = [];
  const addTitleWordRef = (el) => {
    if (el && !titleWordRefs.current.includes(el)) titleWordRefs.current.push(el);
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  // Header entrance — clip-path wipe on the title words, fades on the rest.
  // Single orchestrated sequence, plays once on load/scroll-in.
  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.set(titleWordRefs.current, { clipPath: "inset(0 100% 0 0)" });
    gsap.set([eyebrowRef.current, introRef.current], { opacity: 0, y: 16 });
    gsap.set(dividerRef.current, { scaleX: 0, transformOrigin: "left center" });
    gsap.set([formColRef.current, detailsColRef.current], { opacity: 0, y: 24 });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: sectionRef.current, start: "top 78%", once: true },
      defaults: { ease: "power3.out" },
    });

    tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.45 })
      .to(
        titleWordRefs.current,
        { clipPath: "inset(0 0% 0 0)", duration: 0.7, stagger: 0.1 },
        "-=0.2"
      )
      .to(dividerRef.current, { scaleX: 1, duration: 0.7, ease: "power2.inOut" }, "-=0.35")
      .to(introRef.current, { opacity: 1, y: 0, duration: 0.5 }, "-=0.4")
      .to(
        [formColRef.current, detailsColRef.current],
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.12 },
        "-=0.25"
      );

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-brand-black px-6 py-40 sm:px-10 lg:px-16 xl:px-20"
    >
      {/* Header */}
      <div className="mx-auto max-w-3xl text-center">
        <span
          ref={eyebrowRef}
          className="font-montserrat text-xs font-medium uppercase tracking-[0.25em] text-brand-blue-400"
        >
          Get in touch
        </span>

        <h1 className="mt-5 font-grotesk text-4xl font-bold leading-none text-brand-gray-100 sm:text-5xl lg:text-6xl">
          <span ref={addTitleWordRef} className="inline-block">
            Let&rsquo;s
          </span>{" "}
          <span ref={addTitleWordRef} className="inline-block">
            talk
          </span>
        </h1>

        <p
          ref={introRef}
          className="mx-auto mt-6 max-w-xl font-montserrat text-[15px] leading-relaxed text-brand-gray-300"
        >
          Questions about an order, a wholesale enquiry, or just want to say hello —
          the studio reads every message and replies within two business days.
        </p>
      </div>

      <div ref={dividerRef} className="mx-auto mt-14 max-w-5xl border-t border-brand-gray-700" />

      {/* Form + details */}
      <div className="mx-auto mt-14 grid max-w-5xl gap-16 lg:grid-cols-[1.3fr_1fr] lg:gap-12">
        {/* Form */}
        <div ref={formColRef}>
          {submitted ? (
            <div className="flex h-full min-h-[320px] flex-col justify-center rounded-2xl border border-brand-gray-700 bg-brand-gray-800/40 px-8 py-10">
              <h2 className="font-grotesk text-2xl font-semibold text-brand-gray-100">
                Message sent
              </h2>
              <p className="mt-3 font-montserrat text-sm leading-relaxed text-brand-gray-300">
                Thanks, {form.name.split(" ")[0] || "friend"} — the studio has your note and
                will follow up at {form.email || "the address you gave us"}.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setForm({ name: "", email: "", subject: SUBJECTS[0], message: "" });
                }}
                className="mt-6 w-fit font-montserrat text-sm font-medium text-brand-blue-400 underline decoration-brand-blue-700 underline-offset-4 transition-colors duration-300 hover:text-brand-blue-300"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="font-montserrat text-xs font-medium text-brand-gray-300">
                    Name
                  </span>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange("name")}
                    placeholder="Jordan Lee"
                    className="rounded-lg border border-brand-gray-700 bg-brand-gray-900/60 px-4 py-3 font-montserrat text-sm text-brand-gray-100 placeholder:text-brand-gray-500 outline-none transition-colors duration-300 focus:border-brand-blue-400"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="font-montserrat text-xs font-medium text-brand-gray-300">
                    Email
                  </span>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange("email")}
                    placeholder="jordan@email.com"
                    className="rounded-lg border border-brand-gray-700 bg-brand-gray-900/60 px-4 py-3 font-montserrat text-sm text-brand-gray-100 placeholder:text-brand-gray-500 outline-none transition-colors duration-300 focus:border-brand-blue-400"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-2">
                <span className="font-montserrat text-xs font-medium text-brand-gray-300">
                  Subject
                </span>
                <div className="flex flex-wrap gap-2">
                  {SUBJECTS.map((subject) => {
                    const isActive = form.subject === subject;
                    return (
                      <button
                        key={subject}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, subject }))}
                        className={`rounded-full border px-4 py-2 font-montserrat text-xs font-medium transition-colors duration-300 ${
                          isActive
                            ? "border-brand-blue-500 bg-brand-blue-600 text-brand-gray-100"
                            : "border-brand-gray-700 text-brand-gray-300 hover:border-brand-blue-500 hover:text-brand-blue-300"
                        }`}
                      >
                        {subject}
                      </button>
                    );
                  })}
                </div>
              </label>

              <label className="flex flex-col gap-2">
                <span className="font-montserrat text-xs font-medium text-brand-gray-300">
                  Message
                </span>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange("message")}
                  placeholder="Tell us what's on your mind..."
                  className="resize-none rounded-lg border border-brand-gray-700 bg-brand-gray-900/60 px-4 py-3 font-montserrat text-sm text-brand-gray-100 placeholder:text-brand-gray-500 outline-none transition-colors duration-300 focus:border-brand-blue-400"
                />
              </label>

              <button
                type="submit"
                className="group inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-full bg-brand-gray-100 px-6 py-3.5 font-montserrat text-sm font-medium text-brand-black transition-colors duration-300 hover:bg-brand-blue-300"
              >
                Send message
                <ArrowUpRight
                  size={16}
                  strokeWidth={2}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </button>
            </form>
          )}
        </div>

        {/* Details */}
        <div ref={detailsColRef} className="flex flex-col gap-10">
          <div className="flex flex-col gap-6">
            {CONTACT_DETAILS.map(({ icon: Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
                className="group flex items-start gap-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-gray-700 text-brand-blue-400 transition-colors duration-300 group-hover:border-brand-blue-400">
                  <Icon size={16} strokeWidth={1.75} />
                </span>
                <span className="flex flex-col gap-0.5 pt-1.5">
                  <span className="font-montserrat text-xs uppercase tracking-wide text-brand-gray-400">
                    {label}
                  </span>
                  <span className="font-montserrat text-sm text-brand-gray-100 transition-colors duration-300 group-hover:text-brand-blue-300">
                    {value}
                  </span>
                </span>
              </a>
            ))}
          </div>

          <div className="border-t border-brand-gray-700 pt-8">
            <span className="font-montserrat text-xs uppercase tracking-wide text-brand-gray-400">
              Studio hours
            </span>
            <p className="mt-2 font-montserrat text-sm leading-relaxed text-brand-gray-100">
              Monday–Friday, 9am–6pm ET
            </p>
          </div>

          <div className="flex items-center gap-5 border-t border-brand-gray-700 pt-8">
            {SOCIALS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="text-brand-gray-300 transition-colors duration-300 hover:text-brand-blue-400"
              >
                <Icon size={17} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
