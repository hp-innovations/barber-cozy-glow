export const SHOP = {
  name: "Algonquin Barber Shop",
  established: "2017",
  phone: "(847) 769-0998",
  phoneHref: "tel:+18477690998",
  address: "202 E Algonquin Rd, Algonquin, IL 60102",
  addressLine1: "202 E Algonquin Rd",
  addressLine2: "Algonquin, IL 60102",
  booksyUrl:
    "https://booksy.com/en-us/1683261_algonquin-barber-shop_barber-shop_18885_algonquin",
  facebookUrl: "https://facebook.com/algonquinbarber",
  rating: "4.8",
  reviewCount: "115",
  mapUrl:
    "https://www.google.com/maps?q=202+E+Algonquin+Rd,+Algonquin,+IL+60102&output=embed",
} as const;

export type Service = {
  slug: string;
  name: string;
  duration: string;
  price: string;
  tagline: string;
  /** SEO body copy — one or more paragraphs unique to this service. */
  blurb: string[];
  /** What's included, shown as chips. */
  includes: string[];
};

export const SERVICES: Service[] = [
  {
    slug: "haircut",
    name: "Haircut",
    duration: "30 min",
    price: "$35",
    tagline: "A clean, tailored cut shaped to your hair and head.",
    blurb: [
      "Our signature haircut starts with a real conversation about your hair type, head shape and the look you want — then a precise cut to match. Whether you're after a tidy professional trim, a textured crop or a fresh new style, our barbers take the time to get it right.",
      "Every haircut finishes with a clean neckline, a style with product if you'd like, and tips on keeping it looking sharp between visits. It's the cut Algonquin has trusted since 2017.",
    ],
    includes: ["Consultation", "Precision cut", "Neck cleanup", "Style finish"],
  },
  {
    slug: "skin-fade",
    name: "Skin Fade",
    duration: "30 min",
    price: "$35",
    tagline: "Seamless skin-to-length blends, done right.",
    blurb: [
      "A skin fade is all about a flawless gradient — from bare skin up through perfectly blended lengths. Our barbers fade by hand with clippers and detail work, so there are no harsh lines, just a smooth, modern finish that grows out cleanly.",
      "Low, mid or high fade, paired with the top style of your choice — we dial it in to suit your hair and how you wear it.",
    ],
    includes: ["Custom fade height", "Hand-blended gradient", "Line-up", "Style finish"],
  },
  {
    slug: "haircut-beard-combo",
    name: "Haircut & Beard Combo",
    duration: "45 min",
    price: "$50",
    tagline: "A full reset — sharp cut plus shaped beard.",
    blurb: [
      "Get the complete look in one sitting: a tailored haircut followed by a shaped, lined and trimmed beard. We balance the two so your hairline and beard line work together for a clean, intentional finish.",
      "Ideal before a big event or whenever you want to feel completely put-together from the top down.",
    ],
    includes: ["Full haircut", "Beard shaping", "Hot towel", "Line-up"],
  },
  {
    slug: "head-shave",
    name: "Head Shave",
    duration: "30 min",
    price: "$40",
    tagline: "A smooth, close head shave with hot-lather care.",
    blurb: [
      "A traditional head shave done with care — warm lather, a close, comfortable shave, and finishing products to soothe the skin. The result is a clean, smooth finish without irritation.",
      "Great as a one-time refresh or a regular part of your routine.",
    ],
    includes: ["Hot lather", "Close shave", "Soothing finish"],
  },
  {
    slug: "kids-haircut",
    name: "Kid's Haircut",
    duration: "30 min",
    price: "$30",
    tagline: "Patient, friendly cuts for the little ones.",
    blurb: [
      "We love working with kids. Our barbers are patient, gentle and quick — making first haircuts and regular trims a calm, positive experience. Parents are always welcome to stay close.",
      "From simple trims to fun styles, your child leaves looking great and feeling comfortable.",
    ],
    includes: ["Kid-friendly approach", "Comfortable pace", "Style finish"],
  },
  {
    slug: "beard-trim",
    name: "Beard Trim",
    duration: "15 min",
    price: "$15",
    tagline: "Shaped, lined and tidied in minutes.",
    blurb: [
      "Keep your beard looking its best with a quick, expert trim. We shape the length, define the cheek and neck lines, and tidy stray hairs for a crisp, even finish.",
      "Perfect for maintenance between full services or whenever your beard needs a quick reset.",
    ],
    includes: ["Length trim", "Cheek & neck line", "Tidy-up"],
  },
  {
    slug: "eyebrow-shaping",
    name: "Eyebrow Shaping / Wax",
    duration: "10 min",
    price: "$10",
    tagline: "Clean, natural-looking brow shaping.",
    blurb: [
      "Quick eyebrow shaping and waxing to clean up and define your brows for a sharper overall look. We keep it natural and balanced — never overdone.",
    ],
    includes: ["Shaping", "Wax", "Clean finish"],
  },
  {
    slug: "ear-wax",
    name: "Ear Wax",
    duration: "30 min",
    price: "$10",
    tagline: "Gentle removal of fine ear hair.",
    blurb: [
      "A fast, comfortable wax service to remove fine ear hair for a cleaner appearance. Often added on to a haircut for the complete grooming finish.",
    ],
    includes: ["Gentle wax", "Clean finish"],
  },
  {
    slug: "nose-wax",
    name: "Nose Wax",
    duration: "5 min",
    price: "$10",
    tagline: "Quick, painless nose-hair removal.",
    blurb: [
      "A speedy, surprisingly comfortable nose wax to keep things tidy. It takes just a few minutes and makes a noticeable difference — a popular add-on to any service.",
    ],
    includes: ["Quick wax", "Comfortable finish"],
  },
  {
    slug: "hair-wash",
    name: "Hair Wash",
    duration: "10 min",
    price: "$10",
    tagline: "A refreshing wash and rinse.",
    blurb: [
      "A relaxing hair wash and rinse to refresh your scalp and prep your hair for a cut or style. A small touch that makes the whole visit feel that much better.",
    ],
    includes: ["Wash", "Rinse", "Towel dry"],
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export const ALSO_OFFERED = [
  "Buzz Cut",
  "Curly Hair",
  "Hair Shape Up",
  "Scissor Cut",
  "Shave",
  "Straight Razor Shave",
] as const;

export const HOURS = [
  { day: "Monday", time: "Closed", closed: true },
  { day: "Tuesday", time: "Closed", closed: true },
  { day: "Wednesday", time: "9:00 AM – 7:00 PM", closed: false },
  { day: "Thursday", time: "11:00 AM – 7:00 PM", closed: false },
  { day: "Friday", time: "10:00 AM – 7:00 PM", closed: false },
  { day: "Saturday", time: "9:00 AM – 5:00 PM", closed: false },
  { day: "Sunday", time: "9:00 AM – 6:00 PM", closed: false },
] as const;

export const REVIEWS = [
  { quote: "Excellent work and quality customer service.", who: "Google Review" },
  {
    quote: "Amazing place, my boyfriend loved his new haircut!",
    who: "Google Review",
  },
  {
    quote:
      "Amazing service, professional work. Will be back again, thank you very much!",
    who: "Google Review",
  },
  {
    quote:
      "Elaina is the BEST! Me and my brother have been coming here since 2018 and she always does a fantastic job. You can tell she is very experienced.",
    who: "Oskar, Google",
  },
  {
    quote:
      "She is awesome at fading, doing all kinds of male stylized hair, and she even does eyebrows and waxing. Prices are also fair. Highly recommend!",
    who: "Natalie, Google",
  },
  {
    quote:
      "I've been bringing my boys (10 & 7) to Elaina for over 5 years now. She is the best and is so wonderful with them.",
    who: "Parent & Regular",
  },
] as const;

export const TRUST_BADGES = [
  "★ 4.8 Rated",
  "Great with Kids",
  "Restroom On-Site",
  "Walk-ins & Appointments",
  "Fair, Honest Pricing",
] as const;
