import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, ArrowUpRight, Minus, Plus, Check, Lock, X } from "lucide-react";
import gsap from "gsap";
import { useCart } from "../store/useCartStore";

const fmt = (n) => `$${n.toFixed(2)}`;

export default function Checkout() {
  const [cart, setCart] = useCart();

  const stepRefs = useRef([]);
  stepRefs.current = [];
  const addStepRef = (el) => el && !stepRefs.current.includes(el) && stepRefs.current.push(el);
  const successRef = useRef(null);

  const [step, setStep] = useState(1); // 1 shipping, 2 payment, 3 confirmation
  const [form, setForm] = useState({
    email: "",
    fullName: "",
    address: "",
    city: "",
    postal: "",
    shippingMethod: "standard",
    cardNumber: "",
    expiry: "",
    cvc: "",
    promo: "",
  });
  const [placing, setPlacing] = useState(false);

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = subtotal === 0 ? 0 : form.shippingMethod === "express" ? 18 : 8;
  const total = subtotal + shipping;

  useEffect(() => {
    gsap.fromTo(
      stepRefs.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out" }
    );
  }, [step]);

  useEffect(() => {
    if (step === 3 && successRef.current) {
      gsap.fromTo(successRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" });
    }
  }, [step]);

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const updateQty = (id, size, qty) => {
    if (qty < 1) return;
    setCart((prev) => prev.map((i) => (i.id === id && i.size === size ? { ...i, qty } : i)));
  };

  const removeItem = (id, size) => {
    setCart((prev) => prev.filter((i) => !(i.id === id && i.size === size)));
  };

  const goToPayment = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const placeOrder = (e) => {
    e.preventDefault();
    setPlacing(true);
    setTimeout(() => {
      setPlacing(false);
      setStep(3);
      setCart([]);
    }, 1200);
  };

  const StepDot = ({ n, label }) => (
    <div className="flex items-center gap-2">
      <div
        className={`flex h-6 w-6 items-center justify-center rounded-full font-montserrat text-[11px] font-medium ${
          step >= n ? "bg-brand-blue-600 text-brand-gray-100" : "bg-white/10 text-brand-gray-500"
        }`}
      >
        {step > n ? <Check size={12} /> : n}
      </div>
      <span className={`font-montserrat text-xs ${step >= n ? "text-brand-gray-100" : "text-brand-gray-500"}`}>
        {label}
      </span>
    </div>
  );

  // Empty-bag guard — don't let someone land on a blank checkout form.
  if (cart.length === 0 && step !== 3) {
    return (
      <section className="flex min-h-[70vh] w-full flex-col items-center justify-center gap-4 bg-brand-black px-6 text-center">
        <p className="font-montserrat text-sm text-brand-gray-400">Your bag is empty.</p>
        <Link
          to="/shop"
          className="cursor-pointer rounded-full bg-brand-gray-100 px-6 py-3 font-montserrat text-sm font-medium text-brand-black transition-colors duration-300 hover:bg-brand-blue-300"
        >
          Back to shop
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-2xl flex-col bg-brand-black px-6 py-10 sm:px-10">
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/shop"
          className="flex cursor-pointer items-center gap-1.5 font-montserrat text-xs text-brand-gray-400 hover:text-brand-gray-100"
        >
          <ArrowLeft size={14} /> Back to shop
        </Link>
        <h1 className="font-grotesk text-lg font-semibold text-brand-gray-100">
          {step === 3 ? "Order Confirmed" : "Checkout"}
        </h1>
        <span className="w-16" aria-hidden="true" />
      </div>

      {step !== 3 && (
        <div className="mb-8 flex items-center gap-6 border-b border-white/10 pb-4">
          <StepDot n={1} label="Shipping" />
          <div className="h-px flex-1 bg-white/10" />
          <StepDot n={2} label="Payment" />
        </div>
      )}

      {step === 3 ? (
        <div ref={successRef} className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/15">
            <Check size={32} strokeWidth={2.5} className="text-emerald-400" />
          </div>
          <h2 className="font-grotesk text-2xl font-semibold text-brand-gray-100">
            Thank you, {form.fullName || "friend"}!
          </h2>
          <p className="font-montserrat text-sm text-brand-gray-400">
            Your order has been placed. A confirmation has been sent to{" "}
            <span className="text-brand-gray-200">{form.email || "your email"}</span>.
          </p>
          <p className="font-montserrat text-xs text-brand-gray-500">
            Order total: <span className="text-brand-gray-200">{fmt(total)}</span>
          </p>
          <Link
            to="/shop"
            className="mt-3 cursor-pointer rounded-full bg-brand-gray-100 px-6 py-3 font-montserrat text-sm font-medium text-brand-black transition-colors duration-300 hover:bg-brand-blue-300"
          >
            Continue shopping
          </Link>
        </div>
      ) : step === 1 ? (
        <form onSubmit={goToPayment} className="flex flex-1 flex-col gap-8">
          <div ref={addStepRef} className="rounded-xl border border-white/10 p-4">
            <ul className="flex flex-col gap-3">
              {cart.map((item) => (
                <li key={`${item.id}-${item.size}`} className="flex items-center gap-3">
                  <div className="h-14 w-12 shrink-0 overflow-hidden rounded bg-brand-gray-800">
                    <img src={item.img} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-montserrat text-xs text-brand-gray-200">{item.name}</p>
                    <p className="font-montserrat text-[11px] text-brand-gray-500">Size {item.size}</p>
                    <div className="mt-1 flex w-fit items-center gap-3 rounded-full border border-white/10 px-2 py-1">
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, item.size, item.qty - 1)}
                        className="cursor-pointer text-brand-gray-300 hover:text-white"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-4 text-center font-montserrat text-xs text-brand-gray-100">{item.qty}</span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, item.size, item.qty + 1)}
                        className="cursor-pointer text-brand-gray-300 hover:text-white"
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="font-montserrat text-xs text-brand-gray-100">{fmt(item.price * item.qty)}</span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id, item.size)}
                      aria-label="Remove item"
                      className="cursor-pointer text-brand-gray-500 hover:text-brand-blue-400"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div ref={addStepRef}>
            <h3 className="mb-3 font-montserrat text-xs font-medium uppercase tracking-[0.2em] text-brand-gray-100">
              Contact
            </h3>
            <input
              required
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange("email")}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-montserrat text-sm text-brand-gray-100 placeholder:text-brand-gray-500 focus:border-brand-blue-400 focus:outline-none"
            />
          </div>

          <div ref={addStepRef}>
            <h3 className="mb-3 font-montserrat text-xs font-medium uppercase tracking-[0.2em] text-brand-gray-100">
              Shipping Address
            </h3>
            <div className="flex flex-col gap-3">
              <input
                required
                placeholder="Full name"
                value={form.fullName}
                onChange={handleChange("fullName")}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-montserrat text-sm text-brand-gray-100 placeholder:text-brand-gray-500 focus:border-brand-blue-400 focus:outline-none"
              />
              <input
                required
                placeholder="Street address"
                value={form.address}
                onChange={handleChange("address")}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-montserrat text-sm text-brand-gray-100 placeholder:text-brand-gray-500 focus:border-brand-blue-400 focus:outline-none"
              />
              <div className="flex gap-3">
                <input
                  required
                  placeholder="City"
                  value={form.city}
                  onChange={handleChange("city")}
                  className="w-1/2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-montserrat text-sm text-brand-gray-100 placeholder:text-brand-gray-500 focus:border-brand-blue-400 focus:outline-none"
                />
                <input
                  required
                  placeholder="Postal code"
                  value={form.postal}
                  onChange={handleChange("postal")}
                  className="w-1/2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-montserrat text-sm text-brand-gray-100 placeholder:text-brand-gray-500 focus:border-brand-blue-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div ref={addStepRef}>
            <h3 className="mb-3 font-montserrat text-xs font-medium uppercase tracking-[0.2em] text-brand-gray-100">
              Shipping Method
            </h3>
            <div className="flex flex-col gap-2">
              {[
                { id: "standard", label: "Standard", eta: "4–6 business days", cost: 8 },
                { id: "express", label: "Express", eta: "1–2 business days", cost: 18 },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 transition-colors duration-200 ${
                    form.shippingMethod === opt.id ? "border-brand-blue-500 bg-brand-blue-600/10" : "border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shippingMethod"
                      checked={form.shippingMethod === opt.id}
                      onChange={() => setForm((p) => ({ ...p, shippingMethod: opt.id }))}
                      className="cursor-pointer accent-brand-blue-500"
                    />
                    <div>
                      <p className="font-montserrat text-sm text-brand-gray-100">{opt.label}</p>
                      <p className="font-montserrat text-[11px] text-brand-gray-500">{opt.eta}</p>
                    </div>
                  </div>
                  <span className="font-montserrat text-sm text-brand-gray-200">{fmt(opt.cost)}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="mt-auto flex cursor-pointer items-center justify-center gap-2 rounded-full bg-brand-gray-100 py-3.5 font-montserrat text-sm font-medium text-brand-black transition-colors duration-300 hover:bg-brand-blue-300"
          >
            Continue to payment
            <ArrowRight size={16} strokeWidth={2} />
          </button>
        </form>
      ) : (
        <form onSubmit={placeOrder} className="flex flex-1 flex-col gap-8">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="flex w-fit cursor-pointer items-center gap-1.5 font-montserrat text-xs text-brand-gray-400 hover:text-brand-gray-100"
          >
            <ArrowLeft size={14} /> Back to shipping
          </button>

          <div ref={addStepRef}>
            <h3 className="mb-3 flex items-center gap-2 font-montserrat text-xs font-medium uppercase tracking-[0.2em] text-brand-gray-100">
              <Lock size={12} /> Payment
            </h3>
            <div className="flex flex-col gap-3">
              <input
                required
                inputMode="numeric"
                maxLength={19}
                placeholder="Card number"
                value={form.cardNumber}
                onChange={handleChange("cardNumber")}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-montserrat text-sm text-brand-gray-100 placeholder:text-brand-gray-500 focus:border-brand-blue-400 focus:outline-none"
              />
              <div className="flex gap-3">
                <input
                  required
                  placeholder="MM/YY"
                  maxLength={5}
                  value={form.expiry}
                  onChange={handleChange("expiry")}
                  className="w-1/2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-montserrat text-sm text-brand-gray-100 placeholder:text-brand-gray-500 focus:border-brand-blue-400 focus:outline-none"
                />
                <input
                  required
                  placeholder="CVC"
                  maxLength={4}
                  value={form.cvc}
                  onChange={handleChange("cvc")}
                  className="w-1/2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-montserrat text-sm text-brand-gray-100 placeholder:text-brand-gray-500 focus:border-brand-blue-400 focus:outline-none"
                />
              </div>
            </div>
            <p className="mt-2 font-montserrat text-[11px] text-brand-gray-500">
              This is a demo checkout — no real payment is processed.
            </p>
          </div>

          <div ref={addStepRef}>
            <h3 className="mb-3 font-montserrat text-xs font-medium uppercase tracking-[0.2em] text-brand-gray-100">
              Promo Code
            </h3>
            <div className="flex gap-3">
              <input
                placeholder="Enter code"
                value={form.promo}
                onChange={handleChange("promo")}
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-montserrat text-sm text-brand-gray-100 placeholder:text-brand-gray-500 focus:border-brand-blue-400 focus:outline-none"
              />
              <button
                type="button"
                className="cursor-pointer rounded-lg border border-white/10 px-5 font-montserrat text-xs font-medium text-brand-gray-200 hover:border-brand-blue-400"
              >
                Apply
              </button>
            </div>
          </div>

          <div
            ref={addStepRef}
            className="space-y-1.5 rounded-xl border border-white/10 p-4 font-montserrat text-xs text-brand-gray-400"
          >
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{fmt(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping ({form.shippingMethod})</span>
              <span>{fmt(shipping)}</span>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-2 text-sm font-medium text-brand-gray-100">
              <span>Total</span>
              <span>{fmt(total)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={placing}
            className="mt-auto flex items-center justify-center gap-2 rounded-full bg-brand-gray-100 py-3.5 font-montserrat text-sm font-medium text-brand-black transition-colors duration-300 hover:bg-brand-blue-300 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            {placing ? "Processing…" : `Place order · ${fmt(total)}`}
            {!placing && <ArrowUpRight size={16} strokeWidth={2} />}
          </button>
        </form>
      )}
    </section>
  );
}
