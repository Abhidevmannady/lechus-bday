"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LetterContent } from "@/types/eternity";
import { Sparkles, RotateCcw, Heart, Mail } from "lucide-react";

interface HeartfeltLetterProps {
  letter: LetterContent;
  recipientName: string;
}

export default function HeartfeltLetter({ letter, recipientName }: HeartfeltLetterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleOpenLetter = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setIsOpen(true);
      setIsAnimating(false);
    }, 750);
  };

  const handleFoldBack = () => {
    setIsOpen(false);
  };

  return (
    <section className="relative py-36 px-6 sm:px-12 max-w-5xl mx-auto z-10 border-t border-[#D6B779]/15">
      {/* Dynamic Warm Ivory Glow behind section when letter is open */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none -z-10 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-radial from-[#F5F0E8]/08 via-[#D6B779]/05 to-transparent blur-3xl" />
      </div>

      {/* Section Header */}
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151519] border border-[#D6B779]/20 text-[10px] tracking-[0.3em] uppercase text-[#D6B779] mb-4 font-mono"
        >
          <Mail className="w-3 h-3 text-[#D6B779]" />
          <span>PERSONAL CORRESPONDENCE</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.1 }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#F5F0E8] font-normal tracking-tight mb-4"
        >
          {letter.heading || "One Thing I Never Want You to Forget."}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-xs uppercase tracking-[0.25em] text-[#D6B779]/80 font-light"
        >
          {letter.instruction_text || "There's something I'd like you to read."}
        </motion.p>
      </div>

      {/* Centerpiece Container */}
      <div className="relative max-w-3xl mx-auto flex flex-col items-center">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            /* Tactile 3D Origami Envelope */
            <motion.div
              key="closed-envelope-tactile"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.92 }}
              transition={{ duration: 0.5 }}
              className="relative w-full max-w-lg aspect-[1.58/1] rounded-2xl bg-[#151519] border border-[#D6B779]/35 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] p-8 flex flex-col items-center justify-between overflow-hidden perspective-1000 group cursor-pointer"
              onClick={handleOpenLetter}
              style={{
                backgroundImage:
                  "radial-gradient(ellipse at 50% 30%, rgba(30, 30, 38, 0.9), rgba(11, 11, 13, 0.98))",
              }}
            >
              {/* Envelope Flap 3D fold */}
              <div
                className={`absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-[#23232C] to-[#151519] border-b border-[#D6B779]/30 origin-top transition-transform duration-700 ease-in-out z-20 ${
                  isAnimating ? "-rotate-x-180 opacity-60" : ""
                }`}
                style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
              />

              {/* Envelope Interior Lining Pattern */}
              <div className="absolute inset-x-6 bottom-6 top-16 bg-[#1A1A22] rounded-lg border border-[#D6B779]/15 flex items-center justify-center opacity-40 pointer-events-none">
                <span className="font-serif italic text-xs text-[#D6B779]/40 tracking-widest">
                  CONFIDENTIAL • ETERNITY VAULT
                </span>
              </div>

              {/* Top Text */}
              <div className="relative z-10 pt-2 text-center">
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#D6B779]/80 font-mono">
                  {letter.seal_text || "For Your Eyes Only"}
                </span>
              </div>

              {/* Champagne Gold Embossed Wax Seal */}
              <div className="relative z-30 my-auto flex flex-col items-center">
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-[#8A6F36] via-[#D6B779] to-[#F5F0E8] shadow-[0_0_25px_rgba(214,183,121,0.35)] border-2 border-[#F5F0E8]/60 transition-transform duration-300"
                >
                  {/* Wax rim seal texture */}
                  <div className="w-16 h-16 rounded-full border border-[#0B0B0D]/30 flex items-center justify-center bg-gradient-to-br from-[#D6B779] to-[#8A6F36]">
                    <span className="font-serif font-bold text-3xl text-[#0B0B0D] tracking-wider drop-shadow-sm select-none">
                      E
                    </span>
                  </div>
                  <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-[#F5F0E8] animate-pulse" />
                </motion.div>
              </div>

              {/* Bottom Interactive Button */}
              <div className="relative z-30 pb-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenLetter();
                  }}
                  className="group/btn relative px-8 py-2.5 rounded-full bg-[#0B0B0D]/90 border border-[#D6B779]/50 text-xs text-[#E8CF9A] uppercase tracking-[0.25em] font-light hover:bg-[#D6B779] hover:text-[#0B0B0D] hover:border-[#D6B779] transition-all duration-300 shadow-lg"
                >
                  <span>Open Your Letter</span>
                </button>
              </div>
            </motion.div>
          ) : (
            /* The Unfolded Parchment Letter */
            <motion.div
              key="opened-parchment-letter"
              initial={{ opacity: 0, y: 50, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 25, scale: 0.97 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full rounded-2xl bg-[#F5F0E8] text-[#151519] p-8 sm:p-14 md:p-16 shadow-[0_30px_90px_rgba(0,0,0,0.85)] border border-[#D6B779]/60"
            >
              {/* Subtle Paper Texture Border Accent */}
              <div className="absolute inset-3 border border-[#D6B779]/25 pointer-events-none rounded-xl" />

              {/* Top Controls & Stamp */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#151519]/10">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#151519]/50 font-mono">
                  <span>ACT IV • LETTER ARCHIVE</span>
                </div>

                <button
                  onClick={handleFoldBack}
                  className="flex items-center gap-1.5 text-xs text-[#151519]/60 hover:text-[#151519] transition-colors py-1 px-3 rounded-full border border-[#151519]/15 hover:border-[#151519]/40"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Fold and return to envelope</span>
                </button>
              </div>

              {/* Letter Date */}
              <div className="text-right mb-6">
                <span className="text-xs uppercase tracking-widest text-[#151519]/60 font-serif italic">
                  {letter.date || "On this special day"}
                </span>
              </div>

              {/* Salutation */}
              <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#151519] font-normal mb-8 leading-tight">
                {letter.greeting?.replace("[Recipient Name]", recipientName) ||
                  `Dear ${recipientName || "Friend"},`}
              </h3>

              {/* Letter Paragraphs with Generous Editorial Typography */}
              <div className="space-y-6 text-base sm:text-lg md:text-xl font-serif leading-relaxed text-[#151519]/85 font-light">
                {letter.paragraphs.map((para, pIdx) => (
                  <p key={pIdx} className="first-letter:text-2xl first-letter:font-normal">
                    {para.replace("[Recipient Name]", recipientName)}
                  </p>
                ))}
              </div>

              {/* Vintage Keepsake Photo Attachment */}
              {letter.photo_url && (
                <div className="my-10 max-w-sm mx-auto p-4 bg-white shadow-xl border border-[#151519]/10 rotate-1 hover:rotate-0 transition-transform duration-500">
                  <div className="aspect-[4/3] overflow-hidden bg-neutral-100 rounded-sm">
                    <img
                      src={letter.photo_url}
                      alt="Keepsake photograph"
                      className="w-full h-full object-cover filter contrast-105"
                    />
                  </div>
                  <p className="text-[11px] text-center text-[#151519]/60 mt-3 font-serif italic">
                    A moment forever preserved in time.
                  </p>
                </div>
              )}

              {/* Closing Sentiment & Signature */}
              <div className="mt-14 pt-8 border-t border-[#151519]/15 flex flex-col items-start">
                <p className="text-sm sm:text-base font-serif italic text-[#151519]/70 mb-2">
                  {letter.closing || "With all my heart,"}
                </p>
                <p className="font-serif text-3xl sm:text-4xl text-[#151519] font-medium tracking-tight">
                  {letter.signature || "Always, Someone Who Cares"}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
