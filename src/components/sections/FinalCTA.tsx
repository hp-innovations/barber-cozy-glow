import { BookButton } from "./BookButton";

export function FinalCTA() {
  return (
    <section className="bg-leather px-5 py-20 text-center text-cream">
      <div className="mx-auto max-w-2xl">
        <h2 className="font-display text-[clamp(2rem,5vw,3rem)]">
          Ready for a <em className="italic text-brass-bright">Fresh Cut?</em>
        </h2>
        <p className="mx-auto mt-4 text-lg text-cream/85">
          Book in under a minute, or stop by — the chair (and a cold beverage)
          is ready.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <BookButton>Book Online Now</BookButton>
          <GiftCardButton />
        </div>
      </div>
    </section>
  );
}
