"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PersonalQuirk } from "@/types/eternity";
import { Plus, Minus, Sparkles } from "lucide-react";

interface ThingsThatMakeYouYouProps {
  quirks: PersonalQuirk[];
}

export default function ThingsThatMakeYouYou({ quirks }: ThingsThatMakeYouYouProps) {
  const [activeQuirkId, setActiveQuirkId] = useState<string | null>(null);

  if (!quirks || quirks.length === 0) {
    return null;
  }

  const toggleQuirk = (id: string) => {
    setActiveQuirkId(activeQuirkId === id ? null : id);
  };

  return (
    <section className="relative py-36 px-6 sm:px-12 max-w-5xl mx-auto z-10 border-t border-[#D6B779]/15">
      {/* Header */}
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-20">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151519] border border-[#D6B779]/20 text-[10px] tracking-[0.3em] uppercase text-[#D6B779] mb-4 font-mono"
        >
          <Sparkles className="w-3 h-3 text-[#D6B779]" />
          <span>ACT VI • THE LEXICON</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.1 }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#F5F0E8] font-normal tracking-tight mb-4"
        >
          Things That Make You, You.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-sm sm:text-base text-[#A3A3A8] font-light leading-relaxed max-w-lg"
        >
          A quiet catalog of the quirks, habits, and rare qualities that make your presence so
          deeply cherished.
        </motion.p>
      </div>

      {/* Editorial Numbered Lexicon */}
      <div className="border-t border-[#D6B779]/25 divide-y divide-[#D6B779]/15">
        {quirks.map((quirk, index) => {
          const isExpanded = activeQuirkId === quirk.id;
          const numeral = String(index + 1).padStart(2, "0");

          return (
            <motion.div
              key={quirk.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.08 }}
              className="py-6 sm:py-8 transition-colors duration-300"
            >
              <div
                onClick={() => toggleQuirk(quirk.id)}
                className="flex items-start justify-between gap-6 cursor-pointer group"
              >
                {/* Index numeral and title */}
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-8">
                  <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#D6B779]/70 group-hover:text-[#D6B779] transition-colors">
                    N° {numeral}
                  </span>

                  <div>
                    <span className="block text-[11px] uppercase tracking-[0.2em] text-[#A3A3A8]/70 font-mono mb-1">
                      {quirk.category}
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl text-[#F5F0E8] font-light tracking-tight group-hover:text-[#D6B779] transition-colors">
                      {quirk.title}
                    </h3>
                  </div>
                </div>

                {/* Minimalist expand icon */}
                <div className="w-8 h-8 rounded-full border border-[#D6B779]/20 flex items-center justify-center text-[#D6B779] shrink-0 group-hover:border-[#D6B779]/60 transition-colors">
                  {isExpanded ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                </div>
              </div>

              {/* Expanded Narrative Drawer */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="sm:pl-20 pt-4 max-w-2xl">
                      <p className="text-base sm:text-lg text-[#EDEDED] font-serif font-light leading-relaxed border-l border-[#D6B779]/30 pl-4 py-1 italic">
                        &ldquo;{quirk.message}&rdquo;
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
