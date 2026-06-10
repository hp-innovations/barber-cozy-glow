import { TRUST_BADGES } from "@/lib/shop-data";

function SectionHeading({
  eyebrow,
  title,
  sub,
  dark,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  dark?: boolean;
}) {
  return (
    <div className="mb-12 text-center">
      <p
        className={`mb-2.5 font-condensed text-sm font-semibold uppercase tracking-[0.28em] ${
          dark ? "text-brass" : "text-leather"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`font-display text-[clamp(1.9rem,4vw,2.7rem)] ${
          dark ? "text-brass-bright" : "text-espresso"
        }`}
      >
        {title}
      </h2>
      <div className="mx-auto mt-5 h-0.5 w-16 rounded bg-brass" />
      {sub && (
        <p
          className={`mx-auto mt-5 max-w-xl ${
            dark ? "text-cream/80" : "text-coffee"
          }`}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

export function About() {
  return (
    <section id="about" className="bg-cream px-5 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Our Chair, Your Style"
          title="Where Everybody Leaves Looking Sharp"
        />

        <div className="grid items-center gap-11 md:grid-cols-2">
          <div className="space-y-5 text-coffee">
            <p>
              Algonquin Barber Shop is a true neighborhood shop. In the owner's
              own words:{" "}
              <em>
                "I have been a barber for 14 years. After commuting to Chicago
                for many years I decided it was time to open my own shop."
              </em>{" "}
              Algonquin Barber Shop opened on July 1, 2017 — and has been
              Algonquin's go-to ever since.
            </p>
            <p>
              Our barbers — including <strong>Elaina</strong> and{" "}
              <strong>Isaac</strong> — take the time to understand your head
              shape, your hair and your style, so every cut feels tailor-made.
              Many customers have been in our chairs for years. Whether it's
              your first fade or your kid's first haircut, you're in experienced
              hands.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              {TRUST_BADGES.map((b) => (
                <span
                  key={b}
                  className="rounded-full border border-brass/40 bg-paper px-4 py-2 font-condensed text-sm tracking-wide text-coffee"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-brass/30 border-l-4 border-l-brass bg-paper p-8 shadow-lg shadow-leather/10">
            <h3 className="mb-3 font-display text-2xl text-leather">
              The Full Experience
            </h3>
            <p className="text-coffee">
              "Come in for an amazing hair cut followed by a hot lather neck
              shave while enjoying a refreshing beverage." A relaxed atmosphere
              to unwind after a long day or week — paired with a cut and style
              done right.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {["Skin Fades", "Scissor Cuts", "Beard Shaping", "Straight-Razor Shave"].map(
                (t) => (
                  <span
                    key={t}
                    className="rounded-md bg-cream px-3.5 py-1.5 text-sm text-coffee"
                  >
                    {t}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { SectionHeading };
