"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Check, RefreshCw, ShieldCheck, Link2 } from "lucide-react";
import { useApp } from "@/components/AppProvider";
import { DeskHeader } from "@/components/DeskHeader";

export default function ConnectPartnerPage() {
  const { loading, user, relationship, t, refreshSession } = useApp();
  const router = useRouter();
  const [inviteCodeInput, setInviteCodeInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (!loading && relationship?.status === "active") {
      router.push("/");
    }
  }, [loading, user, relationship, router]);

  useEffect(() => {
    if (!user || relationship) return;
    fetch("/api/relationship", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create_invite" }),
    })
      .then(() => refreshSession())
      .catch(() => {});
  }, [user, relationship, refreshSession]);

  const handleCopy = async () => {
    if (!relationship?.inviteCode) return;
    await navigator.clipboard.writeText(relationship.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = async () => {
    setBusy(true);
    await fetch("/api/relationship", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "regenerate_invite" }),
    });
    await refreshSession();
    setBusy(false);
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/relationship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "join",
          inviteCode: inviteCodeInput.trim().toUpperCase(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          data.error === "ALREADY_LINKED"
            ? t.connect.alreadyLinked
            : t.connect.invalidCode
        );
        return;
      }
      await refreshSession();
      router.push("/");
    } catch {
      setError(t.auth.genericError);
    } finally {
      setBusy(false);
    }
  };

  if (loading || !user) return null;

  return (
    <>
      <DeskHeader />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-full bg-[#783B43]/15 text-[#783B43] items-center justify-center">
            <Link2 className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-[#35271F]">
            {t.connect.title}
          </h1>
          <p className="text-sm sm:text-base text-[#795C43] max-w-xl mx-auto">
            {t.connect.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Share Your Invite Code */}
          <div className="parchment-card rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-[#35271F]">
              {t.connect.yourCodeTitle}
            </h2>
            <p className="text-sm text-[#5C4534]">{t.connect.yourCodeDesc}</p>

            <div className="p-4 rounded-lg bg-[#291B12] text-[#F3E8D2] text-center space-y-3">
              <p
                dir="ltr"
                className="font-mono text-2xl font-bold tracking-[0.18em] text-[#E8D7B8]"
              >
                {relationship?.inviteCode ?? "..."}
              </p>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#783B43] text-[#F3E8D2] text-xs font-medium hover:bg-[#8E4851] cursor-pointer"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {copied ? t.connect.copied : t.connect.copyCode}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={handleRegenerate}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#E8D7B8]/30 text-[#E8D7B8] text-xs hover:bg-[#E8D7B8]/10 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {t.connect.regenerateCode}
                </button>
              </div>
            </div>

            <p className="text-xs text-[#795C43] italic">
              {t.connect.waitingPartner}
            </p>
          </div>

          {/* Card 2: Enter Partner's Code */}
          <div className="parchment-card rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-[#35271F]">
              {t.connect.orJoinTitle}
            </h2>
            <p className="text-sm text-[#5C4534]">{t.connect.orJoinDesc}</p>

            <form onSubmit={handleJoin} className="space-y-4">
              <input
                type="text"
                required
                dir="ltr"
                placeholder={t.connect.codePlaceholder}
                value={inviteCodeInput}
                onChange={(e) => setInviteCodeInput(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 rounded-md bg-[#FBF6EC] border border-[#795C43]/35 font-mono text-center text-base tracking-widest text-[#35271F] focus:outline-none focus:border-[#783B43]"
              />

              {error && (
                <p className="text-xs text-[#783B43] bg-[#783B43]/10 p-2.5 rounded">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full py-3 rounded-md bg-[#783B43] text-[#F3E8D2] font-semibold text-sm hover:bg-[#642F36] disabled:opacity-60 cursor-pointer"
              >
                {busy ? "..." : t.connect.joinBtn}
              </button>
            </form>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-[#795C43] text-center max-w-xl mx-auto">
          <ShieldCheck className="w-4 h-4 text-[#783B43] shrink-0" />
          <span>{t.connect.exclusiveNote}</span>
        </div>
      </main>
    </>
  );
}
