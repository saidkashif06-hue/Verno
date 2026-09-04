import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Mail, User as UserIcon, ShieldCheck } from "lucide-react";
import gsap from "gsap";

// Same delay used in the navbar logout, so the spinner reads as
// deliberate rather than a flicker
const LOGOUT_DELAY_MS = 3000;

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase() || "").join("") || "?";
};

export default function Profile() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const cardRef = useRef(null);

  const [user, setUser] = useState(readStoredUser);
  const [loggingOut, setLoggingOut] = useState(false);

  // Not logged in? Bounce to sign in — this page has nothing to show.
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/signin", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleLogout = () => {
    if (loggingOut) return;
    setLoggingOut(true);

    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("authChange"));
      sessionStorage.setItem("logoutMessage", "Logged out successfully");
      window.location.href = "/";
    }, LOGOUT_DELAY_MS);
  };

  if (!user) return null;

  return (
    <main
      ref={sectionRef}
      className="flex min-h-screen w-full items-center justify-center bg-brand-black px-6 pt-32 pb-16 text-brand-gray-100"
    >
      <div
        ref={cardRef}
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-white/5"
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-4 border-b border-white/10 px-8 py-10 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-blue-600 font-grotesk text-2xl font-semibold text-white">
            {getInitials(user.name)}
          </span>
          <div>
            <h1 className="font-grotesk text-2xl font-semibold">
              {user.name || "Your account"}
            </h1>
            <p className="mt-1 font-montserrat text-sm text-brand-gray-400">
              {user.email}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-4 px-8 py-8">
          <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
            <UserIcon size={18} className="text-brand-blue-400" strokeWidth={1.75} />
            <div>
              <p className="font-montserrat text-xs uppercase tracking-wide text-brand-gray-400">
                Full name
              </p>
              <p className="font-montserrat text-sm text-brand-gray-100">
                {user.name || "—"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
            <Mail size={18} className="text-brand-blue-400" strokeWidth={1.75} />
            <div>
              <p className="font-montserrat text-xs uppercase tracking-wide text-brand-gray-400">
                Email
              </p>
              <p className="font-montserrat text-sm text-brand-gray-100">
                {user.email || "—"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
            <ShieldCheck size={18} className="text-brand-blue-400" strokeWidth={1.75} />
            <div>
              <p className="font-montserrat text-xs uppercase tracking-wide text-brand-gray-400">
                Signed in via
              </p>
              <p className="font-montserrat text-sm capitalize text-brand-gray-100">
                {user.provider || "email"}
              </p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="border-t border-white/10 px-8 py-6">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-montserrat text-sm font-medium text-brand-gray-200 transition-colors duration-300 hover:border-brand-blue-400/60 hover:text-brand-blue-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loggingOut ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-gray-300/40 border-t-brand-gray-100" />
                Logging out...
              </>
            ) : (
              <>
                <LogOut size={16} strokeWidth={1.75} />
                Logout
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
