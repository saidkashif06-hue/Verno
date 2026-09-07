import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const LOGO_LEFT = "VERN";
const LOGO_RIGHT = "O";

// Total time the preloader stays on screen before it starts wiping away
const DISPLAY_MS = 3000;

export default function Preloader({ onComplete }) {
  const [visible, setVisible] = useState(true);

  const containerRef = useRef(null);
  const bgRef = useRef(null);
  const leftLettersRef = useRef([]);
  const rightLetterRef = useRef(null);
  const apostropheRef = useRef(null);
  const lineRef = useRef(null);
  const fillRef = useRef(null);
  const counterRef = useRef(null);
  const counterObj = useRef({ value: 0 });
  const exitTimerCtx = useRef(null);

  leftLettersRef.current = [];
  const addLetterRef = (el) => {
    if (el && !leftLettersRef.current.includes(el)) leftLettersRef.current.push(el);
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const revealTargets = [
      ...leftLettersRef.current,
      apostropheRef.current,
      rightLetterRef.current,
      lineRef.current,
    ];

    const introCtx = gsap.context(() => {
      // Slow, continuous drift on the background image — runs the whole
      // time the preloader is mounted, independent of the intro/exit tweens
      gsap.fromTo(
        bgRef.current,
        { scale: 1.08 },
        { scale: 1, duration: 4.5, ease: "sine.out" }
      );

      if (prefersReducedMotion) {
        gsap.set(revealTargets, { opacity: 1, y: 0, filter: "blur(0px)" });
        gsap.set(fillRef.current, { scaleX: 1 });
        if (counterRef.current) counterRef.current.textContent = "100";
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onStart: () => gsap.set(revealTargets, { willChange: "transform, opacity, filter" }),
      });

      tl.fromTo(
        leftLettersRef.current,
        { opacity: 0, y: 22, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.05,
        }
      )
        .fromTo(
          apostropheRef.current,
          { opacity: 0, y: 22, filter: "blur(6px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power4.out" },
          "-=0.55"
        )
        .fromTo(
          rightLetterRef.current,
          { opacity: 0, y: 22, filter: "blur(6px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power4.out" },
          "-=0.6"
        )
        .fromTo(
          lineRef.current,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          "-=0.35"
        )
        .to(
          fillRef.current,
          { scaleX: 1, duration: 1.6, ease: "power2.inOut" },
          "-=0.15"
        )
        .to(
          counterObj.current,
          {
            value: 100,
            duration: 1.6,
            ease: "power2.inOut",
            onUpdate: () => {
              if (counterRef.current) {
                counterRef.current.textContent = String(
                  Math.round(counterObj.current.value)
                );
              }
            },
          },
          "<"
        );
    }, containerRef);

    // Fires once the preloader has been visible for DISPLAY_MS, regardless
    // of whether the intro tween has finished — the wipe-out is what
    // actually removes it from the screen.
    const exitTimer = setTimeout(() => {
      const exitCtx = gsap.context(() => {
        const exitTl = gsap.timeline({
          defaults: { ease: "power4.inOut" },
          onComplete: () => {
            setVisible(false);
            onComplete?.();
          },
        });

        exitTl
          .to(revealTargets, {
            opacity: 0,
            y: -14,
            filter: "blur(4px)",
            duration: 0.5,
            ease: "power3.in",
            stagger: 0.025,
          })
          .to(bgRef.current, { opacity: 0, scale: 1.04, duration: 0.7 }, "-=0.35")
          .to(containerRef.current, { yPercent: -100, duration: 0.85 }, "-=0.55");
      }, containerRef);

      // stash so the outer cleanup can revert it too
      exitTimerCtx.current = exitCtx;
    }, DISPLAY_MS);

    return () => {
      introCtx.revert();
      clearTimeout(exitTimer);
      exitTimerCtx.current?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center gap-8 overflow-hidden bg-brand-black"
      role="status"
      aria-label="Loading VERN'O"
      aria-live="polite"
    >
      {/* Background image, kept very low opacity so it reads as texture
          rather than a photo competing with the logo */}
      <div
        ref={bgRef}
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.08]"
        style={{ backgroundImage: "url('/preimg.webp')" }}
      />
      {/* Subtle vignette so the edges stay clean and text keeps contrast */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--tw-color-brand-black,#000)_78%)]" />

      <div className="relative flex items-baseline font-grotesk text-5xl font-semibold tracking-[0.15em] text-brand-gray-100 sm:text-6xl">
        {LOGO_LEFT.split("").map((char, i) => (
          <span key={`l-${i}`} ref={addLetterRef} className="inline-block">
            {char}
          </span>
        ))}
        <span ref={apostropheRef} className="inline-block text-brand-blue-400">
          '
        </span>
        <span ref={rightLetterRef} className="inline-block">
          {LOGO_RIGHT}
        </span>
      </div>

      <div ref={lineRef} className="relative flex w-48 flex-col items-center gap-3 sm:w-56">
        <div className="relative h-[1.5px] w-full overflow-hidden bg-white/10">
          <div
            ref={fillRef}
            className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-brand-blue-400"
          />
        </div>
        <span className="font-montserrat text-xs tracking-[0.25em] text-brand-gray-300 tabular-nums">
          <span ref={counterRef}>0</span>%
        </span>
      </div>
    </div>
  );
}
