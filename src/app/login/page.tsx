"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Feather } from "lucide-react";
import { useApp } from "@/components/AppProvider";

export default function LoginPage() {
  const { t, refreshSession } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        setError(t.auth.invalidCredentials);
        return;
      }
      await refreshSession();
      router.push("/");
    } catch {
      setError(t.auth.genericError);
    } finally {
      setSubmitting(false);
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
            {t.auth.loginTitle}
          </h1>
          <p className="text-sm text-[#795C43]">{t.auth.loginSubtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full px-3.5 py-2.5 rounded-md bg-[#FBF6EC] border border-[#795C43]/35 text-sm text-[#35271F] focus:outline-none focus:border-[#783B43]"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-[#35271F]">
                {t.auth.password}
              </label>
              <Link
                href="/forgot-password"
                className="text-[11px] text-[#783B43] hover:underline"
              >
                {t.auth.forgotPasswordLink}
              </Link>
            </div>
            <input
              type="password"
              required
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-md bg-[#FBF6EC] border border-[#795C43]/35 text-sm text-[#35271F] focus:outline-none focus:border-[#783B43]"
            />
          </div>

          {error && (
            <p className="text-xs text-[#783B43] bg-[#783B43]/10 p-2.5 rounded">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-md bg-[#783B43] text-[#F3E8D2] font-semibold text-sm hover:bg-[#642F36] disabled:opacity-60 transition-colors cursor-pointer"
          >
            {submitting ? "..." : t.auth.signInBtn}
          </button>
        </form>

        <div className="text-center text-xs text-[#795C43] pt-2 border-t border-[#795C43]/20">
          <Link href="/register" className="hover:text-[#783B43] underline">
            {t.auth.noAccount}
          </Link>
        </div>
      </div>
    </div>
  );
}
