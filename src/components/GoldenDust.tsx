"use client";

import { useEffect, useState } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { initParticlesEngine } from "@tsparticles/react";

/**
 * GoldenDust — Touch-reactive golden particle field.
 * Uses initParticlesEngine (v3 API) for proper initialization.
 */
export default function GoldenDust() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));
  }, []);

  if (!ready) return null;

  return (
    <Particles
      id="golden-dust"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 2 }}
      options={{
        fullScreen: false,
        fpsLimit: 60,
        particles: {
          number: {
            value: 50,
            density: { enable: true, width: 800, height: 800 },
          },
          color: {
            value: ["#f0d48a", "#e8a87c", "#f5cba7", "#d4a574", "#ffecd2"],
          },
          shape: { type: "circle" },
          opacity: {
            value: { min: 0.15, max: 0.6 },
            animation: {
              enable: true,
              speed: 0.8,
              sync: false,
            },
          },
          size: {
            value: { min: 1, max: 3.5 },
            animation: {
              enable: true,
              speed: 1.5,
              sync: false,
            },
          },
          move: {
            enable: true,
            speed: { min: 0.2, max: 0.8 },
            direction: "none" as const,
            random: true,
            straight: false,
            outModes: { default: "out" as const },
            drift: 0.5,
          },
          wobble: {
            enable: true,
            distance: 10,
            speed: 3,
          },
          shadow: {
            enable: true,
            color: "#f0d48a",
            blur: 8,
          },
        },
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "repulse",
            },
            onClick: {
              enable: true,
              mode: "push",
            },
          },
          modes: {
            repulse: {
              distance: 80,
              speed: 0.5,
            },
            push: {
              quantity: 4,
            },
          },
        },
        detectRetina: true,
      }}
    />
  );
}
