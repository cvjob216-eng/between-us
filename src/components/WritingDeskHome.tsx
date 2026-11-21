"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Feather,
  Mail,
  Send,
  BookOpen,
  Link2,
  Clock,
  Sparkles,
  FileEdit,
} from "lucide-react";
import { useApp } from "./AppProvider";
import { EnvelopeVisual } from "./StationeryArt";
import { formatDateTime } from "@/lib/i18n";

interface DeskEnvelope {
  id: string;
  senderName: string;
  envelopeDesign: string;
  stampDesign: string;
  waxSealDesign: string;
  recipientLabel: string;
  specialOccasionLabel: string;
  deliveredAt: string | null;
  sentAt: string;
  status: string;
}

export function WritingDeskHome() {
  const { user, relationship, counts, lang, dir, t } = useApp();
  const router = useRouter();
  const [arrivedEnvelopes, setArrivedEnvelopes] = useState<DeskEnvelope[]>([]);
  const [loadingInbox, setLoadingInbox] = useState(true);

  useEffect(() => {
    if (!user || !relationship || relationship.status !== "active") {
      setLoadingInbox(false);
      return;
    }
    fetch("/api/letters?box=inbox", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { letters: [] }))
      .then((data) => {
        const unopened = (data.letters ?? []).filter(
          (l: DeskEnvelope) => l.status === "delivered"
        );
        setArrivedEnvelopes(unopened);
      })
      .finally(() => setLoadingInbox(false));
  }, [user, relationship]);

  if (!user) return null;

  const myDisplay = user.nickname || user.displayName;
  const partnerDisplay =
    relationship?.partner?.nickname || relationship?.partner?.displayName;

  return (
    <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Top Personal Correspondence Plaque */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 parchment-card rounded-xl p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full border-2 border-[#795C43]/40 bg-[#E8D7B8] overflow-hidden flex items-center justify-center shrink-0">
            {user.profileImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.profileImage}
                alt={myDisplay}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl font-bold text-[#783B43]">
                {myDisplay.slice(0, 1)}
              </span>
            )}
          </div>
          <div>
            <p className="text-xs text-[#795C43] uppercase tracking-wider">
              {t.desk.greeting}
            </p>
            <h1 className="text-xl sm:text-2xl font-bold text-[#35271F]">
              {myDisplay}
            </h1>
            {relationship?.status === "active" && partnerDisplay ? (
              <p className="text-sm text-[#783B43] flex items-center gap-1.5 mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {t.desk.correspondent}: <strong>{partnerDisplay}</strong>
                </span>
              </p>
            ) : (
              <Link
                href="/connect"
                className="inline-flex items-center gap-1.5 text-sm text-[#783B43] font-semibold underline mt-1"
              >
                <Link2 className="w-3.5 h-3.5" />
                {t.desk.linkNow}
              </Link>
            )}
          </div>
        </div>

        {/* Primary Write CTA */}
        <div className="flex flex-wrap items-center gap-3">
          {relationship?.status === "active" ? (
            <Link
              href="/compose"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-[#783B43] text-[#F3E8D2] font-semibold text-sm shadow hover:bg-[#642F36] transition-all hover:-translate-y-0.5"
            >
              <Feather className="w-4 h-4" />
              <span>{t.desk.writeLetter}</span>
            </Link>
          ) : (
            <Link
              href="/connect"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-[#783B43] text-[#F3E8D2] font-semibold text-sm shadow hover:bg-[#642F36] transition-colors"
            >
              <Link2 className="w-4 h-4" />
              <span>{t.desk.linkNow}</span>
            </Link>
          )}
        </div>
      </section>

      {/* Main Wooden Desk & Vintage Mailbox */}
      <section className="wooden-desk-surface rounded-2xl p-5 sm:p-8 lg:p-10 text-[#F3E8D2] relative overflow-hidden">
        {/* Decorative wooden desk brass corner accents */}
        <div className="absolute inset-3 border border-[#E8D7B8]/15 rounded-xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left/Right: Vintage Mailbox Illustration & Status */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#F3E8D2]">
                {t.desk.mailboxTitle}
              </h2>
              <span className="px-3 py-1 rounded-full bg-[#783B43] text-[#F3E8D2] text-xs font-semibold">
                {counts.unopenedLetters} {t.desk.unopenedCount}
              </span>
            </div>

            {/* Handcrafted SVG Vintage Brass & Oak Mailbox */}
            <div className="bg-[#291B12]/60 border border-[#E8D7B8]/20 rounded-xl p-6 flex flex-col items-center text-center space-y-4">
              <svg
                viewBox="0 0 220 150"
                className="w-48 h-32 drop-shadow-lg"
                aria-hidden="true"
              >
                {/* Wooden stand */}
                <rect x="98" y="112" width="24" height="32" rx="3" fill="#5A3D28" />
                {/* Mailbox arch */}
                <path
                  d="M42 112 V64 C42 36, 70 22, 110 22 C150 22, 178 36, 178 64 V112 Z"
                  fill="#795C43"
                  stroke="#E8D7B8"
                  strokeOpacity="0.35"
                  strokeWidth="2"
                />
                {/* Brass front plate */}
                <path
                  d="M54 112 V68 C54 46, 78 34, 110 34 C142 34, 166 46, 166 68 V112 Z"
                  fill="#4A3222"
                />
                {/* Letter slot */}
                <rect
                  x="74"
                  y="60"
                  width="72"
                  height="9"
                  rx="4"
                  fill="#1F140D"
                  stroke="#C99B9B"
                  strokeOpacity="0.45"
                />
                {/* Envelope peeking out when unopened letters exist */}
                {counts.unopenedLetters > 0 && (
                  <g className="animate-gentle-float">
                    <rect
                      x="82"
                      y="44"
                      width="56"
                      height="24"
                      rx="2"
                      fill="#F3E8D2"
                      stroke="#783B43"
                      strokeWidth="1.2"
                    />
                    <polyline
                      points="82,44 110,59 138,44"
                      fill="none"
                      stroke="#795C43"
                      strokeWidth="1.2"
                    />
                    <circle cx="110" cy="56" r="4.5" fill="#783B43" />
                  </g>
                )}
                {/* Brass flag raised when mail arrived */}
                <g
                  transform={
                    counts.unopenedLetters > 0
                      ? "translate(178, 52) rotate(0)"
                      : "translate(178, 72) rotate(75)"
                  }
                >
                  <rect x="0" y="-26" width="4" height="28" fill="#D4B483" />
                  <path d="M4 -26 H22 V-14 H4 Z" fill="#783B43" />
                </g>
              </svg>

              <p className="text-sm text-[#E8D7B8] leading-relaxed">
                {counts.unopenedLetters > 0
                  ? t.desk.newArrivalBanner
                  : t.desk.noNewArrivals}
              </p>

              {counts.inTransitIncoming > 0 && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8D7B8]/15 border border-[#C99B9B]/35 text-xs text-[#F3E8D2]">
                  <Clock className="w-3.5 h-3.5 text-[#C99B9B]" />
                  <span>
                    {counts.inTransitIncoming} {t.desk.inTransitNotice}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Envelopes on the Desk */}
          <div className="lg:col-span-7">
            {relationship?.status !== "active" ? (
              <div className="border border-dashed border-[#E8D7B8]/30 rounded-xl p-8 text-center space-y-4">
                <Link2 className="w-10 h-10 text-[#C99B9B] mx-auto" />
                <h3 className="text-xl font-semibold text-[#F3E8D2]">
                  {t.desk.notLinkedYet}
                </h3>
                <p className="text-sm text-[#E8D7B8]/80 max-w-md mx-auto">
                  {t.connect.subtitle}
                </p>
                <Link
                  href="/connect"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-[#783B43] text-[#F3E8D2] text-sm font-semibold hover:bg-[#8E4851]"
                >
                  {t.desk.linkNow}
                </Link>
              </div>
            ) : loadingInbox ? (
              <div className="py-12 text-center text-sm text-[#E8D7B8]/70">
                ...
              </div>
            ) : arrivedEnvelopes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {arrivedEnvelopes.slice(0, 4).map((env) => (
                  <button
                    key={env.id}
                    type="button"
                    onClick={() => router.push(`/letters/${env.id}`)}
                    className="text-start animate-envelope-arrive group cursor-pointer focus:outline-none"
                  >
                    <EnvelopeVisual
                      envelopeId={env.envelopeDesign}
                      stampId={env.stampDesign}
                      waxSealId={env.waxSealDesign}
                      recipientLabel={
                        user.privacyHideSenderOnDesk
                          ? t.desk.privacyMaskedLabel
                          : env.recipientLabel
                      }
                      envelopeNote={
                        env.specialOccasionLabel || t.desk.tapEnvelopeHint
                      }
                      compact
                      dir={dir}
                      className="group-hover:-translate-y-1.5 group-hover:shadow-2xl transition-all"
                    />
                    <p className="text-[11px] text-[#E8D7B8]/80 mt-1.5 px-1">
                      {!user.privacyHideSenderOnDesk &&
                        `${t.mailbox.fromSender}: ${env.senderName} • `}
                      {formatDateTime(env.deliveredAt || env.sentAt, lang)}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="border border-[#E8D7B8]/20 bg-[#291B12]/40 rounded-xl p-8 text-center space-y-4">
                <Mail className="w-10 h-10 text-[#C99B9B] mx-auto opacity-80" />
                <p className="text-base text-[#E8D7B8]">
                  {t.desk.noNewArrivals}
                </p>
                <div className="flex flex-wrap justify-center gap-3 pt-1">
                  <Link
                    href="/compose"
                    className="px-4 py-2 rounded bg-[#783B43] text-[#F3E8D2] text-sm font-medium hover:bg-[#642F36]"
                  >
                    {t.desk.writeLetter}
                  </Link>
                  <Link
                    href="/inbox"
                    className="px-4 py-2 rounded border border-[#E8D7B8]/35 text-[#F3E8D2] text-sm hover:bg-[#E8D7B8]/10"
                  >
                    {t.desk.openMailbox}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Secondary Desk Stationery Folios (Inbox, Sent, Archive, Drafts) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/inbox"
          className="parchment-card rounded-xl p-5 flex items-center justify-between hover:-translate-y-0.5 transition-transform"
        >
          <div className="space-y-1">
            <p className="text-xs text-[#795C43] uppercase tracking-wider">
              {t.desk.inboxCard}
            </p>
            <p className="text-2xl font-bold text-[#35271F]">
              {counts.unopenedLetters}
            </p>
            <p className="text-xs text-[#783B43]">{t.desk.unopenedCount}</p>
          </div>
          <div className="w-11 h-11 rounded-full bg-[#783B43]/12 text-[#783B43] flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
        </Link>

        <Link
          href="/sent"
          className="parchment-card rounded-xl p-5 flex items-center justify-between hover:-translate-y-0.5 transition-transform"
        >
          <div className="space-y-1">
            <p className="text-xs text-[#795C43] uppercase tracking-wider">
              {t.desk.sentCard}
            </p>
            <p className="text-sm font-semibold text-[#35271F]">
              {t.mailbox.sentSubtitle.slice(0, 32)}…
            </p>
          </div>
          <div className="w-11 h-11 rounded-full bg-[#795C43]/15 text-[#795C43] flex items-center justify-center shrink-0">
            <Send className="w-5 h-5" />
          </div>
        </Link>

        <Link
          href="/archive"
          className="parchment-card rounded-xl p-5 flex items-center justify-between hover:-translate-y-0.5 transition-transform"
        >
          <div className="space-y-1">
            <p className="text-xs text-[#795C43] uppercase tracking-wider">
              {t.desk.archiveCard}
            </p>
            <p className="text-sm font-semibold text-[#35271F]">
              Memory Archive
            </p>
          </div>
          <div className="w-11 h-11 rounded-full bg-[#C99B9B]/25 text-[#783B43] flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
        </Link>

        <Link
          href="/compose"
          className="parchment-card rounded-xl p-5 flex items-center justify-between hover:-translate-y-0.5 transition-transform"
        >
          <div className="space-y-1">
            <p className="text-xs text-[#795C43] uppercase tracking-wider">
              {t.desk.draftsCount}
            </p>
            <p className="text-2xl font-bold text-[#35271F]">{counts.drafts}</p>
          </div>
          <div className="w-11 h-11 rounded-full bg-[#795C43]/15 text-[#35271F] flex items-center justify-center">
            <FileEdit className="w-5 h-5" />
          </div>
        </Link>
      </section>
    </main>
  );
}
