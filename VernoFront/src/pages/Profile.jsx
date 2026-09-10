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
  LayoutDashboard,
  Heart,
  MapPin,
  Settings as SettingsIcon,
  Plus,
  Trash2,
  Star,
  Bell,
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

const readStored = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase() || "").join("") || "?";
};

const fmt = (n) => `$${n.toFixed(2)}`;

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

// Placeholder order history — swap for a real fetch once checkout writes
// orders somewhere (backend, or localStorage as a stopgap).
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

// Seed data for the wishlist — only used the first time, then it lives in
// localStorage so removals persist.
const DEFAULT_WISHLIST = [
  { id: "w1", name: "Wool Overcoat", price: 320 },
  { id: "w2", name: "Tapered Trouser", price: 145 },
  { id: "w3", name: "Merino Crewneck", price: 98 },
];

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "orders", label: "Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "settings", label: "Settings", icon: SettingsIcon },
];

export default function Profile() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(readStoredUser);
  const [loggingOut, setLoggingOut] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const [wishlist, setWishlist] = useState(() => readStored("wishlist", DEFAULT_WISHLIST));
  const [addresses, setAddresses] = useState(() => readStored("addresses", []));
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Not logged in? Bounce to sign in — this page has nothing to show.
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/signin", { replace: true });
    }
  }, [navigate]);

  // Fade in the active panel on first mount and whenever the tab changes.
  useEffect(() => {
    if (!contentRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("addresses", JSON.stringify(addresses));
  }, [addresses]);

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

  // Local-only avatar preview — stashes a data URL on the stored user
  // object. Swap for a real upload endpoint once one exists.
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

  const updateUserField = (field, value) => {
    const nextUser = { ...user, [field]: value };
    setUser(nextUser);
    localStorage.setItem("user", JSON.stringify(nextUser));
    window.dispatchEvent(new Event("authChange"));
  };

  const removeFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const addAddress = (address) => {
    setAddresses((prev) => {
      const isFirst = prev.length === 0;
      return [...prev, { ...address, id: crypto.randomUUID(), isDefault: isFirst }];
    });
    setShowAddressForm(false);
  };

  const removeAddress = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const setDefaultAddress = (id) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  if (!user) return null;

  const firstName = user.name?.split(" ")[0] || "there";
  const memberSince = user.createdAt ? formatDate(user.createdAt) : "—";

  return (
    <main ref={sectionRef} className="min-h-screen w-full bg-brand-black mt-10 text-brand-gray-100">
      <div className="grid w-full grid-cols-1 md:grid-cols-[272px_1fr] md:items-start">
        {/* Sidebar */}
        <aside className="flex flex-col gap-8 border-b border-white/10 px-6 py-8 md:sticky md:top-24 md:h-[calc(100vh-96px)] md:border-b-0 md:border-r md:px-8">
          <div className="flex items-center gap-4">
            <div className="group relative shrink-0">
              <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-brand-blue-600 font-grotesk text-xl font-semibold text-white">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name || "Profile"} className="h-full w-full object-cover" />
                ) : (
                  getInitials(user.name)
                )}
              </span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Change profile picture"
                className="absolute -bottom-1 -right-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-brand-black text-brand-gray-200 transition-colors duration-200 hover:border-brand-blue-400/60 hover:text-brand-blue-300"
              >
                <Camera size={12} strokeWidth={1.75} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate font-grotesk text-base font-semibold">{user.name || "Your account"}</p>
              <p className="truncate font-montserrat text-xs text-brand-gray-400">{user.email}</p>
            </div>
          </div>

          <nav className="-mx-2 flex gap-1 overflow-x-auto md:mx-0 md:flex-col md:overflow-visible">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`flex shrink-0 cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 font-montserrat text-sm transition-colors duration-200 ${
                  activeTab === id
                    ? "bg-brand-blue-600/15 text-brand-blue-300"
                    : "text-brand-gray-300 hover:bg-white/5"
                }`}
              >
                <Icon size={16} strokeWidth={1.75} />
                {label}
              </button>
            ))}
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="mt-auto hidden cursor-pointer items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 font-montserrat text-sm font-medium text-brand-gray-200 transition-colors duration-300 hover:border-brand-blue-400/60 hover:text-brand-blue-300 disabled:cursor-not-allowed disabled:opacity-70 md:flex"
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
        <div ref={contentRef} className="min-w-0 px-6 py-8 md:px-10 md:py-10">
          {activeTab === "overview" && (
            <Overview
              user={user}
              firstName={firstName}
              memberSince={memberSince}
              wishlistCount={wishlist.length}
              onViewOrders={() => setActiveTab("orders")}
            />
          )}

          {activeTab === "orders" && <Orders />}

          {activeTab === "wishlist" && (
            <Wishlist items={wishlist} onRemove={removeFromWishlist} />
          )}

          {activeTab === "addresses" && (
            <Addresses
              addresses={addresses}
              showForm={showAddressForm}
              onToggleForm={() => setShowAddressForm((v) => !v)}
              onAdd={addAddress}
              onRemove={removeAddress}
              onSetDefault={setDefaultAddress}
            />
          )}

          {activeTab === "settings" && (
            <SettingsPanel user={user} onUpdateField={updateUserField} />
          )}

          {/* Logout — only shown here on mobile, where the sidebar button is hidden */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="mt-8 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 font-montserrat text-sm font-medium text-brand-gray-200 transition-colors duration-300 hover:border-brand-blue-400/60 hover:text-brand-blue-300 disabled:cursor-not-allowed disabled:opacity-70 md:hidden"
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </main>
  );
}

function SectionHeading({ title, action }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="font-montserrat text-sm font-medium text-brand-gray-200">{title}</h2>
      {action}
    </div>
  );
}

function Overview({ user, firstName, memberSince, wishlistCount, onViewOrders }) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-grotesk text-2xl font-semibold">Welcome back, {firstName}</h1>
        <p className="mt-1 font-montserrat text-sm text-brand-gray-400">
          Here's what's happening with your account.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total orders" value={MOCK_ORDERS.length} />
        <StatCard label="Last order" value={formatDate(MOCK_ORDERS[0].date)} />
        <StatCard label="Wishlist items" value={wishlistCount} />
        <StatCard label="Member since" value={memberSince} className="hidden lg:block" />
      </div>

      <div>
        <SectionHeading title="Account details" />
        <div className="flex flex-col gap-3">
          <DetailRow icon={UserIcon} label="Full name" value={user.name || "—"} />
          <DetailRow icon={Mail} label="Email" value={user.email || "—"} />
          <DetailRow icon={ShieldCheck} label="Signed in via" value={user.provider || "email"} capitalize />
        </div>
      </div>

      <div>
        <SectionHeading
          title="Recent orders"
          action={
            <button
              type="button"
              onClick={onViewOrders}
              className="flex cursor-pointer items-center gap-1 font-montserrat text-xs text-brand-blue-400 hover:text-brand-blue-300"
            >
              View all <ChevronRight size={12} />
            </button>
          }
        />
        <div className="flex flex-col gap-2">
          {MOCK_ORDERS.slice(0, 2).map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, className = "" }) {
  return (
    <div className={`rounded-xl border border-white/10 bg-white/5 px-4 py-4 ${className}`}>
      <p className="font-montserrat text-xs text-brand-gray-400">{label}</p>
      <p className="mt-1 truncate font-grotesk text-xl font-semibold">{value}</p>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value, capitalize }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
      <Icon size={18} className="text-brand-blue-400" strokeWidth={1.75} />
      <div>
        <p className="font-montserrat text-xs uppercase tracking-wide text-brand-gray-400">{label}</p>
        <p className={`font-montserrat text-sm text-brand-gray-100 ${capitalize ? "capitalize" : ""}`}>{value}</p>
      </div>
    </div>
  );
}

function OrderRow({ order }) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5">
        <Package size={16} className="text-brand-blue-400" strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-montserrat text-sm text-brand-gray-100">{order.id}</p>
        <p className="flex items-center gap-1 font-montserrat text-[11px] text-brand-gray-500">
          <Calendar size={11} /> {formatDate(order.date)} · {order.items} item{order.items > 1 ? "s" : ""}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="font-montserrat text-sm text-brand-gray-100">{fmt(order.total)}</span>
        <span className={`rounded-full px-2 py-0.5 font-montserrat text-[10px] font-medium ${STATUS_STYLES[order.status]}`}>
          {order.status}
        </span>
      </div>
    </div>
  );
}

function Orders() {
  return (
    <div>
      <h1 className="font-grotesk text-2xl font-semibold">Orders</h1>
      <p className="mt-1 font-montserrat text-sm text-brand-gray-400">
        Track and review everything you've ordered.
      </p>

      <div className="mt-6 flex flex-col gap-2">
        {MOCK_ORDERS.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No orders yet"
            body="Once you place an order, it'll show up here."
          />
        ) : (
          MOCK_ORDERS.map((order) => <OrderRow key={order.id} order={order} />)
        )}
      </div>
    </div>
  );
}

function Wishlist({ items, onRemove }) {
  return (
    <div>
      <h1 className="font-grotesk text-2xl font-semibold">Wishlist</h1>
      <p className="mt-1 font-montserrat text-sm text-brand-gray-400">
        Pieces you've saved for later.
      </p>

      {items.length === 0 ? (
        <div className="mt-6">
          <EmptyState icon={Heart} title="Your wishlist is empty" body="Save items you like from the shop to find them here." />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5">
              <div className="flex h-28 items-center justify-center bg-gradient-to-br from-brand-blue-900/60 to-white/5">
                <span className="font-grotesk text-lg font-semibold text-brand-blue-300/80">
                  {getInitials(item.name)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 px-3 py-3">
                <div className="min-w-0">
                  <p className="truncate font-montserrat text-xs text-brand-gray-100">{item.name}</p>
                  <p className="font-montserrat text-[11px] text-brand-gray-500">{fmt(item.price)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  aria-label={`Remove ${item.name} from wishlist`}
                  className="shrink-0 cursor-pointer text-brand-gray-500 hover:text-brand-blue-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Addresses({ addresses, showForm, onToggleForm, onAdd, onRemove, onSetDefault }) {
  const [form, setForm] = useState({ label: "", fullName: "", line1: "", city: "", postal: "" });

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.fullName || !form.line1 || !form.city || !form.postal) return;
    onAdd(form);
    setForm({ label: "", fullName: "", line1: "", city: "", postal: "" });
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-grotesk text-2xl font-semibold">Addresses</h1>
          <p className="mt-1 font-montserrat text-sm text-brand-gray-400">
            Manage the addresses you ship to.
          </p>
        </div>
        <button
          type="button"
          onClick={onToggleForm}
          className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 font-montserrat text-xs font-medium text-brand-gray-200 hover:border-brand-blue-400/60 hover:text-brand-blue-300"
        >
          <Plus size={14} /> Add address
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              placeholder="Label (e.g. Home)"
              value={form.label}
              onChange={handleChange("label")}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 font-montserrat text-sm text-brand-gray-100 placeholder:text-brand-gray-500 focus:border-brand-blue-400 focus:outline-none"
            />
            <input
              required
              placeholder="Full name"
              value={form.fullName}
              onChange={handleChange("fullName")}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 font-montserrat text-sm text-brand-gray-100 placeholder:text-brand-gray-500 focus:border-brand-blue-400 focus:outline-none"
            />
          </div>
          <input
            required
            placeholder="Street address"
            value={form.line1}
            onChange={handleChange("line1")}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 font-montserrat text-sm text-brand-gray-100 placeholder:text-brand-gray-500 focus:border-brand-blue-400 focus:outline-none"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              required
              placeholder="City"
              value={form.city}
              onChange={handleChange("city")}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 font-montserrat text-sm text-brand-gray-100 placeholder:text-brand-gray-500 focus:border-brand-blue-400 focus:outline-none"
            />
            <input
              required
              placeholder="Postal code"
              value={form.postal}
              onChange={handleChange("postal")}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 font-montserrat text-sm text-brand-gray-100 placeholder:text-brand-gray-500 focus:border-brand-blue-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="mt-1 cursor-pointer self-start rounded-full bg-brand-blue-600 px-5 py-2.5 font-montserrat text-xs font-medium text-white hover:bg-brand-blue-500"
          >
            Save address
          </button>
        </form>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {addresses.length === 0 ? (
          <EmptyState icon={MapPin} title="No saved addresses" body="Add an address to speed through checkout next time." />
        ) : (
          addresses.map((address) => (
            <div key={address.id} className="flex items-start justify-between gap-4 rounded-lg border border-white/10 bg-white/5 px-4 py-3.5">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-brand-blue-400" strokeWidth={1.75} />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-montserrat text-sm text-brand-gray-100">
                      {address.label || "Address"}
                    </p>
                    {address.isDefault && (
                      <span className="flex items-center gap-1 rounded-full bg-brand-blue-600/15 px-2 py-0.5 font-montserrat text-[10px] font-medium text-brand-blue-300">
                        <Star size={9} fill="currentColor" /> Default
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 font-montserrat text-xs text-brand-gray-400">
                    {address.fullName} · {address.line1}, {address.city} {address.postal}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                {!address.isDefault && (
                  <button
                    type="button"
                    onClick={() => onSetDefault(address.id)}
                    className="cursor-pointer font-montserrat text-xs text-brand-blue-400 hover:text-brand-blue-300"
                  >
                    Set default
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onRemove(address.id)}
                  aria-label="Remove address"
                  className="cursor-pointer text-brand-gray-500 hover:text-brand-blue-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function SettingsPanel({ user, onUpdateField }) {
  const [name, setName] = useState(user.name || "");
  const [saved, setSaved] = useState(false);
  const [prefs, setPrefs] = useState(() => readStored("preferences", { orderUpdates: true, promotions: false }));

  useEffect(() => {
    localStorage.setItem("preferences", JSON.stringify(prefs));
  }, [prefs]);

  const handleSaveName = (e) => {
    e.preventDefault();
    onUpdateField("name", name);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const togglePref = (key) => setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-grotesk text-2xl font-semibold">Settings</h1>
        <p className="mt-1 font-montserrat text-sm text-brand-gray-400">
          Manage your profile and how we contact you.
        </p>
      </div>

      <div>
        <SectionHeading title="Profile" />
        <form onSubmit={handleSaveName} className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="font-montserrat text-xs text-brand-gray-400">Full name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 font-montserrat text-sm text-brand-gray-100 focus:border-brand-blue-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="cursor-pointer rounded-full bg-brand-blue-600 px-5 py-2.5 font-montserrat text-xs font-medium text-white hover:bg-brand-blue-500"
          >
            {saved ? "Saved" : "Save changes"}
          </button>
        </form>
        <p className="mt-2 font-montserrat text-[11px] text-brand-gray-500">
          Email changes will be available once account settings are connected to the backend.
        </p>
      </div>

      <div>
        <SectionHeading title="Notifications" />
        <div className="flex flex-col gap-2">
          <PrefToggle
            icon={Bell}
            label="Order updates"
            description="Shipping and delivery notifications"
            checked={prefs.orderUpdates}
            onChange={() => togglePref("orderUpdates")}
          />
          <PrefToggle
            icon={Mail}
            label="Promotions"
            description="New arrivals, sales and restocks"
            checked={prefs.promotions}
            onChange={() => togglePref("promotions")}
          />
        </div>
      </div>

      <div>
        <SectionHeading title="Password" />
        <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3.5">
          <p className="font-montserrat text-sm text-brand-gray-300">
            Password changes aren't available yet — coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}

function PrefToggle({ icon: Icon, label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/5 px-4 py-3.5">
      <div className="flex items-center gap-3">
        <Icon size={18} className="text-brand-blue-400" strokeWidth={1.75} />
        <div>
          <p className="font-montserrat text-sm text-brand-gray-100">{label}</p>
          <p className="font-montserrat text-xs text-brand-gray-500">{description}</p>
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
          checked ? "bg-brand-blue-600" : "bg-white/10"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-200 ${
            checked ? "translate-x-[22px]" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

function EmptyState({ icon: Icon, title, body }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-white/10 py-12 text-center">
      <Icon size={22} className="text-brand-gray-500" strokeWidth={1.5} />
      <p className="font-montserrat text-sm text-brand-gray-200">{title}</p>
      <p className="max-w-xs font-montserrat text-xs text-brand-gray-500">{body}</p>
    </div>
  );
}