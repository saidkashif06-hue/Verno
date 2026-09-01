import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Placeholder FAQ content — swap with real policy/product copy.
const FAQS = [
  {
    q: "How does Vern'o sizing run?",
    a: "True to standard menswear sizing, cut for regular-to-athletic builds. Every product page includes a detailed measurement chart — if you're between sizes, we generally recommend sizing down for a tailored fit or up for a relaxed one.",
  },
  {
    q: "What's your returns policy?",
    a: "30 days from delivery on unworn, unwashed items with tags attached. Returns are free within the US; international returns are covered by the customer. Refunds are issued to your original payment method once the item is received.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes — we currently ship to 12 countries. Delivery typically takes 5-10 business days depending on destination, and all duties/taxes are calculated at checkout so there are no surprise fees on arrival.",
  },
  {
    q: "How should I care for the fabrics?",
    a: "Most pieces are machine washable on a cold, gentle cycle — check the care label on each item for specifics. We recommend air-drying tailored pieces (shirts, trousers, jackets) to preserve fit and fabric structure over time.",
  },
  {
    q: "What does 'developed in-house' actually mean?",
    a: "Every pattern, fabric selection, and fit test happens internally rather than through a third-party manufacturer's existing templates — meaning the fit, cut, and construction are designed specifically for Vern'o, not licensed from a generic supplier.",
  },
  {
    q: "Can I exchange an item for a different size?",
    a: "Yes, free size exchanges are available within 30 days of delivery for US customers. Start an exchange from your order confirmation email and we'll ship the new size out as soon as the original is scanned in transit.",
  },
];

export default function FAQ() {
  const sectionRef = useRef(null);
  const eyebrowRef = useRef(null);
  const word1Ref = useRef(null);
  const word2Ref = useRef(null);
  const paraRef = useRef(null);
  const itemRefs = useRef([]);
  const panelRefs = useRef([]);

  const [openIndex, setOpenIndex] = useState(null);

  itemRefs.current = [];
  panelRefs.current = [];
  const addItemRef = (el) => {
    if (el && !itemRefs.current.includes(el)) itemRefs.current.push(el);
  };
  const addPanelRef = (el, i) => {
    panelRefs.current[i] = el;
  };

  // Entrance — same clip-path heading wipe as other sections, plus each FAQ row
  // wipes in horizontally (clip-path) and staggers down the list as it scrolls
  // into view.
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([word1Ref.current, word2Ref.current], { clipPath: "inset(0 100% 0 0)" });
      gsap.set([eyebrowRef.current, paraRef.current], { opacity: 0, y: 18 });
      gsap.set(itemRefs.current, { clipPath: "inset(0 100% 0 0)", opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
        defaults: { ease: "power3.out" },
      });

      tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.5 })
        .to(word1Ref.current, { clipPath: "inset(0 0% 0 0)", duration: 0.75 }, "-=0.2")
        .to(word2Ref.current, { clipPath: "inset(0 0% 0 0)", duration: 0.75 }, "-=0.55")
        .to(paraRef.current, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
        .to(
          itemRefs.current,
          { clipPath: "inset(0 0% 0 0)", opacity: 1, duration: 0.7, stagger: 0.12 },
          "-=0.3"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Accordion open/close — clip-path wipe-down reveal on the answer text, paired
  // with a height tween on the panel wrapper so the layout still collapses/expands
  // (clip-path alone doesn't reclaim document space).
  useEffect(() => {
    panelRefs.current.forEach((panel, i) => {
      if (!panel) return;
      const inner = panel.querySelector("[data-faq-answer]");
      const isOpen = openIndex === i;

      gsap.to(panel, {
        height: isOpen ? "auto" : 0,
        duration: 0.5,
        ease: "power2.inOut",
      });

      gsap.to(inner, {
        clipPath: isOpen ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
        duration: isOpen ? 0.55 : 0.35,
        delay: isOpen ? 0.08 : 0,
        ease: "power2.out",
      });
    });
  }, [openIndex]);

  return (
    <section ref={sectionRef} className="w-full bg-brand-black px-6 py-24 sm:px-10 lg:px-16 xl:px-20">
      <div>
        <span
          ref={eyebrowRef}
          className="font-montserrat text-xs font-medium uppercase tracking-[0.25em] text-brand-blue-400"
        >
          FAQ
        </span>

        <h2 className="mt-5 max-w-xl font-grotesk text-3xl font-bold leading-[1.15] text-brand-gray-100 sm:text-4xl lg:text-[2.75rem]">
          <span ref={word1Ref} className="inline-block">
            Answers before
          </span>{" "}
          <span ref={word2Ref} className="inline-block">
            you have to ask
          </span>
        </h2>

        <p
          ref={paraRef}
          className="mt-6 max-w-md font-montserrat text-[15px] leading-relaxed text-brand-gray-300"
        >
          Sizing, shipping, returns — the practical stuff, answered plainly.
        </p>
      </div>

      <div className="mt-14 divide-y divide-brand-gray-800 border-t border-brand-gray-800">
        {FAQS.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={item.q} ref={addItemRef} style={{ willChange: "clip-path" }}>
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-6 text-left"
                aria-expanded={isOpen}
              >
                <span className="font-montserrat text-base font-medium text-brand-gray-100 sm:text-lg">
                  {item.q}
                </span>
                <Plus
                  size={20}
                  className={`shrink-0 text-brand-blue-400 transition-transform duration-400 ${
                    isOpen ? "rotate-45" : "rotate-0"
                  }`}
                />
              </button>

              <div ref={(el) => addPanelRef(el, i)} className="h-0 overflow-hidden">
                <p
                  data-faq-answer
                  className="max-w-2xl pb-6 font-montserrat text-[15px] leading-relaxed text-brand-gray-300"
                  style={{ clipPath: "inset(0 0 100% 0)" }}
                >
                  {item.a}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
