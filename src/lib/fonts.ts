import {
  Amiri,
  Aref_Ruqaa,
  Noto_Naskh_Arabic,
  Lateef,
  Gulzar,
  Cairo,
  Tajawal,
  Reem_Kufi,
  IBM_Plex_Sans_Arabic,
  Playpen_Sans_Arabic,
  Vibes,
  Harmattan,
  Caveat,
  Dancing_Script,
  Great_Vibes,
  Parisienne,
  Cormorant_Garamond,
  Libre_Baskerville,
} from "next/font/google";

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

const arefRuqaa = Aref_Ruqaa({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-aref-ruqaa",
  display: "swap",
});

const notoNaskh = Noto_Naskh_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
  variable: "--font-noto-naskh",
  display: "swap",
});

const lateef = Lateef({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
  variable: "--font-lateef",
  display: "swap",
});

const gulzar = Gulzar({
  subsets: ["arabic", "latin"],
  weight: ["400"],
  variable: "--font-gulzar",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cairo",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-tajawal",
  display: "swap",
});

const reemKufi = Reem_Kufi({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
  variable: "--font-reem-kufi",
  display: "swap",
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-arabic",
  display: "swap",
});

const playpenArabic = Playpen_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-playpen-arabic",
  display: "swap",
});

const vibes = Vibes({
  subsets: ["arabic", "latin"],
  weight: ["400"],
  variable: "--font-vibes",
  display: "swap",
});

const harmattan = Harmattan({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
  variable: "--font-harmattan",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-dancing-script",
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-great-vibes",
  display: "swap",
});

const parisienne = Parisienne({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-parisienne",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-libre-baskerville",
  display: "swap",
});

export const ALL_FONT_VARIABLES = [
  amiri.variable,
  arefRuqaa.variable,
  notoNaskh.variable,
  lateef.variable,
  gulzar.variable,
  cairo.variable,
  tajawal.variable,
  reemKufi.variable,
  ibmPlexArabic.variable,
  playpenArabic.variable,
  vibes.variable,
  harmattan.variable,
  caveat.variable,
  dancingScript.variable,
  greatVibes.variable,
  parisienne.variable,
  cormorant.variable,
  libreBaskerville.variable,
].join(" ");
