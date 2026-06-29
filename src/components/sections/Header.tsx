import { useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { BarberPole, BookButton } from "./BookButton";
import { SHOP } from "@/lib/shop-data";

const LINKS = [
  { to: "/", label: "Home", exact: true },
  { to: "/about", label: "About", exact: false },
  { to: "/services", label: "Services", exact: false },
  { to: "/reviews", label: "Reviews", exact: false },
  { to: "/contact", label: "Contact", exact: false },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-brass bg-espresso/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <Link to="/" className="flex items-center gap-3 text-cream">
          <BarberPole />
          <span className="leading-tight">
            <span className="block font-display text-lg font-bold tracking-wide">
              {SHOP.name}
            </span>
            <span className="block font-condensed text-[0.62rem] uppercase tracking-[0.32em] text-brass-bright">
              Est. {SHOP.established} · Algonquin, IL
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-4 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.exact ?? false }}
              activeProps={{ className: "text-brass-bright" }}
              className="font-condensed text-sm uppercase tracking-[0.12em] text-cream transition-colors hover:text-brass-bright"
            >
              {l.label}
            </Link>
          ))}
          <BookButton size="sm" />
          <Button asChild size="sm" className="bg-cream text-espresso hover:bg-white border-0">
            <a href={SHOP.phoneHref}>
              <Phone size={16} /> Call or Text
            </a>
          </Button>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          className="text-cream md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {open && (
        <div className="flex flex-col gap-4 border-t border-brass/40 bg-espresso px-5 py-5 md:hidden">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.exact ?? false }}
              activeProps={{ className: "text-brass-bright" }}
              onClick={() => setOpen(false)}
              className="font-condensed text-base uppercase tracking-[0.12em] text-cream"
            >
              {l.label}
            </Link>
          ))}
          <BookButton className="w-full" />
          <Button asChild className="w-full bg-cream text-espresso hover:bg-white border-0">
            <a href={SHOP.phoneHref}>
              <Phone size={16} /> Call or Text {SHOP.phone}
            </a>
          </Button>
        </div>
      )}
    </header>
  );
}
