"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { triggerHaptic } from "@/utils/SouvenirGenerator";

/* ── Lazy-load heavy components for perf ── */
const NebulaBackground = dynamic(() => import("@/components/NebulaBackground"), {
  ssr: false,
});
const GoldenDust = dynamic(() => import("@/components/GoldenDust"), {
  ssr: false,
});
const FloatingPolaroids = dynamic(
  () => import("@/components/FloatingPolaroids"),
  { ssr: false }
);
const SupernovaFlash = dynamic(() => import("@/components/SupernovaFlash"), {
  ssr: false,
});
const SouvenirCard = dynamic(() => import("@/components/SouvenirCard"), {
  ssr: false,
});

/* ── Birthday photos for souvenir ── */
const PHOTOS = [
  "/assets/birthday/samhitha-1.jpeg",
  "/assets/birthday/samhitha-2.jpeg",
  "/assets/birthday/samhitha-3.jpeg",
];

/* ── App Phases ── */
type Phase = "awakening" | "input" | "supernova" | "reveal";

/* ── Letter stagger animations ── */
const letterVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.04,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

export default function CelestialSouvenirPage() {
  const [phase, setPhase] = useState<Phase>("awakening");
  const [userName, setUserName] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [showSupernova, setShowSupernova] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  /* ── Auto-advance from awakening after cinematic intro ── */
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase("input");
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  /* ── Focus input when entering input phase ── */
  useEffect(() => {
    if (phase === "input") {
      setTimeout(() => inputRef.current?.focus(), 800);
    }
  }, [phase]);

  /* ── Handle souvenir generation ── */
  const handleGenerate = useCallback(() => {
    if (!userName.trim()) return;
    triggerHaptic([30, 20, 60]);

    // Retain the user's manual photo selection (do not cycle)


    setShowSupernova(true);
    setPhase("supernova");
  }, [userName]);

  const handleSupernovaComplete = useCallback(() => {
    setShowSupernova(false);
    setPhase("reveal");
    triggerHaptic([50, 30, 80, 30, 50]);
  }, []);

  /* ── Keyboard handler ── */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && userName.trim()) {
      handleGenerate();
    }
  };

  return (
    <main className="relative min-h-dvh w-full flex flex-col items-center justify-center overflow-hidden">
      {/* ═══════════════════════════════════════════════
          LAYER 0: Nebula Background
          ═══════════════════════════════════════════════ */}
      <NebulaBackground />

      {/* ═══════════════════════════════════════════════
          LAYER 1: Floating Polaroids (visible in awakening + input)
          ═══════════════════════════════════════════════ */}
      <AnimatePresence>
        {(phase === "awakening" || phase === "input") && (
          <motion.div
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <FloatingPolaroids />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════
          LAYER 2: Golden Dust Particles
          ═══════════════════════════════════════════════ */}
      <GoldenDust />

      {/* ═══════════════════════════════════════════════
          LAYER 3: Supernova Flash
          ═══════════════════════════════════════════════ */}
      <AnimatePresence>
        {showSupernova && (
          <SupernovaFlash onComplete={handleSupernovaComplete} />
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════
          CONTENT LAYER
          ═══════════════════════════════════════════════ */}
      <div
        className="relative z-10 w-full max-w-lg mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-dvh"
      >
        <AnimatePresence mode="wait">
          {/* ─────────────────────────────────────────
              PHASE 1: The Awakening
              ───────────────────────────────────────── */}
          {phase === "awakening" && (
            <motion.div
              key="awakening"
              className="flex flex-col items-center gap-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            >
              {/* Star ornament */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="text-4xl mb-2"
                style={{
                  color: "var(--color-golden-dust)",
                  textShadow: "0 0 30px rgba(240, 212, 138, 0.5)",
                }}
              >
                ✦
              </motion.div>

              <motion.h1
                className="text-5xl md:text-7xl font-semibold tracking-wide"
                style={{
                  fontFamily: "var(--font-header)",
                  background:
                    "linear-gradient(135deg, #f0d48a 0%, #e8a87c 40%, #e056a0 70%, #9b59e0 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 25px rgba(108, 63, 181, 0.3))",
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 1.2 }}
              >
                Samhitha
              </motion.h1>

              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <div
                  className="h-px w-12"
                  style={{ background: "rgba(240, 212, 138, 0.3)" }}
                />
                <p
                  className="text-xs tracking-[0.35em] uppercase"
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontWeight: 200,
                    color: "rgba(240, 212, 138, 0.6)",
                  }}
                >
                  Birthday Celebration
                </p>
                <div
                  className="h-px w-12"
                  style={{ background: "rgba(240, 212, 138, 0.3)" }}
                />
              </motion.div>

              {/* Loading shimmer */}
              <motion.div
                className="mt-8 flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.5, 0.3] }}
                transition={{
                  delay: 1.5,
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "rgba(155, 89, 224, 0.6)" }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                      duration: 1.2,
                      delay: i * 0.2,
                      repeat: Infinity,
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────
              PHASE 2: The Name Alchemy
              ───────────────────────────────────────── */}
          {phase === "input" && (
            <motion.div
              key="input"
              className="flex flex-col items-center gap-8 w-full text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Star */}
              <motion.div
                className="text-2xl"
                style={{
                  color: "var(--color-golden-dust)",
                  textShadow: "0 0 20px rgba(240, 212, 138, 0.4)",
                }}
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                }}
              >
                ✦
              </motion.div>

              {/* Heading */}
              <div>
                <motion.h2
                  className="text-3xl md:text-4xl font-light tracking-wide mb-3"
                  style={{
                    fontFamily: "var(--font-header)",
                    color: "var(--color-celestial-white)",
                  }}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  Welcome, Dear Guest
                </motion.h2>
                <motion.p
                  className="text-sm italic"
                  style={{
                    fontFamily: "var(--font-header)",
                    fontWeight: 300,
                    color: "rgba(232, 168, 124, 0.7)",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  What is your name, honored guest?
                </motion.p>
              </div>

              {/* Glass card with input */}
              <motion.div
                className="glass-panel w-full p-8 flex flex-col items-center gap-6"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <input
                  ref={inputRef}
                  id="guest-name-input"
                  type="text"
                  className="celestial-input"
                  placeholder="Enter your name..."
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  maxLength={24}
                  autoComplete="off"
                  autoCapitalize="words"
                />

                {/* Shimmering name preview */}
                <AnimatePresence>
                  {userName.length > 0 && (
                    <motion.div
                      className="flex items-center justify-center flex-wrap gap-0.5 mt-2 min-h-[40px]"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      {userName.split("").map((letter, i) => (
                        <motion.span
                          key={`${i}-${letter}`}
                          className="text-2xl md:text-3xl font-semibold"
                          style={{
                            fontFamily: "var(--font-header)",
                            background:
                              "linear-gradient(90deg, #f0d48a, #e8a87c, #e056a0, #9b59e0, #f0d48a)",
                            backgroundSize: "200% auto",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                            animation: "shimmer 3s linear infinite",
                            display: "inline-block",
                          }}
                          variants={letterVariants}
                          initial="hidden"
                          animate="visible"
                          custom={i}
                        >
                          {letter === " " ? "\u00A0" : letter}
                        </motion.span>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Photo selector */}
                <div className="flex gap-3 mt-2">
                  {PHOTOS.map((photo, i) => (
                    <motion.button
                      key={photo}
                      className="relative w-14 h-14 rounded-xl overflow-hidden cursor-pointer"
                      style={{
                        border:
                          selectedPhoto === i
                            ? "2px solid rgba(155, 89, 224, 0.7)"
                            : "2px solid rgba(255, 255, 255, 0.1)",
                        boxShadow:
                          selectedPhoto === i
                            ? "0 0 20px rgba(155, 89, 224, 0.3)"
                            : "none",
                        transition: "all 0.3s ease",
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedPhoto(i)}
                      aria-label={`Select photo ${i + 1}`}
                    >
                      <img
                        src={photo}
                        alt={`Template ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {selectedPhoto === i && (
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          style={{
                            background: "rgba(108, 63, 181, 0.3)",
                          }}
                          layoutId="photo-selected"
                        >
                          <span className="text-white text-xs">✓</span>
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>

                <p
                  className="text-[10px] tracking-widest uppercase"
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontWeight: 200,
                    color: "rgba(155, 89, 224, 0.4)",
                  }}
                >
                  Choose your backdrop
                </p>
              </motion.div>

              {/* Generate CTA */}
              <motion.button
                id="generate-souvenir-btn"
                className="celestial-btn"
                onClick={handleGenerate}
                disabled={!userName.trim()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                ✦ Generate My Souvenir ✦
              </motion.button>

              {/* Subtle hint */}
              <motion.p
                className="text-[10px] tracking-wider"
                style={{
                  fontFamily: "var(--font-ui)",
                  fontWeight: 200,
                  color: "rgba(155, 89, 224, 0.3)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
              >
                Your personalized memory awaits
              </motion.p>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────
              PHASE 3–4: The Supernova Reveal
              ───────────────────────────────────────── */}
          {phase === "reveal" && (
            <motion.div
              key="reveal"
              className="flex flex-col items-center gap-6 w-full text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {/* Title */}
              <motion.div
                className="mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <p
                  className="text-xs tracking-[0.35em] uppercase mb-2"
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontWeight: 200,
                    color: "rgba(240, 212, 138, 0.6)",
                    textShadow: "0 0 10px rgba(240, 212, 138, 0.2)",
                  }}
                >
                  ✦ Your Celestial Souvenir ✦
                </p>
                <h2
                  className="text-2xl md:text-3xl font-light"
                  style={{
                    fontFamily: "var(--font-header)",
                    color: "var(--color-celestial-white)",
                  }}
                >
                  A Memory, Forged in Stars
                </h2>
              </motion.div>

              <SouvenirCard
                userName={userName}
                photoSrc={PHOTOS[selectedPhoto]}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══════════════════════════════════════════════
          FIXED: Bottom attribution
          ═══════════════════════════════════════════════ */}
      <motion.footer
        className="fixed bottom-0 left-0 right-0 text-center pb-4 pointer-events-none"
        style={{ zIndex: 5 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <p
          className="text-[9px] tracking-[0.3em] uppercase"
          style={{
            fontFamily: "var(--font-ui)",
            fontWeight: 200,
            color: "rgba(155, 89, 224, 0.25)",
          }}
        >
          A Celestial Experience
        </p>
      </motion.footer>
    </main>
  );
}
