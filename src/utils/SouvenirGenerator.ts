/**
 * SouvenirGenerator — High-resolution Canvas compositing engine.
 *
 * Composes a "Magazine Cover" souvenir card:
 *   1. Birthday girl photo as hero background (full bleed)
 *   2. Post-production filters (vignette + film grain)
 *   3. Guest name in premium editorial typography
 *   4. Event branding overlay
 *
 * Renders at 3x DPR for print-quality output.
 */

const CANVAS_W = 1080;
const CANVAS_H = 1920;
const DPR = 3;
const FINAL_W = CANVAS_W * DPR;
const FINAL_H = CANVAS_H * DPR;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Draw text with a subtle shadow for depth.
 */
function drawTextWithShadow(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  opts: {
    font: string;
    color: string;
    shadowColor?: string;
    shadowBlur?: number;
    align?: CanvasTextAlign;
    maxWidth?: number;
  }
) {
  ctx.save();
  ctx.font = opts.font;
  ctx.fillStyle = opts.color;
  ctx.textAlign = opts.align || "center";
  ctx.textBaseline = "middle";

  if (opts.shadowColor) {
    ctx.shadowColor = opts.shadowColor;
    ctx.shadowBlur = opts.shadowBlur || 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;
  }

  if (opts.maxWidth) {
    ctx.fillText(text, x, y, opts.maxWidth);
  } else {
    ctx.fillText(text, x, y);
  }
  ctx.restore();
}

/**
 * Apply cinematic vignette.
 */
function applyVignette(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const centerX = w / 2;
  const centerY = h / 2;
  const radius = Math.max(w, h) * 0.55;
  const grad = ctx.createRadialGradient(centerX, centerY, radius * 0.3, centerX, centerY, radius);
  grad.addColorStop(0, "rgba(0,0,0,0)");
  grad.addColorStop(0.6, "rgba(0,0,0,0.1)");
  grad.addColorStop(1, "rgba(0,0,0,0.55)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

/**
 * Apply subtle film grain.
 */
function applyGrain(ctx: CanvasRenderingContext2D, w: number, h: number, intensity = 18) {
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * intensity;
    data[i] += noise;
    data[i + 1] += noise;
    data[i + 2] += noise;
  }
  ctx.putImageData(imageData, 0, 0);
}

/**
 * Draw decorative borders and glows.
 */
function drawFrame(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const inset = w * 0.06;

  // Outer decorative line
  ctx.strokeStyle = "rgba(240, 212, 138, 0.25)";
  ctx.lineWidth = 2;
  ctx.strokeRect(inset, inset, w - inset * 2, h - inset * 2);

  // Inner decorative line
  const innerInset = inset + w * 0.015;
  ctx.strokeStyle = "rgba(240, 212, 138, 0.12)";
  ctx.lineWidth = 1;
  ctx.strokeRect(innerInset, innerInset, w - innerInset * 2, h - innerInset * 2);

  // Corner accents
  const cornerSize = w * 0.06;
  const corners = [
    { x: inset, y: inset },
    { x: w - inset, y: inset },
    { x: inset, y: h - inset },
    { x: w - inset, y: h - inset },
  ];

  ctx.strokeStyle = "rgba(240, 212, 138, 0.4)";
  ctx.lineWidth = 2.5;

  corners.forEach(({ x, y }, i) => {
    ctx.beginPath();
    const dx = i % 2 === 0 ? 1 : -1;
    const dy = i < 2 ? 1 : -1;
    ctx.moveTo(x + cornerSize * dx, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y + cornerSize * dy);
    ctx.stroke();
  });
}

export async function generateSouvenir(
  userName: string,
  photoSrc: string
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = FINAL_W;
  canvas.height = FINAL_H;
  const ctx = canvas.getContext("2d")!;

  // Scale for DPR
  ctx.scale(DPR, DPR);
  const w = CANVAS_W;
  const h = CANVAS_H;

  // 1a. Background Fill (blurred & darkened) to prevent letterboxing
  const photo = await loadImage(photoSrc);
  const imgRatio = photo.width / photo.height;
  const canvasRatio = w / h;
  let bgW: number, bgH: number, bgX: number, bgY: number;

  if (imgRatio > canvasRatio) {
    bgH = h;
    bgW = h * imgRatio;
    bgX = (w - bgW) / 2;
    bgY = 0;
  } else {
    bgW = w;
    bgH = w / imgRatio;
    bgX = 0;
    bgY = (h - bgH) / 2;
  }
  
  ctx.save();
  ctx.filter = "blur(40px) brightness(0.6) saturate(1.8)";
  ctx.drawImage(photo, bgX, bgY, bgW, bgH);
  ctx.restore();

  // 1b. Foreground Image (contained to avoid cropping)
  let fgW: number, fgH: number, fgX: number, fgY: number;
  if (imgRatio > canvasRatio) {
    fgW = w;
    fgH = w / imgRatio;
    fgX = 0;
    fgY = (h - fgH) / 2;
  } else {
    fgH = h;
    fgW = h * imgRatio;
    fgX = (w - fgW) / 2;
    fgY = 0;
  }
  
  // Soft drop shadow for the uncropped image
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
  ctx.shadowBlur = 60;
  ctx.shadowOffsetY = 20;
  ctx.drawImage(photo, fgX, fgY, fgW, fgH);
  ctx.restore();

  // 2. Color grade — warm-purple tint overlay
  ctx.save();
  ctx.globalCompositeOperation = "overlay";
  const tintGrad = ctx.createLinearGradient(0, 0, 0, h);
  tintGrad.addColorStop(0, "rgba(108, 63, 181, 0.15)");
  tintGrad.addColorStop(0.5, "rgba(224, 86, 160, 0.08)");
  tintGrad.addColorStop(1, "rgba(232, 168, 124, 0.12)");
  ctx.fillStyle = tintGrad;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();

  // 3. Bottom gradient for text readability
  ctx.save();
  const bottomGrad = ctx.createLinearGradient(0, h * 0.45, 0, h);
  bottomGrad.addColorStop(0, "rgba(10, 10, 18, 0)");
  bottomGrad.addColorStop(0.3, "rgba(10, 10, 18, 0.3)");
  bottomGrad.addColorStop(0.6, "rgba(10, 10, 18, 0.65)");
  bottomGrad.addColorStop(1, "rgba(10, 10, 18, 0.9)");
  ctx.fillStyle = bottomGrad;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();

  // 4. Top gradient
  ctx.save();
  const topGrad = ctx.createLinearGradient(0, 0, 0, h * 0.3);
  topGrad.addColorStop(0, "rgba(10, 10, 18, 0.6)");
  topGrad.addColorStop(1, "rgba(10, 10, 18, 0)");
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();

  // 5. Decorative frame
  drawFrame(ctx, w, h);

  // 6. Top branding — "SAMHITHA'S"
  drawTextWithShadow(ctx, "★  S A M H I T H A ' S  ★", w / 2, h * 0.08, {
    font: `300 ${w * 0.035}px Inter, sans-serif`,
    color: "rgba(240, 212, 138, 0.8)",
    shadowColor: "rgba(240, 212, 138, 0.3)",
    shadowBlur: 15,
  });

  // Event line
  drawTextWithShadow(ctx, "BIRTHDAY CELEBRATION", w / 2, h * 0.11, {
    font: `200 ${w * 0.022}px Inter, sans-serif`,
    color: "rgba(240, 212, 138, 0.5)",
  });

  // 7. Year badge
  drawTextWithShadow(ctx, "2 0 2 6", w / 2, h * 0.135, {
    font: `600 ${w * 0.018}px Inter, sans-serif`,
    color: "rgba(240, 212, 138, 0.4)",
  });

  // 8. Guest name — large editorial serif
  const nameFontSize = userName.length > 12 ? w * 0.1 : w * 0.13;
  drawTextWithShadow(ctx, userName.toUpperCase(), w / 2, h * 0.77, {
    font: `600 ${nameFontSize}px "Cormorant Garamond", Georgia, serif`,
    color: "#ffffff",
    shadowColor: "rgba(108, 63, 181, 0.6)",
    shadowBlur: 35,
    maxWidth: w * 0.9,
  });

  // "Dearest [Name]" subtitle instead of guest
  drawTextWithShadow(ctx, "— With all my love —", w / 2, h * 0.83, {
    font: `italic 400 ${w * 0.035}px "Cormorant Garamond", Georgia, serif`,
    color: "rgba(232, 168, 124, 0.9)",
    shadowColor: "rgba(232, 168, 124, 0.4)",
    shadowBlur: 15,
  });

  // Separator line
  ctx.save();
  ctx.strokeStyle = "rgba(240, 212, 138, 0.4)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(w * 0.35, h * 0.86);
  ctx.lineTo(w * 0.65, h * 0.86);
  ctx.stroke();
  ctx.restore();

  // Bottom message from birthday girl
  drawTextWithShadow(ctx, "Thank you so much for coming to my birthday and", w / 2, h * 0.89, {
    font: `300 ${w * 0.026}px "Inter", sans-serif`,
    color: "rgba(255, 255, 255, 0.85)",
    shadowBlur: 10,
    shadowColor: "rgba(0,0,0,0.5)"
  });
  
  drawTextWithShadow(ctx, "making it so incredibly special. You mean the world to me!", w / 2, h * 0.915, {
    font: `300 ${w * 0.026}px "Inter", sans-serif`,
    color: "rgba(255, 255, 255, 0.85)",
    shadowBlur: 10,
    shadowColor: "rgba(0,0,0,0.5)"
  });

  drawTextWithShadow(ctx, "Yours truly, Samhitha", w / 2, h * 0.95, {
    font: `italic 400 ${w * 0.03}px "Cormorant Garamond", Georgia, serif`,
    color: "rgba(240, 212, 138, 0.9)",
    shadowBlur: 10,
  });

  // Tiny footer
  drawTextWithShadow(ctx, "✦ A CELESTIAL SOUVENIR ✦", w / 2, h * 0.98, {
    font: `400 ${w * 0.016}px Inter, sans-serif`,
    color: "rgba(240, 212, 138, 0.4)",
  });

  // 9. Post-production: vignette + grain
  applyVignette(ctx, w, h);
  applyGrain(ctx, w, h, 12);

  // Export as PNG blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas toBlob failed"))),
      "image/png",
      1.0
    );
  });
}

/**
 * Trigger a browser file download from a Blob.
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Trigger haptic pulse if supported.
 */
export function triggerHaptic(pattern: number[] = [50, 30, 80]) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}
