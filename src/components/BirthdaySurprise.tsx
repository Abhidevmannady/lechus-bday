"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { SurpriseContent } from "@/types/eternity";
import { Sparkles, Wind, Gift, Heart, RotateCcw, Lock, Unlock } from "lucide-react";

interface BirthdaySurpriseProps {
  surprise: SurpriseContent;
  recipientName: string;
}

export default function BirthdaySurprise({ surprise, recipientName }: BirthdaySurpriseProps) {
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [isBlowing, setIsBlowing] = useState(false);
  const [showSecretReveal, setShowSecretReveal] = useState(false);

  const handleBlowCandles = () => {
    if (candlesBlown || isBlowing) return;
    setIsBlowing(true);

    // After brief flicker, extinguish
    setTimeout(() => {
      setCandlesBlown(true);
      setIsBlowing(false);

      // Launch celebratory gold and warm ivory confetti shower
      try {
        confetti({
          particleCount: 85,
          spread: 95,
          origin: { y: 0.65 },
          colors: ["#D6B779", "#E8CF9A", "#F5F0E8", "#B98E96", "#FFDF9E"],
          disableForReducedMotion: true,
        });

        setTimeout(() => {
          confetti({
            particleCount: 45,
            spread: 70,
            origin: { y: 0.55 },
            colors: ["#D6B779", "#F5F0E8"],
          });
        }, 400);
      } catch {
        // ignore
      }
    }, 600);
  };

  const handleRelight = () => {
    setCandlesBlown(false);
    setShowSecretReveal(false);
  };

  return (
    <section className="relative py-36 px-6 sm:px-12 max-w-5xl mx-auto z-10 border-t border-[#D6B779]/15">
      {/* Header */}
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151519] border border-[#D6B779]/20 text-[10px] tracking-[0.3em] uppercase text-[#D6B779] mb-4 font-mono"
        >
          <Sparkles className="w-3 h-3 text-[#D6B779]" />
          <span>ACT V • THE CELEBRATION</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.1 }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#F5F0E8] font-normal tracking-tight mb-4"
        >
          {surprise.wish_prompt || "Make a wish. This moment is yours."}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-sm sm:text-base text-[#A3A3A8] font-light max-w-lg leading-relaxed"
        >
          Take a quiet breath, think of the thing you hope for most this coming year, and extinguish
          the flames.
        </motion.p>
      </div>

      {/* Interactive Birthday Cake Ritual */}
      <div className="relative max-w-lg mx-auto flex flex-col items-center">
        {/* The Patisserie Artwork Cake */}
        <div className="relative w-80 h-72 flex flex-col items-center justify-end select-none">
          {/* Candle Flames & Smoke Layer */}
          <div className="flex items-end justify-center gap-8 mb-1 relative z-20">
            {[1, 2, 3].map((candleIndex) => (
              <div key={candleIndex} className="flex flex-col items-center relative">
                {/* Flame with multi-tier glow */}
                {!candlesBlown ? (
                  <div
                    className={`relative w-4 h-7 cursor-pointer transition-transform duration-300 ${
                      isBlowing ? "skew-x-12 scale-90 opacity-60" : "animate-flicker"
                    }`}
                  >
                    {/* Outer amber halo */}
                    <div className="absolute inset-0 rounded-full bg-[#FFB703] blur-[3px] opacity-80" />
                    {/* Inner gold flame */}
                    <div className="absolute inset-0.5 rounded-full bg-gradient-to-t from-[#D6B779] via-[#FFD700] to-white" />
                    {/* White-hot core */}
                    <div className="absolute inset-x-1 bottom-1 top-3 rounded-full bg-white opacity-95" />
                  </div>
                ) : (
                  /* Curling SVG Smoke Wisp */
                  <div className="w-2 h-7 bg-white/30 rounded-full animate-smoke pointer-events-none" />
                )}

                {/* Wick */}
                <div className="w-0.5 h-2 bg-[#8F7846]" />

                {/* Fluted Gold Candle Body */}
                <div className="w-3.5 h-14 rounded-t-sm bg-gradient-to-b from-[#F5F0E8] via-[#D6B779] to-[#8F7846] shadow-md border border-[#D6B779]/50" />
              </div>
            ))}
          </div>

          {/* Cake Tier 1 (Top Tier) */}
          <div className="relative w-48 h-18 rounded-t-2xl bg-gradient-to-b from-[#21212B] to-[#15151A] border-t-2 border-x border-[#D6B779]/60 shadow-xl flex items-center justify-center overflow-hidden z-10">
            {/* Scallop Frosting Filigree */}
            <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-[#D6B779]/30 via-[#E8CF9A]/60 to-[#D6B779]/30 border-b border-[#D6B779]/40" />
            <div className="flex items-center gap-1.5 text-xs text-[#D6B779] font-serif tracking-widest uppercase">
              <Sparkles className="w-3 h-3 text-[#D6B779]" />
              <span>{recipientName || "LECHU"}</span>
              <Sparkles className="w-3 h-3 text-[#D6B779]" />
            </div>
          </div>

          {/* Cake Tier 2 (Middle Tier) */}
          <div className="relative w-64 h-20 rounded-t-2xl bg-gradient-to-b from-[#1C1C24] to-[#121216] border-t-2 border-x border-[#D6B779]/50 shadow-2xl flex items-center justify-between px-6 overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-[#D6B779]/40 via-[#E8CF9A]/70 to-[#D6B779]/40 border-b border-[#D6B779]/50" />
            <span className="text-[10px] uppercase tracking-widest text-[#D6B779]/70 font-mono">
              NEW CHAPTER
            </span>
            <Heart className="w-3.5 h-3.5 text-[#B98E96]" />
            <span className="text-[10px] uppercase tracking-widest text-[#D6B779]/70 font-mono">
              EST. 2026
            </span>
          </div>

          {/* Cake Tier 3 (Pedestal / Base) */}
          <div className="w-76 h-5 rounded-full bg-gradient-to-r from-[#7D6433] via-[#D6B779] to-[#7D6433] shadow-2xl border-t border-[#F5F0E8]/50" />
        </div>

        {/* Blow Action Controls */}
        <div className="mt-10 flex items-center gap-4">
          {!candlesBlown ? (
            <button
              onClick={handleBlowCandles}
              disabled={isBlowing}
              className="group flex items-center gap-3 px-10 py-4 rounded-full bg-[#151519] border border-[#D6B779]/50 text-[#F5F0E8] text-xs uppercase tracking-[0.25em] font-light hover:bg-[#D6B779] hover:text-[#0B0B0D] hover:border-[#D6B779] transition-all duration-300 shadow-2xl shadow-[#D6B779]/15 cursor-pointer"
            >
              <Wind className="w-4 h-4 text-[#D6B779] group-hover:text-[#0B0B0D] transition-colors" />
              <span>{isBlowing ? "Making A Wish..." : "Blow Out The Candles"}</span>
            </button>
          ) : (
            <button
              onClick={handleRelight}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/10 text-xs text-[#A3A3A8] hover:text-[#D6B779] hover:border-[#D6B779]/40 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Relight candles</span>
            </button>
          )}
        </div>

        {/* Celebratory Revealed Message */}
        <AnimatePresence>
          {candlesBlown && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.8 }}
              className="mt-14 w-full p-8 sm:p-10 rounded-2xl bg-[#151519]/95 border border-[#D6B779]/40 shadow-2xl text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#D6B779]/15 text-[#D6B779] mb-4">
                <Sparkles className="w-5 h-5" />
              </div>

              <h4 className="font-serif text-3xl sm:text-4xl text-[#F5F0E8] font-normal mb-4 gold-pure-gradient">
                Your Wish Has Been Heard.
              </h4>

              <p className="text-base sm:text-lg text-[#EDEDED] font-serif font-light leading-relaxed max-w-md mx-auto mb-8">
                {surprise.revealed_message ||
                  "May every wish you whisper into the universe today come back to you as joy, health, peace, and unforgettable adventures."}
              </p>

              {/* Secret Surprise Drawer Button */}
              <button
                onClick={() => setShowSecretReveal(!showSecretReveal)}
                className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-[#0B0B0D] border border-[#D6B779]/30 text-xs text-[#E8CF9A] hover:border-[#D6B779] tracking-wider uppercase transition-colors"
              >
                {showSecretReveal ? (
                  <Unlock className="w-3.5 h-3.5 text-[#D6B779]" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-[#D6B779]" />
                )}
                <span>
                  {showSecretReveal ? "Hide Secret Surprise" : "Unlock Secret Surprise"}
                </span>
              </button>

              {/* Secret Drawer Content */}
              <AnimatePresence>
                {showSecretReveal && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mt-8 pt-8 border-t border-[#D6B779]/20 overflow-hidden"
                  >
                    <div className="p-6 rounded-xl bg-[#0B0B0D]/80 border border-[#D6B779]/20 max-w-md mx-auto">
                      <p className="font-serif text-2xl text-[#F5F0E8] mb-3">
                        {surprise.secret_title || "A Hidden Surprise Just For You"}
                      </p>

                      {surprise.secret_note && (
                        <p className="text-sm text-[#A3A3A8] italic font-serif leading-relaxed mb-6">
                          &ldquo;{surprise.secret_note}&rdquo;
                        </p>
                      )}

                      {surprise.secret_photo_url && (
                        <div className="rounded-xl overflow-hidden border border-[#D6B779]/30 shadow-lg">
                          <img
                            src={surprise.secret_photo_url}
                            alt="Secret birthday surprise"
                            className="w-full h-auto object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
