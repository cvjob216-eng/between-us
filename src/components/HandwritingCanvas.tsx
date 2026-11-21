"use client";

import React, { useEffect, useRef, useState } from "react";
import { RotateCcw, Trash2, Undo2, Check } from "lucide-react";
import { INK_COLORS, getPaperById } from "@/lib/catalog";
import { useApp } from "./AppProvider";

interface Stroke {
  points: Array<{ x: number; y: number }>;
  color: string;
  width: number;
}

export function HandwritingCanvas({
  paperId,
  initialImage,
  onSave,
}: {
  paperId: string;
  initialImage: string | null;
  onSave: (pngDataUrl: string) => void;
}) {
  const { t } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const currentStrokeRef = useRef<Stroke | null>(null);
  const isDrawingRef = useRef(false);
  const [penWidth, setPenWidth] = useState(3.2);
  const [penColor, setPenColor] = useState("#35271F");
  const [savedNotice, setSavedNotice] = useState(false);

  const paper = getPaperById(paperId);

  const redraw = (strokeList: Stroke[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = paper.bgHex;
    ctx.fillRect(0, 0, w, h);

    // Subtle ruled lines on canvas for comfortable handwriting
    ctx.strokeStyle = `${paper.accentHex}22`;
    ctx.lineWidth = 1;
    for (let y = 64; y < h - 24; y += 52) {
      ctx.beginPath();
      ctx.moveTo(32, y);
      ctx.lineTo(w - 32, y);
      ctx.stroke();
    }

    for (const stroke of strokeList) {
      if (stroke.points.length === 0) continue;
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        const prev = stroke.points[i - 1];
        const curr = stroke.points[i];
        const midX = (prev.x + curr.x) / 2;
        const midY = (prev.y + curr.y) / 2;
        ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
      }
      const last = stroke.points[stroke.points.length - 1];
      ctx.lineTo(last.x, last.y);
      ctx.stroke();
    }
  };

  useEffect(() => {
    redraw(strokes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strokes, paperId]);

  const getCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    const pt = getCoords(e);
    const nextStroke: Stroke = {
      points: [pt],
      color: penColor,
      width: penWidth * 1.6,
    };
    currentStrokeRef.current = nextStroke;
    setSavedNotice(false);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !currentStrokeRef.current) return;
    const pt = getCoords(e);
    currentStrokeRef.current.points.push(pt);
    redraw([...strokes, currentStrokeRef.current]);
  };

  const handlePointerUp = () => {
    if (!isDrawingRef.current || !currentStrokeRef.current) return;
    isDrawingRef.current = false;
    const finished = currentStrokeRef.current;
    currentStrokeRef.current = null;
    if (finished.points.length > 0) {
      setStrokes((prev) => [...prev, finished]);
    }
  };

  const handleUndo = () => {
    setStrokes((prev) => prev.slice(0, -1));
    setSavedNotice(false);
  };

  const handleClear = () => {
    setStrokes([]);
    setSavedNotice(false);
  };

  const handleSaveCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    onSave(dataUrl);
    setSavedNotice(true);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#795C43]/20">
        <span className="text-sm font-semibold text-[#35271F]">
          {t.compose.handwritingTitle}
        </span>

        {/* Pen Thickness */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#795C43]">{t.compose.penThickness}:</span>
          {[2, 3.2, 5.2].map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => setPenWidth(w)}
              className={`w-7 h-7 rounded-full border flex items-center justify-center cursor-pointer ${
                penWidth === w
                  ? "border-[#783B43] bg-[#783B43]/10"
                  : "border-[#795C43]/30"
              }`}
            >
              <span
                className="rounded-full bg-[#35271F]"
                style={{ width: w * 2.2, height: w * 2.2 }}
              />
            </button>
          ))}
        </div>

        {/* Ink Colors */}
        <div className="flex items-center gap-1.5">
          {INK_COLORS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setPenColor(c.hex)}
              title={c.nameEn}
              className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-transform ${
                penColor === c.hex ? "scale-115 border-[#35271F]" : "border-white/70"
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>

      <div
        className="relative rounded-sm overflow-hidden border shadow-inner touch-none"
        style={{ borderColor: paper.borderHex }}
      >
        <canvas
          ref={canvasRef}
          width={1100}
          height={680}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full h-auto block cursor-crosshair touch-none"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleUndo}
            disabled={strokes.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#795C43]/30 text-xs text-[#35271F] hover:bg-[#E8D7B8] disabled:opacity-40 cursor-pointer"
          >
            <Undo2 className="w-3.5 h-3.5" />
            {t.compose.undo}
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={strokes.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#795C43]/30 text-xs text-[#35271F] hover:bg-[#E8D7B8] disabled:opacity-40 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {t.compose.clear}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#795C43]/30 text-xs text-[#783B43] hover:bg-[#E8D7B8] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {t.compose.retry}
          </button>
        </div>

        <button
          type="button"
          onClick={handleSaveCanvas}
          disabled={strokes.length === 0 && !initialImage}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[#783B43] text-[#F3E8D2] text-xs font-semibold hover:bg-[#642F36] disabled:opacity-40 cursor-pointer transition-colors"
        >
          <Check className="w-4 h-4" />
          {t.compose.saveHandwriting}
        </button>
      </div>

      {savedNotice && (
        <p className="text-xs text-[#2E4739] font-medium">
          ✓ {t.compose.handwritingAttached}
        </p>
      )}
    </div>
  );
}
