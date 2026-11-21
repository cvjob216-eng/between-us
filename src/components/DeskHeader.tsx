"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Feather,
  Mail,
  Send,
  BookOpen,
  Settings,
  Bell,
  Home,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useApp } from "./AppProvider";
import { formatDateTime } from "@/lib/i18n";

interface NotificationItem {
  id: string;
  type: string;
  messageKey: string;
  letterId: string | null;
  sentAt: string;
  readAt: string | null;
}

export function DeskHeader() {
  const { user, counts, lang, t, logout, refreshSession } = useApp();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (!notifOpen || !user) return;
    fetch("/api/notifications", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { notifications: [] }))
      .then((d) => setNotifs(d.notifications ?? []))
      .catch(() => {});
  }, [notifOpen, user]);

  const markAllRead = async () => {
    await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    });
    setNotifs((prev) =>
      prev.map((n) => ({ ...n, readAt: new Date().toISOString() }))
    );
    refreshSession();
  };

  if (!user) return null;

  const navItems = [
    { href: "/", label: t.nav.desk, icon: Home },
    { href: "/compose", label: t.nav.compose, icon: Feather },
    {
      href: "/inbox",
      label: t.nav.inbox,
      icon: Mail,
      badge: counts.unopenedLetters,
    },
    { href: "/sent", label: t.nav.sent, icon: Send },
    { href: "/archive", label: t.nav.archive, icon: BookOpen },
    { href: "/settings", label: t.nav.settings, icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#795C43]/25 bg-[#F3E8D2]/92 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group shrink-0"
        >
          <div className="w-9 h-9 rounded-full bg-[#783B43] text-[#F3E8D2] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <Feather className="w-4 h-4" />
          </div>
          <div className="leading-tight">
            <span className="block text-base sm:text-lg font-bold text-[#35271F]">
              {t.appName}
            </span>
            <span className="block text-[10px] tracking-widest uppercase text-[#795C43]">
              {t.appSubtitle}
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-md text-sm transition-colors ${
                  active
                    ? "bg-[#783B43] text-[#F3E8D2] shadow-sm"
                    : "text-[#35271F]/80 hover:bg-[#E8D7B8]/70 hover:text-[#35271F]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
                {item.badge && item.badge > 0 ? (
                  <span
                    className={`px-1.5 py-0.5 text-[11px] rounded-full font-semibold leading-none ${
                      active
                        ? "bg-[#F3E8D2] text-[#783B43]"
                        : "bg-[#783B43] text-[#F3E8D2]"
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Notifications + Mobile Toggle */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotifOpen((v) => !v)}
              className="relative p-2 rounded-full border border-[#795C43]/30 bg-[#F7EFE0] text-[#35271F] hover:bg-[#E8D7B8] transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {counts.unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#783B43] text-[#F3E8D2] text-[10px] flex items-center justify-center font-bold">
                  {counts.unreadNotifications}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute end-0 mt-2 w-80 rounded-md parchment-card shadow-xl z-50 p-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#795C43]/20">
                  <span className="text-sm font-semibold text-[#35271F]">
                    {t.notifications.newLetterTitle}
                  </span>
                  {notifs.some((n) => !n.readAt) && (
                    <button
                      type="button"
                      onClick={markAllRead}
                      className="text-xs text-[#783B43] hover:underline cursor-pointer"
                    >
                      {t.notifications.markAllRead}
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-[#795C43]/15 mt-1">
                  {notifs.length === 0 ? (
                    <p className="py-6 text-center text-xs text-[#795C43]">
                      {t.notifications.empty}
                    </p>
                  ) : (
                    notifs.map((n) => {
                      const bodyText =
                        n.messageKey === "delayed"
                          ? t.notifications.delayedLetterBody
                          : n.type === "partner_linked"
                            ? t.connect.title
                            : t.notifications.newLetterBody;
                      return (
                        <button
                          key={n.id}
                          type="button"
                          onClick={() => {
                            setNotifOpen(false);
                            router.push(
                              n.letterId ? `/letters/${n.letterId}` : "/inbox"
                            );
                          }}
                          className={`w-full text-start py-2.5 px-2 rounded hover:bg-[#E8D7B8]/50 transition-colors cursor-pointer ${
                            !n.readAt ? "bg-[#C99B9B]/15" : ""
                          }`}
                        >
                          <p className="text-sm text-[#35271F] font-medium">
                            {bodyText}
                          </p>
                          <p className="text-[11px] text-[#795C43] mt-0.5">
                            {formatDateTime(n.sentAt, lang)}
                          </p>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-2 rounded-md border border-[#795C43]/30 bg-[#F7EFE0] text-[#35271F]"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#795C43]/20 bg-[#F3E8D2] px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-md text-sm ${
                  active
                    ? "bg-[#783B43] text-[#F3E8D2]"
                    : "text-[#35271F] hover:bg-[#E8D7B8]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {item.label}
                </span>
                {item.badge && item.badge > 0 ? (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-[#C99B9B] text-[#35271F] font-semibold">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-md text-sm text-[#783B43] hover:bg-[#E8D7B8]"
          >
            <LogOut className="w-4 h-4" />
            {t.nav.logout}
          </button>
        </div>
      )}
    </header>
  );
}
