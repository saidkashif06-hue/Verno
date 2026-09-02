import { useState, useMemo, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  X,
  Plus,
  Minus,
  ShoppingBag,
  Heart,
  Search,
  SlidersHorizontal,
  Star,
  Eye,
  Check,
  ChevronDown,
  LogIn,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCart, useWishlist } from "../store/useCartStore";

gsap.registerPlugin(ScrollTrigger);

/* ================================ DATA ================================ */

const CATEGORIES = ["All", "Hoodies", "T-Shirts", "Jackets", "Knitwear", "Accessories"];
const SIZES_APPAREL = ["XS", "S", "M", "L", "XL"];
const SIZES_ONE = ["One Size"];
const SIZES_SHOE = ["7", "8", "9", "10", "11"];
const ALL_SIZES = ["XS", "S", "M", "L", "XL", "One Size", "7", "8", "9", "10", "11"];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

const PRODUCTS = [
  {
    id: 1,
    name: "Vern'o Striped Polo — Navy",
    price: 68,
    category: "T-Shirts",
    img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop",
    sizes: SIZES_APPAREL,
    rating: 4.6,
    reviews: 128,
    stock: "in",
    description:
      "A breathable cotton-piqué polo with a subtle navy stripe. Cut for a relaxed fit through the chest with a slightly tapered waist.",
  },
  {
    id: 2,
    name: "Vern'o Court Sneaker — Blue",
    price: 124,
    category: "Accessories",
    img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    sizes: SIZES_SHOE,
    rating: 4.8,
    reviews: 342,
    stock: "low",
    description:
      "Minimal court silhouette in full-grain leather with a cushioned midsole built for all-day wear.",
  },
  {
    id: 3,
    name: "Vern'o Track Jacket — Navy",
    price: 142,
    category: "Jackets",
    img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop",
    sizes: SIZES_APPAREL,
    rating: 4.4,
    reviews: 76,
    stock: "in",
    description:
      "Lightweight shell track jacket with a stand collar and ribbed cuffs. Water-resistant finish for transitional weather.",
  },
  {
    id: 4,
    name: "Vern'o Pique Tee — Fog Grey",
    price: 54,
    category: "T-Shirts",
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
    sizes: SIZES_APPAREL,
    rating: 4.2,
    reviews: 54,
    stock: "in",
    description:
      "Heavyweight cotton tee in a soft fog grey. Garment-dyed for a lived-in feel from the first wear.",
  },
  {
    id: 5,
    name: "Vern'o Wool Beanie — Navy",
    price: 38,
    category: "Accessories",
    img: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=800&auto=format&fit=crop",
    sizes: SIZES_ONE,
    rating: 4.7,
    reviews: 91,
    stock: "in",
    description: "Merino wool rib-knit beanie. Unlined, close fit, made to layer under a hood.",
  },
  {
    id: 6,
    name: "Vern'o Pullover Hoodie — Slate",
    price: 96,
    category: "Hoodies",
    img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop",
    sizes: SIZES_APPAREL,
    rating: 4.9,
    reviews: 210,
    stock: "in",
    description:
      "Heavyweight brushed-fleece hoodie in slate. Dropped shoulder, kangaroo pocket, ribbed hem.",
  },
  {
    id: 7,
    name: "Vern'o Graphic Crewneck — Chalk",
    price: 78,
    category: "Knitwear",
    img: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop",
    sizes: SIZES_APPAREL,
    rating: 4.1,
    reviews: 38,
    stock: "out",
    description: "Fine-gauge cotton crewneck with a tonal chest graphic. Runs true to size.",
  },
  {
    id: 8,
    name: "Vern'o Colourblock Sweatshirt",
    price: 88,
    category: "Hoodies",
    img: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop",
    sizes: SIZES_APPAREL,
    rating: 4.3,
    reviews: 63,
    stock: "in",
    description: "Colourblocked loopback sweatshirt with a relaxed drop-shoulder cut.",
  },
];

const fmt = (n) => `$${n.toFixed(2)}`;
const PAGE_SIZE = 8;

/* ============================ STAR RATING ============================ */

function Stars({ rating, reviews, size = 12 }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={size}
            strokeWidth={1.5}
            className={i < Math.round(rating) ? "fill-brand-blue-400 text-brand-blue-400" : "text-brand-gray-600"}
          />
        ))}
      </div>
      {reviews != null && (
        <span className="font-montserrat text-[11px] text-brand-gray-500">({reviews})</span>
      )}
    </div>
  );
}

/* ============================ STOCK BADGE ============================ */

function StockBadge({ stock }) {
  if (stock === "out") {
    return (
      <span className="absolute left-3 top-3 rounded-full bg-brand-black/80 px-2.5 py-1 font-montserrat text-[10px] font-medium uppercase tracking-wide text-brand-gray-300 backdrop-blur-sm">
        Sold out
      </span>
    );
  }
  if (stock === "low") {
    return (
      <span className="absolute left-3 top-3 rounded-full bg-amber-400/90 px-2.5 py-1 font-montserrat text-[10px] font-medium uppercase tracking-wide text-brand-black">
        Low stock
      </span>
    );
  }
  return null;
}

/* ============================== TOAST ================================ */

function Toast({ toast }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!toast || !ref.current) return;
    gsap.fromTo(
      ref.current,
      { opacity: 0, x: 40, y: 0 },
      { opacity: 1, x: 0, duration: 0.4, ease: "power3.out" }
    );
  }, [toast]);

  if (!toast) return null;

  return (
    <div
      ref={ref}
      className="fixed bottom-24 right-6 z-[100] flex items-center gap-3 rounded-xl border border-white/10 bg-brand-gray-900 px-4 py-3 shadow-2xl"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-400/15">
        <Check size={14} strokeWidth={2.5} className="text-emerald-400" />
      </span>
      <p className="font-montserrat text-xs text-brand-gray-100">{toast}</p>
    </div>
  );
}

/* ============================ FILTER PANEL ============================ */

function FilterPanel({ active, setActive, price, setPrice, sizeFilter, toggleSize, onClear }) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h4 className="mb-4 font-montserrat text-xs font-medium uppercase tracking-[0.2em] text-brand-gray-100">
          Category
        </h4>
        <ul className="flex flex-col gap-2.5">
          {CATEGORIES.map((cat) => (
            <li key={cat}>
              <button
                onClick={() => setActive(cat)}
                className={`cursor-pointer font-montserrat text-sm transition-colors duration-200 ${
                  active === cat
                    ? "font-medium text-brand-blue-400"
                    : "text-brand-gray-400 hover:text-brand-gray-100"
                }`}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="mb-4 font-montserrat text-xs font-medium uppercase tracking-[0.2em] text-brand-gray-100">
          Price
        </h4>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={0}
            value={price[0]}
            onChange={(e) => setPrice([Number(e.target.value) || 0, price[1]])}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-montserrat text-xs text-brand-gray-100 focus:border-brand-blue-400 focus:outline-none"
          />
          <span className="text-brand-gray-600">–</span>
          <input
            type="number"
            min={0}
            value={price[1]}
            onChange={(e) => setPrice([price[0], Number(e.target.value) || 0])}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-montserrat text-xs text-brand-gray-100 focus:border-brand-blue-400 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <h4 className="mb-4 font-montserrat text-xs font-medium uppercase tracking-[0.2em] text-brand-gray-100">
          Size
        </h4>
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((s) => {
            const isSelected = sizeFilter.includes(s);
            return (
              <button
                key={s}
                onClick={() => toggleSize(s)}
                className={`cursor-pointer rounded-full border px-3 py-1.5 font-montserrat text-[11px] font-medium uppercase transition-colors duration-200 ${
                  isSelected
                    ? "border-brand-blue-500 bg-brand-blue-600 text-brand-gray-100"
                    : "border-white/10 text-brand-gray-400 hover:border-brand-blue-400 hover:text-brand-blue-300"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={onClear}
        className="w-fit cursor-pointer font-montserrat text-xs font-medium text-brand-gray-400 underline decoration-brand-gray-600 underline-offset-4 hover:text-brand-blue-400"
      >
        Clear all filters
      </button>
    </div>
  );
}

/* ============================ PRODUCT CARD ============================ */

/**
 * Shared size-selector + add-to-cart control block, reused for:
 *  - the desktop hover overlay (sm and up)
 *  - the always-visible mobile block underneath the image (below sm)
 */
function SizeAddControls({ product, size, setSize, onAdd, variant }) {
  const isOverlay = variant === "overlay";

  return (
    <>
      <div className="flex flex-wrap gap-1.5">
        {product.sizes.map((s) => {
          const isSelected = size === s;
          return (
            <button
              key={s}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSize(s);
              }}
              className={`flex h-8 min-w-[2rem] cursor-pointer items-center justify-center rounded-full border px-2 font-montserrat text-[11px] font-medium uppercase tracking-wide transition-colors duration-200 active:scale-95 ${
                isSelected
                  ? "border-brand-blue-500 bg-brand-blue-600 text-brand-gray-100"
                  : isOverlay
                  ? "border-brand-gray-100/30 bg-brand-black/60 text-brand-gray-100 backdrop-blur-sm hover:border-brand-blue-400 hover:bg-brand-blue-600/80"
                  : "border-white/10 bg-white/5 text-brand-gray-200 hover:border-brand-blue-400"
              }`}
            >
              {s}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onAdd();
        }}
        disabled={!size}
        className={`mt-2 flex w-full items-center justify-center gap-2 rounded-full py-2.5 font-montserrat text-xs font-medium uppercase tracking-wide transition-all duration-300 active:scale-[0.98] ${
          size
            ? isOverlay
              ? "cursor-pointer bg-brand-gray-100 text-brand-black hover:bg-brand-blue-300"
              : "cursor-pointer bg-brand-gray-100 text-brand-black hover:bg-brand-blue-300"
            : isOverlay
            ? "cursor-not-allowed bg-brand-gray-100/30 text-brand-gray-100/50"
            : "cursor-not-allowed bg-white/5 text-brand-gray-500"
        }`}
      >
        <ShoppingBag size={14} strokeWidth={2} />
        {size ? "Add to cart" : "Select a size"}
      </button>
    </>
  );
}

function ProductCard({ product, index, isWishlisted, onToggleWishlist, onAddToCart, onQuickView }) {
  const cardRef = useRef(null);
  const [size, setSize] = useState(null);
  const soldOut = product.stock === "out";

  useEffect(() => {
    if (!cardRef.current) return;
    const col = index % 4;
    gsap.set(cardRef.current, { opacity: 0, x: 40 });

    const st = ScrollTrigger.create({
      trigger: cardRef.current,
      start: "top 90%",
      once: true,
      onEnter: () => {
        gsap.to(cardRef.current, {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: "power3.out",
          delay: col * 0.06,
        });
      },
    });

    return () => st.kill();
  }, [index]);

  const handleAdd = () => {
    if (!size || soldOut) return;
    onAddToCart(product, size);
    setSize(null);
  };

  return (
    <div ref={cardRef} data-card className="group block">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-brand-gray-800">
        <img
          src={product.img}
          alt={product.name}
          loading="lazy"
          className={`h-full w-full object-cover transition-transform duration-700 ease-out ${
            soldOut ? "opacity-50 grayscale" : "sm:group-hover:scale-105"
          }`}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-black/70 via-brand-black/10 to-transparent opacity-0 transition-opacity duration-300 sm:group-hover:opacity-100" />

        <StockBadge stock={product.stock} />

        {/* Wishlist — visible by default on mobile, hover-reveal not needed since it's always on */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          aria-label="Toggle wishlist"
          className="absolute right-3 top-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-brand-black/60 backdrop-blur-sm transition-colors duration-200 hover:bg-brand-black/90"
        >
          <Heart
            size={15}
            strokeWidth={2}
            className={isWishlisted ? "fill-brand-blue-400 text-brand-blue-400" : "text-brand-gray-100"}
          />
        </button>

        {/* Quick view — always visible on mobile (no hover), hover-reveal only on sm+ */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onQuickView(product);
          }}
          className="absolute right-3 top-14 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-brand-black/60 opacity-100 backdrop-blur-sm transition-all duration-200 hover:bg-brand-black/90 sm:opacity-0 sm:group-hover:opacity-100"
          aria-label="Quick view"
        >
          <Eye size={15} strokeWidth={2} className="text-brand-gray-100" />
        </button>

        {/* Size + add-to-cart overlay — desktop only (hover-driven) */}
        {!soldOut && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden translate-y-full p-3 opacity-0 transition-all duration-300 ease-out sm:block sm:group-hover:pointer-events-auto sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
            <SizeAddControls product={product} size={size} setSize={setSize} onAdd={handleAdd} variant="overlay" />
          </div>
        )}
      </div>

      <div className="mt-3.5 flex items-start justify-between gap-3">
        <div>
          <p className="font-montserrat text-[13px] leading-snug text-brand-gray-300">
            {product.name}
            {size && <span className="ml-1.5 text-brand-blue-300">· {size}</span>}
          </p>
          <div className="mt-1">
            <Stars rating={product.rating} reviews={product.reviews} />
          </div>
        </div>
        <span className="whitespace-nowrap font-montserrat text-[13px] font-medium text-brand-gray-100">
          {fmt(product.price)}
        </span>
      </div>

      {/* Size + add-to-cart — always visible below the image on mobile, since hover doesn't work on touch */}
      {!soldOut && (
        <div className="mt-3 sm:hidden">
          <SizeAddControls product={product} size={size} setSize={setSize} onAdd={handleAdd} variant="inline" />
        </div>
      )}
    </div>
  );
}

/* ============================ QUICK VIEW MODAL ============================ */

function QuickViewModal({ product, onClose, onAddToCart, isWishlisted, onToggleWishlist }) {
  const backdropRef = useRef(null);
  const panelRef = useRef(null);
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!product) return;
    setSize(null);
    setQty(1);
    gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
    gsap.fromTo(
      panelRef.current,
      { opacity: 0, y: 24, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power3.out" }
    );
  }, [product]);

  if (!product) return null;
  const soldOut = product.stock === "out";

  const handleClose = () => {
    gsap.to(panelRef.current, { opacity: 0, y: 16, scale: 0.97, duration: 0.25, ease: "power2.in" });
    gsap.to(backdropRef.current, { opacity: 0, duration: 0.25, onComplete: onClose });
  };

  const handleAdd = () => {
    if (!size) return;
    onAddToCart(product, size, qty);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 sm:p-8">
      <div ref={backdropRef} onClick={handleClose} className="absolute inset-0 cursor-pointer bg-black/70 backdrop-blur-sm" />
      <div
        ref={panelRef}
        className="relative grid w-full max-w-3xl grid-cols-1 overflow-hidden rounded-2xl border border-white/10 bg-brand-black shadow-2xl sm:grid-cols-2 max-h-[92vh] overflow-y-auto"
      >
        <button
          onClick={handleClose}
          aria-label="Close quick view"
          className="absolute right-4 top-4 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-brand-black/70 text-brand-gray-100 hover:text-white"
        >
          <X size={18} />
        </button>

        <div className="relative aspect-square sm:aspect-auto">
          <img src={product.img} alt={product.name} className="h-full w-full object-cover" />
          <StockBadge stock={product.stock} />
        </div>

        <div className="flex flex-col gap-4 p-6 sm:p-8">
          <div>
            <h3 className="font-grotesk text-xl font-semibold text-brand-gray-100 sm:text-2xl">
              {product.name}
            </h3>
            <div className="mt-2">
              <Stars rating={product.rating} reviews={product.reviews} size={13} />
            </div>
          </div>

          <span className="font-montserrat text-lg font-medium text-brand-gray-100">{fmt(product.price)}</span>

          <p className="font-montserrat text-sm leading-relaxed text-brand-gray-400">{product.description}</p>

          {soldOut ? (
            <p className="rounded-lg bg-white/5 px-4 py-3 font-montserrat text-xs text-brand-gray-400">
              This item is currently sold out. Check back soon.
            </p>
          ) : (
            <>
              <div>
                <p className="mb-2 font-montserrat text-xs font-medium uppercase tracking-[0.15em] text-brand-gray-300">
                  Size
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={`flex h-9 min-w-[2.25rem] cursor-pointer items-center justify-center rounded-full border px-3 font-montserrat text-xs font-medium uppercase transition-colors duration-200 active:scale-95 ${
                        size === s
                          ? "border-brand-blue-500 bg-brand-blue-600 text-brand-gray-100"
                          : "border-white/10 text-brand-gray-300 hover:border-brand-blue-400"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <p className="font-montserrat text-xs font-medium uppercase tracking-[0.15em] text-brand-gray-300">
                  Qty
                </p>
                <div className="flex items-center gap-3 rounded-full border border-white/10 px-3 py-1.5">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="cursor-pointer text-brand-gray-300 hover:text-white"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-4 text-center font-montserrat text-xs text-brand-gray-100">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    className="cursor-pointer text-brand-gray-300 hover:text-white"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="mt-2 flex gap-3">
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={!size}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-full py-3 font-montserrat text-sm font-medium uppercase tracking-wide transition-colors duration-300 active:scale-[0.98] ${
                    size
                      ? "cursor-pointer bg-brand-gray-100 text-brand-black hover:bg-brand-blue-300"
                      : "cursor-not-allowed bg-brand-gray-100/30 text-brand-gray-100/50"
                  }`}
                >
                  <ShoppingBag size={16} strokeWidth={2} />
                  {size ? "Add to cart" : "Select a size"}
                </button>
                <button
                  type="button"
                  onClick={() => onToggleWishlist(product.id)}
                  aria-label="Toggle wishlist"
                  className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/10 hover:border-brand-blue-400"
                >
                  <Heart
                    size={18}
                    strokeWidth={2}
                    className={isWishlisted ? "fill-brand-blue-400 text-brand-blue-400" : "text-brand-gray-100"}
                  />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================= WISHLIST DRAWER ============================= */

function WishlistDrawer({ open, onClose, items, onRemove, onMoveToCart }) {
  const backdropRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!panelRef.current) return;
    if (open) {
      gsap.set(backdropRef.current, { display: "block" });
      gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(panelRef.current, { x: "100%", opacity: 0 }, { x: "0%", opacity: 1, duration: 0.5, ease: "power3.out" });
    } else {
      gsap.to(panelRef.current, { x: "100%", opacity: 0, duration: 0.4, ease: "power3.in" });
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => gsap.set(backdropRef.current, { display: "none" }),
      });
    }
  }, [open]);

  return (
    <>
      <div
        ref={backdropRef}
        onClick={onClose}
        className="fixed inset-0 z-[60] hidden cursor-pointer bg-black/60 backdrop-blur-sm"
        style={{ opacity: 0 }}
      />
      <div
        ref={panelRef}
        className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-brand-black shadow-2xl"
        style={{ transform: "translateX(100%)" }}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <h3 className="font-grotesk text-lg font-semibold text-brand-gray-100">Wishlist ({items.length})</h3>
          <button onClick={onClose} aria-label="Close wishlist" className="cursor-pointer text-brand-gray-300 hover:text-white">
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <Heart size={32} strokeWidth={1.5} className="text-brand-gray-500" />
              <p className="font-montserrat text-sm text-brand-gray-400">Nothing saved yet.</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-6">
              {items.map((p) => (
                <li key={p.id} className="flex gap-4">
                  <div className="h-24 w-20 shrink-0 overflow-hidden rounded-md bg-brand-gray-800">
                    <img src={p.img} alt={p.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-montserrat text-sm text-brand-gray-100">{p.name}</p>
                      <button
                        onClick={() => onRemove(p.id)}
                        aria-label="Remove from wishlist"
                        className="cursor-pointer text-brand-gray-500 hover:text-brand-blue-400"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-montserrat text-sm font-medium text-brand-gray-100">{fmt(p.price)}</span>
                      <button
                        onClick={() => onMoveToCart(p)}
                        disabled={p.stock === "out"}
                        className="cursor-pointer font-montserrat text-xs font-medium text-brand-blue-400 underline underline-offset-4 disabled:cursor-not-allowed disabled:text-brand-gray-600 disabled:no-underline"
                      >
                        {p.stock === "out" ? "Sold out" : "Move to bag"}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

/* ========================== AUTH REQUIRED MODAL ========================== */

function AuthRequiredModal({ open, onClose, onSignIn }) {
  const backdropRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
    gsap.fromTo(
      panelRef.current,
      { opacity: 0, y: 24, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power3.out" }
    );
  }, [open]);

  if (!open) return null;

  const handleClose = () => {
    gsap.to(panelRef.current, { opacity: 0, y: 16, scale: 0.97, duration: 0.25, ease: "power2.in" });
    gsap.to(backdropRef.current, { opacity: 0, duration: 0.25, onComplete: onClose });
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
      <div
        ref={backdropRef}
        onClick={handleClose}
        className="absolute inset-0 cursor-pointer bg-black/70 backdrop-blur-sm"
      />
      <div
        ref={panelRef}
        className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-brand-black p-8 text-center shadow-2xl"
      >
        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute right-4 top-4 cursor-pointer text-brand-gray-400 hover:text-white"
        >
          <X size={18} />
        </button>

        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue-600/15">
          <LogIn size={20} strokeWidth={2} className="text-brand-blue-400" />
        </div>

        <h3 className="mt-5 font-grotesk text-lg font-semibold text-brand-gray-100">
          You're not signed in
        </h3>
        <p className="mt-2 font-montserrat text-sm text-brand-gray-400">
          Sign in to your account to continue to checkout.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={onSignIn}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-brand-gray-100 py-3 font-montserrat text-sm font-medium text-brand-black transition-colors duration-300 hover:bg-brand-blue-300"
          >
            Sign in
            <ArrowRight size={16} strokeWidth={2} />
          </button>
          <button
            onClick={handleClose}
            className="cursor-pointer font-montserrat text-xs font-medium text-brand-gray-400 hover:text-brand-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================================= SHOP ================================= */

export default function Shop() {
  const navigate = useNavigate();

  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [sortOpen, setSortOpen] = useState(false);
  const [price, setPrice] = useState([0, 200]);
  const [sizeFilter, setSizeFilter] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [wishlist, setWishlist] = useWishlist();
  const [cart, setCart] = useCart();
  const [quickView, setQuickView] = useState(null);
  const [toast, setToast] = useState(null);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  // Auth gate for checkout — mirrors the `token` key SignIn.jsx writes to
  // localStorage and the `authChange` event it dispatches on login.
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem("token")
  );
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    const syncAuth = () => setIsAuthenticated(!!localStorage.getItem("token"));
    window.addEventListener("authChange", syncAuth);
    window.addEventListener("storage", syncAuth); // covers login/logout in another tab
    return () => {
      window.removeEventListener("authChange", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  const handleCheckoutClick = () => {
    if (isAuthenticated) {
      navigate("/shop/checkout");
    } else {
      setAuthModalOpen(true);
    }
  };

  const goToSignIn = () => {
    setAuthModalOpen(false);
    // SignIn.jsx reads location.state.from and redirects back here after login.
    navigate("/signin", { state: { from: "/shop/checkout" } });
  };

  const sectionRef = useRef(null);
  const eyebrowRef = useRef(null);
  const titleRef = useRef(null);
  const subRef = useRef(null);
  const searchRef = useRef(null);
  const sortRef = useRef(null);
  const sortPanelRef = useRef(null);

  /* --- header entrance --- */
  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.set([eyebrowRef.current, titleRef.current, subRef.current, searchRef.current], {
      opacity: 0,
      x: 40,
    });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
      defaults: { ease: "power3.out" },
    });

    tl.to(eyebrowRef.current, { opacity: 1, x: 0, duration: 0.5 })
      .to(titleRef.current, { opacity: 1, x: 0, duration: 0.6 }, "-=0.3")
      .to(subRef.current, { opacity: 1, x: 0, duration: 0.5 }, "-=0.35")
      .to(searchRef.current, { opacity: 1, x: 0, duration: 0.5 }, "-=0.3");

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, []);

  /* --- reset pagination when filters change --- */
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [active, search, sortBy, price, sizeFilter]);

  /* --- toast auto-dismiss --- */
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  /* --- close sort dropdown on outside click (touch / keyboard fallback) --- */
  useEffect(() => {
    if (!sortOpen) return;
    const handleClick = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false);
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [sortOpen]);

  /* --- sort dropdown: slide down/up with gsap, driven by hover state --- */
  useEffect(() => {
    if (!sortPanelRef.current) return;
    gsap.set(sortPanelRef.current, { opacity: 0, y: -8, pointerEvents: "none" });
  }, []);

  useEffect(() => {
    if (!sortPanelRef.current) return;
    if (sortOpen) {
      gsap.to(sortPanelRef.current, {
        opacity: 1,
        y: 0,
        pointerEvents: "auto",
        duration: 0.3,
        ease: "power3.out",
      });
    } else {
      gsap.to(sortPanelRef.current, {
        opacity: 0,
        y: -8,
        pointerEvents: "none",
        duration: 0.2,
        ease: "power2.in",
      });
    }
  }, [sortOpen]);

  const toggleWishlist = (id) => {
    setWishlist((prev) => {
      const exists = prev.includes(id);
      setToast(exists ? "Removed from wishlist" : "Saved to wishlist");
      return exists ? prev.filter((w) => w !== id) : [...prev, id];
    });
  };

  const toggleSizeFilter = (s) => {
    setSizeFilter((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  const clearFilters = () => {
    setActive("All");
    setSearch("");
    setPrice([0, 200]);
    setSizeFilter([]);
    setSortBy("featured");
  };

  const addToCart = (product, size, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id && i.size === size);
      if (existing) {
        return prev.map((i) => (i.id === product.id && i.size === size ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, img: product.img, size, qty }];
    });
    setToast(`${product.name} added to bag`);
  };

  const moveWishlistToCart = (product) => {
    const size = product.sizes[0];
    addToCart(product, size, 1);
    setWishlist((prev) => prev.filter((id) => id !== product.id));
  };

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      const matchesCategory = active === "All" || p.category === active;
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesPrice = p.price >= price[0] && p.price <= price[1];
      const matchesSize = sizeFilter.length === 0 || p.sizes.some((s) => sizeFilter.includes(s));
      return matchesCategory && matchesSearch && matchesPrice && matchesSize;
    });

    switch (sortBy) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      case "featured":
      default:
        list = [...list].sort((a, b) => a.id - b.id);
        break;
    }

    return list;
  }, [active, search, price, sizeFilter, sortBy]);

  const visible = filtered.slice(0, visibleCount);
  const wishlistProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <section ref={sectionRef} className="w-full bg-brand-black px-6 py-24 sm:px-10 lg:px-16 xl:px-20">
      {/* Floating action buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        <button
          onClick={() => setWishlistOpen(true)}
          className="flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-brand-black/90 px-4 py-3 font-montserrat text-xs font-medium text-brand-gray-100 shadow-xl backdrop-blur-sm transition-colors duration-300 hover:border-brand-blue-400"
        >
          <Heart size={16} strokeWidth={2} />
          {wishlist.length > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-blue-600 text-[11px] font-semibold text-brand-gray-100">
              {wishlist.length}
            </span>
          )}
        </button>

        {/* Checkout is now a button, not a Link — it gates on auth first,
            then either navigates to /shop/checkout or opens the sign-in modal. */}
        <button
          onClick={handleCheckoutClick}
          className="flex cursor-pointer items-center gap-2 rounded-full bg-brand-gray-100 px-5 py-3.5 font-montserrat text-sm font-medium text-brand-black shadow-xl transition-colors duration-300 hover:bg-brand-blue-300"
        >
          <ShoppingBag size={18} strokeWidth={2} />
          Checkout
          {cartCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-blue-600 text-[11px] font-semibold text-brand-gray-100">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      <Toast toast={toast} />

      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 font-montserrat text-xs text-brand-gray-500">
        <a href="/" className="hover:text-brand-gray-200">
          Home
        </a>
        <span>/</span>
        <span className="text-brand-gray-300">Shop</span>
      </nav>

      {/* Header */}
      <div className="text-center">
        <span
          ref={eyebrowRef}
          className="font-montserrat text-xs font-medium uppercase tracking-[0.25em] text-brand-blue-400"
        >
          SS26 Collection
        </span>
        <h1
          ref={titleRef}
          className="mt-3 font-grotesk text-4xl font-bold leading-none text-brand-gray-100 sm:text-5xl lg:text-6xl"
        >
          Shop All
        </h1>
        <p ref={subRef} className="mx-auto mt-4 max-w-md font-montserrat text-sm text-brand-gray-400">
          Considered menswear, crafted in small batches. Find your size, add it to your bag.
        </p>

        <div ref={searchRef} className="mx-auto mt-8 flex max-w-md items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3">
          <Search size={16} className="text-brand-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full bg-transparent font-montserrat text-sm text-brand-gray-100 placeholder:text-brand-gray-500 focus:outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="cursor-pointer text-brand-gray-500 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Controls row: mobile filter toggle, results count, sort */}
      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="flex cursor-pointer items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 font-montserrat text-xs font-medium text-brand-gray-200 lg:hidden"
        >
          <SlidersHorizontal size={14} />
          Filters
        </button>

        <p className="font-montserrat text-xs text-brand-gray-500">
          {filtered.length} {filtered.length === 1 ? "result" : "results"}
        </p>

        <div
          ref={sortRef}
          className="relative ml-auto"
          onMouseEnter={() => setSortOpen(true)}
          onMouseLeave={() => setSortOpen(false)}
        >
          <button
            onClick={() => setSortOpen((o) => !o)}
            className="flex cursor-pointer items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 font-montserrat text-xs font-medium text-brand-gray-200 hover:border-brand-blue-400"
          >
            Sort: {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
            <ChevronDown size={14} className={`transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`} />
          </button>
          <div
            ref={sortPanelRef}
            className="absolute right-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-brand-gray-900 shadow-xl"
          >
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setSortBy(opt.value);
                  setSortOpen(false);
                }}
                className={`block w-full cursor-pointer px-4 py-3 text-left font-montserrat text-xs transition-colors duration-150 ${
                  sortBy === opt.value ? "bg-brand-blue-600/20 text-brand-blue-300" : "text-brand-gray-300 hover:bg-white/5"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Body: sidebar + grid */}
      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <FilterPanel
              active={active}
              setActive={setActive}
              price={price}
              setPrice={setPrice}
              sizeFilter={sizeFilter}
              toggleSize={toggleSizeFilter}
              onClear={clearFilters}
            />
          </div>
        </aside>

        <div>
          {visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
              <Search size={28} strokeWidth={1.5} className="text-brand-gray-600" />
              <p className="font-montserrat text-sm text-brand-gray-400">
                No pieces match your filters.
              </p>
              <button
                onClick={clearFilters}
                className="cursor-pointer font-montserrat text-xs font-medium text-brand-blue-400 underline underline-offset-4"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              {/* Single column on the smallest screens so the size + add-to-cart
                  controls have room to breathe under each card */}
              <div className="grid grid-cols-1 gap-x-5 gap-y-10 xs:grid-cols-2 sm:grid-cols-3 xl:grid-cols-4">
                {visible.map((p, i) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    index={i}
                    isWishlisted={wishlist.includes(p.id)}
                    onToggleWishlist={toggleWishlist}
                    onAddToCart={addToCart}
                    onQuickView={setQuickView}
                  />
                ))}
              </div>

              {visibleCount < filtered.length && (
                <div className="mt-14 flex justify-center">
                  <button
                    onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                    className="cursor-pointer rounded-full border border-white/10 px-8 py-3.5 font-montserrat text-sm font-medium text-brand-gray-100 transition-colors duration-300 hover:border-brand-blue-400 hover:text-brand-blue-300"
                  >
                    Load more ({filtered.length - visibleCount} left)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile filters drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[85] flex lg:hidden">
          <div
            className="absolute inset-0 cursor-pointer bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-brand-black p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-grotesk text-lg font-semibold text-brand-gray-100">Filters</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="cursor-pointer text-brand-gray-300 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
           <FilterPanel
  active={active}
  setActive={(cat) => {
    setActive(cat);
    setMobileFiltersOpen(false);
  }}
  price={price}
  setPrice={setPrice}
  sizeFilter={sizeFilter}
  toggleSize={toggleSizeFilter}
  onClear={() => {
    clearFilters();
    setMobileFiltersOpen(false);
  }}
/>
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-8 cursor-pointer rounded-full bg-brand-gray-100 py-3 font-montserrat text-sm font-medium text-brand-black"
            >
              Show {filtered.length} results
            </button>
          </div>
        </div>
      )}

      <QuickViewModal
        product={quickView}
        onClose={() => setQuickView(null)}
        onAddToCart={addToCart}
        isWishlisted={quickView ? wishlist.includes(quickView.id) : false}
        onToggleWishlist={toggleWishlist}
      />

      <WishlistDrawer
        open={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        items={wishlistProducts}
        onRemove={(id) => setWishlist((prev) => prev.filter((w) => w !== id))}
        onMoveToCart={moveWishlistToCart}
      />

      <AuthRequiredModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSignIn={goToSignIn}
      />
    </section>
  );
}
