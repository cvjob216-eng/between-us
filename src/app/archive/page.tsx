"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Download,
  Heart,
  Search,
  Sparkles,
} from "lucide-react";
import { useApp } from "@/components/AppProvider";
import { DeskHeader } from "@/components/DeskHeader";
import { PaperSheet, StampSvg, WaxSealSvg } from "@/components/StationeryArt";
import { getFontById } from "@/lib/catalog";
import { formatDateTime } from "@/lib/i18n";

interface ArchiveLetter {
  id: string;
  senderName: string;
  receiverName: string;
  isSender: boolean;
  paperDesign: string;
  envelopeDesign: string;
  stampDesign: string;
  waxSealDesign: string;
  recipientLabel: string;
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
  status: string;
  isFavorite: boolean;
  content: string | null;
  handwritingImage: string | null;
}

export default function ArchivePage() {
  const { loading, user, relationship, lang, t } = useApp();
  const router = useRouter();

  const [letters, setLetters] = useState<ArchiveLetter[]>([]);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState("");
  const [senderFilter, setSenderFilter] = useState<"all" | "me" | "partner">("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    if (!loading && user && relationship?.status !== "active") {
      router.push("/connect");
    }
  }, [loading, user, relationship, router]);

  const fetchArchive = useCallback(() => {
    if (!user || relationship?.status !== "active") return;
    setFetching(true);
    const params = new URLSearchParams({
      box: "archive",
      sender: senderFilter,
      favorites: favoritesOnly ? "true" : "false",
    });
    if (search.trim()) params.set("search", search.trim());
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);

    fetch(`/api/letters?${params.toString()}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { letters: [] }))
      .then((d) => setLetters(d.letters ?? []))
      .finally(() => setFetching(false));
  }, [user, relationship, senderFilter, favoritesOnly, search, dateFrom, dateTo]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchArchive();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchArchive]);

  const toggleFavorite = async (
    e: React.MouseEvent,
    letterId: string
  ) => {
    e.stopPropagation();
    const res = await fetch(`/api/letters/${letterId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggle_favorite" }),
    });
    if (res.ok) {
      const data = await res.json();
      setLetters((prev) =>
        prev.map((l) =>
          l.id === letterId ? { ...l, isFavorite: data.isFavorite } : l
        )
      );
    }
  };

  if (loading || !user) return null;

  return (
    <>
      <DeskHeader />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Title & Backup Export */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#35271F] flex items-center gap-2.5">
              <BookOpen className="w-6 h-6 text-[#783B43]" />
              <span>{t.archive.title}</span>
            </h1>
            <p className="text-sm text-[#795C43]">{t.archive.subtitle}</p>
          </div>

          <a
            href="/api/archive/export"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-[#795C43]/40 bg-[#F7EFE0] text-sm font-semibold text-[#35271F] hover:bg-[#E8D7B8] transition-colors shrink-0"
          >
            <Download className="w-4 h-4 text-[#783B43]" />
            <span>{t.archive.exportBackup}</span>
          </a>
        </div>

        {/* Search & Filters Bar */}
        <section className="parchment-card rounded-xl p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-[#795C43] absolute top-3 start-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.archive.searchPlaceholder}
                className="w-full ps-9 pe-3 py-2 rounded-md bg-[#FBF6EC] border border-[#795C43]/30 text-sm text-[#35271F]"
              />
            </div>

            <div className="md:col-span-3 flex items-center gap-2">
              <span className="text-xs text-[#795C43] shrink-0">
                {t.archive.dateFrom}:
              </span>
              <input
                type="date"
                dir="ltr"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-2.5 py-2 rounded-md bg-[#FBF6EC] border border-[#795C43]/30 text-xs text-[#35271F]"
              />
            </div>

            <div className="md:col-span-3 flex items-center gap-2">
              <span className="text-xs text-[#795C43] shrink-0">
                {t.archive.dateTo}:
              </span>
              <input
                type="date"
                dir="ltr"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-2.5 py-2 rounded-md bg-[#FBF6EC] border border-[#795C43]/30 text-xs text-[#35271F]"
              />
            </div>

            <div className="md:col-span-1 flex items-center justify-end">
              <span className="text-xs font-semibold text-[#783B43]">
                {letters.length}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                { id: "all", label: t.archive.filterAll },
                { id: "me", label: t.archive.filterFromMe },
                { id: "partner", label: t.archive.filterFromPartner },
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSenderFilter(f.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer border ${
                  senderFilter === f.id
                    ? "bg-[#783B43] text-[#F3E8D2] border-[#783B43]"
                    : "bg-[#FBF6EC] text-[#35271F] border-[#795C43]/30"
                }`}
              >
                {f.label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setFavoritesOnly((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer border ${
                favoritesOnly
                  ? "bg-[#783B43] text-[#F3E8D2] border-[#783B43]"
                  : "bg-[#FBF6EC] text-[#35271F] border-[#795C43]/30"
              }`}
            >
              <Heart
                className="w-3.5 h-3.5"
                fill={favoritesOnly ? "currentColor" : "none"}
              />
              <span>{t.archive.filterFavorites}</span>
            </button>
          </div>
        </section>

        {/* Archived Letters Grid */}
        {fetching ? (
          <div className="py-12 text-center text-sm text-[#795C43]">...</div>
        ) : letters.length === 0 ? (
          <div className="parchment-card rounded-xl p-10 text-center text-[#795C43]">
            {t.archive.emptyArchive}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {letters.map((l) => {
              const fontObj = getFontById(l.fontFamily);
              return (
                <article
                  key={l.id}
                  onClick={() => router.push(`/letters/${l.id}`)}
                  className="cursor-pointer group"
                >
                  <PaperSheet
                    paperId={l.paperDesign}
                    className="p-5 sm:p-6 space-y-4 group-hover:-translate-y-1 transition-transform"
                  >
                    <div className="flex items-start justify-between gap-2 border-b border-[#795C43]/20 pb-3">
                      <div className="space-y-1">
                        <p className="text-xs text-[#795C43]">
                          {t.mailbox.fromSender}:{" "}
                          <strong className="text-[#35271F]">
                            {l.senderName}
                          </strong>{" "}
                          →{" "}
                          <strong className="text-[#35271F]">
                            {l.receiverName}
                          </strong>
                        </p>
                        {l.specialOccasionLabel && (
                          <p className="inline-flex items-center gap-1 text-[11px] text-[#783B43] font-medium">
                            <Sparkles className="w-3 h-3" />
                            {l.specialOccasionLabel}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <StampSvg stampId={l.stampDesign} width={34} />
                        <WaxSealSvg sealId={l.waxSealDesign} size={32} />
                        <button
                          type="button"
                          onClick={(e) => toggleFavorite(e, l.id)}
                          className="p-1.5 rounded-full hover:bg-[#783B43]/10 text-[#783B43] cursor-pointer"
                          aria-label="Favorite"
                        >
                          <Heart
                            className="w-4 h-4"
                            fill={l.isFavorite ? "currentColor" : "none"}
                          />
                        </button>
                      </div>
                    </div>

                    {l.content ? (
                      <p
                        dir={l.direction}
                        className="line-clamp-4 leading-relaxed"
                        style={{
                          fontFamily: fontObj.cssFamily,
                          fontSize: `${Math.min(20, l.fontSize)}px`,
                          color: l.inkColor,
                        }}
                      >
                        {l.content}
                      </p>
                    ) : l.handwritingImage ? (
                      <p className="text-xs italic text-[#795C43]">
                        ✦ {t.opening.handwrittenAttachment}
                      </p>
                    ) : (
                      <p className="text-xs italic text-[#795C43]">
                        ✦ {t.mailbox.notOpenedYet}
                      </p>
                    )}

                    <div className="pt-2 border-t border-[#795C43]/15 flex flex-wrap justify-between gap-2 text-[11px] text-[#795C43]">
                      <span>
                        {t.mailbox.sentAt}: {formatDateTime(l.sentAt, lang)}
                      </span>
                      <span>
                        {l.openedAt
                          ? `${t.mailbox.openedAt}: ${formatDateTime(l.openedAt, lang)}`
                          : `${t.mailbox.arrivedAt}: ${formatDateTime(l.deliveredAt || l.deliveryAt, lang)}`}
                      </span>
                    </div>
                  </PaperSheet>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
