"use client";

import React from "react";
import {
  EnvelopeOption,
  PaperOption,
  StampOption,
  WaxSealOption,
  getEnvelopeById,
  getPaperById,
  getStampById,
  getWaxSealById,
} from "@/lib/catalog";

export function WaxSealSvg({
  sealId,
  size = 56,
  className = "",
  breaking = false,
}: {
  sealId: string;
  size?: number;
  className?: string;
  breaking?: boolean;
}) {
  const seal: WaxSealOption = getWaxSealById(sealId);
  const gradId = `wax-grad-${seal.id}-${size}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`${breaking ? "animate-seal-break" : ""} drop-shadow-[0_4px_6px_rgba(53,39,31,0.35)] ${className}`}
      aria-label={seal.nameEn}
    >
      <defs>
        <radialGradient id={gradId} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor={seal.highlightHex} />
          <stop offset="55%" stopColor={seal.colorHex} />
          <stop offset="100%" stopColor={seal.shadowHex} />
        </radialGradient>
      </defs>

      {/* Organic melted wax silhouette */}
      <path
        d="M50 5 C62 4, 72 11, 81 17 C89 23, 95 34, 94 46 C96 58, 91 71, 82 80 C73 89, 63 95, 51 94 C39 96, 26 90, 18 81 C10 72, 5 61, 7 49 C5 37, 11 25, 19 17 C27 9, 38 6, 50 5 Z"
        fill={`url(#${gradId})`}
      />

      {/* Inner pressed rim */}
      <circle
        cx="50"
        cy="50"
        r="32"
        fill="none"
        stroke={seal.shadowHex}
        strokeWidth="2.5"
        opacity="0.7"
      />
      <circle
        cx="50"
        cy="50"
        r="29"
        fill="none"
        stroke={seal.highlightHex}
        strokeWidth="1"
        opacity="0.55"
      />

      {/* Embossed symbol */}
      {seal.symbol === "heart" && (
        <path
          d="M50 66 C50 66 32 54 32 42 C32 36 37 32 42 32 C46 32 49 35 50 38 C51 35 54 32 58 32 C63 32 68 36 68 42 C68 54 50 66 50 66 Z"
          fill={seal.shadowHex}
          stroke={seal.highlightHex}
          strokeWidth="1.2"
        />
      )}

      {seal.symbol === "flower" && (
        <g fill={seal.shadowHex} stroke={seal.highlightHex} strokeWidth="0.9">
          <circle cx="50" cy="36" r="7" />
          <circle cx="63" cy="46" r="7" />
          <circle cx="58" cy="61" r="7" />
          <circle cx="42" cy="61" r="7" />
          <circle cx="37" cy="46" r="7" />
          <circle cx="50" cy="50" r="5" fill={seal.highlightHex} />
        </g>
      )}

      {seal.symbol === "star" && (
        <polygon
          points="50,30 55,43 69,43 58,52 62,66 50,57 38,66 42,52 31,43 45,43"
          fill={seal.shadowHex}
          stroke={seal.highlightHex}
          strokeWidth="1.2"
        />
      )}

      {seal.symbol === "crescent" && (
        <path
          d="M57 33 A17 17 0 1 0 65 62 A13 13 0 1 1 57 33 Z"
          fill={seal.shadowHex}
          stroke={seal.highlightHex}
          strokeWidth="1"
        />
      )}

      {seal.symbol === "crown" && (
        <path
          d="M32 60 L35 40 L44 50 L50 36 L56 50 L65 40 L68 60 Z M32 63 H68"
          fill={seal.shadowHex}
          stroke={seal.highlightHex}
          strokeWidth="1.2"
        />
      )}
    </svg>
  );
}

export function StampSvg({
  stampId,
  width = 64,
  className = "",
}: {
  stampId: string;
  width?: number;
  className?: string;
}) {
  const stamp: StampOption = getStampById(stampId);
  const height = Math.round(width * 1.22);

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-between select-none shadow-sm ${className}`}
      style={{
        width,
        height,
        backgroundColor: stamp.bgHex,
        border: `2px dashed ${stamp.inkHex}66`,
        padding: 4,
      }}
    >
      <div
        className="w-full h-full flex flex-col items-center justify-between p-1"
        style={{ border: `1px solid ${stamp.inkHex}88` }}
      >
        <span
          className="text-[7px] tracking-widest font-semibold uppercase leading-none"
          style={{ color: stamp.inkHex }}
        >
          POSTE
        </span>

        <svg viewBox="0 0 40 40" className="w-7 h-7" style={{ color: stamp.inkHex }}>
          {stamp.motif === "rose" && (
            <g fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="20" cy="16" r="7" />
              <path d="M16 14 C18 11, 22 11, 24 14 C23 18, 17 18, 16 14 Z" />
              <path d="M20 23 V35 M20 28 L14 25 M20 30 L26 27" />
            </g>
          )}
          {stamp.motif === "heart" && (
            <path
              d="M20 31 C20 31 8 23 8 15 C8 11 11 8 15 8 C17.5 8 19.5 10 20 12 C20.5 10 22.5 8 25 8 C29 8 32 11 32 15 C32 23 20 31 20 31 Z"
              fill="currentColor"
              opacity="0.82"
            />
          )}
          {stamp.motif === "quill" && (
            <g fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M30 8 C20 10, 13 18, 10 32 L14 26 C21 24, 28 17, 30 8 Z" />
              <path d="M10 32 L18 20" />
            </g>
          )}
          {stamp.motif === "paris" && (
            <g fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M20 6 L16 24 L12 34 M20 6 L24 24 L28 34 M14 24 H26 M15 18 H25 M16 34 C16 30, 24 30, 24 34" />
            </g>
          )}
          {stamp.motif === "cairo" && (
            <g fill="none" stroke="currentColor" strokeWidth="1.6">
              <polygon points="8,32 17,14 26,32" />
              <polygon points="20,32 27,19 34,32" />
              <circle cx="29" cy="11" r="3" />
            </g>
          )}
          {stamp.motif === "moon" && (
            <g fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M24 10 A10 10 0 1 0 28 27 A8 8 0 1 1 24 10 Z" fill="currentColor" opacity="0.75" />
              <circle cx="27" cy="14" r="1.2" fill="currentColor" />
            </g>
          )}
          {stamp.motif === "anniversary" && (
            <g fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="20" cy="20" r="10" />
              <polygon points="20,12 22,18 28,18 23,21 25,27 20,23 15,27 17,21 12,18 18,18" fill="currentColor" />
            </g>
          )}
          {stamp.motif === "dove" && (
            <g fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M10 24 C14 14, 24 12, 31 15 C26 19, 25 26, 17 28 C14 28, 12 26, 10 24 Z" />
              <path d="M18 16 C15 11, 10 10, 8 13 C11 16, 14 18, 17 19" />
            </g>
          )}
        </svg>

        <span
          className="text-[6.5px] tracking-wider font-medium leading-none truncate max-w-full"
          style={{ color: stamp.inkHex }}
        >
          {stamp.postmarkText}
        </span>
      </div>
    </div>
  );
}

export function EnvelopeVisual({
  envelopeId,
  stampId,
  waxSealId,
  recipientLabel,
  symbolicAddress,
  envelopeNote,
  isOpen = false,
  breakingSeal = false,
  onSealClick,
  compact = false,
  dir = "rtl",
  className = "",
}: {
  envelopeId: string;
  stampId: string;
  waxSealId: string;
  recipientLabel?: string;
  symbolicAddress?: string;
  envelopeNote?: string;
  isOpen?: boolean;
  breakingSeal?: boolean;
  onSealClick?: () => void;
  compact?: boolean;
  dir?: "rtl" | "ltr";
  className?: string;
}) {
  const env: EnvelopeOption = getEnvelopeById(envelopeId);

  return (
    <div
      className={`relative rounded-sm overflow-hidden transition-all duration-500 ${compact ? "p-4" : "p-6 sm:p-8"} ${className}`}
      style={{
        backgroundColor: env.paperHex,
        border: `1.5px solid ${env.trimHex}88`,
        boxShadow:
          "0 14px 30px rgba(53, 39, 31, 0.16), inset 0 0 32px rgba(121, 92, 67, 0.12)",
      }}
    >
      {/* Airmail vintage diagonal border if airmail style */}
      {env.style === "airmail" && (
        <div
          className="absolute inset-0 pointer-events-none opacity-45"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, #783B43 0 8px, transparent 8px 16px, #4B5E72 16px 24px, transparent 24px 32px)",
            maskImage:
              "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            padding: 6,
            maskComposite: "exclude",
            WebkitMaskComposite: "xor",
          }}
        />
      )}

      {/* Floral corner etching if floral style */}
      {env.style === "floral" && (
        <svg
          className="absolute bottom-2 left-2 w-20 h-20 opacity-25 pointer-events-none"
          viewBox="0 0 80 80"
          fill="none"
          stroke={env.trimHex}
          strokeWidth="1.2"
        >
          <path d="M10 70 C24 55, 35 42, 56 26" />
          <circle cx="32" cy="48" r="7" />
          <circle cx="48" cy="33" r="5" />
          <path d="M18 60 C12 52, 16 44, 24 46" />
        </svg>
      )}

      {/* Top flap visual */}
      <div
        className={`absolute top-0 left-0 right-0 pointer-events-none transition-transform duration-700 origin-top ${
          isOpen ? "-translate-y-4 opacity-40" : ""
        }`}
        style={{ height: compact ? "46%" : "48%" }}
      >
        <svg
          viewBox="0 0 400 140"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <polygon
            points="0,0 400,0 200,128"
            fill={env.flapHex}
            stroke={env.trimHex}
            strokeOpacity="0.45"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* Postage Stamp + Postmark Circle */}
      <div
        className={`relative z-10 flex items-start justify-between ${
          dir === "rtl" ? "flex-row" : "flex-row-reverse"
        }`}
      >
        <div className="flex items-center gap-2">
          <StampSvg stampId={stampId} width={compact ? 48 : 60} />
          {!compact && (
            <svg
              width="52"
              height="52"
              viewBox="0 0 60 60"
              className="opacity-35 pointer-events-none"
            >
              <circle
                cx="30"
                cy="30"
                r="22"
                fill="none"
                stroke="#35271F"
                strokeWidth="1.2"
                strokeDasharray="3 2"
              />
              <path
                d="M6 26 Q20 20 34 26 T56 26 M6 34 Q20 28 34 34 T56 34"
                fill="none"
                stroke="#35271F"
                strokeWidth="0.9"
              />
            </svg>
          )}
        </div>
        <span
          className="text-[11px] tracking-widest uppercase opacity-60 font-serif"
          style={{ color: "#35271F" }}
        >
          {env.style === "airmail" ? "PAR AVION" : "COURRIER PRIVÉ"}
        </span>
      </div>

      {/* Center Wax Seal */}
      <div className="relative z-20 flex justify-center my-2 sm:my-4">
        {onSealClick ? (
          <button
            type="button"
            onClick={onSealClick}
            className="group focus:outline-none transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Wax seal"
          >
            <WaxSealSvg
              sealId={waxSealId}
              size={compact ? 48 : 68}
              breaking={breakingSeal}
            />
          </button>
        ) : (
          <WaxSealSvg
            sealId={waxSealId}
            size={compact ? 46 : 62}
            breaking={breakingSeal}
          />
        )}
      </div>

      {/* Recipient Name & Symbolic Address */}
      <div className="relative z-10 text-center space-y-1 pt-1">
        <p
          className={`${compact ? "text-lg" : "text-2xl"} font-semibold text-[#35271F]`}
          style={{ fontFamily: "var(--font-amiri), var(--font-cormorant), serif" }}
        >
          {recipientLabel || "إليك"}
        </p>
        {symbolicAddress && (
          <p className="text-xs sm:text-sm text-[#795C43] italic">
            {symbolicAddress}
          </p>
        )}
        {envelopeNote && (
          <p className="text-xs text-[#783B43] font-medium pt-0.5">
            ✦ {envelopeNote}
          </p>
        )}
      </div>
    </div>
  );
}

export function PaperSheet({
  paperId,
  children,
  className = "",
}: {
  paperId: string;
  children: React.ReactNode;
  className?: string;
}) {
  const paper: PaperOption = getPaperById(paperId);

  return (
    <div
      className={`relative rounded-sm paper-grain transition-colors duration-300 ${className}`}
      style={{
        backgroundColor: paper.bgHex,
        border: `1px solid ${paper.borderHex}`,
        boxShadow:
          "0 12px 36px rgba(53, 39, 31, 0.12), inset 0 0 42px rgba(121, 92, 67, 0.08)",
      }}
    >
      {/* Delicate inner frame */}
      {paper.pattern === "framed" && (
        <div
          className="absolute inset-3 sm:inset-5 pointer-events-none"
          style={{
            border: `1px solid ${paper.accentHex}55`,
            outline: `1px solid ${paper.accentHex}28`,
            outlineOffset: "4px",
          }}
        />
      )}

      {/* Pressed flora watermark */}
      {paper.pattern === "floral" && (
        <>
          <svg
            className="absolute top-3 right-3 w-20 h-20 opacity-20 pointer-events-none"
            viewBox="0 0 100 100"
            fill="none"
            stroke="#783B43"
            strokeWidth="1.2"
          >
            <path d="M85 15 C65 30, 50 50, 35 80" />
            <circle cx="62" cy="36" r="8" />
            <circle cx="48" cy="54" r="6" />
            <path d="M56 26 C64 18, 72 22, 68 30" />
          </svg>
          <svg
            className="absolute bottom-3 left-3 w-20 h-20 opacity-20 pointer-events-none rotate-180"
            viewBox="0 0 100 100"
            fill="none"
            stroke="#783B43"
            strokeWidth="1.2"
          >
            <path d="M85 15 C65 30, 50 50, 35 80" />
            <circle cx="62" cy="36" r="8" />
            <circle cx="48" cy="54" r="6" />
          </svg>
        </>
      )}

      {/* Vintage postal watermark */}
      {paper.pattern === "postal" && (
        <div className="absolute top-5 left-5 opacity-20 pointer-events-none select-none flex items-center gap-2">
          <div className="w-12 h-12 rounded-full border border-dashed border-[#5B4331] flex items-center justify-center text-[8px] font-serif tracking-widest text-[#5B4331]">
            1895
          </div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#5B4331] font-serif">
            CORRESPONDANCE
          </span>
        </div>
      )}

      {/* Aged edges vignette */}
      {paper.pattern === "aged" && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: "inset 0 0 55px rgba(121, 92, 67, 0.24)",
          }}
        />
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
}
