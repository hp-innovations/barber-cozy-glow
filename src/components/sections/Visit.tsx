import { Calendar, Facebook, MapPin, Phone } from "lucide-react";
import { HOURS, SHOP } from "@/lib/shop-data";
import { BookButton } from "./BookButton";
import { SectionHeading } from "./About";

export function Visit() {
  return (
    <section id="visit" className="bg-cream px-5 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Find Us" title="Visit & Hours" />

        <div className="grid gap-10 md:grid-cols-2">
          {/* Location & contact */}
          <div className="rounded-xl border border-brass/30 bg-paper p-8 shadow-lg shadow-leather/10">
            <h3 className="mb-5 flex items-center gap-2.5 font-display text-xl text-leather">
              <MapPin className="text-brass" /> Location & Contact
            </h3>

            <div className="space-y-4 text-coffee">
              <p className="flex items-start gap-3">
                <MapPin size={20} className="mt-0.5 shrink-0 text-brass" />
                <span>
                  {SHOP.addressLine1}
                  <br />
                  {SHOP.addressLine2}
                </span>
              </p>
              <p className="flex items-center gap-3">
                <Phone size={20} className="shrink-0 text-brass" />
                <a href={SHOP.phoneHref} className="hover:text-leather">
                  {SHOP.phone} — call or text
                </a>
              </p>
              <p className="flex items-center gap-3">
                <Calendar size={20} className="shrink-0 text-brass" />
                <a
                  href={SHOP.booksyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-leather"
                >
                  Book online with Booksy
                </a>
              </p>
              <p className="flex items-center gap-3">
                <Facebook size={20} className="shrink-0 text-brass" />
                <a
                  href={SHOP.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-leather"
                >
                  Follow us on Facebook
                </a>
              </p>
            </div>

            <div className="mt-5 overflow-hidden rounded-lg border border-brass/30">
              <iframe
                title="Map to Algonquin Barber Shop"
                src={SHOP.mapUrl}
                loading="lazy"
                className="block h-60 w-full border-0"
              />
            </div>
          </div>

          {/* Hours */}
          <div className="rounded-xl border border-brass/30 bg-paper p-8 shadow-lg shadow-leather/10">
            <h3 className="mb-5 flex items-center gap-2.5 font-display text-xl text-leather">
              Hours
            </h3>
            <dl>
              {HOURS.map((h) => (
                <div
                  key={h.day}
                  className={`flex justify-between border-b border-border py-2.5 ${
                    h.closed ? "text-muted-foreground" : "text-coffee"
                  }`}
                >
                  <dt>{h.day}</dt>
                  <dd className="font-condensed tracking-wide">{h.time}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-sm text-muted-foreground">
              Hours can vary on holidays — please call or text ahead to confirm.
              Appointments recommended on busy weekends.
            </p>
            <div className="mt-6">
              <BookButton className="w-full">Reserve Your Spot</BookButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
