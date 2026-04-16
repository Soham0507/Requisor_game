import React, { useEffect, useRef } from "react";

interface Particle {
  destX: number;
  destY: number;
  x: number;
  y: number;
  startX: number;
  startY: number;
  color: number;
}

function easeOutCubic(t: number, b: number, c: number, d: number): number {
  return c * ((t = t / d - 1) * t * t + 1) + b;
}

const LINE1 = "We Create High-Impact";
const LINE2 = "Booth Gaming Experiences";
const START_DELAY = 50;
const DURATION = 320;
const STEP = 2;

export function ParticleText() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    let stopped = false;
    let animId: number;
    let tick = 0;
    const particles: Particle[] = [];

    async function init() {
      const W = wrap!.clientWidth || 900;

      // Try a starting font size, then shrink to fit
      let fontSize = Math.max(Math.min(W / 9, 96), 22);
      const FONT_FAMILY = "'Plus Jakarta Sans', 'Inter', sans-serif";

      // Wait for fonts
      try { await document.fonts.load(`900 ${fontSize}px ${FONT_FAMILY}`); } catch (_) {}
      await document.fonts.ready;

      // Measure and fit text to canvas width
      const offCtx = document.createElement("canvas").getContext("2d")!;
      offCtx.font = `900 ${fontSize}px ${FONT_FAMILY}`;
      const maxTxtW = Math.max(
        offCtx.measureText(LINE1).width,
        offCtx.measureText(LINE2).width
      );
      if (maxTxtW > W * 0.95) {
        fontSize = Math.floor(fontSize * (W * 0.95) / maxTxtW);
      }

      const lineH = fontSize * 1.28;
      const H = Math.ceil(lineH * 2 + fontSize * 0.3);

      canvas.width = W;
      canvas.height = H;

      const ctx = canvas.getContext("2d")!;
      ctx.font = `900 ${fontSize}px ${FONT_FAMILY}`;

      // Draw line 1 — white
      const w1 = ctx.measureText(LINE1).width;
      ctx.fillStyle = "#ffffff";
      ctx.fillText(LINE1, (W - w1) / 2, fontSize);

      // Draw line 2 — orange → pink → purple gradient
      const w2 = ctx.measureText(LINE2).width;
      const x2 = (W - w2) / 2;
      const grad = ctx.createLinearGradient(x2, 0, x2 + w2, 0);
      grad.addColorStop(0,   "#fb923c");
      grad.addColorStop(0.45,"#f472b6");
      grad.addColorStop(1,   "#a855f7");
      ctx.fillStyle = grad;
      ctx.fillText(LINE2, x2, fontSize + lineH);

      // Sample every STEP pixels, build particle list
      const imgData = ctx.getImageData(0, 0, W, H);
      const data = imgData.data;

      for (let y = 0; y < H; y += STEP) {
        for (let x = 0; x < W; x += STEP) {
          const i = (y * W + x) * 4;
          if (data[i + 3] > 100) {
            // Random scatter origin
            const sx = Math.random() * W;
            const sy = Math.random() * H;
            particles.push({
              destX: x, destY: y,
              x: sx, y: sy,
              startX: sx, startY: sy,
              // Pack RGBA → Uint32 (little-endian: R | G<<8 | B<<16 | A<<24)
              color: data[i] | (data[i + 1] << 8) | (data[i + 2] << 16) | (255 << 24),
            });
          }
        }
      }

      ctx.clearRect(0, 0, W, H);
      if (!stopped) draw(W, H, ctx);
    }

    function draw(W: number, H: number, ctx: CanvasRenderingContext2D) {
      if (stopped) return;

      const t = tick - START_DELAY;
      const frame = ctx.createImageData(W, H);
      const pixels = new Uint32Array(frame.data.buffer);

      for (const p of particles) {
        if (t > 0) {
          const ct = Math.min(t, DURATION);
          p.x = easeOutCubic(ct, p.startX, p.destX - p.startX, DURATION);
          p.y = easeOutCubic(ct, p.startY, p.destY - p.startY, DURATION);
        }
        const px = Math.round(p.x);
        const py = Math.round(p.y);
        if (px >= 0 && px < W && py >= 0 && py < H) {
          pixels[py * W + px] = p.color;
        }
      }

      ctx.putImageData(frame, 0, 0);
      tick++;

      // Stop looping once animation is complete + a brief settle buffer
      if (t < DURATION + 30) {
        animId = requestAnimationFrame(() => draw(W, H, ctx));
      }
    }

    init();

    return () => {
      stopped = true;
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div ref={wrapRef} className="w-full max-w-5xl mx-auto mb-6">
      <canvas ref={canvasRef} className="w-full h-auto" />
    </div>
  );
}
