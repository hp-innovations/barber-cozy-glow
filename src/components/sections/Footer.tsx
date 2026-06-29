import { Link } from "@tanstack/react-router";
import { BarberPole } from "./BookButton";
import { SHOP } from "@/lib/shop-data";

const NAV = [
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/reviews", label: "Reviews" },
  { to: "/contact", label: "Contact & Hours" },
] as const;

export function Footer() {
  return (
    <footer className="bg-espresso px-5 py-10 text-center text-cream/70">
      <div className="mb-3.5 flex items-center justify-center gap-3 text-cream">
        <BarberPole />
        <span className="font-display text-lg font-bold">{SHOP.name}</span>
      </div>

      <nav className="mb-4 flex flex-wrap justify-center gap-x-5 gap-y-2">
        {NAV.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            className="font-condensed text-sm uppercase tracking-[0.12em] text-cream/80 hover:text-brass-bright"
          >
            {n.label}
          </Link>
        ))}
      </nav>

      <p className="text-sm">
        {SHOP.address} · {SHOP.phone}
      </p>
      <p className="mt-2 text-sm">
        ★ {SHOP.rating} on Google ·{" "}
        <a
          href={SHOP.booksyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brass-bright hover:underline"
        >
          Book on Booksy
        </a>{" "}
        ·{" "}
        <a
          href={SHOP.facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brass-bright hover:underline"
        >
          Facebook
        </a>
      </p>
      <p className="mt-4 text-xs text-cream/50">
        © {new Date().getFullYear()} {SHOP.name}. Established {SHOP.established}.
      </p>
    </footer>
  );
}
