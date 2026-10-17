"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { ChevronDown, Sparkles, Compass, ArrowRight } from "lucide-react";

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
  const [phase, setPhase] = useState<"initial" | "revealing" | "exiting">("initial");

  const handleEnterClick = () => {
    setPhase("revealing");

    // Launch celebratory champagne gold and warm rose confetti
    try {
      confetti({
        particleCount: 70,
        spread: 85,
        origin: { y: 0.6 },
        colors: ["#D6B779", "#E8CF9A", "#F5F0E8", "#B98E96", "#FFDF9E"],
        disableForReducedMotion: true,
      });

      setTimeout(() => {
        confetti({
          particleCount: 40,
          angle: 60,
          spread: 60,
          origin: { x: 0.2, y: 0.7 },
          colors: ["#D6B779", "#F5F0E8"],
        });
        confetti({
          particleCount: 40,
          angle: 120,
          spread: 60,
          origin: { x: 0.8, y: 0.7 },
          colors: ["#D6B779", "#F5F0E8"],
        });
      }, 400);
    } catch {
      // ignore
    }

    // Auto transition to main experience after 3 seconds
    setTimeout(() => {
      handleComplete();
    }, 3200);
  };

  const handleComplete = () => {
    setPhase("exiting");
    setTimeout(() => {
      onEnter();
    }, 800);
  };

  const handleSkip = () => {
    onEnter();
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={
        phase === "exiting"
          ? { opacity: 0, scale: 1.03, filter: "blur(6px)", transition: { duration: 0.8, ease: "easeInOut" } }
          : { opacity: 1 }
      }
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0B0D] overflow-hidden select-none"
    >
      {/* Ambient Radial Golden Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#D6B779]/12 via-[#151519]/70 to-[#0B0B0D] pointer-events-none" />

      {/* Subtle Film Horizon Line */}
      <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D6B779]/20 to-transparent pointer-events-none" />

      {/* Skip Button */}
      <button
        onClick={handleSkip}
        className="absolute top-8 right-8 z-50 text-[11px] tracking-[0.2em] uppercase text-[#A3A3A8]/70 hover:text-[#D6B779] transition-colors py-1.5 px-4 rounded-full border border-white/10 hover:border-[#D6B779]/40 bg-[#151519]/60 backdrop-blur-md cursor-pointer"
      >
        Skip Intro
      </button>

      {/* STAGE 1: INVITATION */}
      {phase === "initial" && (
        <motion.div
          key="stage-initial"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-20 max-w-4xl px-6 text-center flex flex-col items-center"
        >
          {/* Act Stamp */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#151519] border border-[#D6B779]/30 text-[10px] tracking-[0.3em] uppercase text-[#D6B779] mb-8 font-mono shadow-lg">
            <Compass className="w-3.5 h-3.5 text-[#D6B779]" />
            <span>ACT I • PROLOGUE</span>
          </div>

          {/* Understated Introductory Quote */}
          <p className="font-serif italic text-lg sm:text-2xl text-[#E8CF9A] font-light max-w-xl leading-relaxed mb-6">
            &ldquo;{introQuote || "For someone who makes ordinary moments extraordinary."}&rdquo;
          </p>

          {/* Monumental Headline */}
          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight text-[#F5F0E8] font-normal leading-[1.02] mb-10">
            {introTitle || "A Story Called You."}
          </h1>

          {/* Elegant Gold Separator */}
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#D6B779] to-transparent mb-12" />

          {/* The Enter Button */}
          <motion.button
            onClick={handleEnterClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="group relative inline-flex items-center gap-4 px-10 py-4.5 rounded-full bg-[#151519] border-2 border-[#D6B779]/50 text-[#F5F0E8] text-xs uppercase tracking-[0.25em] font-medium shadow-[0_0_30px_rgba(214,183,121,0.2)] hover:border-[#D6B779] hover:shadow-[0_0_40px_rgba(214,183,121,0.4)] transition-all duration-300 cursor-pointer overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D6B779]/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
            <Sparkles className="w-4 h-4 text-[#D6B779] transition-transform duration-500 group-hover:rotate-45" />
            <span>Enter Your Little Universe</span>
          </motion.button>

          {/* Ambient Hint */}
          <div className="mt-14 flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#A3A3A8]/70">
            <span>A CINEMATIC GIFT</span>
            <ChevronDown className="w-4 h-4 animate-bounce text-[#D6B779]/70" />
          </div>
        </motion.div>
      )}

      {/* STAGE 2: THE REVEAL */}
      {phase === "revealing" && (
        <motion.div
          key="stage-revealing"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-20 flex flex-col items-center justify-center text-center px-6 max-w-4xl"
        >
          {/* Subtle Background Preview */}
          <div className="absolute inset-0 -z-10 w-screen h-screen overflow-hidden pointer-events-none">
            <img
              src={heroImageUrl}
              alt="Memory"
              className="w-full h-full object-cover filter brightness-[0.35] contrast-110 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0D] via-transparent to-[#0B0B0D]" />
          </div>

          <p className="text-[11px] font-mono uppercase tracking-[0.35em] text-[#D6B779] mb-4">
            HONORING & CELEBRATING
          </p>

          <h2 className="font-serif text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-light text-[#F5F0E8] leading-none mb-6 gold-pure-gradient drop-shadow-2xl">
            {recipientName || "[Recipient Name]"}
          </h2>

          <p className="font-serif italic text-base sm:text-xl text-[#F5F0E8]/90 max-w-md font-light mb-8">
            Your world of memories is now unfolding...
          </p>

          {/* Quick Continue Button */}
          <button
            onClick={handleComplete}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#151519]/90 border border-[#D6B779]/50 text-xs text-[#E8CF9A] tracking-widest uppercase hover:bg-[#D6B779] hover:text-[#0B0B0D] transition-colors cursor-pointer"
          >
            <span>Step Inside</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
