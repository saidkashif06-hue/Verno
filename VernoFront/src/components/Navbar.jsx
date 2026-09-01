import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, User, Menu, X } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "About", to: "/about" },
  { label: "Journal", to: "/journal" },
  { label: "Contact", to: "/contact" },
];
const SOCIALS = [
  { icon: FaFacebookF, href: "https://facebook.com", label: "Facebook" },
  { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
  { icon: FaLinkedinIn, href: "https://linkedin.com", label: "LinkedIn" },
];

// Keeps the logout spinner visible for this long before actually clearing
// the token, so the animation reads as a deliberate action, not a flicker
const LOGOUT_DELAY_MS = 3000;

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem("token")
  );
  const [loggingOut, setLoggingOut] = useState(false);

  const navRef = useRef(null);
  const topRowRef = useRef(null);
  const bottomRowRef = useRef(null);
  const logoRef = useRef(null);
  const bottomLogoRef = useRef(null);
  const taglineRef = useRef(null);
  const socialsRef = useRef(null);
  const linksRef = useRef([]);
  const actionsRef = useRef(null);
  const underlineRefs = useRef({});
  const mobileMenuRef = useRef(null);
  const mobileLinksRef = useRef([]);

  linksRef.current = [];
  mobileLinksRef.current = [];

  const addLinkRef = (el) => {
    if (el && !linksRef.current.includes(el)) linksRef.current.push(el);
  };
  const addMobileLinkRef = (el) => {
    if (el && !mobileLinksRef.current.includes(el)) mobileLinksRef.current.push(el);
  };

  // Keep isLoggedIn in sync with localStorage:
  // - "authChange" fires from SignIn/SignUp/logout in this same tab
  //   (plain localStorage writes don't trigger re-renders on their own)
  // - "storage" fires when the token changes in ANOTHER tab
  useEffect(() => {
    const syncAuth = () => setIsLoggedIn(!!localStorage.getItem("token"));

    window.addEventListener("authChange", syncAuth);
    window.addEventListener("storage", syncAuth);

    return () => {
      window.removeEventListener("authChange", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  const handleLogout = () => {
    if (loggingOut) return;
    setLoggingOut(true);

    // Purely cosmetic delay so the spinner is visible — the actual
    // token removal + redirect happens once this timer fires
    setTimeout(() => {
      localStorage.removeItem("token");

      // A hard refresh wipes all JS state, including any toast on
      // screen — so stash the message and let App.jsx show it once
      // the page has fully reloaded and remounted
      sessionStorage.setItem("logoutMessage", "Logged out successfully");

      // Full page refresh + route to "/" (not a client-side navigate)
      window.location.href = "/";
    }, LOGOUT_DELAY_MS);
  };

  // Entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        navRef.current,
        { yPercent: -100 },
        { yPercent: 0, duration: 0.7, ease: "power4.out" }
      )
        .fromTo(
          taglineRef.current,
          { opacity: 0, x: -14 },
          { opacity: 1, x: 0, duration: 0.5 },
          "-=0.35"
        )
        .fromTo(
          logoRef.current,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.4"
        )
        .fromTo(
          socialsRef.current?.children || [],
          { opacity: 0, x: 14 },
          { opacity: 1, x: 0, duration: 0.4, stagger: 0.06 },
          "-=0.4"
        )
        .fromTo(
          linksRef.current,
          { opacity: 0, y: -8 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 },
          "-=0.2"
        )
        .fromTo(
          actionsRef.current?.children || [],
          { opacity: 0, scale: 0.7 },
          { opacity: 1, scale: 1, duration: 0.35, stagger: 0.06 },
          "-=0.25"
        );
    }, navRef);

    return () => ctx.revert();
  }, []);

  // Lightweight scroll listener — only toggles the header shadow class
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Top row collapses smoothly, scrubbed 1:1 with scroll position — no
  // snap, no fixed-duration tween. Desktop only (mobile keeps the top
  // row visible since it holds the logo + menu button).
  useEffect(() => {
    if (!topRowRef.current || !bottomRowRef.current) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 640px)", () => {
      gsap.set(bottomLogoRef.current, { autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "140 top",
          scrub: 0.4,
        },
      });

      tl.to(topRowRef.current, { height: 0, opacity: 0, ease: "none" }, 0)
        .to(
          bottomRowRef.current,
          { paddingTop: "0.85rem", paddingBottom: "0.85rem", ease: "none" },
          0
        )
        .to(bottomLogoRef.current, { autoAlpha: 1, ease: "none" }, 0);
    });

    return () => mm.revert();
  }, []);

  // Hover underline animation
  const handleLinkEnter = (key) => {
    const el = underlineRefs.current[key];
    if (!el) return;
    gsap.to(el, { scaleX: 1, duration: 0.35, ease: "power3.out" });
  };
  const handleLinkLeave = (key) => {
    const el = underlineRefs.current[key];
    if (!el) return;
    gsap.to(el, { scaleX: 0, duration: 0.3, ease: "power3.in" });
  };

  // Mobile menu open/close animation
  useEffect(() => {
    if (!mobileMenuRef.current) return;

    if (menuOpen) {
      gsap.set(mobileMenuRef.current, { display: "flex" });
      const tl = gsap.timeline();
      tl.fromTo(
        mobileMenuRef.current,
        { clipPath: "inset(0% 0% 100% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.5, ease: "power4.inOut" }
      ).fromTo(
        mobileLinksRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.07, ease: "power3.out" },
        "-=0.2"
      );
    } else {
      gsap.to(mobileMenuRef.current, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 0.4,
        ease: "power3.inOut",
        onComplete: () => gsap.set(mobileMenuRef.current, { display: "none" }),
      });
    }
  }, [menuOpen]);

  return (
    <header
      ref={navRef}
      className={`fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-brand-black/95 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? "shadow-lg shadow-black/40" : ""
      }`}
    >
      {/* Top row — tagline / logo / socials */}
      <div ref={topRowRef} className="overflow-hidden border-b border-white/5">
        <div className="mx-auto grid max-w-7xl grid-cols-3 items-center px-6 py-3 lg:px-10">
          <span
            ref={taglineRef}
            className="hidden font-montserrat text-xs uppercase tracking-[0.2em] text-brand-gray-300 sm:block"
          >
            Crafted in small batches — SS26
          </span>

          <Link
            ref={logoRef}
            to="/"
            className="col-start-2 justify-self-center font-grotesk text-2xl font-semibold tracking-[0.15em] text-brand-gray-100"
          >
            VERN<span className="text-brand-blue-400">'</span>O
          </Link>

          <div
            ref={socialsRef}
            className="col-start-3 hidden items-center justify-self-end gap-4 sm:flex"
          >
            {SOCIALS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="text-brand-gray-300 transition-colors duration-300 hover:text-brand-blue-400"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>

          {/* Mobile toggle sits in the top row */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((prev) => !prev)}
            className="col-start-3 justify-self-end cursor-pointer text-brand-gray-100 sm:hidden"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Bottom row — page links / account + shop */}
      <div className="hidden sm:block">
        <div ref={bottomRowRef} className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-6 py-4 lg:px-10">
          <Link
            ref={bottomLogoRef}
            to="/"
            className="invisible justify-self-start font-grotesk text-lg font-semibold tracking-[0.12em] text-brand-gray-100 opacity-0"
          >
            VERN<span className="text-brand-blue-400">'</span>O
          </Link>

          <ul className="col-start-2 flex items-center justify-center gap-10">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <li key={link.to} ref={addLinkRef} className="relative">
                  <Link
                    to={link.to}
                    onMouseEnter={() => handleLinkEnter(link.to)}
                    onMouseLeave={() => handleLinkLeave(link.to)}
                    className={`font-montserrat text-sm font-medium uppercase tracking-wide transition-colors duration-300 ${
                      isActive
                        ? "text-brand-blue-400"
                        : "text-brand-gray-200 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                  <span
                    ref={(el) => (underlineRefs.current[link.to] = el)}
                    className="absolute -bottom-1.5 left-0 h-[1.5px] w-full origin-left bg-brand-blue-400"
                    style={{ transform: `scaleX(${isActive ? 1 : 0})` }}
                  />
                </li>
              );
            })}
          </ul>

          <div ref={actionsRef} className="col-start-3 flex items-center justify-end gap-5">
            {isLoggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                aria-label="Log out"
                className="flex cursor-pointer items-center gap-2 font-montserrat text-sm font-medium text-brand-gray-200 transition-colors duration-300 hover:text-brand-blue-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loggingOut ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-brand-gray-300/40 border-t-brand-gray-100" />
                    Logging out...
                  </>
                ) : (
                  "Logout"
                )}
              </button>
            ) : (
              <Link
                to="/signin"
                aria-label="Account"
                className="text-brand-gray-200 transition-colors duration-300 hover:text-brand-blue-400"
              >
                <User size={20} strokeWidth={1.75} />
              </Link>
            )}
            <Link
              to="/shop"
              aria-label="Shop"
              className="flex items-center gap-2 rounded-full border border-brand-blue-700 bg-brand-blue-900/40 px-4 py-2 font-montserrat text-sm font-medium text-brand-gray-100 transition-colors duration-300 hover:border-brand-blue-400 hover:text-brand-blue-300"
            >
              <ShoppingBag size={18} strokeWidth={1.75} />
              Shop
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        ref={mobileMenuRef}
        className="hidden w-full flex-col gap-8 border-t border-white/10 bg-brand-black px-6 py-10 sm:hidden"
        style={{ clipPath: "inset(0% 0% 100% 0%)" }}
      >
        <ul className="flex flex-col gap-6">
          {NAV_LINKS.map((link) => (
            <li key={link.to} ref={addMobileLinkRef}>
              <Link
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="font-grotesk text-3xl font-medium uppercase tracking-wide text-brand-gray-100 hover:text-brand-blue-400"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div ref={addMobileLinkRef} className="flex items-center gap-6 pt-2">
          {isLoggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex cursor-pointer items-center gap-2 font-montserrat text-sm uppercase tracking-wide text-brand-gray-200 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loggingOut ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-brand-gray-300/40 border-t-brand-gray-100" />
                  Logging out...
                </>
              ) : (
                "Logout"
              )}
            </button>
          ) : (
            <Link
              to="/signin"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 font-montserrat text-sm uppercase tracking-wide text-brand-gray-200"
            >
              <User size={20} strokeWidth={1.75} />
              Account
            </Link>
          )}
          <Link
            to="/shop"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 rounded-full border border-brand-blue-700 bg-brand-blue-900/40 px-5 py-2.5 font-montserrat text-sm font-medium text-brand-gray-100"
          >
            <ShoppingBag size={18} strokeWidth={1.75} />
            Shop
          </Link>
        </div>

        <div ref={addMobileLinkRef} className="flex items-center gap-5 border-t border-white/10 pt-6">
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
    </header>
  );
}
