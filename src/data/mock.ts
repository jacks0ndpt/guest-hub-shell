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
 * Date mock centralizate pentru template-ul Hotel GuestHub.
 * Structura este apropiată de schema viitoare a bazei de date pentru a putea fi
 * înlocuită cu date din Supabase cu modificări minime.
 */

export type PropertySettings = {
  property_name: string;
  property_type: string;
  tagline: string;
  short_description: string;
  logo_placeholder: string;
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
  property_type: "Motel Boutique",
  tagline: "O ședere caldă între munți și centrul vechi.",
  short_description:
    "Un hotel boutique cu 24 de camere în Brașov, România — camere liniștite, servicii sincere și tot ce ai nevoie la un click distanță.",
  logo_placeholder: "HA",
  primary_color: "#8b7355",
  secondary_color: "#c9b99a",
  address: "Strada Republicii 42",
  city: "Brașov",
  country: "România",
  phone: "+40 368 123 456",
  email: "stay@hotelaurora.ro",
  whatsapp: "+40 752 000 000",
  booking_url: "#book",
  currency: "EUR",
  language_default: "ro",
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
    name: "Cameră Dublă Standard",
    short_description: "O cameră dublă liniștită, cu lumină blândă de dimineață și vedere discretă spre oraș.",
    long_description:
      "Camera Dublă Standard este un refugiu de 22 m² gândit pentru un somn odihnitor. Tăblie din lemn lucrat manual, lenjerie premium din bumbac și tonuri neutre, calde — o atmosferă liniștită, ideală pentru cupluri și călători singuri care pun preț pe simplitate și confort.",
    capacity: 2,
    bed_type: "1 pat Queen",
    size_sqm: 22,
    price_from: 89,
    image: roomStandard,
    gallery: [roomStandard, lobby, breakfast],
    amenities: ["Wi-Fi gratuit", "Smart TV", "Duș tip ploaie", "Aer condiționat", "Mic dejun disponibil"],
  },
  {
    slug: "deluxe-mountain-view",
    name: "Cameră Deluxe cu Vedere la Munte",
    short_description: "Pat King, vedere panoramică spre Carpați și un fotoliu confortabil de lectură.",
    long_description:
      "Camera Deluxe cu Vedere la Munte este camera noastră emblematică — 30 m² cu vedere spre creasta Carpaților. Trezește-te cu silueta Tâmpei, savurează cafeaua într-un fotoliu confortabil și relaxează-te în baia cu marmură și duș tip ploaie.",
    capacity: 2,
    bed_type: "1 pat King",
    size_sqm: 30,
    price_from: 129,
    image: roomDeluxe,
    gallery: [roomDeluxe, exterior, surroundings],
    amenities: ["Vedere la munte", "Wi-Fi gratuit", "Smart TV", "Espressor Nespresso", "Duș tip ploaie", "Halat și papuci"],
  },
  {
    slug: "family-room",
    name: "Cameră Familială",
    short_description: "Spațiu pentru patru, cu detalii gândite pentru călătoriile cu copii.",
    long_description:
      "Camera Familială de 36 m² găzduiește până la patru persoane cu un pat queen și două paturi single. Draperii blackout, aer condiționat silențios și un mic colț de relaxare fac ușoară așezarea ca familie după o zi de explorat Brașovul.",
    capacity: 4,
    bed_type: "1 Queen + 2 Single",
    size_sqm: 36,
    price_from: 149,
    image: roomFamily,
    gallery: [roomFamily, breakfast, lobby],
    amenities: ["Prietenos cu familia", "Wi-Fi gratuit", "Smart TV", "Fierbător", "Draperii blackout", "Lenjerie suplimentară"],
  },
  {
    slug: "business-twin",
    name: "Cameră Twin Business",
    short_description: "Două paturi single, un birou de lucru adevărat și Wi-Fi rapid.",
    long_description:
      "Gândită pentru colegi în deplasare — Camera Twin Business oferă două paturi single de mărime full, un birou ergonomic dedicat și Wi-Fi de mare viteză. Etaje liniștite și opțiuni de check-out târziu la cerere.",
    capacity: 2,
    bed_type: "2 paturi Single",
    size_sqm: 24,
    price_from: 99,
    image: roomBusiness,
    gallery: [roomBusiness, lobby, exterior],
    amenities: ["Birou de lucru", "Wi-Fi rapid", "Smart TV", "Fier de călcat", "Recepție 24h", "Printare la cerere"],
  },
];

export const amenities = [
  { icon: "Wifi", label: "Wi-Fi rapid", description: "Internet de mare viteză gratuit în fiecare cameră." },
  { icon: "Coffee", label: "Mic dejun proaspăt", description: "Produse locale servite în fiecare dimineață." },
  { icon: "Car", label: "Parcare gratuită", description: "Parcare sigură la fața locului pentru toți oaspeții." },
  { icon: "Sparkles", label: "Curățenie zilnică", description: "Discretă, atentă, pe programul tău." },
  { icon: "ConciergeBell", label: "Recepție 24/7", description: "O persoană reală, zi sau noapte." },
  { icon: "Mountain", label: "Vedere la munte", description: "Camere cu vedere spre Carpați." },
  { icon: "PawPrint", label: "Pet friendly", description: "Animale mici binevenite la cerere." },
  { icon: "Leaf", label: "Grădină liniștită", description: "O mică curte interioară pentru relaxare." },
];

export type GalleryItem = { src: string; alt: string; category: "rooms" | "lobby" | "breakfast" | "exterior" | "surroundings" };
export const gallery: GalleryItem[] = [
  { src: roomStandard, alt: "Cameră Dublă Standard", category: "rooms" },
  { src: roomDeluxe, alt: "Cameră Deluxe cu Vedere la Munte", category: "rooms" },
  { src: roomFamily, alt: "Cameră Familială", category: "rooms" },
  { src: roomBusiness, alt: "Cameră Twin Business", category: "rooms" },
  { src: lobby, alt: "Lobby-ul Hotel Aurora", category: "lobby" },
  { src: breakfast, alt: "Mic dejun servit", category: "breakfast" },
  { src: exterior, alt: "Exteriorul hotelului la apus", category: "exterior" },
  { src: surroundings, alt: "Centrul vechi din Brașov", category: "surroundings" },
];

export const testimonials = [
  {
    name: "Ioana M.",
    location: "București",
    quote:
      "Cel mai liniștit somn din ultimele luni. Simplu, cald, iar cafeaua de dimineață a fost excepțională.",
    rating: 5,
  },
  {
    name: "Marco R.",
    location: "Milano",
    quote:
      "Am ajuns la centrul vechi în 6 minute pe jos. Personalul a fost cu adevărat amabil — ne-am simțit ca în vizită la prieteni.",
    rating: 5,
  },
  {
    name: "Sophie L.",
    location: "Paris",
    quote: "Camera cu vedere la munte merită fiecare euro. Ne întoarcem cu siguranță în toamnă.",
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
    title: "Ședere de Weekend",
    description: "Două nopți, de vineri până duminică, cu check-out târziu la ora 13:00.",
    badge: "Reducere 15%",
    perks: ["Două nopți, un singur preț", "Check-out târziu la 13:00", "Băutură de bun venit la sosire"],
  },
  {
    slug: "breakfast-included",
    title: "Mic Dejun Inclus",
    description: "Rezervă orice cameră și bucură-te de micul nostru dejun local complet, din partea casei.",
    badge: "Cel mai popular",
    perks: ["Mic dejun complet pentru doi", "Patiserii locale proaspete", "Cafea de specialitate"],
  },
  {
    slug: "late-checkout",
    title: "Pachet Check-out Târziu",
    description: "Adaugă trei ore suplimentare în cameră pentru o dimineață lentă și relaxată.",
    badge: "Dimineți liniștite",
    perks: ["Check-out la 14:00", "Espresso din partea casei", "Rezervare taxi prioritară"],
  },
];

export const nearbyAttractions = [
  { name: "Piața Sfatului", distance: "6 min pe jos" },
  { name: "Biserica Neagră", distance: "8 min pe jos" },
  { name: "Telecabina Tâmpa", distance: "12 min pe jos" },
  { name: "Domeniul schiabil Poiana Brașov", distance: "20 min cu mașina" },
  { name: "Castelul Bran", distance: "35 min cu mașina" },
];

export const transport = [
  { label: "Gara Brașov", detail: "10 min cu taxiul" },
  { label: "Aeroportul București Otopeni", detail: "2h 30 min cu mașina" },
  { label: "Aeroportul Sibiu", detail: "2h 15 min cu mașina" },
];

export { heroHotel };
