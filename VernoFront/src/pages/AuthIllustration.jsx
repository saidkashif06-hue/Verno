import { useRef, useEffect } from "react";
import { Mail, Lock, MessageCircle, Wifi, Check, Gift, Tag, Sparkles, UserPlus } from "lucide-react";
import gsap from "gsap";

/**
 * Original flat-illustration panel for the auth pages — an abstract
 * avatar card with floating icon badges, built from shapes rather than
 * a stock photo or a copied illustration file. `variant` swaps the icon
 * set, accent badge, and float pattern so sign-in and sign-up don't
 * look identical.
 */
export default function AuthIllustration({ variant = "signin" }) {
  const rootRef = useRef(null);
  const cardRef = useRef(null);
  const badgeRefs = useRef([]);
  const cornerBadgeRef = useRef(null);
  badgeRefs.current = [];

  const addBadgeRef = (el) => {
    if (el && !badgeRefs.current.includes(el)) badgeRefs.current.push(el);
  };

  const isSignup = variant === "signup";

  const floatingIcons = isSignup
    ? [
        { Icon: Gift, top: "14%", left: "12%" },
        { Icon: Tag, top: "22%", left: "72%" },
        { Icon: Sparkles, top: "68%", left: "78%" },
        { Icon: Mail, top: "76%", left: "16%" },
      ]
    : [
        { Icon: Mail, top: "14%", left: "70%" },
        { Icon: Lock, top: "20%", left: "14%" },
        { Icon: MessageCircle, top: "70%", left: "18%" },
        { Icon: Wifi, top: "76%", left: "74%" },
      ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, scale: 0.85, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 0.1 }
      );

      gsap.fromTo(
        badgeRefs.current,
        { opacity: 0, scale: 0.4 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)", stagger: 0.1, delay: 0.5 }
      );

      gsap.fromTo(
        cornerBadgeRef.current,
        { opacity: 0, scale: 0.4 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)", delay: 0.85 }
      );

      // Gentle ambient float, staggered per badge so they drift out of sync
      badgeRefs.current.forEach((el, i) => {
        gsap.to(el, {
          y: i % 2 === 0 ? -10 : 10,
          duration: 2.6 + i * 0.3,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: 1 + i * 0.15,
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, [variant]);

  return (
    <div ref={rootRef} className="relative flex h-full w-full items-center justify-center overflow-hidden">
      {/* Ambient background blobs */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-blue-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-brand-blue-700/20 blur-3xl" />

      {/* Decorative scatter — dots, rings, an x mark */}
      <span className="absolute left-[20%] top-[10%] h-1.5 w-1.5 rounded-full bg-brand-blue-400/50" />
      <span className="absolute right-[16%] top-[38%] h-2 w-2 rounded-full bg-brand-blue-400/40" />
      <span className="absolute bottom-[16%] left-[38%] h-1.5 w-1.5 rounded-full bg-brand-blue-400/50" />
      <span className="absolute right-[28%] top-[16%] h-6 w-6 rounded-full border border-brand-blue-400/30" />
      <svg className="absolute bottom-[30%] right-[14%] h-3 w-3 text-brand-blue-400/40" viewBox="0 0 10 10" fill="none">
        <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>

      {/* Floating icon badges */}
      {floatingIcons.map(({ Icon, top, left }, i) => (
        <div
          key={i}
          ref={addBadgeRef}
          style={{ top, left }}
          className="absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-brand-blue-500/25 bg-brand-gray-900/80 shadow-lg shadow-black/20 backdrop-blur-sm"
        >
          <Icon size={18} strokeWidth={1.75} className="text-brand-blue-300" />
        </div>
      ))}

      {/* Central card */}
      <div
        ref={cardRef}
        className="relative flex h-64 w-52 flex-col items-center justify-end overflow-hidden rounded-[2rem] border border-brand-blue-500/25 bg-gradient-to-b from-brand-gray-800/60 to-brand-gray-900/60 pb-0 backdrop-blur-sm"
      >
        <div className="pointer-events-none absolute inset-x-6 top-8 h-24 rounded-full bg-brand-blue-500/10 blur-2xl" />

        {/* Abstract avatar — head + shoulders, built from shapes, no stock art */}
        <div className="relative mb-0 flex flex-col items-center">
          <div className="h-14 w-14 rounded-full bg-brand-gray-100" />
          <div className="-mt-1 h-24 w-36 rounded-t-[3rem] bg-brand-gray-100" />
        </div>

        {/* Corner accent badge — check for sign-in, add for sign-up */}
        <div
          ref={cornerBadgeRef}
          className="absolute bottom-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue-600 shadow-lg shadow-black/30"
        >
          {isSignup ? (
            <UserPlus size={17} strokeWidth={2} className="text-brand-gray-100" />
          ) : (
            <Check size={18} strokeWidth={2.5} className="text-brand-gray-100" />
          )}
        </div>
      </div>
    </div>
  );
}
