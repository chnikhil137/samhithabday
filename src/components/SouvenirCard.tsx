"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import {
  generateSouvenir,
  downloadBlob,
  triggerHaptic,
} from "@/utils/SouvenirGenerator";

interface SouvenirCardProps {
  userName: string;
  photoSrc: string;
}

/**
 * SouvenirCard — The final "Magazine Cover" reveal.
 * Shows a live preview + one-tap download button.
 */
export default function SouvenirCard({ userName, photoSrc }: SouvenirCardProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    triggerHaptic([50, 30, 80, 30, 50]);
    try {
      const blob = await generateSouvenir(userName, photoSrc);
      downloadBlob(blob, `samhithas-birthday-${userName.toLowerCase().replace(/\s+/g, "-")}.png`);
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <motion.div
      className="w-full flex flex-col items-center gap-8"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Card Preview */}
      <motion.div
        className="relative w-full max-w-[320px] mx-auto"
        style={{ perspective: "1000px" }}
        initial={{ rotateY: 15, rotateX: 5 }}
        animate={{ rotateY: 0, rotateX: 0 }}
        transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
      >
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            aspectRatio: "9/16",
            boxShadow: `
              0 20px 60px rgba(0, 0, 0, 0.6),
              0 0 40px rgba(108, 63, 181, 0.2),
              0 0 80px rgba(108, 63, 181, 0.1),
              inset 0 0 0 1px rgba(255, 255, 255, 0.1)
            `,
          }}
        >
          {/* Blurred Background Layer */}
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={photoSrc}
              alt="Birthday memory background"
              fill
              className="object-cover"
              sizes="320px"
              style={{ filter: "blur(20px) brightness(0.6) saturate(1.8)", transform: "scale(1.2)" }}
            />
          </div>

          {/* Uncropped Foreground Image */}
          <div className="absolute inset-0">
            <Image
              src={photoSrc}
              alt="Birthday memory"
              fill
              className="object-contain"
              sizes="320px"
              style={{ filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.6))" }}
              priority
            />
          </div>

          {/* Color grade overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(
                to bottom,
                rgba(10, 10, 18, 0.5) 0%,
                rgba(10, 10, 18, 0) 25%,
                rgba(10, 10, 18, 0) 45%,
                rgba(10, 10, 18, 0.4) 65%,
                rgba(10, 10, 18, 0.85) 100%
              )`,
              mixBlendMode: "normal",
            }}
          />

          {/* Top branding */}
          <div className="absolute top-0 left-0 right-0 pt-6 text-center">
            <motion.p
              className="text-[10px] tracking-[0.3em] uppercase"
              style={{
                fontFamily: "var(--font-ui)",
                fontWeight: 300,
                color: "rgba(240, 212, 138, 0.7)",
                textShadow: "0 0 10px rgba(240, 212, 138, 0.3)",
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              ★ Samhitha&apos;s Birthday ★
            </motion.p>
            <motion.p
              className="text-[8px] tracking-[0.4em] uppercase mt-1"
              style={{
                fontFamily: "var(--font-ui)",
                fontWeight: 200,
                color: "rgba(240, 212, 138, 0.4)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
            >
              2 0 2 6
            </motion.p>
          </div>

          {/* Decorative border */}
          <div
            className="absolute inset-3 rounded-lg pointer-events-none"
            style={{
              border: "1px solid rgba(240, 212, 138, 0.15)",
            }}
          />

          {/* Guest name & Message */}
          <div className="absolute bottom-0 left-0 right-0 pb-6 px-4 text-center">
            <motion.h2
              className="text-4xl font-semibold tracking-wide"
              style={{
                fontFamily: "var(--font-header)",
                color: "#ffffff",
                textShadow:
                  "0 0 35px rgba(108, 63, 181, 0.6), 0 4px 6px rgba(0,0,0,0.6)",
                lineHeight: "1",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              {userName.toUpperCase()}
            </motion.h2>
            <motion.p
              className="text-sm italic mt-1"
              style={{
                fontFamily: "var(--font-header)",
                fontWeight: 400,
                color: "rgba(232, 168, 124, 0.9)",
                textShadow: "0 0 10px rgba(232, 168, 124, 0.4)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              — With all my love —
            </motion.p>

            {/* Separator */}
            <motion.div
              className="mx-auto mt-2 mb-2"
              style={{
                width: "40%",
                height: "1px",
                background: "rgba(240, 212, 138, 0.4)",
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.3, duration: 0.8 }}
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="flex flex-col gap-0.5"
            >
              <p
                className="text-[9px]"
                style={{
                  fontFamily: "var(--font-ui)",
                  fontWeight: 300,
                  color: "rgba(255, 255, 255, 0.85)",
                  textShadow: "0 1px 3px rgba(0,0,0,0.8)",
                }}
              >
                Thank you so much for coming to my birthday and
              </p>
              <p
                className="text-[9px] mb-1"
                style={{
                  fontFamily: "var(--font-ui)",
                  fontWeight: 300,
                  color: "rgba(255, 255, 255, 0.85)",
                  textShadow: "0 1px 3px rgba(0,0,0,0.8)",
                }}
              >
                making it so incredibly special. You mean the world to me!
              </p>
              <p
                className="text-xs italic"
                style={{
                  fontFamily: "var(--font-header)",
                  fontWeight: 400,
                  color: "rgba(240, 212, 138, 0.9)",
                  textShadow: "0 1px 3px rgba(0,0,0,0.8)",
                }}
              >
                Yours truly, Samhitha
              </p>
            </motion.div>
          </div>

          {/* Film grain overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              opacity: 0.04,
              mixBlendMode: "overlay",
            }}
          />
        </div>
      </motion.div>

      {/* Download Button */}
      <motion.button
        id="download-memory-btn"
        className="celestial-btn"
        onClick={handleDownload}
        disabled={downloading}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        whileTap={{ scale: 0.95 }}
      >
        {downloading ? (
          <span className="flex items-center gap-3">
            <motion.span
              className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            Creating Memory...
          </span>
        ) : (
          "✦ Download Memory ✦"
        )}
      </motion.button>

      {/* Generate another */}
      <motion.p
        className="text-xs tracking-widest uppercase cursor-pointer hover:text-white/70 transition-colors"
        style={{
          fontFamily: "var(--font-ui)",
          fontWeight: 200,
          color: "rgba(155, 89, 224, 0.5)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        onClick={() => window.location.reload()}
      >
        Create Another Souvenir →
      </motion.p>
    </motion.div>
  );
}
