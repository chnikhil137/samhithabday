"use client";

import { useEffect, useRef } from "react";

/**
 * NebulaBackground — A GPU-accelerated iridescent nebula rendered on Canvas.
 * Shifts colors based on time, creating a "liquid silk" living backdrop.
 */
export default function NebulaBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    resize();
    window.addEventListener("resize", resize);

    // Track pointer for interactive glow
    const onPointer = (e: PointerEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0]?.clientX ?? 0 : (e as PointerEvent).clientX;
      const clientY = "touches" in e ? e.touches[0]?.clientY ?? 0 : (e as PointerEvent).clientY;
      mouseRef.current = { x: clientX / width, y: clientY / height };
    };
    window.addEventListener("pointermove", onPointer);
    window.addEventListener("touchmove", onPointer as EventListener);

    // Use device orientation if available
    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        mouseRef.current = {
          x: 0.5 + (e.gamma / 90) * 0.5,
          y: 0.5 + ((e.beta - 45) / 90) * 0.5,
        };
      }
    };
    window.addEventListener("deviceorientation", onOrientation);

    const draw = (time: number) => {
      const t = time * 0.0003;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Deep void base
      ctx.fillStyle = "#0a0a12";
      ctx.fillRect(0, 0, width, height);

      // Nebula orbs — soft radial gradients that drift
      const orbs = [
        {
          x: width * (0.3 + 0.15 * Math.sin(t * 0.7) + mx * 0.1),
          y: height * (0.3 + 0.1 * Math.cos(t * 0.5) + my * 0.1),
          r: Math.min(width, height) * 0.5,
          colors: [`rgba(108, 63, 181, ${0.12 + 0.04 * Math.sin(t)})`, "transparent"],
        },
        {
          x: width * (0.7 + 0.1 * Math.cos(t * 0.6)),
          y: height * (0.6 + 0.15 * Math.sin(t * 0.8)),
          r: Math.min(width, height) * 0.45,
          colors: [`rgba(224, 86, 160, ${0.09 + 0.03 * Math.cos(t * 1.2)})`, "transparent"],
        },
        {
          x: width * (0.5 + 0.2 * Math.sin(t * 0.4 + 1)),
          y: height * (0.4 + 0.12 * Math.cos(t * 0.9 + 2)),
          r: Math.min(width, height) * 0.55,
          colors: [`rgba(155, 89, 224, ${0.08 + 0.03 * Math.sin(t * 0.7)})`, "transparent"],
        },
        {
          x: width * (0.2 + 0.1 * Math.cos(t * 0.3)),
          y: height * (0.8 + 0.08 * Math.sin(t * 0.6)),
          r: Math.min(width, height) * 0.35,
          colors: [`rgba(232, 168, 124, ${0.07 + 0.02 * Math.sin(t * 1.1)})`, "transparent"],
        },
        {
          x: width * (0.8 + 0.12 * Math.sin(t * 0.5 + 3)),
          y: height * (0.15 + 0.1 * Math.cos(t * 0.7 + 1)),
          r: Math.min(width, height) * 0.4,
          colors: [`rgba(240, 212, 138, ${0.05 + 0.02 * Math.cos(t * 0.9)})`, "transparent"],
        },
      ];

      for (const orb of orbs) {
        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
        grad.addColorStop(0, orb.colors[0]);
        grad.addColorStop(1, orb.colors[1]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      // Interactive glow — follows pointer/gyro
      const igx = mx * width;
      const igy = my * height;
      const igr = Math.min(width, height) * 0.3;
      const igGrad = ctx.createRadialGradient(igx, igy, 0, igx, igy, igr);
      igGrad.addColorStop(0, "rgba(155, 89, 224, 0.06)");
      igGrad.addColorStop(0.5, "rgba(108, 63, 181, 0.03)");
      igGrad.addColorStop(1, "transparent");
      ctx.fillStyle = igGrad;
      ctx.fillRect(0, 0, width, height);

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("touchmove", onPointer as EventListener);
      window.removeEventListener("deviceorientation", onOrientation);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
