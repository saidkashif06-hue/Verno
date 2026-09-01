import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import gsap from "gsap";
import axios from "axios";
import { toast } from "react-toastify";

// Point this at your backend base URL (move to an env var if you like)
const API_BASE_URL = "https://verno-rt2e.onrender.com/api/auth";

// Keeps the loading spinner visible for at least this long, even if the
// API responds faster, so the animation doesn't just flash by
const MIN_LOADING_MS = 3000;

export default function SignUp() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const formRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null); // "google" | "facebook" | null

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

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

    if (!form.name) newErrors.name = "Name is required";

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

    if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = "Passwords do not match";
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

      // Run the real request alongside a minimum-duration timer so the
      // spinner never just flickers on a fast connection
      await Promise.all([
        axios.post(`${API_BASE_URL}/register`, {
          name: form.name,
          email: form.email,
          password: form.password,
        }),
        new Promise((resolve) => setTimeout(resolve, MIN_LOADING_MS)),
      ]);

      toast.success("Account created! Please sign in.");

      // Account created — send them to sign in rather than auto-logging in.
      // Small delay so the success toast is visible before the page changes.
      setTimeout(() => navigate("/signin"), 900);
    } catch (err) {
      // axios puts server error responses in err.response.data
      const message =
        err.response?.data?.message || err.message || "Signup failed";
      setErrors({ general: message });
      toast.error(message);
      setLoading(false);
    }
  };

  // Kicks off the backend-driven OAuth flow. This is a full page redirect,
  // not an axios call — the browser needs to leave the SPA entirely to go
  // through Google/Facebook's consent screen, then lands back on
  // /oauth-success once the backend has issued a token.
  const handleSocialSignUp = (provider) => {
    setSocialLoading(provider);
    window.location.href = `${API_BASE_URL}/${provider}`;
  };

  return (
    <main className="flex min-h-screen mt-15  h-[850px] bg-brand-black text-brand-gray-100">

      {/* LEFT FORM */}
      <div className="flex w-full lg:w-[50%]  items-center justify-center px-6 sm:px-10 lg:px-16">
        <div className="w-full max-w-md">

          {/* LOGO */}
          <Link
            to="/"
            className="mb-10 block font-grotesk text-xl tracking-[0.15em]"
          >
            VERN<span className="text-brand-blue-400">'</span>O
          </Link>

          <h1 className="text-3xl font-grotesk font-semibold">
            Create account
          </h1>

          <p className="mt-2 text-sm text-brand-gray-400">
            Join VERN'O and elevate your wardrobe
          </p>

          {/* FORM */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="mt-10 flex flex-col gap-5"
          >

            {errors.general && (
              <div className="text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded">
                {errors.general}
              </div>
            )}

            {/* NAME */}
            <div>
              <label className="text-xs text-brand-gray-400">Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className={`mt-2 w-full rounded-lg outline-none border px-4 py-3 text-sm bg-white/5 ${
                  errors.name
                    ? "border-red-500"
                    : "border-white/10 focus:border-brand-blue-400"
                }`}
              />
              {errors.name && (
                <p className="text-xs text-red-400 mt-1">{errors.name}</p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-xs text-brand-gray-400">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className={`mt-2 w-full rounded-lg outline-none border px-4 py-3 text-sm bg-white/5 ${
                  errors.email
                    ? "border-red-500"
                    : "border-white/10 focus:border-brand-blue-400"
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-400 mt-1">{errors.email}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-xs text-brand-gray-400">Password</label>
              <div className="relative mt-2">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  className={`w-full rounded-lg border outline-none px-4 py-3 text-sm bg-white/5 ${
                    errors.password
                      ? "border-red-500"
                      : "border-white/10 focus:border-brand-blue-400"
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
              {errors.password && (
                <p className="text-xs text-red-400 mt-1">{errors.password}</p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="text-xs text-brand-gray-400">
                Confirm Password
              </label>
              <div className="relative mt-2">
                <input
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-4 py-3 text-sm bg-white/5 ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-white/10 focus:border-brand-blue-400"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-full bg-brand-blue-600 px-6 py-3 text-sm font-medium hover:bg-brand-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Creating...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            {/* DIVIDER */}
            <div className="flex items-center gap-3 my-1">
              <span className="h-px flex-1 bg-white/10" />
              <span className="text-xs text-brand-gray-400">
                Or continue with
              </span>
              <span className="h-px flex-1 bg-white/10" />
            </div>

            {/* SOCIAL SIGN UP */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSocialSignUp("google")}
                disabled={socialLoading !== null}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FaGoogle size={16} />
                {socialLoading === "google" ? "Connecting..." : "Google"}
              </button>

              <button
                type="button"
                onClick={() => handleSocialSignUp("facebook")}
                disabled={socialLoading !== null}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FaFacebook size={16} />
                {socialLoading === "facebook" ? "Connecting..." : "Facebook"}
              </button>
            </div>

            <p className="text-center text-sm text-brand-gray-400">
              Already have an account?{" "}
              <Link to="/signin" className="text-brand-blue-400">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* RIGHT IMAGE */}
      <div className="hidden lg:block lg:w-[50%] relative">
        <img
          src="/authimage.webp"
          className="h-full w-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-brand-blue-900/40" />
      </div>
    </main>
  );
}
