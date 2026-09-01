import { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import gsap from "gsap";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = "http://localhost:5000/api/auth";
const MIN_LOADING_MS = 3000;

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const sectionRef = useRef(null);
  const formRef = useRef(null);

  // Shop's checkout gate passes state: { from: "/shop/checkout" } when it
  // redirects here, so a successful login sends the user right back.
  const redirectTo = location.state?.from || "/";

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null);

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        formRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const validate = () => {
    let newErrors = {};
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email";
    }
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Minimum 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      setErrors((prev) => ({ ...prev, general: "" }));

      const [{ data }] = await Promise.all([
        axios.post(`${API_BASE_URL}/login`, {
          email: form.email,
          password: form.password,
        }),
        new Promise((resolve) => setTimeout(resolve, MIN_LOADING_MS)),
      ]);

      localStorage.setItem("token", data.token);
      window.dispatchEvent(new Event("authChange"));

      toast.success(`Welcome back, ${data.user?.name || "there"}!`);

      setTimeout(() => navigate(redirectTo), 900);
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Login failed";
      setErrors({ general: message });
      toast.error(message);
      setLoading(false);
    }
  };

  const handleSocialSignIn = (provider) => {
    setSocialLoading(provider);
    window.location.href = `${API_BASE_URL}/${provider}`;
  };

  return (
    <main
      ref={sectionRef}
      className="flex min-h-screen w-full mt-15 h-[800px] bg-brand-black text-brand-gray-100"
    >
      {/* LEFT */}
      <div className="flex w-full lg:w-[50%] items-center justify-center px-6 sm:px-10 lg:px-16">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-10 block font-grotesk text-xl tracking-[0.15em]">
            VERN<span className="text-brand-blue-400">'</span>O
          </Link>

          <h1 className="text-3xl font-grotesk font-semibold">Welcome back</h1>
          <p className="mt-2 text-sm text-brand-gray-400">Sign in to your account</p>

          <form ref={formRef} onSubmit={handleSubmit} className="mt-10 flex flex-col gap-5">
            {errors.general && (
              <div className="text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded">
                {errors.general}
              </div>
            )}

            <div>
              <label className="text-xs text-brand-gray-400">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className={`mt-2 w-full rounded-lg outline-none border px-4 py-3 text-sm bg-white/5 outline-none ${
                  errors.email ? "border-red-500" : "border-white/10 focus:border-brand-blue-400"
                }`}
              />
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="text-xs text-brand-gray-400">Password</label>
              <div className="relative mt-2">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  className={`w-full rounded-lg outline-none border px-4 py-3 text-sm bg-white/5 outline-none ${
                    errors.password ? "border-red-500" : "border-white/10 focus:border-brand-blue-400"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-full bg-brand-blue-600 px-6 py-3 text-sm font-medium hover:bg-brand-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <div className="flex items-center gap-3 my-1">
              <span className="h-px flex-1 bg-white/10" />
              <span className="text-xs text-brand-gray-400">Or continue with</span>
              <span className="h-px flex-1 bg-white/10" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSocialSignIn("google")}
                disabled={socialLoading !== null}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FaGoogle size={16} />
                {socialLoading === "google" ? "Connecting..." : "Google"}
              </button>

              <button
                type="button"
                onClick={() => handleSocialSignIn("facebook")}
                disabled={socialLoading !== null}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FaFacebook size={16} />
                {socialLoading === "facebook" ? "Connecting..." : "Facebook"}
              </button>
            </div>

            <p className="text-center text-sm text-brand-gray-400">
              Don't have an account?{" "}
              <Link to="/signup" className="text-brand-blue-400">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* RIGHT */}
      <div className="hidden lg:block lg:w-[50%] relative">
        <img src="/authimage2.webp" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-brand-blue-900/60" />
      </div>
    </main>
  );
}