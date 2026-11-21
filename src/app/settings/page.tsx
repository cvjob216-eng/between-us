"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Settings,
  User,
  Volume2,
  Bell,
  Shield,
  Unlink,
  LogOut,
  Check,
  Upload,
} from "lucide-react";
import { useApp } from "@/components/AppProvider";
import { DeskHeader } from "@/components/DeskHeader";
import { FONT_OPTIONS } from "@/lib/catalog";
import { AppLanguage } from "@/lib/i18n";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function SettingsPage() {
  const { loading, user, relationship, lang, t, refreshSession, logout } =
    useApp();
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [preferredLanguage, setPreferredLanguage] = useState<AppLanguage>("ar");
  const [defaultFont, setDefaultFont] = useState("amiri");
  const [defaultFontSize, setDefaultFontSize] = useState(20);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [privacyHideSenderOnDesk, setPrivacyHideSenderOnDesk] = useState(false);

  const [saving, setSaving] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [pushStatus, setPushStatus] = useState("");
  const [confirmUnlinkPrompt, setConfirmUnlinkPrompt] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    setDisplayName(user.displayName);
    setNickname(user.nickname);
    setProfileImage(user.profileImage);
    setPreferredLanguage(user.preferredLanguage);
    setDefaultFont(user.defaultFont);
    setDefaultFontSize(user.defaultFontSize);
    setSoundEnabled(user.soundEnabled);
    setNotificationsEnabled(user.notificationsEnabled);
    setPrivacyHideSenderOnDesk(user.privacyHideSenderOnDesk);
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setErrorMsg(t.settings.avatarHint);
      return;
    }
    if (file.size > 750_000) {
      setErrorMsg(t.settings.avatarHint);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setProfileImage(String(reader.result));
      setErrorMsg("");
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setSavedToast(false);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName,
          nickname,
          profileImage,
          preferredLanguage,
          defaultFont,
          defaultFontSize,
          soundEnabled,
          notificationsEnabled,
          privacyHideSenderOnDesk,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        setErrorMsg(d.error || t.auth.genericError);
        return;
      }
      await refreshSession();
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 3000);
    } catch {
      setErrorMsg(t.auth.genericError);
    } finally {
      setSaving(false);
    }
  };

  const handleEnableWebPush = async () => {
    setPushStatus("");
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPushStatus("Notifications API not supported in this browser.");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      setPushStatus("Notification permission denied.");
      return;
    }

    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (vapidKey && "serviceWorker" in navigator) {
      try {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey),
        });
        await fetch("/api/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sub.toJSON()),
        });
      } catch {
        // Fallback to standard browser Notification when VAPID is unconfigured
      }
    }

    setNotificationsEnabled(true);
    setPushStatus(t.settings.pushEnabledStatus);
  };

  const handleRelationshipAction = async (
    action: "request_unlink" | "confirm_unlink" | "cancel_unlink"
  ) => {
    await fetch("/api/relationship", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setConfirmUnlinkPrompt(false);
    await refreshSession();
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (loading || !user) return null;

  return (
    <>
      <DeskHeader />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#35271F] flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-[#783B43]" />
            <span>{t.settings.title}</span>
          </h1>
          <p className="text-sm text-[#795C43]">{t.settings.subtitle}</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Profile Section */}
          <section className="parchment-card rounded-xl p-6 space-y-5">
            <h2 className="text-lg font-bold text-[#35271F] flex items-center gap-2">
              <User className="w-5 h-5 text-[#783B43]" />
              <span>{t.settings.profileSection}</span>
            </h2>

            <div className="flex flex-wrap items-center gap-5">
              <div className="w-20 h-20 rounded-full border-2 border-[#795C43]/40 bg-[#E8D7B8] overflow-hidden flex items-center justify-center shrink-0">
                {profileImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profileImage}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-[#783B43]">
                    {displayName.slice(0, 1)}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-[#795C43]/40 bg-[#FBF6EC] text-xs font-semibold text-[#35271F] hover:bg-[#E8D7B8] cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-[#783B43]" />
                  <span>{t.settings.avatarUpload}</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-[#795C43]">
                  {t.settings.avatarHint}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#35271F]">
                  {t.settings.displayName}
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md bg-[#FBF6EC] border border-[#795C43]/35 text-sm text-[#35271F]"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#35271F]">
                  {t.settings.nickname}
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md bg-[#FBF6EC] border border-[#795C43]/35 text-sm text-[#35271F]"
                />
              </div>
            </div>
          </section>

          {/* Language & Typography */}
          <section className="parchment-card rounded-xl p-6 space-y-5">
            <h2 className="text-lg font-bold text-[#35271F]">
              {t.settings.preferencesSection}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#35271F]">
                  {t.settings.languageLabel}
                </label>
                <select
                  value={preferredLanguage}
                  onChange={(e) =>
                    setPreferredLanguage(e.target.value as AppLanguage)
                  }
                  className="w-full px-3 py-2.5 rounded-md bg-[#FBF6EC] border border-[#795C43]/35 text-sm text-[#35271F]"
                >
                  <option value="ar">العربية (RTL)</option>
                  <option value="fr">Français (LTR)</option>
                  <option value="en">English (LTR)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#35271F]">
                  {t.settings.defaultFontLabel}
                </label>
                <select
                  value={defaultFont}
                  onChange={(e) => setDefaultFont(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-md bg-[#FBF6EC] border border-[#795C43]/35 text-sm text-[#35271F]"
                >
                  {FONT_OPTIONS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {lang === "ar" ? f.nameAr : f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#35271F]">
                  {t.settings.defaultFontSizeLabel} ({defaultFontSize}px)
                </label>
                <input
                  type="range"
                  min={16}
                  max={32}
                  value={defaultFontSize}
                  onChange={(e) => setDefaultFontSize(Number(e.target.value))}
                  className="w-full accent-[#783B43] mt-3"
                />
              </div>
            </div>
          </section>

          {/* Sound & Notifications */}
          <section className="parchment-card rounded-xl p-6 space-y-5">
            <h2 className="text-lg font-bold text-[#35271F] flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#783B43]" />
              <span>{t.settings.notificationsSection}</span>
            </h2>

            <label className="flex items-start justify-between gap-4 cursor-pointer">
              <div>
                <p className="text-sm font-semibold text-[#35271F] flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-[#795C43]" />
                  {t.settings.soundEffectsLabel}
                </p>
                <p className="text-xs text-[#5C4534] mt-0.5">
                  {t.settings.soundEffectsDesc}
                </p>
              </div>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="w-5 h-5 accent-[#783B43] mt-1"
              />
            </label>

            <label className="flex items-start justify-between gap-4 cursor-pointer pt-3 border-t border-[#795C43]/15">
              <div>
                <p className="text-sm font-semibold text-[#35271F]">
                  {t.settings.notificationsLabel}
                </p>
                <p className="text-xs text-[#5C4534] mt-0.5">
                  {t.settings.notificationsDesc}
                </p>
              </div>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="w-5 h-5 accent-[#783B43] mt-1"
              />
            </label>

            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={handleEnableWebPush}
                className="px-4 py-2 rounded-md border border-[#783B43]/50 text-xs font-semibold text-[#783B43] hover:bg-[#783B43]/10 cursor-pointer"
              >
                {t.settings.enablePushBtn}
              </button>
              {pushStatus && (
                <p className="text-xs text-[#2E4739] font-medium">
                  {pushStatus}
                </p>
              )}
              <p className="text-[11px] text-[#795C43] leading-relaxed">
                {t.settings.pushBrowserNote}
              </p>
            </div>
          </section>

          {/* Privacy */}
          <section className="parchment-card rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-[#35271F] flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#783B43]" />
              <span>{t.settings.securitySection}</span>
            </h2>

            <label className="flex items-start justify-between gap-4 cursor-pointer">
              <div>
                <p className="text-sm font-semibold text-[#35271F]">
                  {t.settings.privacyMaskLabel}
                </p>
                <p className="text-xs text-[#5C4534] mt-0.5">
                  {t.settings.privacyMaskDesc}
                </p>
              </div>
              <input
                type="checkbox"
                checked={privacyHideSenderOnDesk}
                onChange={(e) => setPrivacyHideSenderOnDesk(e.target.checked)}
                className="w-5 h-5 accent-[#783B43] mt-1"
              />
            </label>
          </section>

          {errorMsg && (
            <p className="text-xs text-[#783B43] bg-[#783B43]/10 p-3 rounded">
              {errorMsg}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-md bg-[#783B43] text-[#F3E8D2] font-semibold text-sm hover:bg-[#642F36] cursor-pointer"
            >
              {saving ? "..." : t.settings.saveSettingsBtn}
            </button>

            {savedToast && (
              <span className="inline-flex items-center gap-1.5 text-sm text-[#2E4739] font-semibold">
                <Check className="w-4 h-4" />
                {t.settings.savedToast}
              </span>
            )}
          </div>
        </form>

        {/* Relationship Unlink & Account Logout */}
        <section className="parchment-card rounded-xl p-6 space-y-5 border-[#783B43]/30">
          {relationship?.status === "active" && (
            <div className="space-y-3 pb-5 border-b border-[#795C43]/20">
              <h2 className="text-lg font-bold text-[#783B43] flex items-center gap-2">
                <Unlink className="w-5 h-5" />
                <span>{t.settings.unlinkTitle}</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#5C4534]">
                {t.settings.unlinkDesc}
              </p>

              {relationship.unlinkRequestedBy ? (
                <div className="p-4 rounded-lg bg-[#783B43]/10 space-y-3">
                  <p className="text-xs font-medium text-[#783B43]">
                    {t.settings.unlinkPendingNotice}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleRelationshipAction("confirm_unlink")}
                      className="px-4 py-2 rounded bg-[#783B43] text-[#F3E8D2] text-xs font-semibold cursor-pointer"
                    >
                      {t.settings.unlinkConfirmPartnerBtn}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRelationshipAction("cancel_unlink")}
                      className="px-4 py-2 rounded border border-[#795C43]/40 text-xs text-[#35271F] cursor-pointer"
                    >
                      {t.settings.unlinkCancelBtn}
                    </button>
                  </div>
                </div>
              ) : !confirmUnlinkPrompt ? (
                <button
                  type="button"
                  onClick={() => setConfirmUnlinkPrompt(true)}
                  className="px-4 py-2 rounded border border-[#783B43]/50 text-xs font-semibold text-[#783B43] hover:bg-[#783B43]/10 cursor-pointer"
                >
                  {t.settings.unlinkBtn}
                </button>
              ) : (
                <div className="p-4 rounded-lg bg-[#783B43]/10 space-y-3">
                  <p className="text-xs font-semibold text-[#35271F]">
                    {t.settings.unlinkConfirmText}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleRelationshipAction("request_unlink")}
                      className="px-4 py-2 rounded bg-[#783B43] text-[#F3E8D2] text-xs font-semibold cursor-pointer"
                    >
                      {t.settings.unlinkBtn}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmUnlinkPrompt(false)}
                      className="px-4 py-2 rounded border border-[#795C43]/40 text-xs text-[#35271F] cursor-pointer"
                    >
                      {t.settings.unlinkCancelBtn}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-[#783B43]/40 text-sm font-semibold text-[#783B43] hover:bg-[#783B43]/10 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{t.settings.logoutBtn}</span>
          </button>
        </section>
      </main>
    </>
  );
}
