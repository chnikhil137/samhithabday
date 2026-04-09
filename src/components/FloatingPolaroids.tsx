"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const PHOTOS = [
  { src: "/assets/birthday/samhitha-1.jpeg", alt: "Samhitha photo 1" },
  { src: "/assets/birthday/samhitha-2.jpeg", alt: "Samhitha photo 2" },
  { src: "/assets/birthday/samhitha-3.jpeg", alt: "Samhitha photo 3" },
];

/**
 * Each polaroid has unique drift parameters for organic floating movement.
 */
const POLAROID_CONFIGS = [
  {
    initialX: "-12vw",
    initialY: "5vh",
    rotate: -8,
    duration: 14,
    delay: 0,
    scale: 0.85,
    driftKeyframes: {
      x: ["-12vw", "-8vw", "-15vw", "-10vw", "-12vw"],
      y: ["5vh", "-3vh", "-8vh", "2vh", "5vh"],
      rotate: [-8, -3, -10, -5, -8],
    },
  },
  {
    initialX: "10vw",
    initialY: "-8vh",
    rotate: 6,
    duration: 18,
    delay: 2,
    scale: 0.78,
    driftKeyframes: {
      x: ["10vw", "15vw", "8vw", "14vw", "10vw"],
      y: ["-8vh", "-15vh", "-5vh", "-12vh", "-8vh"],
      rotate: [6, 10, 3, 8, 6],
    },
  },
  {
    initialX: "-5vw",
    initialY: "-20vh",
    rotate: 4,
    duration: 16,
    delay: 4,
    scale: 0.7,
    driftKeyframes: {
      x: ["-5vw", "0vw", "-8vw", "-2vw", "-5vw"],
      y: ["-20vh", "-28vh", "-18vh", "-25vh", "-20vh"],
      rotate: [4, 8, 1, 6, 4],
    },
  },
];

export default function FloatingPolaroids() {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center pointer-events-none"
      style={{ zIndex: 1, perspective: "1200px" }}
      aria-hidden="true"
    >
      {PHOTOS.map((photo, i) => {
        const config = POLAROID_CONFIGS[i];
        return (
          <motion.div
            key={photo.src}
            className="absolute polaroid"
            style={{
              width: "clamp(120px, 30vw, 180px)",
              transformStyle: "preserve-3d",
            }}
            initial={{
              opacity: 0,
              x: config.initialX,
              y: config.initialY,
              rotate: config.rotate,
              scale: 0.5,
            }}
            animate={{
              opacity: [0, 0.75, 0.75, 0.75, 0.75],
              x: config.driftKeyframes.x,
              y: config.driftKeyframes.y,
              rotate: config.driftKeyframes.rotate,
              scale: config.scale,
            }}
            transition={{
              delay: config.delay,
              duration: config.duration,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
              opacity: { delay: config.delay, duration: 2 },
            }}
          >
            <div className="relative w-full aspect-[3/4] overflow-hidden rounded-[2px]">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="180px"
                className="object-cover"
                priority={i === 0}
              />
            </div>
            <div
              className="text-center mt-1 text-[10px] tracking-[0.15em] uppercase"
              style={{
                color: "rgba(80, 60, 100, 0.5)",
                fontFamily: "var(--font-ui)",
                fontWeight: 300,
              }}
            >
              ★ memory
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
