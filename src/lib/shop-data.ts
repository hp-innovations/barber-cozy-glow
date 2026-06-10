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
  mapUrl:
    "https://www.google.com/maps?q=202+E+Algonquin+Rd,+Algonquin,+IL+60102&output=embed",
} as const;

export const SERVICES = [
  { name: "Haircut", duration: "30 min", price: "$35" },
  { name: "Skin Fade", duration: "30 min", price: "$35" },
  { name: "Haircut & Beard Combo", duration: "45 min", price: "$50" },
  { name: "Head Shave", duration: "30 min", price: "$40" },
  { name: "Kid's Haircut", duration: "30 min", price: "$30" },
  { name: "Beard Trim", duration: "15 min", price: "$15" },
  { name: "Eyebrow Shaping / Wax", duration: "10 min", price: "$10" },
  { name: "Ear Wax", duration: "30 min", price: "$10" },
  { name: "Nose Wax", duration: "5 min", price: "$10" },
  { name: "Hair Wash", duration: "10 min", price: "$7" },
] as const;

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
