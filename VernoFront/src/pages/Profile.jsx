import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Mail,
  User as UserIcon,
  ShieldCheck,
  Camera,
  Package,
  Calendar,
  ChevronRight,
} from "lucide-react";
import gsap from "gsap";

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

// Placeholder order history — swap this out once orders are actually
// persisted on checkout / fetched from the backend.
const MOCK_ORDERS = [
  { id: "VN-10493", date: "2026-08-28", status: "Delivered", items: 3, total: 184.5 },
  { id: "VN-10412", date: "2026-08-11", status: "Shipped", items: 1, total: 62.0 },
  { id: "VN-10327", date: "2026-07-22", status: "Processing", items: 2, total: 129.0 },
];

const STATUS_STYLES = {
  Delivered: "bg-emerald-400/15 text-emerald-400",
  Shipped: "bg-brand-blue-400/15 text-brand-blue-300",
  Processing: "bg-amber-400/15 text-amber-300",
};

const fmt = (n) => `$${n.toFixed(2)}`;

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function Profile() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(readStoredUser);
  const [loggingOut, setLoggingOut] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "orders"

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

  // Local-only avatar preview for now — reads the file into a data URL and
  // stashes it on the stored user object. Swap for a real upload endpoint
  // once one exists.
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const nextUser = { ...user, avatar: reader.result };
      setUser(nextUser);
      localStorage.setItem("user", JSON.stringify(nextUser));
      window.dispatchEvent(new Event("authChange"));
    };
    reader.readAsDataURL(file);
  };

  if (!user) return null;

  const memberSince = user.createdAt ? formatDate(user.createdAt) : null;

  return (
    <main
      ref={sectionRef}
      className="flex min-h-screen w-full justify-center bg-brand-black px-6 pt-32 pb-16 text-brand-gray-100"
    >
      <div
        ref={cardRef}
        className="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-[260px_1fr]"
      >
        {/* Sidebar */}
        <aside className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="group relative">
              <span className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-brand-blue-600 font-grotesk text-2xl font-semibold text-white">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || "Profile"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  getInitials(user.name)
                )}
              </span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Change profile picture"
                className="absolute -bottom-1 -right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-brand-black text-brand-gray-200 transition-colors duration-200 hover:border-brand-blue-400/60 hover:text-brand-blue-300"
              >
                <Camera size={13} strokeWidth={1.75} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <div>
              <h1 className="font-grotesk text-lg font-semibold">
                {user.name || "Your account"}
              </h1>
              <p className="mt-0.5 font-montserrat text-xs text-brand-gray-400">
                {user.email}
              </p>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 font-montserrat text-sm transition-colors duration-200 ${
                activeTab === "overview"
                  ? "bg-brand-blue-600/15 text-brand-blue-300"
                  : "text-brand-gray-300 hover:bg-white/5"
              }`}
            >
              <UserIcon size={16} strokeWidth={1.75} />
              Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 font-montserrat text-sm transition-colors duration-200 ${
                activeTab === "orders"
                  ? "bg-brand-blue-600/15 text-brand-blue-300"
                  : "text-brand-gray-300 hover:bg-white/5"
              }`}
            >
              <Package size={16} strokeWidth={1.75} />
              Orders
            </button>
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="mt-auto flex cursor-pointer items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 font-montserrat text-sm font-medium text-brand-gray-200 transition-colors duration-300 hover:border-brand-blue-400/60 hover:text-brand-blue-300 disabled:cursor-not-allowed disabled:opacity-70"
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
        </aside>

        {/* Main content */}
        <div className="flex flex-col gap-6">
          {activeTab === "overview" ? (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-4">
                  <p className="font-montserrat text-xs text-brand-gray-400">Total orders</p>
                  <p className="mt-1 font-grotesk text-xl font-semibold">
                    {MOCK_ORDERS.length}
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-4">
                  <p className="font-montserrat text-xs text-brand-gray-400">Last order</p>
                  <p className="mt-1 font-grotesk text-xl font-semibold">
                    {MOCK_ORDERS[0] ? formatDate(MOCK_ORDERS[0].date) : "—"}
                  </p>
                </div>
                <div className="hidden rounded-xl border border-white/10 bg-white/5 px-4 py-4 sm:block">
                  <p className="font-montserrat text-xs text-brand-gray-400">Member since</p>
                  <p className="mt-1 font-grotesk text-xl font-semibold">
                    {memberSince || "—"}
                  </p>
                </div>
              </div>

              {/* Account details */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h2 className="mb-4 font-montserrat text-xs font-medium uppercase tracking-[0.2em] text-brand-gray-400">
                  Account details
                </h2>
                <div className="flex flex-col gap-3">
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
              </div>

              {/* Recent orders preview */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-montserrat text-xs font-medium uppercase tracking-[0.2em] text-brand-gray-400">
                    Recent orders
                  </h2>
                  <button
                    type="button"
                    onClick={() => setActiveTab("orders")}
                    className="flex cursor-pointer items-center gap-1 font-montserrat text-xs text-brand-blue-400 hover:text-brand-blue-300"
                  >
                    View all <ChevronRight size={12} />
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {MOCK_ORDERS.slice(0, 2).map((order) => (
                    <OrderRow key={order.id} order={order} />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="mb-4 font-montserrat text-xs font-medium uppercase tracking-[0.2em] text-brand-gray-400">
                Order history
              </h2>
              {MOCK_ORDERS.length === 0 ? (
                <p className="font-montserrat text-sm text-brand-gray-400">
                  No orders yet.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {MOCK_ORDERS.map((order) => (
                    <OrderRow key={order.id} order={order} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function OrderRow({ order }) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5">
        <Package size={16} className="text-brand-blue-400" strokeWidth={1.75} />
      </div>
      <div className="flex-1">
        <p className="font-montserrat text-sm text-brand-gray-100">{order.id}</p>
        <p className="flex items-center gap-1 font-montserrat text-[11px] text-brand-gray-500">
          <Calendar size={11} /> {formatDate(order.date)} · {order.items} item
          {order.items > 1 ? "s" : ""}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="font-montserrat text-sm text-brand-gray-100">
          {fmt(order.total)}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 font-montserrat text-[10px] font-medium ${STATUS_STYLES[order.status]}`}
        >
          {order.status}
        </span>
      </div>
    </div>
  );
}