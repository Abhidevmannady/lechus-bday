"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowDown, Calendar, Sparkles } from "lucide-react";
import Card3D from "@/components/Card3D";

interface HeroSectionProps {
  recipientName: string;
  birthdayDate: string;
  tagline: string;
  headline: string;
  subheadline: string;
  heroImageUrl: string;
}

export default function HeroSection({
  recipientName,
  birthdayDate,
  tagline,
  headline,
  subheadline,
  heroImageUrl,
}: HeroSectionProps) {
  const scrollToGallery = () => {
    const el = document.getElementById("gallery-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-between pt-28 pb-16 px-6 sm:px-12 max-w-7xl mx-auto z-10">
      {/* Top Tagline & Editorial Milestone Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D6B779]/20 pb-6 mb-12"
      >
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D6B779] animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#D6B779] font-mono">
            ACT II • THE CELEBRATION
          </span>
        </div>

        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#A3A3A8] font-mono">
          <Calendar className="w-3.5 h-3.5 text-[#D6B779]" />
          <span>{birthdayDate || "Celebrate Today"}</span>
        </div>
      </motion.div>

      {/* Main Hero Editorial Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center my-auto">
        {/* Left Column: Breathtaking Headline */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="lg:col-span-7 flex flex-col items-start"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#151519] border border-[#D6B779]/25 text-[11px] text-[#E8CF9A] tracking-wider mb-8 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#D6B779]" />
            <span>HONORING {recipientName || "LECHU"}</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-light leading-[1.02] text-[#F5F0E8] tracking-tight mb-8">
            {headline || "Today, the world gets to celebrate you."}
          </h1>

          <p className="text-base sm:text-xl text-[#A3A3A8] font-light leading-relaxed max-w-xl mb-8 font-serif">
            {subheadline ||
              "Your smile, your little quirks, your unforgettable moments, and all the memories that make you who you are."}
          </p>

          <p className="text-xs sm:text-sm italic font-serif text-[#D6B779] tracking-wide mb-10 border-l border-[#D6B779]/40 pl-4 py-1">
            &ldquo;{tagline || "Every beautiful story has a person who makes it unforgettable."}&rdquo;
          </p>

          <button
            onClick={scrollToGallery}
            className="group flex items-center gap-4 px-9 py-4 rounded-full bg-[#151519] border border-[#D6B779]/40 text-[#F5F0E8] text-xs uppercase tracking-[0.25em] font-light hover:bg-[#D6B779] hover:text-[#0B0B0D] hover:border-[#D6B779] transition-all duration-300 shadow-xl cursor-pointer"
          >
            <span>Explore The Archive</span>
            <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-1 duration-300" />
          </button>
        </motion.div>

        {/* Right Column: Leica Medium-Format Photography Frame with 3D Parallax Tilt */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, delay: 0.3 }}
          className="lg:col-span-5 relative"
        >
          <Card3D maxTilt={10} scale={1.02} glareOpacity={0.25} className="mx-auto max-w-md lg:max-w-none">
            <div className="relative group">
              {/* Viewfinder corner brackets */}
              <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-[#D6B779]/50 pointer-events-none" />
              <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-[#D6B779]/50 pointer-events-none" />
              <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-[#D6B779]/50 pointer-events-none" />
              <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-[#D6B779]/50 pointer-events-none" />

              {/* Frame border */}
              <div className="relative rounded-2xl p-2.5 bg-[#151519] border border-[#D6B779]/30 shadow-2xl overflow-hidden">
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#0B0B0D]">
                  <img
                    src={heroImageUrl}
                    alt={recipientName ? `${recipientName}'s portrait` : "Celebrated memory"}
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  />

                  {/* Film vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D]/85 via-transparent to-transparent pointer-events-none" />

                  {/* Museum placard label */}
                  <div className="absolute bottom-4 inset-x-4 flex items-center justify-between p-3.5 rounded-lg bg-[#0B0B0D]/80 backdrop-blur-md border border-[#D6B779]/20">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.25em] text-[#D6B779] font-mono">
                        PORTRAIT N° 01
                      </p>
                      <p className="font-serif text-sm text-[#F5F0E8] truncate">
                        {recipientName || "LECHU"}
                      </p>
                    </div>
                    <span className="text-[10px] text-[#A3A3A8] tracking-widest font-mono">
                      24 FPS • 35MM
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card3D>
        </motion.div>
      </div>

      {/* Bottom Scroll Cue */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1, duration: 1 }}
        className="flex items-center justify-center pt-12"
      >
        <button
          onClick={scrollToGallery}
          className="flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#A3A3A8]/70 hover:text-[#D6B779] transition-colors font-mono"
        >
          <span>SCROLL TO UNCOVER THE JOURNEY</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce text-[#D6B779]/70" />
        </button>
      </motion.div>
    </section>
  );
}
