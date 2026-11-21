"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Clock,
  Feather,
  Keyboard,
  PenTool,
  Send,
  Sparkles,
  Trash2,
  Eye,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useApp } from "@/components/AppProvider";
import { DeskHeader } from "@/components/DeskHeader";
import {
  EnvelopeVisual,
  PaperSheet,
  StampSvg,
  WaxSealSvg,
} from "@/components/StationeryArt";
import { HandwritingCanvas } from "@/components/HandwritingCanvas";
import {
  ENVELOPE_OPTIONS,
  FONT_OPTIONS,
  INK_COLORS,
  PAPER_OPTIONS,
  STAMP_OPTIONS,
  WAX_SEAL_OPTIONS,
  getFontById,
} from "@/lib/catalog";
import { playPaperRustle, playDeskPlace } from "@/lib/sounds";

type StepId = "paper" | "write" | "envelope" | "stamp" | "preview" | "delivery";

const LOCAL_DRAFT_KEY = "bl_working_draft_v1";

export default function ComposePage() {
  const { loading, user, relationship, lang, dir, t, refreshSession } = useApp();
  const router = useRouter();

  const [step, setStep] = useState<StepId>("paper");
  const [writeMode, setWriteMode] = useState<"keyboard" | "handwriting">("keyboard");

  // Letter state
  const [content, setContent] = useState("");
  const [handwritingImage, setHandwritingImage] = useState<string | null>(null);
  const [paperDesign, setPaperDesign] = useState("antique_ivory");
  const [envelopeDesign, setEnvelopeDesign] = useState("classic_ivory");
  const [stampDesign, setStampDesign] = useState("pressed_rose");
  const [waxSealDesign, setWaxSealDesign] = useState("burgundy_heart");
  const [recipientLabel, setRecipientLabel] = useState("");
  const [symbolicAddress, setSymbolicAddress] = useState("");
  const [envelopeNote, setEnvelopeNote] = useState("");
  const [fontFamily, setFontFamily] = useState("amiri");
  const [fontSize, setFontSize] = useState(20);
  const [inkColor, setInkColor] = useState("#35271F");
  const [letterLang, setLetterLang] = useState<"ar" | "en" | "fr">("ar");
  const [letterDir, setLetterDir] = useState<"rtl" | "ltr">("rtl");
  const [deliveryPreset, setDeliveryPreset] = useState<
    "instant" | "5m" | "30m" | "1h" | "6h" | "12h" | "24h" | "custom"
  >("instant");
  const [scheduleMode, setScheduleMode] = useState<
    "immediate_send" | "delayed_arrival" | "scheduled_send"
  >("immediate_send");
  const [customDeliveryIso, setCustomDeliveryIso] = useState("");
  const [specialOccasionLabel, setSpecialOccasionLabel] = useState("");

  // Draft & submission state
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [resumedBanner, setResumedBanner] = useState(false);
  const [draftState, setDraftState] = useState<"idle" | "saving" | "saved">("idle");
  const [sealingOverlay, setSealingOverlay] = useState(false);
  const [sentResult, setSentResult] = useState<"none" | "sent" | "scheduled">("none");
  const [errorMsg, setErrorMsg] = useState("");
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    if (!loading && user && relationship?.status !== "active") {
      router.push("/connect");
    }
  }, [loading, user, relationship, router]);

  // Load initial defaults & restore server or local draft
  useEffect(() => {
    if (!user || draftLoaded) return;

    const partnerDefault =
      relationship?.partner?.nickname ||
      relationship?.partner?.displayName ||
      "";
    setRecipientLabel(partnerDefault);
    setFontFamily(user.defaultFont || "amiri");
    setFontSize(user.defaultFontSize || 20);

    fetch("/api/drafts", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { workingDraft: null }))
      .then((data) => {
        const srv = data.workingDraft;
        let restored = false;

        if (srv && (srv.content || srv.handwritingImage)) {
          setContent(srv.content || "");
          setHandwritingImage(srv.handwritingImage || null);
          const ds = srv.designSettings || {};
          if (ds.paperDesign) setPaperDesign(ds.paperDesign);
          if (ds.envelopeDesign) setEnvelopeDesign(ds.envelopeDesign);
          if (ds.stampDesign) setStampDesign(ds.stampDesign);
          if (ds.waxSealDesign) setWaxSealDesign(ds.waxSealDesign);
          if (ds.recipientLabel) setRecipientLabel(ds.recipientLabel);
          if (ds.symbolicAddress) setSymbolicAddress(ds.symbolicAddress);
          if (ds.envelopeNote) setEnvelopeNote(ds.envelopeNote);
          if (ds.fontFamily) setFontFamily(ds.fontFamily);
          if (ds.fontSize) setFontSize(ds.fontSize);
          if (ds.inkColor) setInkColor(ds.inkColor);
          if (ds.language) setLetterLang(ds.language);
          if (ds.direction) setLetterDir(ds.direction);
          if (ds.specialOccasionLabel)
            setSpecialOccasionLabel(ds.specialOccasionLabel);
          restored = true;
        } else if (typeof window !== "undefined") {
          const localRaw = localStorage.getItem(LOCAL_DRAFT_KEY);
          if (localRaw) {
            try {
              const local = JSON.parse(localRaw);
              if (local.content || local.handwritingImage) {
                setContent(local.content || "");
                setHandwritingImage(local.handwritingImage || null);
                if (local.paperDesign) setPaperDesign(local.paperDesign);
                if (local.fontFamily) setFontFamily(local.fontFamily);
                restored = true;
              }
            } catch {
              // ignore corrupted local draft
            }
          }
        }

        if (restored) setResumedBanner(true);
        setDraftLoaded(true);
      })
      .catch(() => setDraftLoaded(true));
  }, [user, relationship, draftLoaded]);

  const designSettingsPayload = useMemo(
    () => ({
      paperDesign,
      envelopeDesign,
      stampDesign,
      waxSealDesign,
      recipientLabel,
      symbolicAddress,
      envelopeNote,
      fontFamily,
      fontSize,
      inkColor,
      language: letterLang,
      direction: letterDir,
      deliveryPreset,
      scheduleMode,
      customDeliveryIso,
      specialOccasionLabel,
    }),
    [
      paperDesign,
      envelopeDesign,
      stampDesign,
      waxSealDesign,
      recipientLabel,
      symbolicAddress,
      envelopeNote,
      fontFamily,
      fontSize,
      inkColor,
      letterLang,
      letterDir,
      deliveryPreset,
      scheduleMode,
      customDeliveryIso,
      specialOccasionLabel,
    ]
  );

  // Auto-save to localStorage immediately & to PostgreSQL debounced
  const triggerAutoSave = useCallback(() => {
    if (!draftLoaded || !user || sentResult !== "none") return;

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          LOCAL_DRAFT_KEY,
          JSON.stringify({
            content,
            handwritingImage,
            ...designSettingsPayload,
          })
        );
      } catch {
        // ignore quota errors
      }
    }

    if (!content.trim() && !handwritingImage) return;

    setDraftState("saving");
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/drafts", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content,
            handwritingImage,
            designSettings: designSettingsPayload,
          }),
        });
        if (res.ok) setDraftState("saved");
      } catch {
        setDraftState("idle");
      }
    }, 900);
  }, [
    draftLoaded,
    user,
    sentResult,
    content,
    handwritingImage,
    designSettingsPayload,
  ]);

  useEffect(() => {
    triggerAutoSave();
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [triggerAutoSave]);

  const handleDiscardDraft = async () => {
    setContent("");
    setHandwritingImage(null);
    setResumedBanner(false);
    setDraftState("idle");
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_DRAFT_KEY);
    }
    await fetch("/api/drafts", { method: "DELETE" });
  };

  const handleLetterLanguageChange = (newLang: "ar" | "en" | "fr") => {
    setLetterLang(newLang);
    setLetterDir(newLang === "ar" ? "rtl" : "ltr");
    if (newLang === "ar" && getFontById(fontFamily).recommendedLang === "latin") {
      setFontFamily("amiri");
    } else if (
      newLang !== "ar" &&
      getFontById(fontFamily).recommendedLang === "ar"
    ) {
      setFontFamily("cormorant_garamond");
    }
  };

  const handleSendLetter = async () => {
    setErrorMsg("");
    if (!content.trim() && !handwritingImage) {
      setErrorMsg(t.compose.emptyLetterWarning);
      setStep("write");
      return;
    }

    if (
      (scheduleMode === "scheduled_send" ||
        scheduleMode === "delayed_arrival" ||
        deliveryPreset === "custom") &&
      (!customDeliveryIso || new Date(customDeliveryIso) <= new Date())
    ) {
      setErrorMsg(
        lang === "ar"
          ? "يُرجى اختيار تاريخ ووقت في المستقبل."
          : "Please choose a valid future date and time."
      );
      return;
    }

    playPaperRustle(Boolean(user?.soundEnabled));
    setSealingOverlay(true);

    try {
      const res = await fetch("/api/letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          handwritingImage,
          ...designSettingsPayload,
          customDeliveryIso: customDeliveryIso
            ? new Date(customDeliveryIso).toISOString()
            : "",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSealingOverlay(false);
        setErrorMsg(t.auth.genericError);
        return;
      }

      if (typeof window !== "undefined") {
        localStorage.removeItem(LOCAL_DRAFT_KEY);
      }

      setTimeout(async () => {
        playDeskPlace(Boolean(user?.soundEnabled));
        setSealingOverlay(false);
        setSentResult(data.scheduled ? "scheduled" : "sent");
        await refreshSession();
      }, 1500);
    } catch {
      setSealingOverlay(false);
      setErrorMsg(t.auth.genericError);
    }
  };

  if (loading || !user || relationship?.status !== "active") return null;

  const activeFont = getFontById(fontFamily);
  const stepsOrder: Array<{ id: StepId; label: string }> = [
    { id: "paper", label: t.compose.stepPaper },
    { id: "write", label: t.compose.stepWrite },
    { id: "envelope", label: t.compose.stepEnvelope },
    { id: "stamp", label: t.compose.stepStamp },
    { id: "preview", label: t.compose.stepPreview },
    { id: "delivery", label: t.compose.stepDelivery },
  ];
  const currentStepIdx = stepsOrder.findIndex((s) => s.id === step);

  const fontGroups = [
    {
      title: t.compose.fontCategoryClassical,
      fonts: FONT_OPTIONS.filter((f) => f.category === "arabic_classical"),
    },
    {
      title: t.compose.fontCategoryModern,
      fonts: FONT_OPTIONS.filter((f) => f.category === "arabic_modern"),
    },
    {
      title: t.compose.fontCategoryHandwriting,
      fonts: FONT_OPTIONS.filter((f) => f.category === "arabic_handwriting"),
    },
    {
      title: t.compose.fontCategoryLatin,
      fonts: FONT_OPTIONS.filter((f) => f.category === "latin_script"),
    },
  ];

  // Sent Confirmation Screen
  if (sentResult !== "none") {
    return (
      <>
        <DeskHeader />
        <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-12 flex items-center justify-center">
          <div className="parchment-card rounded-2xl p-8 text-center space-y-6 w-full animate-paper-unfold">
            <div className="flex justify-center">
              <WaxSealSvg sealId={waxSealDesign} size={84} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#35271F]">
              {t.compose.sentSuccessTitle}
            </h1>
            <p className="text-sm sm:text-base text-[#5C4534] leading-relaxed">
              {sentResult === "scheduled"
                ? t.compose.scheduledSuccessDesc
                : t.compose.sentSuccessDesc}
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.push("/sent")}
                className="px-6 py-3 rounded-md bg-[#783B43] text-[#F3E8D2] font-semibold text-sm cursor-pointer"
              >
                {t.nav.sent}
              </button>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="px-6 py-3 rounded-md border border-[#795C43]/40 text-[#35271F] font-semibold text-sm cursor-pointer"
              >
                {t.nav.desk}
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <DeskHeader />

      {/* Wax Sealing Animation Modal */}
      {sealingOverlay && (
        <div className="fixed inset-0 z-50 bg-[#291B12]/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-5">
          <div className="animate-bounce">
            <WaxSealSvg sealId={waxSealDesign} size={96} />
          </div>
          <p className="text-lg sm:text-xl text-[#F3E8D2] font-semibold">
            {t.compose.sealingAnimationText}
          </p>
        </div>
      )}

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Header + Draft Status */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#35271F] flex items-center gap-2">
              <Feather className="w-6 h-6 text-[#783B43]" />
              <span>{t.compose.title}</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {draftState === "saving" && (
              <span className="text-xs text-[#795C43]">
                {t.compose.draftSaving}
              </span>
            )}
            {draftState === "saved" && (
              <span className="text-xs text-[#2E4739] font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                {t.compose.draftSaved}
              </span>
            )}
            {(content || handwritingImage) && (
              <button
                type="button"
                onClick={handleDiscardDraft}
                className="inline-flex items-center gap-1 text-xs text-[#783B43] hover:underline cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {t.compose.discardDraft}
              </button>
            )}
          </div>
        </div>

        {resumedBanner && (
          <div className="px-4 py-2.5 rounded-lg bg-[#E8D7B8] border border-[#795C43]/30 text-xs text-[#35271F] flex items-center justify-between">
            <span>✦ {t.compose.resumeDraftBanner}</span>
            <button
              type="button"
              onClick={() => setResumedBanner(false)}
              className="text-[#783B43] font-semibold cursor-pointer"
            >
              ×
            </button>
          </div>
        )}

        {/* 6-Step Ritual Stepper */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
          {stepsOrder.map((s) => {
            const active = s.id === step;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setStep(s.id)}
                className={`shrink-0 px-3.5 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                  active
                    ? "bg-[#783B43] text-[#F3E8D2] shadow-sm"
                    : "bg-[#F7EFE0] border border-[#795C43]/25 text-[#35271F] hover:bg-[#E8D7B8]"
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-[#783B43]/15 border border-[#783B43]/30 text-sm text-[#783B43]">
            {errorMsg}
          </div>
        )}

        {/* STEP 1: PAPER SELECTION */}
        {step === "paper" && (
          <section className="space-y-5">
            <h2 className="text-xl font-bold text-[#35271F]">
              {t.compose.paperTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PAPER_OPTIONS.map((p) => {
                const selected = p.id === paperDesign;
                const label =
                  lang === "ar" ? p.nameAr : lang === "fr" ? p.nameFr : p.nameEn;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      playPaperRustle(Boolean(user.soundEnabled));
                      setPaperDesign(p.id);
                    }}
                    className={`text-start rounded-xl p-3 transition-all cursor-pointer border-2 ${
                      selected
                        ? "border-[#783B43] shadow-lg -translate-y-0.5 bg-[#E8D7B8]/40"
                        : "border-transparent hover:border-[#795C43]/35 bg-[#F7EFE0]/60"
                    }`}
                  >
                    <PaperSheet paperId={p.id} className="h-36 p-4 flex flex-col justify-between">
                      <span
                        className="text-xs opacity-65"
                        style={{ color: p.accentHex }}
                      >
                        {lang === "ar" ? "بسم الله…" : "Dearest…"}
                      </span>
                      <div className="space-y-1.5 opacity-30">
                        <div className="h-1 w-3/4 rounded bg-current" style={{ color: p.accentHex }} />
                        <div className="h-1 w-full rounded bg-current" style={{ color: p.accentHex }} />
                        <div className="h-1 w-2/3 rounded bg-current" style={{ color: p.accentHex }} />
                      </div>
                    </PaperSheet>
                    <div className="mt-2.5 flex items-center justify-between px-1">
                      <span className="text-sm font-semibold text-[#35271F]">
                        {label}
                      </span>
                      {selected && (
                        <Check className="w-4 h-4 text-[#783B43]" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* STEP 2: LETTER EDITOR & TYPOGRAPHY + HANDWRITING */}
        {step === "write" && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left/Main: Writing Sheet or Handwriting Canvas */}
            <div className="lg:col-span-8 space-y-4">
              {/* Mode Switch: Keyboard vs Handwriting */}
              <div className="flex flex-wrap items-center justify-between gap-2 parchment-card rounded-lg p-2">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setWriteMode("keyboard")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs sm:text-sm font-medium cursor-pointer ${
                      writeMode === "keyboard"
                        ? "bg-[#783B43] text-[#F3E8D2]"
                        : "text-[#35271F] hover:bg-[#E8D7B8]"
                    }`}
                  >
                    <Keyboard className="w-4 h-4" />
                    {t.compose.modeKeyboard}
                  </button>
                  <button
                    type="button"
                    onClick={() => setWriteMode("handwriting")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs sm:text-sm font-medium cursor-pointer ${
                      writeMode === "handwriting"
                        ? "bg-[#783B43] text-[#F3E8D2]"
                        : "text-[#35271F] hover:bg-[#E8D7B8]"
                    }`}
                  >
                    <PenTool className="w-4 h-4" />
                    {t.compose.modeHandwriting}
                  </button>
                </div>

                {handwritingImage && (
                  <div className="flex items-center gap-2 text-xs text-[#2E4739]">
                    <span>✓ {t.compose.handwritingAttached}</span>
                    <button
                      type="button"
                      onClick={() => setHandwritingImage(null)}
                      className="text-[#783B43] underline cursor-pointer"
                    >
                      {t.compose.removeHandwriting}
                    </button>
                  </div>
                )}
              </div>

              {writeMode === "keyboard" ? (
                <PaperSheet paperId={paperDesign} className="p-5 sm:p-8 min-h-[430px]">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    dir={letterDir}
                    lang={letterLang}
                    placeholder={t.compose.letterPlaceholder}
                    rows={13}
                    className="w-full h-full min-h-[360px] bg-transparent resize-y focus:outline-none leading-[1.9] placeholder:text-[#795C43]/50"
                    style={{
                      fontFamily: activeFont.cssFamily,
                      fontSize: `${fontSize}px`,
                      color: inkColor,
                    }}
                  />
                </PaperSheet>
              ) : (
                <div className="parchment-card rounded-xl p-4 sm:p-5">
                  <HandwritingCanvas
                    paperId={paperDesign}
                    initialImage={handwritingImage}
                    onSave={(png) => setHandwritingImage(png)}
                  />
                </div>
              )}
            </div>

            {/* Right: Typography, Direction, Ink, Font Catalog */}
            <aside className="lg:col-span-4 parchment-card rounded-xl p-4 sm:p-5 space-y-5">
              {/* Letter Language & Direction */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#35271F]">
                  {t.compose.letterLanguage}
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(
                    [
                      { id: "ar", label: "العربية" },
                      { id: "fr", label: "Français" },
                      { id: "en", label: "English" },
                    ] as const
                  ).map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => handleLetterLanguageChange(l.id)}
                      className={`py-1.5 rounded text-xs font-medium cursor-pointer border ${
                        letterLang === l.id
                          ? "bg-[#783B43] text-[#F3E8D2] border-[#783B43]"
                          : "bg-[#FBF6EC] text-[#35271F] border-[#795C43]/30"
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#35271F]">
                  {t.compose.textDirection}
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setLetterDir("rtl")}
                    className={`py-1.5 px-2 rounded text-xs cursor-pointer border ${
                      letterDir === "rtl"
                        ? "bg-[#795C43] text-[#F3E8D2] border-[#795C43]"
                        : "bg-[#FBF6EC] text-[#35271F] border-[#795C43]/30"
                    }`}
                  >
                    {t.compose.rtlLabel}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLetterDir("ltr")}
                    className={`py-1.5 px-2 rounded text-xs cursor-pointer border ${
                      letterDir === "ltr"
                        ? "bg-[#795C43] text-[#F3E8D2] border-[#795C43]"
                        : "bg-[#FBF6EC] text-[#35271F] border-[#795C43]/30"
                    }`}
                  >
                    {t.compose.ltrLabel}
                  </button>
                </div>
              </div>

              {/* Font Size & Ink Color */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-[#35271F]">
                  <span>{t.compose.fontSize}</span>
                  <span>{fontSize}px</span>
                </div>
                <input
                  type="range"
                  min={16}
                  max={32}
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-[#783B43]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#35271F]">
                  {t.compose.inkColor}
                </label>
                <div className="flex flex-wrap gap-2">
                  {INK_COLORS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setInkColor(c.hex)}
                      title={lang === "ar" ? c.nameAr : c.nameEn}
                      className={`w-7 h-7 rounded-full border-2 cursor-pointer transition-transform ${
                        inkColor === c.hex
                          ? "scale-115 border-[#783B43] ring-2 ring-[#783B43]/30"
                          : "border-white"
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* Live Font Preview + Categorized Font Picker */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-[#35271F]">
                  {t.compose.fontPreviewHint}
                </p>
                <div
                  dir={letterDir}
                  className="p-3 rounded bg-[#FBF6EC] border border-[#795C43]/30 min-h-[64px] leading-relaxed"
                  style={{
                    fontFamily: activeFont.cssFamily,
                    fontSize: `${Math.min(24, fontSize)}px`,
                    color: inkColor,
                  }}
                >
                  {content.trim().slice(0, 90) ||
                    (letterLang === "ar"
                      ? activeFont.sampleAr
                      : activeFont.sampleLat)}
                </div>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto pe-1">
                {fontGroups.map((group) => (
                  <div key={group.title} className="space-y-1.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#783B43]">
                      {group.title}
                    </p>
                    <div className="space-y-1.5">
                      {group.fonts.map((f) => {
                        const selected = f.id === fontFamily;
                        return (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => setFontFamily(f.id)}
                            className={`w-full text-start p-2.5 rounded-md border transition-colors cursor-pointer ${
                              selected
                                ? "bg-[#783B43]/12 border-[#783B43]"
                                : "bg-[#FBF6EC]/80 border-[#795C43]/20 hover:bg-[#E8D7B8]/60"
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs text-[#795C43] mb-1">
                              <span className="font-semibold text-[#35271F]">
                                {lang === "ar" ? f.nameAr : f.name}
                              </span>
                              <span>{f.name}</span>
                            </div>
                            <p
                              dir={f.recommendedLang === "ar" ? "rtl" : "ltr"}
                              className="text-base truncate text-[#35271F]"
                              style={{ fontFamily: f.cssFamily }}
                            >
                              {content.trim().slice(0, 48) ||
                                (f.recommendedLang === "ar"
                                  ? f.sampleAr
                                  : f.sampleLat)}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </section>
        )}

        {/* STEP 3: ENVELOPE SELECTION & INSCRIPTION */}
        {step === "envelope" && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-xl font-bold text-[#35271F]">
                {t.compose.envelopeTitle}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ENVELOPE_OPTIONS.map((env) => {
                  const selected = env.id === envelopeDesign;
                  const label =
                    lang === "ar"
                      ? env.nameAr
                      : lang === "fr"
                        ? env.nameFr
                        : env.nameEn;
                  return (
                    <button
                      key={env.id}
                      type="button"
                      onClick={() => setEnvelopeDesign(env.id)}
                      className={`text-start rounded-xl p-3 border-2 cursor-pointer transition-all ${
                        selected
                          ? "border-[#783B43] bg-[#E8D7B8]/50 shadow-md"
                          : "border-transparent bg-[#F7EFE0]/60 hover:border-[#795C43]/30"
                      }`}
                    >
                      <EnvelopeVisual
                        envelopeId={env.id}
                        stampId={stampDesign}
                        waxSealId={waxSealDesign}
                        recipientLabel={recipientLabel || "إليك"}
                        compact
                        dir={dir}
                      />
                      <div className="mt-2 flex items-center justify-between px-1">
                        <span className="text-sm font-semibold text-[#35271F]">
                          {label}
                        </span>
                        {selected && <Check className="w-4 h-4 text-[#783B43]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-5 parchment-card rounded-xl p-5 space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#35271F]">
                  {t.compose.recipientLabel}
                </label>
                <input
                  type="text"
                  value={recipientLabel}
                  onChange={(e) => setRecipientLabel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md bg-[#FBF6EC] border border-[#795C43]/35 text-sm text-[#35271F]"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#35271F]">
                  {t.compose.symbolicAddress}
                </label>
                <input
                  type="text"
                  value={symbolicAddress}
                  onChange={(e) => setSymbolicAddress(e.target.value)}
                  placeholder={
                    lang === "ar"
                      ? "مثلاً: شارع المطر، الطابق الثاني"
                      : "e.g., Rue des Souvenirs"
                  }
                  className="w-full px-3.5 py-2.5 rounded-md bg-[#FBF6EC] border border-[#795C43]/35 text-sm text-[#35271F]"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#35271F]">
                  {t.compose.envelopeNote}
                </label>
                <input
                  type="text"
                  value={envelopeNote}
                  onChange={(e) => setEnvelopeNote(e.target.value)}
                  placeholder={
                    lang === "ar"
                      ? "مثلاً: تُقرأ مع كوب قهوة"
                      : "e.g., Read by candlelight"
                  }
                  className="w-full px-3.5 py-2.5 rounded-md bg-[#FBF6EC] border border-[#795C43]/35 text-sm text-[#35271F]"
                />
              </div>
            </div>
          </section>
        )}

        {/* STEP 4: POSTAGE STAMP & WAX SEAL */}
        {step === "stamp" && (
          <section className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#35271F]">
                {t.compose.stampTitle}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {STAMP_OPTIONS.map((st) => {
                  const selected = st.id === stampDesign;
                  const label =
                    lang === "ar"
                      ? st.nameAr
                      : lang === "fr"
                        ? st.nameFr
                        : st.nameEn;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setStampDesign(st.id)}
                      className={`parchment-card rounded-xl p-4 flex flex-col items-center gap-3 border-2 cursor-pointer transition-all ${
                        selected
                          ? "border-[#783B43] shadow-md -translate-y-0.5"
                          : "border-transparent hover:border-[#795C43]/35"
                      }`}
                    >
                      <StampSvg stampId={st.id} width={68} />
                      <span className="text-xs sm:text-sm font-semibold text-[#35271F] text-center">
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#35271F]">
                {t.compose.waxSealTitle}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {WAX_SEAL_OPTIONS.map((ws) => {
                  const selected = ws.id === waxSealDesign;
                  const label =
                    lang === "ar"
                      ? ws.nameAr
                      : lang === "fr"
                        ? ws.nameFr
                        : ws.nameEn;
                  return (
                    <button
                      key={ws.id}
                      type="button"
                      onClick={() => setWaxSealDesign(ws.id)}
                      className={`parchment-card rounded-xl p-4 flex flex-col items-center gap-3 border-2 cursor-pointer transition-all ${
                        selected
                          ? "border-[#783B43] shadow-md -translate-y-0.5"
                          : "border-transparent hover:border-[#795C43]/35"
                      }`}
                    >
                      <WaxSealSvg sealId={ws.id} size={64} />
                      <span className="text-xs sm:text-sm font-semibold text-[#35271F] text-center">
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* STEP 5: FULL PREVIEW */}
        {step === "preview" && (
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-[#35271F] flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#783B43]" />
              <span>{t.compose.stepPreview}</span>
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-5 wooden-desk-surface p-6 rounded-xl">
                <EnvelopeVisual
                  envelopeId={envelopeDesign}
                  stampId={stampDesign}
                  waxSealId={waxSealDesign}
                  recipientLabel={recipientLabel}
                  symbolicAddress={symbolicAddress}
                  envelopeNote={envelopeNote}
                  dir={dir}
                />
              </div>

              <div className="lg:col-span-7">
                <PaperSheet paperId={paperDesign} className="p-6 sm:p-10 space-y-6">
                  {content.trim() && (
                    <div
                      dir={letterDir}
                      lang={letterLang}
                      className="whitespace-pre-wrap leading-[1.95]"
                      style={{
                        fontFamily: activeFont.cssFamily,
                        fontSize: `${fontSize}px`,
                        color: inkColor,
                      }}
                    >
                      {content}
                    </div>
                  )}
                  {handwritingImage && (
                    <div className="pt-4 border-t border-[#795C43]/20">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={handwritingImage}
                        alt="Handwritten sheet"
                        className="w-full rounded border border-[#795C43]/20"
                      />
                    </div>
                  )}
                </PaperSheet>
              </div>
            </div>
          </section>
        )}

        {/* STEP 6: DELIVERY SETTINGS & SEND */}
        {step === "delivery" && (
          <section className="max-w-3xl mx-auto space-y-6">
            <div className="parchment-card rounded-xl p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-bold text-[#35271F] flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#783B43]" />
                <span>{t.compose.deliveryTitle}</span>
              </h2>

              {/* 3 Clear Modes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(
                  [
                    {
                      id: "immediate_send",
                      title: t.compose.deliveryModeImmediate,
                      desc: t.compose.deliveryModeImmediateDesc,
                    },
                    {
                      id: "delayed_arrival",
                      title: t.compose.deliveryModeDelayedArrival,
                      desc: t.compose.deliveryModeDelayedDesc,
                    },
                    {
                      id: "scheduled_send",
                      title: t.compose.deliveryModeScheduledSend,
                      desc: t.compose.deliveryModeScheduledDesc,
                    },
                  ] as const
                ).map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => {
                      setScheduleMode(mode.id);
                      if (
                        mode.id !== "immediate_send" &&
                        deliveryPreset === "instant"
                      ) {
                        setDeliveryPreset("custom");
                      }
                    }}
                    className={`text-start p-4 rounded-lg border-2 cursor-pointer transition-all space-y-1.5 ${
                      scheduleMode === mode.id
                        ? "border-[#783B43] bg-[#783B43]/10"
                        : "border-[#795C43]/25 bg-[#FBF6EC]"
                    }`}
                  >
                    <p className="text-sm font-bold text-[#35271F]">
                      {mode.title}
                    </p>
                    <p className="text-xs text-[#5C4534] leading-relaxed">
                      {mode.desc}
                    </p>
                  </button>
                ))}
              </div>

              {/* Duration Presets (for immediate_send mode) */}
              {scheduleMode === "immediate_send" && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(
                    [
                      "instant",
                      "5m",
                      "30m",
                      "1h",
                      "6h",
                      "12h",
                      "24h",
                      "custom",
                    ] as const
                  ).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setDeliveryPreset(p)}
                      className={`py-2.5 px-3 rounded-md text-xs sm:text-sm font-medium border cursor-pointer ${
                        deliveryPreset === p
                          ? "bg-[#783B43] text-[#F3E8D2] border-[#783B43]"
                          : "bg-[#FBF6EC] text-[#35271F] border-[#795C43]/30 hover:bg-[#E8D7B8]"
                      }`}
                    >
                      {t.compose.presets[p]}
                    </button>
                  ))}
                </div>
              )}

              {/* Custom Date/Time Picker */}
              {(deliveryPreset === "custom" ||
                scheduleMode === "delayed_arrival" ||
                scheduleMode === "scheduled_send") && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#35271F]">
                    {t.compose.customDateLabel}
                  </label>
                  <input
                    type="datetime-local"
                    dir="ltr"
                    value={customDeliveryIso}
                    onChange={(e) => setCustomDeliveryIso(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-md bg-[#FBF6EC] border border-[#795C43]/35 text-sm text-[#35271F]"
                  />
                </div>
              )}

              {/* Special Occasion Label */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-[#35271F]">
                  <Sparkles className="w-3.5 h-3.5 text-[#783B43]" />
                  <span>{t.compose.specialOccasionLabel}</span>
                </label>
                <input
                  type="text"
                  value={specialOccasionLabel}
                  onChange={(e) => setSpecialOccasionLabel(e.target.value)}
                  placeholder={t.compose.specialOccasionPlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-md bg-[#FBF6EC] border border-[#795C43]/35 text-sm text-[#35271F]"
                />
              </div>

              <button
                type="button"
                onClick={handleSendLetter}
                className="w-full py-4 rounded-lg bg-[#783B43] text-[#F3E8D2] font-bold text-base shadow-lg hover:bg-[#642F36] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-5 h-5" />
                <span>
                  {scheduleMode === "scheduled_send"
                    ? t.compose.scheduleDraftBtn
                    : t.compose.sendLetterBtn}
                </span>
              </button>
            </div>
          </section>
        )}

        {/* Bottom Step Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-[#795C43]/20">
          <button
            type="button"
            disabled={currentStepIdx === 0}
            onClick={() => setStep(stepsOrder[currentStepIdx - 1].id)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-[#795C43]/35 bg-[#F7EFE0] text-sm text-[#35271F] disabled:opacity-40 cursor-pointer"
          >
            {dir === "rtl" ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
            {t.compose.prevStep}
          </button>

          {currentStepIdx < stepsOrder.length - 1 && (
            <button
              type="button"
              onClick={() => setStep(stepsOrder[currentStepIdx + 1].id)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md bg-[#795C43] text-[#F3E8D2] text-sm font-semibold hover:bg-[#642F36] cursor-pointer"
            >
              {t.compose.nextStep}
              {dir === "rtl" ? (
                <ChevronLeft className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </main>
    </>
  );
}
