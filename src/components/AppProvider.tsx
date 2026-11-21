"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  AppLanguage,
  getUiDirection,
  TRANSLATIONS,
  TranslationDict,
} from "@/lib/i18n";

export interface UserProfile {
  id: string;
  displayName: string;
  nickname: string;
  email: string;
  profileImage: string | null;
  preferredLanguage: AppLanguage;
  defaultFont: string;
  defaultFontSize: number;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  privacyHideSenderOnDesk: boolean;
}

export interface PartnerInfo {
  id: string;
  displayName: string;
  nickname: string;
  profileImage: string | null;
}

export interface RelationshipInfo {
  id: string;
  userOneId: string;
  userTwoId: string | null;
  inviteCode: string;
  status: "pending" | "active" | "unlinked";
  unlinkRequestedBy: string | null;
  isUserOne: boolean;
  partner: PartnerInfo | null;
}

export interface AppCounts {
  unreadNotifications: number;
  unopenedLetters: number;
  inTransitIncoming: number;
  drafts: number;
}

interface AppContextValue {
  loading: boolean;
  user: UserProfile | null;
  relationship: RelationshipInfo | null;
  counts: AppCounts;
  lang: AppLanguage;
  dir: "rtl" | "ltr";
  t: TranslationDict;
  setGuestLanguage: (l: AppLanguage) => void;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [relationship, setRelationship] = useState<RelationshipInfo | null>(
    null
  );
  const [counts, setCounts] = useState<AppCounts>({
    unreadNotifications: 0,
    unopenedLetters: 0,
    inTransitIncoming: 0,
    drafts: 0,
  });
  const [guestLang, setGuestLangState] = useState<AppLanguage>("ar");

  useEffect(() => {
    const saved =
      typeof window !== "undefined"
        ? (localStorage.getItem("bl_lang") as AppLanguage | null)
        : null;
    if (saved && ["ar", "en", "fr"].includes(saved)) {
      setGuestLangState(saved);
    }
  }, []);

  const setGuestLanguage = useCallback((l: AppLanguage) => {
    setGuestLangState(l);
    if (typeof window !== "undefined") {
      localStorage.setItem("bl_lang", l);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (!res.ok) {
        setUser(null);
        setRelationship(null);
        return;
      }
      const data = await res.json();
      setUser(data.user ?? null);
      setRelationship(data.relationship ?? null);
      if (data.counts) {
        setCounts(data.counts);
      }
    } catch {
      // network error handled silently
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  // Register Service Worker for PWA & Push
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  // Poll gently every 25s while logged in so scheduled/delayed letters arrive smoothly
  useEffect(() => {
    if (!user) return;
    const timer = setInterval(() => {
      refreshSession();
    }, 25000);
    return () => clearInterval(timer);
  }, [user, refreshSession]);

  const lang: AppLanguage = user?.preferredLanguage ?? guestLang;
  const dir = getUiDirection(lang);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      document.documentElement.dir = dir;
    }
  }, [lang, dir]);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setRelationship(null);
    setCounts({
      unreadNotifications: 0,
      unopenedLetters: 0,
      inTransitIncoming: 0,
      drafts: 0,
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        loading,
        user,
        relationship,
        counts,
        lang,
        dir,
        t,
        setGuestLanguage,
        refreshSession,
        logout,
      }}
    >
      <div dir={dir} className="min-h-screen flex flex-col">
        {children}
      </div>
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
