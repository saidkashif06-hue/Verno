import { Link } from "react-router-dom";
import { ShoppingBag, User, Mail, MapPin } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

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

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-brand-black">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
        {/* Brand column */}
        <div className="flex flex-col gap-4">
          <Link
            to="/"
            className="font-grotesk text-2xl font-semibold tracking-[0.15em] text-brand-gray-100"
          >
            VERN<span className="text-brand-blue-400">'</span>O
          </Link>
          <p className="font-montserrat text-sm leading-relaxed text-brand-gray-300">
            Crafted in small batches — SS26. Considered pieces, made to last
            beyond the season.
          </p>
          <div className="flex items-center gap-4 pt-2">
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
        </div>

        {/* Nav links column */}
        <div className="flex flex-col gap-4">
          <h4 className="font-montserrat text-xs font-medium uppercase tracking-[0.2em] text-brand-gray-100">
            Explore
          </h4>
          <ul className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="font-montserrat text-sm text-brand-gray-300 transition-colors duration-300 hover:text-brand-blue-400"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Account / Shop column */}
        <div className="flex flex-col gap-4">
          <h4 className="font-montserrat text-xs font-medium uppercase tracking-[0.2em] text-brand-gray-100">
            Account
          </h4>
          <ul className="flex flex-col gap-3">
            <li>
              <Link
                to="/account"
                className="flex items-center gap-2 font-montserrat text-sm text-brand-gray-300 transition-colors duration-300 hover:text-brand-blue-400"
              >
                <User size={16} strokeWidth={1.75} />
                My Account
              </Link>
            </li>
            <li>
              <Link
                to="/shop"
                className="flex items-center gap-2 font-montserrat text-sm text-brand-gray-300 transition-colors duration-300 hover:text-brand-blue-400"
              >
                <ShoppingBag size={16} strokeWidth={1.75} />
                Shop All
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact column */}
        <div className="flex flex-col gap-4">
          <h4 className="font-montserrat text-xs font-medium uppercase tracking-[0.2em] text-brand-gray-100">
            Contact
          </h4>
          <ul className="flex flex-col gap-3">
            <li className="flex items-start gap-2 font-montserrat text-sm text-brand-gray-300">
              <Mail size={16} strokeWidth={1.75} className="mt-0.5 shrink-0" />
              hello@vernoclothing.com
            </li>
            <li className="flex items-start gap-2 font-montserrat text-sm text-brand-gray-300">
              <MapPin size={16} strokeWidth={1.75} className="mt-0.5 shrink-0" />
              123 Atelier Street, Lahore, PK
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-center sm:flex-row sm:text-left lg:px-10">
          <span className="font-montserrat text-xs text-brand-gray-400">
            © {new Date().getFullYear()} VERN'O. All rights reserved.
          </span>
          <div className="flex items-center gap-6">
            <Link
              to="/privacy"
              className="font-montserrat text-xs text-brand-gray-400 transition-colors duration-300 hover:text-brand-blue-400"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="font-montserrat text-xs text-brand-gray-400 transition-colors duration-300 hover:text-brand-blue-400"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
