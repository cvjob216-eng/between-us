"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Feather } from "lucide-react";
import { useApp } from "@/components/AppProvider";

export default function ForgotPasswordPage() {
  const { t } = useApp();
  const [step, setStep] = useState<"request" | "reset" | "done">("request");
  const [email, setEmail] = useState("");
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: "request", email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(t.auth.genericError);
        return;
      }
      if (data.resetToken) {
        setGeneratedToken(data.resetToken);
        setToken(data.resetToken);
      }
      setStep("reset");
    } catch {
      setError(t.auth.genericError);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: "reset", email, token, newPassword }),
      });
      if (!res.ok) {
        setError(t.auth.genericError);
        return;
      }
      setStep("done");
    } catch {
      setError(t.auth.genericError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md parchment-card rounded-xl p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <Link
            href="/"
            className="inline-flex w-12 h-12 rounded-full bg-[#783B43] text-[#F3E8D2] items-center justify-center shadow"
          >
            <Feather className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-[#35271F]">
            {t.auth.forgotTitle}
          </h1>
          <p className="text-sm text-[#795C43]">{t.auth.forgotSubtitle}</p>
        </div>

        {step === "request" && (
          <form onSubmit={handleRequest} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#35271F]">
                {t.auth.email}
              </label>
              <input
                type="email"
                required
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-md bg-[#FBF6EC] border border-[#795C43]/35 text-sm text-[#35271F]"
              />
            </div>
            {error && <p className="text-xs text-[#783B43]">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-md bg-[#783B43] text-[#F3E8D2] font-semibold text-sm cursor-pointer"
            >
              {t.auth.requestResetBtn}
            </button>
          </form>
        )}

        {step === "reset" && (
          <form onSubmit={handleReset} className="space-y-4">
            {generatedToken && (
              <div className="p-3 rounded bg-[#E8D7B8] border border-[#795C43]/30 text-xs text-[#35271F] space-y-1">
                <p>{t.auth.resetTokenGenerated}</p>
                <p className="font-mono text-base font-bold tracking-widest text-[#783B43]">
                  {generatedToken}
                </p>
              </div>
            )}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#35271F]">
                {t.auth.resetTokenLabel}
              </label>
              <input
                type="text"
                required
                dir="ltr"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-md bg-[#FBF6EC] border border-[#795C43]/35 text-sm font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#35271F]">
                {t.auth.newPasswordLabel}
              </label>
              <input
                type="password"
                required
                minLength={6}
                dir="ltr"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-md bg-[#FBF6EC] border border-[#795C43]/35 text-sm"
              />
            </div>
            {error && <p className="text-xs text-[#783B43]">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-md bg-[#783B43] text-[#F3E8D2] font-semibold text-sm cursor-pointer"
            >
              {t.auth.confirmResetBtn}
            </button>
          </form>
        )}

        {step === "done" && (
          <div className="text-center space-y-4">
            <p className="text-sm text-[#2E4739] font-medium">
              {t.auth.resetSuccess}
            </p>
            <Link
              href="/login"
              className="inline-block px-6 py-2.5 rounded-md bg-[#783B43] text-[#F3E8D2] text-sm font-semibold"
            >
              {t.auth.signInBtn}
            </Link>
          </div>
        )}

        <div className="text-center text-xs text-[#795C43] pt-2 border-t border-[#795C43]/20">
          <Link href="/login" className="underline">
            {t.auth.haveAccount}
          </Link>
        </div>
      </div>
    </div>
  );
}
