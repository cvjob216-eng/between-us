"use client";

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return null;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function playFilteredNoise(
  duration: number,
  filterFreq: number,
  q: number,
  gainPeak: number,
  delay = 0
) {
  const ctx = getCtx();
  if (!ctx) return;

  const sampleRate = ctx.sampleRate;
  const frameCount = Math.floor(sampleRate * duration);
  const buffer = ctx.createBuffer(1, frameCount, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (frameCount * 0.6));
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = filterFreq;
  filter.Q.value = q;

  const gain = ctx.createGain();
  const start = ctx.currentTime + delay;
  gain.gain.setValueAtTime(0.001, start);
  gain.gain.exponentialRampToValueAtTime(gainPeak, start + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start(start);
}

export function playPaperRustle(enabled: boolean) {
  if (!enabled) return;
  playFilteredNoise(0.26, 2200, 1.2, 0.08, 0);
  playFilteredNoise(0.18, 2800, 1.5, 0.05, 0.08);
}

export function playWaxSealCrack(enabled: boolean) {
  if (!enabled) return;
  const ctx = getCtx();
  if (!ctx) return;
  // Crisp short snap + low wax thud
  playFilteredNoise(0.09, 1400, 2.2, 0.14, 0);
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(190, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(65, ctx.currentTime + 0.09);
  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.11);
}

export function playEnvelopeOpen(enabled: boolean) {
  if (!enabled) return;
  playFilteredNoise(0.32, 1800, 0.9, 0.09, 0.02);
  playFilteredNoise(0.28, 2600, 1.1, 0.06, 0.18);
}

export function playDeskPlace(enabled: boolean) {
  if (!enabled) return;
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(110, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(48, ctx.currentTime + 0.12);
  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.13);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.14);
  playFilteredNoise(0.14, 1500, 1.0, 0.04, 0.02);
}
