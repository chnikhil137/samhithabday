"use client";

import { motion } from "framer-motion";

/**
 * SupernovaFlash — Full-screen light-burst overlay that plays once and removes itself.
 * Uses mix-blend-mode: screen for cinematic bloom.
 */
export default function SupernovaFlash({
  onComplete,
}: {
  onComplete: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center pointer-events-none"
      style={{ zIndex: 100, mixBlendMode: "screen" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      onAnimationComplete={onComplete}
    >
      {/* Central burst */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "80px",
          height: "80px",
          background:
            "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(240,212,138,0.8) 30%, rgba(155,89,224,0.4) 60%, transparent 80%)",
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 8, 15], opacity: [0, 1, 0] }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      {/* Secondary ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "200px",
          height: "200px",
          background:
            "radial-gradient(circle, transparent 40%, rgba(224,86,160,0.3) 60%, rgba(108,63,181,0.2) 80%, transparent 100%)",
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 5, 12], opacity: [0, 0.8, 0] }}
        transition={{ duration: 1.4, ease: "easeOut", delay: 0.1 }}
      />

      {/* Light rays */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            width: "2px",
            height: "150px",
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.8), transparent)",
            transformOrigin: "center bottom",
            rotate: `${i * 45}deg`,
          }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: [0, 1.5, 0], opacity: [0, 0.6, 0] }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
        />
      ))}
    </motion.div>
  );
}
