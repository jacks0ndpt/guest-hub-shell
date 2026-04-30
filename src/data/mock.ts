import heroHotel from "@/assets/hero-hotel.jpg";
import roomStandard from "@/assets/room-standard.jpg";
import roomDeluxe from "@/assets/room-deluxe.jpg";
import roomFamily from "@/assets/room-family.jpg";
import roomBusiness from "@/assets/room-business.jpg";
import lobby from "@/assets/lobby.jpg";
import breakfast from "@/assets/breakfast.jpg";
import surroundings from "@/assets/surroundings.jpg";
import exterior from "@/assets/exterior.jpg";

/**
 * Centralized mock data for the Hotel GuestHub template.
 * Shape is intentionally close to a future DB schema so it can be
 * swapped for Supabase-backed data with minimal changes.
 */

export type PropertySettings = {
  property_name: string;
  property_type: string;
  tagline: string;
  short_description: string;
  logo_placeholder: string; // initials for now
  primary_color: string;
  secondary_color: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  whatsapp: string;
  booking_url: string;
  currency: string;
  language_default: string;
  checkin_time: string;
  checkout_time: string;
  social: { label: string; url: string }[];
};

export const property: PropertySettings = {
  property_name: "Hotel Aurora",
  property_type: "Boutique Motel",
  tagline: "A warm stay between the mountains and the old town.",
  short_description:
    "A 24-room boutique hotel in Brașov, Romania — calm rooms, honest service, and everything you need a tap away.",
  logo_placeholder: "HA",
  primary_color: "#8b7355",
  secondary_color: "#c9b99a",
  address: "Strada Republicii 42",
  city: "Brașov",
  country: "Romania",
  phone: "+40 368 123 456",
  email: "stay@hotelaurora.ro",
  whatsapp: "+40 752 000 000",
  booking_url: "#book",
  currency: "EUR",
  language_default: "en",
  checkin_time: "15:00",
  checkout_time: "11:00",
  social: [
    { label: "Instagram", url: "#" },
    { label: "Facebook", url: "#" },
    { label: "TripAdvisor", url: "#" },
  ],
};

export type Room = {
  slug: string;
  name: string;
  short_description: string;
  long_description: string;
  capacity: number;
  bed_type: string;
  size_sqm: number;
  price_from: number;
  image: string;
  gallery: string[];
  amenities: string[];
};

export const rooms: Room[] = [
  {
    slug: "standard-double",
    name: "Standard Double Room",
    short_description: "A calm double room with soft morning light and quiet city side views.",
    long_description:
      "Our Standard Double is a 22 m² retreat designed for restful sleep. A handcrafted wooden headboard, premium cotton linens, and soft neutral tones create a quiet, grounding atmosphere. Ideal for couples and solo travelers who value simplicity and comfort.",
    capacity: 2,
    bed_type: "1 Queen bed",
    size_sqm: 22,
    price_from: 89,
    image: roomStandard,
    gallery: [roomStandard, lobby, breakfast],
    amenities: ["Free Wi-Fi", "Smart TV", "Rain shower", "Air conditioning", "Breakfast available"],
  },
  {
    slug: "deluxe-mountain-view",
    name: "Deluxe Mountain View Room",
    short_description: "King bed, panoramic Carpathian views, and a cozy reading chair.",
    long_description:
      "The Deluxe Mountain View is our signature room — 30 m² facing the Carpathian ridge. Wake to the Tâmpa silhouette, enjoy pour-over coffee in a plush reading chair, and unwind in a marble-tiled bathroom with a rain shower.",
    capacity: 2,
    bed_type: "1 King bed",
    size_sqm: 30,
    price_from: 129,
    image: roomDeluxe,
    gallery: [roomDeluxe, exterior, surroundings],
    amenities: ["Mountain view", "Free Wi-Fi", "Smart TV", "Nespresso machine", "Rain shower", "Bathrobe & slippers"],
  },
  {
    slug: "family-room",
    name: "Family Room",
    short_description: "Space for four, with thoughtful details for traveling with kids.",
    long_description:
      "Our 36 m² Family Room sleeps up to four with a queen bed and two singles. Blackout curtains, quiet air conditioning, and a small lounge corner make it easy to settle in as a family after a day exploring Brașov.",
    capacity: 4,
    bed_type: "1 Queen + 2 Singles",
    size_sqm: 36,
    price_from: 149,
    image: roomFamily,
    gallery: [roomFamily, breakfast, lobby],
    amenities: ["Family-friendly", "Free Wi-Fi", "Smart TV", "Kettle", "Blackout curtains", "Extra linens"],
  },
  {
    slug: "business-twin",
    name: "Business Twin Room",
    short_description: "Two single beds, a proper work desk, and fast Wi-Fi.",
    long_description:
      "Designed for colleagues on the road — the Business Twin offers two full-size single beds, a dedicated ergonomic work desk, and high-speed Wi-Fi. Quiet floors and late-checkout options available on request.",
    capacity: 2,
    bed_type: "2 Single beds",
    size_sqm: 24,
    price_from: 99,
    image: roomBusiness,
    gallery: [roomBusiness, lobby, exterior],
    amenities: ["Work desk", "Fast Wi-Fi", "Smart TV", "Iron & board", "24h reception", "Printing on request"],
  },
];

export const amenities = [
  { icon: "Wifi", label: "Fast Wi-Fi", description: "Free high-speed internet in every room." },
  { icon: "Coffee", label: "Fresh Breakfast", description: "Local produce served every morning." },
  { icon: "Car", label: "Free Parking", description: "Secure on-site parking for all guests." },
  { icon: "Sparkles", label: "Daily Housekeeping", description: "Quiet, thorough, on your schedule." },
  { icon: "ConciergeBell", label: "24/7 Reception", description: "A real person, day or night." },
  { icon: "Mountain", label: "Mountain Views", description: "Rooms facing the Carpathians." },
  { icon: "PawPrint", label: "Pet Friendly", description: "Small pets welcome on request." },
  { icon: "Leaf", label: "Quiet Garden", description: "A small courtyard to slow down in." },
];

export type GalleryItem = { src: string; alt: string; category: "rooms" | "lobby" | "breakfast" | "exterior" | "surroundings" };
export const gallery: GalleryItem[] = [
  { src: roomStandard, alt: "Standard Double Room", category: "rooms" },
  { src: roomDeluxe, alt: "Deluxe Mountain View Room", category: "rooms" },
  { src: roomFamily, alt: "Family Room", category: "rooms" },
  { src: roomBusiness, alt: "Business Twin Room", category: "rooms" },
  { src: lobby, alt: "Hotel Aurora lobby", category: "lobby" },
  { src: breakfast, alt: "Breakfast spread", category: "breakfast" },
  { src: exterior, alt: "Hotel exterior at dusk", category: "exterior" },
  { src: surroundings, alt: "Brașov old town", category: "surroundings" },
];

export const testimonials = [
  {
    name: "Ioana M.",
    location: "Bucharest",
    quote:
      "The quietest night's sleep I've had in months. Simple, warm, and the morning coffee was exceptional.",
    rating: 5,
  },
  {
    name: "Marco R.",
    location: "Milan",
    quote: "Walked to the old town in 6 minutes. Staff were genuinely helpful — felt like staying with friends.",
    rating: 5,
  },
  {
    name: "Sophie L.",
    location: "Paris",
    quote: "The mountain view room is worth every euro. We'll be back in autumn.",
    rating: 5,
  },
];

export type Offer = {
  slug: string;
  title: string;
  description: string;
  badge: string;
  perks: string[];
};

export const offers: Offer[] = [
  {
    slug: "weekend-stay",
    title: "Weekend Stay",
    description: "Two nights Friday through Sunday with a late checkout at 13:00.",
    badge: "Save 15%",
    perks: ["Two nights, one price", "Late checkout 13:00", "Welcome drink on arrival"],
  },
  {
    slug: "breakfast-included",
    title: "Breakfast Included",
    description: "Book any room and enjoy our full local breakfast, on us.",
    badge: "Most popular",
    perks: ["Full breakfast for two", "Fresh local pastries", "Specialty coffee"],
  },
  {
    slug: "late-checkout",
    title: "Late Checkout Package",
    description: "Add three extra hours in your room for a slow, easy morning.",
    badge: "Slow mornings",
    perks: ["Checkout at 14:00", "Complimentary espresso", "Priority taxi booking"],
  },
];

export const nearbyAttractions = [
  { name: "Piața Sfatului (Old Town Square)", distance: "6 min walk" },
  { name: "Black Church", distance: "8 min walk" },
  { name: "Mount Tâmpa cable car", distance: "12 min walk" },
  { name: "Poiana Brașov ski area", distance: "20 min drive" },
  { name: "Bran Castle", distance: "35 min drive" },
];

export const transport = [
  { label: "Brașov train station", detail: "10 min by taxi" },
  { label: "Bucharest Otopeni airport", detail: "2h 30 min by car" },
  { label: "Sibiu airport", detail: "2h 15 min by car" },
];

export { heroHotel };
