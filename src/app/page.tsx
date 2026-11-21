"use client";

import React from "react";
import { useApp } from "@/components/AppProvider";
import { DeskHeader } from "@/components/DeskHeader";
import { WelcomeView } from "@/components/WelcomeView";
import { WritingDeskHome } from "@/components/WritingDeskHome";

export default function HomePage() {
  const { loading, user, t } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-[#795C43]">
        <div className="w-8 h-8 rounded-full border-2 border-[#783B43] border-t-transparent animate-spin" />
        <p className="text-sm">{t.appName}</p>
      </div>
    );
  }

  if (!user) {
    return <WelcomeView />;
  }

  return (
    <>
      <DeskHeader />
      <WritingDeskHome />
    </>
  );
}
