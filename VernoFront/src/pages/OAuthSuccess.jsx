import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

// The backend's OAuth callback redirects here as a full page navigation
// (not an axios response), so the JWT arrives as a query param rather
// than JSON. This page's only job is to grab it, store it, and move on.
export default function OAuthSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      toast.error("Sign-in failed. Please try again.");
      navigate("/signin");
      return;
    }

    localStorage.setItem("token", token);

    // Let the Navbar (and anything else already mounted) know auth
    // state changed, since localStorage writes don't trigger re-renders
    window.dispatchEvent(new Event("authChange"));

    toast.success("Signed in successfully!");
    navigate("/");
  }, [searchParams, navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-black text-brand-gray-100">
      <div className="flex items-center gap-3">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        <span className="text-sm text-brand-gray-300">Signing you in...</span>
      </div>
    </main>
  );
}
