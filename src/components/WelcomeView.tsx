"use client";

import React from "react";
import Link from "next/link";
import { Feather, Clock, Mail, BookOpen, Sparkles } from "lucide-react";
import { useApp } from "./AppProvider";
import { EnvelopeVisual } from "./StationeryArt";
import { AppLanguage } from "@/lib/i18n";

export function WelcomeView() {
  const { lang, setGuestLanguage, t } = useApp();

  const langs: Array<{ id: AppLanguage; label: string }> = [
    { id: "ar", label: "العربية" },
    { id: "fr", label: "Français" },
    { id: "en", label: "English" },
  ];

  const steps = [
    {
      icon: Feather,
      title: t.welcome.step1Title,
      desc: t.welcome.step1Desc,
    },
    {
      icon: Mail,
      title: t.welcome.step2Title,
      desc: t.welcome.step2Desc,
    },
    {
      icon: Clock,
      title: t.welcome.step3Title,
      desc: t.welcome.step3Desc,
    },
    {
      icon: BookOpen,
      title: t.welcome.step4Title,
      desc: t.welcome.step4Desc,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <header className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-[#783B43] text-[#F3E8D2] flex items-center justify-center shadow">
            <Feather className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#35271F] leading-none">
              {t.appName}
            </h1>
            <p className="text-[11px] tracking-widest uppercase text-[#795C43] mt-1">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-[#E8D7B8]/70 p-1 rounded-full border border-[#795C43]/25">
          {langs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setGuestLanguage(item.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                lang === item.id
                  ? "bg-[#783B43] text-[#F3E8D2]"
                  : "text-[#35271F] hover:bg-[#F3E8D2]/70"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-16">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8D7B8] border border-[#795C43]/30 text-xs text-[#795C43] font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#783B43]" />
              <span>{t.welcome.badge}</span>
            </div>

            <h2
              className="text-3xl sm:text-5xl font-bold text-[#35271F] leading-[1.35]"
              style={{ fontFamily: "var(--font-amiri), var(--font-cormorant), serif" }}
            >
              {t.welcome.heroTitle}
            </h2>

            <p className="text-base sm:text-lg text-[#5C4534] leading-relaxed max-w-2xl">
              {t.welcome.heroDesc}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/register"
                className="px-6 py-3.5 rounded-md bg-[#783B43] text-[#F3E8D2] font-semibold text-sm sm:text-base shadow-md hover:bg-[#642F36] transition-all hover:-translate-y-0.5"
              >
                {t.welcome.startBtn}
              </Link>
              <Link
                href="/login"
                className="px-6 py-3.5 rounded-md border border-[#795C43]/50 bg-[#F7EFE0] text-[#35271F] font-semibold text-sm sm:text-base hover:bg-[#E8D7B8] transition-colors"
              >
                {t.welcome.loginBtn}
              </Link>
            </div>
          </div>

          {/* Interactive Envelope Showcase */}
          <div className="lg:col-span-5">
            <div className="wooden-desk-surface p-6 sm:p-8 rounded-xl relative">
              <div className="animate-gentle-float">
                <EnvelopeVisual
                  envelopeId="classic_ivory"
                  stampId="pressed_rose"
                  waxSealId="burgundy_heart"
                  recipientLabel={lang === "ar" ? "إلى مَن يسكنُ القلب" : "To My Dearest"}
                  symbolicAddress={
                    lang === "ar"
                      ? "شارع الذكريات — خلف نافذة المساء"
                      : "Rue des Souvenirs • 1894"
                  }
                  envelopeNote={
                    lang === "ar" ? "تُفتح على مهل" : "To be opened slowly"
                  }
                  dir={lang === "ar" ? "rtl" : "ltr"}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy Card */}
        <section className="parchment-card rounded-lg p-6 sm:p-10 text-center max-w-4xl mx-auto space-y-3">
          <p className="text-xs uppercase tracking-[0.22em] text-[#783B43] font-semibold">
            {t.welcome.philosophyTitle}
          </p>
          <blockquote
            className="text-xl sm:text-2xl text-[#35271F] leading-relaxed"
            style={{ fontFamily: "var(--font-amiri), var(--font-cormorant), serif" }}
          >
            {t.welcome.philosophyQuote}
          </blockquote>
        </section>

        {/* Ritual Steps */}
        <section className="space-y-6 pb-8">
          <h3 className="text-center text-2xl font-bold text-[#35271F]">
            {t.welcome.stepsTitle}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={idx}
                  className="parchment-card rounded-lg p-5 space-y-3 hover:-translate-y-0.5 transition-transform"
                >
                  <div className="w-10 h-10 rounded-full bg-[#783B43]/12 text-[#783B43] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-bold text-[#35271F]">
                    {s.title}
                  </h4>
                  <p className="text-sm text-[#5C4534] leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
