"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, Lock, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { useApp } from "@/components/AppProvider";
import { DeskHeader } from "@/components/DeskHeader";
import { EnvelopeVisual, PaperSheet } from "@/components/StationeryArt";
import { getFontById } from "@/lib/catalog";
import { formatDateTime } from "@/lib/i18n";
import {
  playWaxSealCrack,
  playEnvelopeOpen,
  playPaperRustle,
} from "@/lib/sounds";

interface FullLetter {
  id: string;
  senderName: string;
  receiverName: string;
  isSender: boolean;
  paperDesign: string;
  envelopeDesign: string;
  stampDesign: string;
  waxSealDesign: string;
  recipientLabel: string;
  symbolicAddress: string;
  envelopeNote: string;
  fontFamily: string;
  fontSize: number;
  inkColor: string;
  language: "ar" | "en" | "fr";
  direction: "rtl" | "ltr";
  specialOccasionLabel: string;
  sentAt: string;
  deliveryAt: string;
  deliveredAt: string | null;
  openedAt: string | null;
  status: "in_transit" | "delivered" | "opened";
  isLocked: boolean;
  isFavorite: boolean;
  content: string | null;
  handwritingImage: string | null;
}

export default function LetterOpeningPage() {
  const params = useParams<{ id: string }>();
  const { loading, user, lang, dir, t, refreshSession } = useApp();
  const router = useRouter();

  const [letter, setLetter] = useState<FullLetter | null>(null);
  const [fetching, setFetching] = useState(true);
  const [stage, setStage] = useState<"sealed" | "breaking" | "unfolding" | "open">("sealed");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user || !params?.id) return;
    fetch(`/api/letters/${params.id}`, { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) {
          setError(t.auth.genericError);
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (!d?.letter) return;
        setLetter(d.letter);
        if (d.letter.isSender || d.letter.status === "opened") {
          setStage("open");
        } else {
          setStage("sealed");
        }
      })
      .finally(() => setFetching(false));
  }, [user, params?.id, t.auth.genericError]);

  const handleBreakSeal = async () => {
    if (!letter || letter.isLocked || stage !== "sealed") return;

    playWaxSealCrack(Boolean(user?.soundEnabled));
    setStage("breaking");

    setTimeout(async () => {
      playEnvelopeOpen(Boolean(user?.soundEnabled));
      setStage("unfolding");

      const res = await fetch(`/api/letters/${letter.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "open" }),
      });

      if (res.ok) {
        const data = await res.json();
        setLetter(data.letter);
        await refreshSession();
      }

      setTimeout(() => {
        playPaperRustle(Boolean(user?.soundEnabled));
        setStage("open");
      }, 450);
    }, 550);
  };

  const handleToggleFavorite = async () => {
    if (!letter) return;
    const res = await fetch(`/api/letters/${letter.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggle_favorite" }),
    });
    if (res.ok) {
      const data = await res.json();
      setLetter((prev) =>
        prev ? { ...prev, isFavorite: data.isFavorite } : null
      );
    }
  };

  if (loading || !user) return null;

  const fontObj = letter ? getFontById(letter.fontFamily) : getFontById("amiri");

  return (
    <>
      <DeskHeader />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href={letter?.isSender ? "/sent" : "/inbox"}
            className="inline-flex items-center gap-1.5 text-sm text-[#795C43] hover:text-[#783B43]"
          >
            {dir === "rtl" ? (
              <ArrowRight className="w-4 h-4" />
            ) : (
              <ArrowLeft className="w-4 h-4" />
            )}
            <span>{t.opening.backToInbox}</span>
          </Link>

          {letter && stage === "open" && !letter.isLocked && (
            <button
              type="button"
              onClick={handleToggleFavorite}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border cursor-pointer transition-colors ${
                letter.isFavorite
                  ? "bg-[#783B43] text-[#F3E8D2] border-[#783B43]"
                  : "bg-[#F7EFE0] text-[#35271F] border-[#795C43]/35 hover:bg-[#E8D7B8]"
              }`}
            >
              <Heart
                className="w-3.5 h-3.5"
                fill={letter.isFavorite ? "currentColor" : "none"}
              />
              <span>
                {letter.isFavorite
                  ? t.opening.favorited
                  : t.opening.addToFavorites}
              </span>
            </button>
          )}
        </div>

        {fetching ? (
          <div className="py-16 text-center text-sm text-[#795C43]">...</div>
        ) : error || !letter ? (
          <div className="parchment-card rounded-xl p-10 text-center text-[#783B43]">
            {error || t.auth.genericError}
          </div>
        ) : letter.isLocked ? (
          /* Locked Until Server Delivery Time */
          <div className="wooden-desk-surface rounded-2xl p-8 sm:p-12 text-center space-y-6 max-w-xl mx-auto">
            <div className="inline-flex w-12 h-12 rounded-full bg-[#783B43]/30 text-[#F3E8D2] items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <EnvelopeVisual
              envelopeId={letter.envelopeDesign}
              stampId={letter.stampDesign}
              waxSealId={letter.waxSealDesign}
              recipientLabel={letter.recipientLabel}
              symbolicAddress={letter.symbolicAddress}
              envelopeNote={letter.specialOccasionLabel}
              dir={dir}
            />
            <div className="space-y-2 text-[#F3E8D2]">
              <p className="text-base font-medium leading-relaxed">
                {t.opening.lockedMessage}
              </p>
              <p className="text-xs text-[#C99B9B]">
                {t.mailbox.expectedArrival}:{" "}
                {formatDateTime(letter.deliveryAt, lang)}
              </p>
            </div>
          </div>
        ) : stage !== "open" ? (
          /* Sealed Envelope Waiting for Tap on Wax Seal */
          <div className="wooden-desk-surface rounded-2xl p-6 sm:p-12 text-center space-y-6 max-w-2xl mx-auto">
            {letter.specialOccasionLabel && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#783B43]/40 text-[#F3E8D2] text-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#C99B9B]" />
                <span>{letter.specialOccasionLabel}</span>
              </div>
            )}

            <EnvelopeVisual
              envelopeId={letter.envelopeDesign}
              stampId={letter.stampDesign}
              waxSealId={letter.waxSealDesign}
              recipientLabel={letter.recipientLabel}
              symbolicAddress={letter.symbolicAddress}
              envelopeNote={letter.envelopeNote}
              isOpen={stage === "unfolding"}
              breakingSeal={stage === "breaking" || stage === "unfolding"}
              onSealClick={handleBreakSeal}
              dir={dir}
            />

            <p className="text-sm sm:text-base text-[#E8D7B8] font-medium">
              {stage === "sealed"
                ? t.opening.tapToBreakSeal
                : stage === "breaking"
                  ? t.opening.breakingSeal
                  : t.opening.unfoldingLetter}
            </p>
          </div>
        ) : (
          /* Unfolded Letter Reveal in Original Stationery & Font */
          <div className="space-y-6 animate-paper-unfold">
            <PaperSheet
              paperId={letter.paperDesign}
              className="p-6 sm:p-12 space-y-8"
            >
              {/* Letter Meta Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#795C43]/25 text-xs text-[#795C43]">
                <div>
                  <span>
                    {t.mailbox.fromSender}:{" "}
                    <strong className="text-[#35271F]">
                      {letter.senderName}
                    </strong>
                  </span>
                  {letter.specialOccasionLabel && (
                    <span className="ms-3 px-2.5 py-0.5 rounded-full bg-[#783B43]/10 text-[#783B43]">
                      ✦ {letter.specialOccasionLabel}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  <span>
                    {t.opening.writtenOn}: {formatDateTime(letter.sentAt, lang)}
                  </span>
                  <span>
                    {t.opening.arrivedOn}:{" "}
                    {formatDateTime(
                      letter.deliveredAt || letter.deliveryAt,
                      lang
                    )}
                  </span>
                </div>
              </div>

              {/* Letter Text in Exact Sender Font, Size, Ink, Direction */}
              {letter.content && (
                <div
                  dir={letter.direction}
                  lang={letter.language}
                  className="whitespace-pre-wrap leading-[2.0] min-h-[220px]"
                  style={{
                    fontFamily: fontObj.cssFamily,
                    fontSize: `${letter.fontSize}px`,
                    color: letter.inkColor,
                  }}
                >
                  {letter.content}
                </div>
              )}

              {/* Handwritten Canvas Attachment if present */}
              {letter.handwritingImage && (
                <div className="pt-4 border-t border-[#795C43]/20 space-y-2">
                  <p className="text-xs text-[#795C43] font-medium">
                    {t.opening.handwrittenAttachment}
                  </p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={letter.handwritingImage}
                    alt={t.opening.handwrittenAttachment}
                    className="w-full rounded border border-[#795C43]/25 shadow-sm"
                  />
                </div>
              )}
            </PaperSheet>

            {/* Compact Kept Envelope Reference */}
            <div className="max-w-sm mx-auto opacity-90">
              <EnvelopeVisual
                envelopeId={letter.envelopeDesign}
                stampId={letter.stampDesign}
                waxSealId={letter.waxSealDesign}
                recipientLabel={letter.recipientLabel}
                symbolicAddress={letter.symbolicAddress}
                envelopeNote={letter.envelopeNote}
                isOpen
                compact
                dir={dir}
              />
            </div>
          </div>
        )}
      </main>
    </>
  );
}
