"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { ChevronDown, Sparkles, Compass } from "lucide-react";

interface CinematicOpeningProps {
  recipientName: string;
  introQuote: string;
  introTitle: string;
  heroImageUrl: string;
  onEnter: () => void;
}

export default function CinematicOpening({
  recipientName,
  introQuote,
  introTitle,
  heroImageUrl,
  onEnter,
}: CinematicOpeningProps) {
  const [phase, setPhase] = useState<"initial" | "revealing" | "transitioning" | "entered">("initial");

  const handleEnterClick = () => {
    setPhase("revealing");

    // Launch bespoke champagne gold and rose stardust burst
    try {
      confetti({
        particleCount: 65,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#D6B779", "#E8CF9A", "#F5F0E8", "#B98E96", "#FFDF9E"],
        disableForReducedMotion: true,
      });

      // Secondary delayed star spray
      setTimeout(() => {
        confetti({
          particleCount: 35,
          angle: 60,
          spread: 55,
          origin: { x: 0.2, y: 0.7 },
          colors: ["#D6B779", "#F5F0E8"],
        });
        confetti({
          particleCount: 35,
          angle: 120,
          spread: 55,
          origin: { x: 0.8, y: 0.7 },
          colors: ["#D6B779", "#F5F0E8"],
        });
      }, 500);
    } catch {
      // ignore
    }

    // Sequence to curtain lift
    setTimeout(() => {
      setPhase("transitioning");
      setTimeout(() => {
        setPhase("entered");
        onEnter();
      }, 1000);
    }, 3200);
  };

  const handleSkip = () => {
    setPhase("entered");
    onEnter();
  };

  if (phase === "entered") {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-auto select-none">
      {/* Top and Bottom Theatrical Cinematic Shutter Curtains */}
      <motion.div
        initial={{ y: 0 }}
        animate={
          phase === "transitioning"
            ? { y: "-100%", transition: { duration: 1, ease: [0.76, 0, 0.24, 1] } }
            : { y: 0 }
        }
        className="absolute top-0 inset-x-0 h-1/2 bg-[#0B0B0D] z-30 pointer-events-none"
      />
      <motion.div
        initial={{ y: 0 }}
        animate={
          phase === "transitioning"
            ? { y: "100%", transition: { duration: 1, ease: [0.76, 0, 0.24, 1] } }
            : { y: 0 }
        }
        className="absolute bottom-0 inset-x-0 h-1/2 bg-[#0B0B0D] z-30 pointer-events-none"
      />

      {/* Main Viewport Content */}
      <div className="relative w-full h-full flex items-center justify-center bg-[#0B0B0D] z-20">
        {/* Ambient Starlight & Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#D6B779]/08 via-[#151519]/60 to-[#0B0B0D] pointer-events-none" />

        {/* Subtle Horizon Line */}
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D6B779]/20 to-transparent pointer-events-none" />

        {/* Skip Button */}
        <button
          onClick={handleSkip}
          className="absolute top-8 right-8 z-40 text-[11px] tracking-[0.2em] uppercase text-[#A3A3A8]/60 hover:text-[#D6B779] transition-colors py-1.5 px-4 rounded-full border border-white/5 hover:border-[#D6B779]/30 backdrop-blur-sm"
        >
          Skip Intro
        </button>

        {/* PHASE 1: THE INVITATION */}
        {phase === "initial" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
            transition={{ duration: 1 }}
            className="relative z-10 max-w-4xl px-6 text-center flex flex-col items-center"
          >
            {/* Prologue Stamp */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-[#151519]/80 border border-[#D6B779]/20 text-[10px] tracking-[0.3em] uppercase text-[#D6B779] mb-8 font-mono"
            >
              <Compass className="w-3 h-3 text-[#D6B779]" />
              <span>ACT I • PROLOGUE</span>
            </motion.div>

            {/* Introductory Understated Quote */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1.2 }}
              className="font-serif italic text-base sm:text-xl md:text-2xl text-[#E8CF9A]/90 font-light max-w-xl leading-relaxed mb-8"
            >
              &ldquo;{introQuote || "For someone who makes ordinary moments extraordinary."}&rdquo;
            </motion.p>

            {/* Monumental Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 1.4 }}
              className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight text-[#F5F0E8] font-normal leading-[1.02] mb-12"
            >
              {introTitle || "A Story Called You."}
            </motion.h1>

            {/* Interactive Invitation Button */}
            <motion.button
              onClick={handleEnterClick}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 1 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              className="group relative inline-flex items-center gap-4 px-10 py-4 rounded-full bg-[#151519] border border-[#D6B779]/40 text-[#F5F0E8] text-xs uppercase tracking-[0.25em] font-light shadow-2xl shadow-[#D6B779]/15 hover:border-[#D6B779] hover:shadow-[#D6B779]/30 transition-all duration-500 overflow-hidden cursor-pointer"
            >
              {/* Gold light sweep on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D6B779]/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

              <Sparkles className="w-4 h-4 text-[#D6B779] transition-transform duration-500 group-hover:rotate-45" />
              <span>Enter Your Little Universe</span>
            </motion.button>

            {/* Ambient Breathing Cue */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 2, duration: 1 }}
              className="mt-16 flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#A3A3A8]"
            >
              <span>A CINEMATIC GIFT FOR A SPECIAL PERSON</span>
              <ChevronDown className="w-3.5 h-3.5 animate-bounce text-[#D6B779]/60" />
            </motion.div>
          </motion.div>
        )}

        {/* PHASE 2: THE REVEALING SEQUENCE */}
        {(phase === "revealing" || phase === "transitioning") && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-4xl"
          >
            {/* Background Image Composition */}
            <div className="absolute inset-0 -z-10 w-screen h-screen overflow-hidden pointer-events-none">
              <motion.img
                initial={{ scale: 1.15, opacity: 0 }}
                animate={{ scale: 1.05, opacity: 0.25 }}
                transition={{ duration: 3.5, ease: "easeOut" }}
                src={heroImageUrl}
                alt="Cinematic Memory"
                className="w-full h-full object-cover filter brightness-70 contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0D] via-transparent to-[#0B0B0D]" />
            </div>

            {/* Act Tag */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="text-[11px] font-mono uppercase tracking-[0.35em] text-[#D6B779] mb-4"
            >
              HONORING & CELEBRATING
            </motion.p>

            {/* Grand Recipient Name Reveal */}
            <motion.h2
              initial={{ opacity: 0, y: 30, letterSpacing: "0.05em" }}
              animate={{ opacity: 1, y: 0, letterSpacing: "-0.02em" }}
              transition={{ delay: 0.6, duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-light text-[#F5F0E8] leading-none mb-6 gold-pure-gradient drop-shadow-2xl"
            >
              {recipientName || "[Recipient Name]"}
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              transition={{ delay: 1.6, duration: 1.2 }}
              className="font-serif italic text-base sm:text-xl text-[#F5F0E8]/80 max-w-md font-light"
            >
              Your world of memories is now unfolding...
            </motion.p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
