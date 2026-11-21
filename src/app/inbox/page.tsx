"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Clock, CheckCircle2 } from "lucide-react";
import { useApp } from "@/components/AppProvider";
import { DeskHeader } from "@/components/DeskHeader";
import { EnvelopeVisual } from "@/components/StationeryArt";
import { formatDateTime } from "@/lib/i18n";

interface MailboxLetter {
  id: string;
  senderName: string;
  envelopeDesign: string;
  stampDesign: string;
  waxSealDesign: string;
  recipientLabel: string;
  symbolicAddress: string;
  envelopeNote: string;
  specialOccasionLabel: string;
  sentAt: string;
  deliveryAt: string;
  deliveredAt: string | null;
  openedAt: string | null;
  status: "in_transit" | "delivered" | "opened";
  isLocked: boolean;
}

export default function InboxPage() {
  const { loading, user, relationship, lang, dir, t } = useApp();
  const router = useRouter();
  const [letters, setLetters] = useState<MailboxLetter[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    if (!loading && user && relationship?.status !== "active") {
      router.push("/connect");
    }
  }, [loading, user, relationship, router]);

  useEffect(() => {
    if (!user || relationship?.status !== "active") return;
    fetch("/api/letters?box=inbox", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { letters: [] }))
      .then((d) => setLetters(d.letters ?? []))
      .finally(() => setFetching(false));
  }, [user, relationship]);

  if (loading || !user) return null;

  const unopened = letters.filter(
    (l) => !l.isLocked && l.status === "delivered"
  );
  const inTransit = letters.filter(
    (l) => l.isLocked || l.status === "in_transit"
  );
  const opened = letters.filter(
    (l) => !l.isLocked && l.status === "opened"
  );

  return (
    <>
      <DeskHeader />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-10">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#35271F] flex items-center gap-2.5">
            <Mail className="w-6 h-6 text-[#783B43]" />
            <span>{t.mailbox.inboxTitle}</span>
          </h1>
          <p className="text-sm text-[#795C43]">{t.mailbox.inboxSubtitle}</p>
        </div>

        {fetching ? (
          <div className="py-12 text-center text-sm text-[#795C43]">...</div>
        ) : letters.length === 0 ? (
          <div className="parchment-card rounded-xl p-10 text-center text-[#795C43]">
            {t.mailbox.noInboxLetters}
          </div>
        ) : (
          <>
            {/* Unopened Arrived Letters */}
            {unopened.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-lg font-bold text-[#783B43]">
                  {t.mailbox.unopenedSection} ({unopened.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {unopened.map((l) => (
                    <div
                      key={l.id}
                      onClick={() => router.push(`/letters/${l.id}`)}
                      className="cursor-pointer group space-y-2 animate-envelope-arrive"
                    >
                      <EnvelopeVisual
                        envelopeId={l.envelopeDesign}
                        stampId={l.stampDesign}
                        waxSealId={l.waxSealDesign}
                        recipientLabel={l.recipientLabel}
                        symbolicAddress={l.symbolicAddress}
                        envelopeNote={l.specialOccasionLabel || l.envelopeNote}
                        compact
                        dir={dir}
                        className="group-hover:-translate-y-1.5 transition-transform"
                      />
                      <div className="px-1 flex items-center justify-between text-xs text-[#5C4534]">
                        <span>
                          {t.mailbox.fromSender}: <strong>{l.senderName}</strong>
                        </span>
                        <span>{formatDateTime(l.deliveredAt || l.deliveryAt, lang)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Locked In-Transit Letters */}
            {inTransit.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-lg font-bold text-[#795C43] flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{t.mailbox.inTransitSection} ({inTransit.length})</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {inTransit.map((l) => (
                    <div
                      key={l.id}
                      className="parchment-card rounded-xl p-5 space-y-3 opacity-90"
                    >
                      <div className="flex items-center justify-between text-xs text-[#783B43] font-semibold">
                        <span className="inline-flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5" />
                          {t.mailbox.statusInTransit}
                        </span>
                      </div>
                      <EnvelopeVisual
                        envelopeId={l.envelopeDesign}
                        stampId={l.stampDesign}
                        waxSealId={l.waxSealDesign}
                        recipientLabel={l.recipientLabel}
                        envelopeNote={l.specialOccasionLabel}
                        compact
                        dir={dir}
                        className="grayscale-[18%]"
                      />
                      <div className="text-xs text-[#5C4534] space-y-1 pt-1">
                        <p>
                          {t.mailbox.fromSender}: <strong>{l.senderName}</strong>
                        </p>
                        <p className="text-[#783B43]">
                          {t.mailbox.expectedArrival}:{" "}
                          {formatDateTime(l.deliveryAt, lang)}
                        </p>
                        <p className="italic text-[11px] text-[#795C43]">
                          {t.mailbox.lockedUntilArrival}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Opened Letters */}
            {opened.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-lg font-bold text-[#35271F] flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#795C43]" />
                  <span>{t.mailbox.openedSection} ({opened.length})</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {opened.map((l) => (
                    <div
                      key={l.id}
                      onClick={() => router.push(`/letters/${l.id}`)}
                      className="cursor-pointer group space-y-2"
                    >
                      <EnvelopeVisual
                        envelopeId={l.envelopeDesign}
                        stampId={l.stampDesign}
                        waxSealId={l.waxSealDesign}
                        recipientLabel={l.recipientLabel}
                        envelopeNote={l.envelopeNote}
                        isOpen
                        compact
                        dir={dir}
                        className="group-hover:-translate-y-1 transition-transform opacity-90"
                      />
                      <div className="px-1 flex items-center justify-between text-xs text-[#5C4534]">
                        <span>
                          {t.mailbox.fromSender}: <strong>{l.senderName}</strong>
                        </span>
                        <span>{formatDateTime(l.openedAt || l.deliveredAt, lang)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </>
  );
}
