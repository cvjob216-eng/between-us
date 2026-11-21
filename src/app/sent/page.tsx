"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Clock, CheckCircle2, CalendarClock, Trash2 } from "lucide-react";
import { useApp } from "@/components/AppProvider";
import { DeskHeader } from "@/components/DeskHeader";
import { EnvelopeVisual } from "@/components/StationeryArt";
import { formatDateTime } from "@/lib/i18n";

interface SentLetter {
  id: string;
  receiverName: string;
  envelopeDesign: string;
  stampDesign: string;
  waxSealDesign: string;
  recipientLabel: string;
  envelopeNote: string;
  specialOccasionLabel: string;
  sentAt: string;
  deliveryAt: string;
  deliveredAt: string | null;
  openedAt: string | null;
  status: "in_transit" | "delivered" | "opened";
}

interface ScheduledDraftItem {
  id: string;
  recipientLabel: string;
  envelopeDesign: string;
  stampDesign: string;
  waxSealDesign: string;
  scheduledSendAt: string;
  specialOccasionLabel: string;
}

export default function SentLettersPage() {
  const { loading, user, relationship, lang, dir, t } = useApp();
  const router = useRouter();
  const [letters, setLetters] = useState<SentLetter[]>([]);
  const [scheduledDrafts, setScheduledDrafts] = useState<ScheduledDraftItem[]>([]);
  const [fetching, setFetching] = useState(true);

  const loadSent = () => {
    fetch("/api/letters?box=sent", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { letters: [], scheduledDrafts: [] }))
      .then((d) => {
        setLetters(d.letters ?? []);
        setScheduledDrafts(d.scheduledDrafts ?? []);
      })
      .finally(() => setFetching(false));
  };

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    if (!loading && user && relationship?.status !== "active") {
      router.push("/connect");
    }
  }, [loading, user, relationship, router]);

  useEffect(() => {
    if (!user || relationship?.status !== "active") return;
    loadSent();
  }, [user, relationship]);

  const cancelScheduled = async (draftId: string) => {
    await fetch(`/api/drafts?id=${encodeURIComponent(draftId)}`, {
      method: "DELETE",
    });
    loadSent();
  };

  if (loading || !user) return null;

  return (
    <>
      <DeskHeader />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-10">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#35271F] flex items-center gap-2.5">
            <Send className="w-6 h-6 text-[#783B43]" />
            <span>{t.mailbox.sentTitle}</span>
          </h1>
          <p className="text-sm text-[#795C43]">{t.mailbox.sentSubtitle}</p>
        </div>

        {/* Scheduled-Send Drafts waiting for dispatch time */}
        {scheduledDrafts.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-[#783B43] flex items-center gap-2">
              <CalendarClock className="w-5 h-5" />
              <span>{t.mailbox.scheduledDraftsSection}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scheduledDrafts.map((sd) => (
                <div
                  key={sd.id}
                  className="parchment-card rounded-xl p-4 space-y-3"
                >
                  <EnvelopeVisual
                    envelopeId={sd.envelopeDesign}
                    stampId={sd.stampDesign}
                    waxSealId={sd.waxSealDesign}
                    recipientLabel={sd.recipientLabel}
                    envelopeNote={sd.specialOccasionLabel}
                    compact
                    dir={dir}
                  />
                  <div className="text-xs text-[#5C4534] space-y-1">
                    <p className="font-semibold text-[#783B43]">
                      {t.mailbox.statusScheduledDraft}
                    </p>
                    <p>
                      {t.mailbox.sentAt}: {formatDateTime(sd.scheduledSendAt, lang)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => cancelScheduled(sd.id)}
                    className="inline-flex items-center gap-1 text-xs text-[#783B43] hover:underline cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {t.mailbox.cancelScheduledDraft}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {fetching ? (
          <div className="py-12 text-center text-sm text-[#795C43]">...</div>
        ) : letters.length === 0 ? (
          <div className="parchment-card rounded-xl p-10 text-center text-[#795C43]">
            {t.mailbox.noSentLetters}
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {letters.map((l) => {
              const statusLabel =
                l.status === "in_transit"
                  ? t.mailbox.statusInTransit
                  : l.status === "opened"
                    ? t.mailbox.statusOpened
                    : t.mailbox.statusDelivered;

              return (
                <div
                  key={l.id}
                  onClick={() => router.push(`/letters/${l.id}`)}
                  className="parchment-card rounded-xl p-4 space-y-3 cursor-pointer hover:-translate-y-0.5 transition-transform"
                >
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span
                      className={`inline-flex items-center gap-1.5 ${
                        l.status === "in_transit"
                          ? "text-[#795C43]"
                          : l.status === "opened"
                            ? "text-[#2E4739]"
                            : "text-[#783B43]"
                      }`}
                    >
                      {l.status === "in_transit" ? (
                        <Clock className="w-3.5 h-3.5" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      {statusLabel}
                    </span>
                    <span className="text-[#795C43]">
                      {t.mailbox.toReceiver}: {l.receiverName}
                    </span>
                  </div>

                  <EnvelopeVisual
                    envelopeId={l.envelopeDesign}
                    stampId={l.stampDesign}
                    waxSealId={l.waxSealDesign}
                    recipientLabel={l.recipientLabel}
                    envelopeNote={l.specialOccasionLabel || l.envelopeNote}
                    isOpen={l.status === "opened"}
                    compact
                    dir={dir}
                  />

                  <div className="text-xs text-[#5C4534] space-y-1 pt-1">
                    <p>
                      {t.mailbox.sentAt}: {formatDateTime(l.sentAt, lang)}
                    </p>
                    <p>
                      {l.status === "in_transit"
                        ? t.mailbox.expectedArrival
                        : t.mailbox.arrivedAt}
                      : {formatDateTime(l.deliveredAt || l.deliveryAt, lang)}
                    </p>
                    <p className="text-[#783B43]">
                      {l.openedAt
                        ? `${t.mailbox.openedAt}: ${formatDateTime(l.openedAt, lang)}`
                        : t.mailbox.notOpenedYet}
                    </p>
                  </div>
                </div>
              );
            })}
          </section>
        )}
      </main>
    </>
  );
}
