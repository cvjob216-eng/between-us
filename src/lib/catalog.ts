export type FontCategory =
  | "arabic_classical"
  | "arabic_modern"
  | "arabic_handwriting"
  | "latin_script";

export interface FontOption {
  id: string;
  name: string;
  nameAr: string;
  category: FontCategory;
  cssFamily: string;
  sampleAr: string;
  sampleLat: string;
  recommendedLang: "ar" | "latin" | "both";
}

export const FONT_OPTIONS: FontOption[] = [
  // Arabic Classical
  {
    id: "amiri",
    name: "Amiri",
    nameAr: "أميري",
    category: "arabic_classical",
    cssFamily: "var(--font-amiri), serif",
    sampleAr: "في انتظار رسالتكِ، يتوق الورقُ لحبر القلب.",
    sampleLat: "Waiting for your letter.",
    recommendedLang: "ar",
  },
  {
    id: "aref_ruqaa",
    name: "Aref Ruqaa",
    nameAr: "عارف رقعة",
    category: "arabic_classical",
    cssFamily: "var(--font-aref-ruqaa), serif",
    sampleAr: "كلماتٌ مكتوبةٌ على مهلٍ، لتصلَ حين يأذنُ الشوق.",
    sampleLat: "Written slowly.",
    recommendedLang: "ar",
  },
  {
    id: "noto_naskh",
    name: "Noto Naskh Arabic",
    nameAr: "نوتو نسخ عربي",
    category: "arabic_classical",
    cssFamily: "var(--font-noto-naskh), serif",
    sampleAr: "بين سطرٍ وآخر، حكايةٌ لا يقرؤها سوانا.",
    sampleLat: "Between the lines.",
    recommendedLang: "ar",
  },
  {
    id: "lateef",
    name: "Lateef",
    nameAr: "لطيف",
    category: "arabic_classical",
    cssFamily: "var(--font-lateef), serif",
    sampleAr: "بعضُ الرسائلِ تُشبه الوردَ المجففَ في دفاتر الذكرى.",
    sampleLat: "Like pressed roses.",
    recommendedLang: "ar",
  },
  {
    id: "gulzar",
    name: "Gulzar",
    nameAr: "جلزار",
    category: "arabic_classical",
    cssFamily: "var(--font-gulzar), serif",
    sampleAr: "سلامٌ على قلبٍ يقرأ حروفي في سكون المساء.",
    sampleLat: "Peace to your heart.",
    recommendedLang: "ar",
  },

  // Arabic Modern
  {
    id: "cairo",
    name: "Cairo",
    nameAr: "القاهرة",
    category: "arabic_modern",
    cssFamily: "var(--font-cairo), sans-serif",
    sampleAr: "رسالةٌ هادئة من بعيد، تحملُ دفءَ الأيام الجميلة.",
    sampleLat: "A quiet letter.",
    recommendedLang: "ar",
  },
  {
    id: "tajawal",
    name: "Tajawal",
    nameAr: "تجوّل",
    category: "arabic_modern",
    cssFamily: "var(--font-tajawal), sans-serif",
    sampleAr: "أكتبُ إليك اليوم كي نحتفظ بهذا الشعور للأبد.",
    sampleLat: "To keep forever.",
    recommendedLang: "ar",
  },
  {
    id: "reem_kufi",
    name: "Reem Kufi",
    nameAr: "ريم كوفي",
    category: "arabic_modern",
    cssFamily: "var(--font-reem-kufi), sans-serif",
    sampleAr: "بريدُ القلبِ لا يعرفُ العجلة.",
    sampleLat: "The heart's post.",
    recommendedLang: "ar",
  },
  {
    id: "ibm_plex_arabic",
    name: "IBM Plex Sans Arabic",
    nameAr: "آي بي إم بليكس عربي",
    category: "arabic_modern",
    cssFamily: "var(--font-ibm-plex-arabic), sans-serif",
    sampleAr: "تفاصيلُ صغيرة تبقى حيةً بين السطور.",
    sampleLat: "Small details remain.",
    recommendedLang: "ar",
  },

  // Arabic Handwriting (Authentic open-source handwriting scripts)
  {
    id: "playpen_arabic",
    name: "Playpen Sans Arabic",
    nameAr: "خط اليد (بلاي بن)",
    category: "arabic_handwriting",
    cssFamily: "var(--font-playpen-arabic), cursive",
    sampleAr: "كتبتُها لكَ بيدي كما لو كنتَ تجلسُ أمامي الآن.",
    sampleLat: "Handwritten for you.",
    recommendedLang: "ar",
  },
  {
    id: "vibes",
    name: "Vibes",
    nameAr: "فايبز (رسم يدوي)",
    category: "arabic_handwriting",
    cssFamily: "var(--font-vibes), cursive",
    sampleAr: "خطٌّ حرٌّ يشبهُ نبضَ القلمِ على الورق.",
    sampleLat: "Flowing pen strokes.",
    recommendedLang: "ar",
  },
  {
    id: "harmattan",
    name: "Harmattan",
    nameAr: "هارماتان (حبر سائل)",
    category: "arabic_handwriting",
    cssFamily: "var(--font-harmattan), serif",
    sampleAr: "كأنّ الحبرَ لم يجفّ بعدُ من رسالتِكِ الأولى.",
    sampleLat: "Ink still fresh.",
    recommendedLang: "ar",
  },

  // English & French Script & Editorial Serif
  {
    id: "caveat",
    name: "Caveat",
    nameAr: "كافيات (يدوي)",
    category: "latin_script",
    cssFamily: "var(--font-caveat), cursive",
    sampleAr: "Across every mile, my pen finds you.",
    sampleLat: "Across every mile, my pen finds you. À bientôt, mon cœur.",
    recommendedLang: "latin",
  },
  {
    id: "dancing_script",
    name: "Dancing Script",
    nameAr: "دانسنغ سكريبت",
    category: "latin_script",
    cssFamily: "var(--font-dancing-script), cursive",
    sampleAr: "Let every word rest softly in your hands.",
    sampleLat: "Let every word rest softly in your hands. Avec tout mon amour.",
    recommendedLang: "latin",
  },
  {
    id: "great_vibes",
    name: "Great Vibes",
    nameAr: "غريت فايبز",
    category: "latin_script",
    cssFamily: "var(--font-great-vibes), cursive",
    sampleAr: "Dearest, some words deserve to be waited for.",
    sampleLat: "Dearest, some words deserve to be waited for.",
    recommendedLang: "latin",
  },
  {
    id: "parisienne",
    name: "Parisienne",
    nameAr: "باريزيان",
    category: "latin_script",
    cssFamily: "var(--font-parisienne), cursive",
    sampleAr: "Une lettre écrite sous la lumière du soir.",
    sampleLat: "Une lettre écrite sous la lumière du soir.",
    recommendedLang: "latin",
  },
  {
    id: "cormorant_garamond",
    name: "Cormorant Garamond",
    nameAr: "كورمورانت غاراموند",
    category: "latin_script",
    cssFamily: "var(--font-cormorant), serif",
    sampleAr: "The art of waiting turns distance into poetry.",
    sampleLat: "The art of waiting turns distance into poetry.",
    recommendedLang: "latin",
  },
  {
    id: "libre_baskerville",
    name: "Libre Baskerville",
    nameAr: "ليبري باسكرفيل",
    category: "latin_script",
    cssFamily: "var(--font-libre-baskerville), serif",
    sampleAr: "Kept safely in our archive of memories.",
    sampleLat: "Kept safely in our archive of memories.",
    recommendedLang: "latin",
  },
];

export interface PaperOption {
  id: string;
  nameAr: string;
  nameEn: string;
  nameFr: string;
  bgHex: string;
  borderHex: string;
  accentHex: string;
  pattern: "ivory" | "aged" | "white" | "framed" | "floral" | "postal" | "plain";
}

export const PAPER_OPTIONS: PaperOption[] = [
  {
    id: "antique_ivory",
    nameAr: "ورق عاجي كلاسيكي",
    nameEn: "Classic Antique Ivory",
    nameFr: "Ivoire Antique Classique",
    bgHex: "#F7EFE0",
    borderHex: "#D8C6A8",
    accentHex: "#795C43",
    pattern: "ivory",
  },
  {
    id: "vintage_beige",
    nameAr: "ورق قديم بلون البيج",
    nameEn: "Aged Parchment Beige",
    nameFr: "Parchemin Beige Ancien",
    bgHex: "#EAD9BC",
    borderHex: "#C5AD89",
    accentHex: "#6D4F37",
    pattern: "aged",
  },
  {
    id: "elegant_white",
    nameAr: "ورق أبيض أنيق",
    nameEn: "Fine Cotton White",
    nameFr: "Coton Blanc Élégant",
    bgHex: "#FBF8F3",
    borderHex: "#DFD5C7",
    accentHex: "#5C4738",
    pattern: "white",
  },
  {
    id: "delicate_frame",
    nameAr: "ورق مزخرف بإطار رقيق",
    nameEn: "Gilded Border Stationery",
    nameFr: "Papier à Bordure Fine",
    bgHex: "#F5EBDA",
    borderHex: "#B89768",
    accentHex: "#783B43",
    pattern: "framed",
  },
  {
    id: "floral_whisper",
    nameAr: "ورق برسومات زهور خفيفة",
    nameEn: "Pressed Flora Whisper",
    nameFr: "Fleurs Séchées Délicates",
    bgHex: "#F8EFE8",
    borderHex: "#D6B5B5",
    accentHex: "#783B43",
    pattern: "floral",
  },
  {
    id: "postal_vintage",
    nameAr: "ورق Vintage بنقوش بريدية",
    nameEn: "19th-Century Postmark",
    nameFr: "Cachet Postal Vintage",
    bgHex: "#EFE2C8",
    borderHex: "#B59C78",
    accentHex: "#5B4331",
    pattern: "postal",
  },
  {
    id: "minimal_pure",
    nameAr: "ورق بسيط بدون زخارف",
    nameEn: "Pure Unadorned Sheet",
    nameFr: "Feuille Pure Sans Ornement",
    bgHex: "#F9F4EA",
    borderHex: "#E4DAC8",
    accentHex: "#35271F",
    pattern: "plain",
  },
];

export interface EnvelopeOption {
  id: string;
  nameAr: string;
  nameEn: string;
  nameFr: string;
  paperHex: string;
  flapHex: string;
  innerHex: string;
  trimHex: string;
  style: "ivory" | "beige" | "rose" | "white" | "floral" | "airmail";
}

export const ENVELOPE_OPTIONS: EnvelopeOption[] = [
  {
    id: "classic_ivory",
    nameAr: "ظرف كلاسيكي عاجي",
    nameEn: "Classic Ivory Envelope",
    nameFr: "Enveloppe Ivoire Classique",
    paperHex: "#F4E9D4",
    flapHex: "#EBDCBE",
    innerHex: "#DEC9A4",
    trimHex: "#B89D78",
    style: "ivory",
  },
  {
    id: "antique_beige",
    nameAr: "ظرف بيج قديم",
    nameEn: "Aged Kraft & Beige",
    nameFr: "Beige Parchemin Ancien",
    paperHex: "#E5CFA9",
    flapHex: "#D9BE92",
    innerHex: "#C7A778",
    trimHex: "#8B6C4A",
    style: "beige",
  },
  {
    id: "romantic_rose",
    nameAr: "ظرف وردي رومانسي",
    nameEn: "Dusty Rose Keepsake",
    nameFr: "Rose Poudré Romantique",
    paperHex: "#EEDADA",
    flapHex: "#E3C5C5",
    innerHex: "#D2A8A8",
    trimHex: "#8D4C54",
    style: "rose",
  },
  {
    id: "elegant_white",
    nameAr: "ظرف أبيض أنيق",
    nameEn: "Pearl Linen White",
    nameFr: "Blanc Lin Élégant",
    paperHex: "#FAF6EE",
    flapHex: "#F1EAE0",
    innerHex: "#E2D7C7",
    trimHex: "#A89882",
    style: "white",
  },
  {
    id: "floral_sketch",
    nameAr: "ظرف برسومات زهور",
    nameEn: "Botanical Pressed Flora",
    nameFr: "Motifs Floraux",
    paperHex: "#F5ECE3",
    flapHex: "#EBDCD0",
    innerHex: "#DCC3B8",
    trimHex: "#783B43",
    style: "floral",
  },
  {
    id: "vintage_airmail",
    nameAr: "ظرف Vintage بريدي",
    nameEn: "Vintage Postal Dispatch",
    nameFr: "Courrier Postal Vintage",
    paperHex: "#ECDDC0",
    flapHex: "#E1CEAA",
    innerHex: "#CEB58B",
    trimHex: "#783B43",
    style: "airmail",
  },
];

export interface StampOption {
  id: string;
  nameAr: string;
  nameEn: string;
  nameFr: string;
  category: "floral" | "heart" | "antique" | "city" | "romantic" | "occasion";
  bgHex: string;
  inkHex: string;
  postmarkText: string;
  motif: "rose" | "heart" | "quill" | "paris" | "cairo" | "moon" | "anniversary" | "dove";
}

export const STAMP_OPTIONS: StampOption[] = [
  {
    id: "pressed_rose",
    nameAr: "طابع الوردة المجففة",
    nameEn: "Pressed Damask Rose",
    nameFr: "Rose Séchée",
    category: "floral",
    bgHex: "#F4E5DF",
    inkHex: "#783B43",
    postmarkText: "1894 • FLORA",
    motif: "rose",
  },
  {
    id: "crimson_heart",
    nameAr: "طابع نبض القلب",
    nameEn: "Crimson Heart Post",
    nameFr: "Cœur Pourpre",
    category: "heart",
    bgHex: "#F5E4E4",
    inkHex: "#8C2D38",
    postmarkText: "POSTE D'AMOUR",
    motif: "heart",
  },
  {
    id: "antique_quill",
    nameAr: "طابع الريشة والحبر",
    nameEn: "Antique Quill 1889",
    nameFr: "Plume Ancienne",
    category: "antique",
    bgHex: "#EDE1CA",
    inkHex: "#5B4331",
    postmarkText: "VIA PAR AVION",
    motif: "quill",
  },
  {
    id: "paris_soir",
    nameAr: "طابع ليالي باريس",
    nameEn: "Paris Soir Stamp",
    nameFr: "Paris au Crépuscule",
    category: "city",
    bgHex: "#EAE4DA",
    inkHex: "#3C4659",
    postmarkText: "PARIS • 1920",
    motif: "paris",
  },
  {
    id: "cairo_nile",
    nameAr: "طابع القاهرة القديم",
    nameEn: "Old Cairo Post",
    nameFr: "Le Caire d'Antan",
    category: "city",
    bgHex: "#EFE2C4",
    inkHex: "#795C43",
    postmarkText: "CAIRO • 1912",
    motif: "cairo",
  },
  {
    id: "crescent_night",
    nameAr: "طابع قمر الرسائل",
    nameEn: "Midnight Crescent",
    nameFr: "Croissant de Nuit",
    category: "romantic",
    bgHex: "#E4E1EA",
    inkHex: "#352E47",
    postmarkText: "NOCTURNE",
    motif: "moon",
  },
  {
    id: "golden_anniversary",
    nameAr: "طابع الذكرى الخاصة",
    nameEn: "Special Occasion",
    nameFr: "Jour Mémorable",
    category: "occasion",
    bgHex: "#F2E7CA",
    inkHex: "#8A6228",
    postmarkText: "SOUVENIR",
    motif: "anniversary",
  },
  {
    id: "messenger_dove",
    nameAr: "طابع حمامة البريد",
    nameEn: "Messenger Dove",
    nameFr: "Colombe Voyageuse",
    category: "romantic",
    bgHex: "#EAEAE2",
    inkHex: "#445A52",
    postmarkText: "PAR VOL",
    motif: "dove",
  },
];

export interface WaxSealOption {
  id: string;
  nameAr: string;
  nameEn: string;
  nameFr: string;
  colorHex: string;
  highlightHex: string;
  shadowHex: string;
  symbol: "heart" | "flower" | "star" | "crown" | "infinity" | "crescent";
}

export const WAX_SEAL_OPTIONS: WaxSealOption[] = [
  {
    id: "burgundy_heart",
    nameAr: "ختم عنابي — قلب",
    nameEn: "Burgundy Heart",
    nameFr: "Cire Bordeaux — Cœur",
    colorHex: "#783B43",
    highlightHex: "#9F5862",
    shadowHex: "#4B1F25",
    symbol: "heart",
  },
  {
    id: "crimson_flower",
    nameAr: "ختم قرمزي — زهرة",
    nameEn: "Crimson Blossom",
    nameFr: "Cire Carmin — Fleur",
    colorHex: "#8E343C",
    highlightHex: "#B8555E",
    shadowHex: "#581B21",
    symbol: "flower",
  },
  {
    id: "antique_gold_star",
    nameAr: "ختم ذهبي عتيق — نجمة",
    nameEn: "Antique Gold Star",
    nameFr: "Cire Or Vieilli — Étoile",
    colorHex: "#9D7840",
    highlightHex: "#C5A063",
    shadowHex: "#62471F",
    symbol: "star",
  },
  {
    id: "dusty_rose_heart",
    nameAr: "ختم وردي عتيق — قلب",
    nameEn: "Dusty Rose Heart",
    nameFr: "Cire Rose Poudré — Cœur",
    colorHex: "#A86C70",
    highlightHex: "#C99396",
    shadowHex: "#6F3F42",
    symbol: "heart",
  },
  {
    id: "forest_olive_flower",
    nameAr: "ختم زيتوني — زهرة",
    nameEn: "Sage Olive Flora",
    nameFr: "Cire Sauge — Fleur",
    colorHex: "#4B614D",
    highlightHex: "#718B73",
    shadowHex: "#2D3D2F",
    symbol: "flower",
  },
  {
    id: "midnight_plum_crescent",
    nameAr: "ختم برقوقي — هلال",
    nameEn: "Plum Crescent",
    nameFr: "Cire Prune — Croissant",
    colorHex: "#573B4E",
    highlightHex: "#7B5B71",
    shadowHex: "#34202E",
    symbol: "crescent",
  },
  {
    id: "walnut_crown",
    nameAr: "ختم بني دافئ — تاج",
    nameEn: "Walnut Crest",
    nameFr: "Cire Noyer — Couronne",
    colorHex: "#6B4C35",
    highlightHex: "#8F6D52",
    shadowHex: "#422D1D",
    symbol: "crown",
  },
  {
    id: "wax_emerald_star",
    nameAr: "ختم زمردي — نجمة",
    nameEn: "Deep Forest Star",
    nameFr: "Cire Émeraude — Étoile",
    colorHex: "#33544D",
    highlightHex: "#557C73",
    shadowHex: "#1D342F",
    symbol: "star",
  },
];

export const INK_COLORS = [
  { id: "dark_ink", nameAr: "حبر داكن كلاسيكي", nameEn: "Dark Sepia Ink", hex: "#35271F" },
  { id: "warm_walnut", nameAr: "حبر جوزي دافئ", nameEn: "Warm Walnut", hex: "#5C402E" },
  { id: "burgundy_wine", nameAr: "حبر عنابي عتيق", nameEn: "Aged Burgundy", hex: "#783B43" },
  { id: "midnight_blue", nameAr: "حبر أزرق ليلي", nameEn: "Midnight Indigo", hex: "#28374E" },
  { id: "forest_moss", nameAr: "حبر أخضر داكن", nameEn: "Forest Moss", hex: "#2E4739" },
  { id: "plum_velvet", nameAr: "حبر أرجواني مخملي", nameEn: "Velvet Plum", hex: "#543449" },
];

export function getFontById(id: string): FontOption {
  return FONT_OPTIONS.find((f) => f.id === id) ?? FONT_OPTIONS[0];
}

export function getPaperById(id: string): PaperOption {
  return PAPER_OPTIONS.find((p) => p.id === id) ?? PAPER_OPTIONS[0];
}

export function getEnvelopeById(id: string): EnvelopeOption {
  return ENVELOPE_OPTIONS.find((e) => e.id === id) ?? ENVELOPE_OPTIONS[0];
}

export function getStampById(id: string): StampOption {
  return STAMP_OPTIONS.find((s) => s.id === id) ?? STAMP_OPTIONS[0];
}

export function getWaxSealById(id: string): WaxSealOption {
  return WAX_SEAL_OPTIONS.find((w) => w.id === id) ?? WAX_SEAL_OPTIONS[0];
}
