"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowUp, Lock } from "lucide-react";
import Link from "next/link";

interface FinalSceneProps {
  recipientName: string;
  finalQuote: string;
  finalSubtext: string;
  heroImageUrl: string;
}

export default function FinalScene({
  recipientName,
  finalQuote,
  finalSubtext,
  heroImageUrl,
}: FinalSceneProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative min-h-[90vh] flex flex-col justify-between py-28 px-6 sm:px-12 max-w-6xl mx-auto z-10 text-center border-t border-[#D6B779]/20">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial from-[#D6B779]/10 via-transparent to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Main Closing Sentiment */}
      <div className="flex flex-col items-center my-auto max-w-3xl mx-auto">
        {/* Ambient Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#151519] border border-[#D6B779]/30 text-xs text-[#E8CF9A] tracking-widest uppercase mb-10"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D6B779]" />
          <span>The Closing Chapter</span>
        </motion.div>

        {/* Cinematic Quote */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-[#F5F0E8] font-light leading-relaxed mb-10"
        >
          &ldquo;{finalQuote ||
            "If there's one thing I hope you carry with you, it's this: you make the world a little more beautiful simply by being in it."}&rdquo;
        </motion.p>

        {/* Prominent Happy Birthday Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="mb-8"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-[#D6B779] mb-2 font-light">
            With All Warmth & Sincerity
          </p>
          <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[#F5F0E8] gold-gradient-text font-normal">
            HAPPY BIRTHDAY, {recipientName || "[RECIPIENT NAME]"}.
          </h2>
        </motion.div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-sm sm:text-base text-[#A3A3A8] font-light max-w-xl mx-auto leading-relaxed mb-12"
        >
          {finalSubtext ||
            "Here's to more laughter, more adventures, more memories, and a thousand little reasons to smile."}
        </motion.p>

        {/* Revisit Memories Button */}
        <motion.button
          onClick={scrollToTop}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#151519] border border-[#D6B779]/40 text-[#F5F0E8] text-xs uppercase tracking-[0.2em] font-light hover:bg-[#D6B779] hover:text-[#0B0B0D] hover:border-[#D6B779] transition-all duration-300 shadow-xl"
        >
          <span>Revisit The Memories</span>
          <ArrowUp className="w-4 h-4 transition-transform group-hover:-translate-y-1 duration-300" />
        </motion.button>
      </div>

      {/* Discreet Footer Bar with Admin Link */}
      <div className="pt-16 border-t border-[#D6B779]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A3A3A8]/60">
        <p className="tracking-widest uppercase text-[10px]">
          ETERNITY • A CINEMATIC GIFT • 2026
        </p>

        {/* Discreet Admin Lock */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-[11px] text-[#A3A3A8]/40 hover:text-[#D6B779] transition-colors p-1"
          title="Curator & Admin Portal"
        >
          <Lock className="w-3 h-3" />
          <span>Curator Portal</span>
        </Link>
      </div>
    </footer>
  );
}
