"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TimelineEntry } from "@/types/eternity";
import { Compass, MapPin, Calendar, Quote, X, ChevronRight } from "lucide-react";

interface StoryTimelineProps {
  entries: TimelineEntry[];
}

export default function StoryTimeline({ entries }: StoryTimelineProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!entries || entries.length === 0) {
    return null;
  }

  return (
    <section className="relative py-36 px-6 sm:px-12 max-w-7xl mx-auto z-10 border-t border-[#D6B779]/15">
      {/* Header */}
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-24">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151519] border border-[#D6B779]/20 text-[10px] tracking-[0.3em] uppercase text-[#D6B779] mb-4 font-mono"
        >
          <Compass className="w-3 h-3 text-[#D6B779]" />
          <span>ACT IV • THE CHRONICLE</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.1 }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#F5F0E8] font-normal tracking-tight mb-4"
        >
          Look How Far These Little Moments Have Taken Us.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-sm sm:text-base text-[#A3A3A8] font-light leading-relaxed max-w-lg"
        >
          Each chapter, a quiet milestone. Each shared laughter, an anchor in time.
        </motion.p>
      </div>

      {/* Central Thread Container */}
      <div className="relative max-w-5xl mx-auto">
        {/* Glowing thread line for desktop */}
        <div className="hidden lg:block absolute left-1/2 top-4 bottom-8 -translate-x-1/2 w-[1px] bg-gradient-to-b from-[#D6B779]/50 via-[#D6B779]/20 to-transparent" />

        {/* Vertical timeline chapters */}
        <div className="flex flex-col gap-20 lg:gap-32">
          {entries.map((entry, index) => {
            const isEven = index % 2 === 0;
            const chapterNumeral = String(index + 1).padStart(2, "0");

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, delay: 0.1 }}
                className={`relative flex flex-col lg:flex-row items-center gap-10 lg:gap-20 ${
                  isEven ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Center Node marker */}
                <div className="hidden lg:flex absolute left-1/2 top-10 -translate-x-1/2 z-20 items-center justify-center">
                  <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#0B0B0D] border-2 border-[#D6B779] shadow-[0_0_15px_rgba(214,183,121,0.3)]">
                    <span className="w-2 h-2 rounded-full bg-[#D6B779] animate-ping opacity-60" />
                    <span className="absolute w-2 h-2 rounded-full bg-[#D6B779]" />
                  </div>
                </div>

                {/* Left/Right Text Column */}
                <div className="w-full lg:w-1/2 flex flex-col items-start lg:px-4">
                  <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-[#D6B779] font-mono mb-3">
                    <span>CHAPTER {chapterNumeral}</span>
                    <span>•</span>
                    <span className="text-[#A3A3A8]">{entry.date}</span>
                    {entry.location && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-[#A3A3A8]">
                          <MapPin className="w-3 h-3 text-[#D6B779]" />
                          {entry.location}
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="font-serif text-3xl sm:text-4xl text-[#F5F0E8] font-normal tracking-tight mb-5 leading-snug">
                    {entry.title}
                  </h3>

                  <p className="text-base text-[#A3A3A8] font-light font-serif leading-relaxed mb-6">
                    {entry.story}
                  </p>

                  {entry.personal_note && (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-[#151519]/80 border-l-2 border-[#D6B779] text-xs text-[#E8CF9A] italic font-serif">
                      <Quote className="w-4 h-4 text-[#D6B779] shrink-0 mt-0.5" />
                      <span>&ldquo;{entry.personal_note}&rdquo;</span>
                    </div>
                  )}
                </div>

                {/* Left/Right Media Column */}
                <div className="w-full lg:w-1/2">
                  {entry.image_urls && entry.image_urls.length > 0 ? (
                    <div
                      className={`grid gap-4 ${
                        entry.image_urls.length > 1 ? "grid-cols-2" : "grid-cols-1"
                      }`}
                    >
                      {entry.image_urls.map((imgUrl, imgIdx) => (
                        <div
                          key={imgIdx}
                          onClick={() => setSelectedImage(imgUrl)}
                          className="group relative rounded-2xl overflow-hidden bg-[#151519] border border-[#D6B779]/20 hover:border-[#D6B779]/60 transition-all duration-500 shadow-xl cursor-pointer aspect-[4/3]"
                        >
                          <img
                            src={imgUrl}
                            alt={`${entry.title} moment`}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-[#0B0B0D]/30 group-hover:bg-transparent transition-colors duration-300" />
                          <div className="absolute bottom-3 right-3 p-1.5 rounded-full bg-[#0B0B0D]/80 text-[#D6B779] opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-48 rounded-2xl border border-dashed border-[#D6B779]/20 flex items-center justify-center text-xs text-[#A3A3A8] font-mono">
                      PHOTO ARCHIVE ENTRY
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Enlarged Photo Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0B0D]/95 backdrop-blur-2xl p-6"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-[#151519] border border-[#D6B779]/30 text-[#F5F0E8]"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden border border-[#D6B779]/40 shadow-2xl">
              <img
                src={selectedImage}
                alt="Story Milestone"
                className="w-full h-full object-contain max-h-[80vh]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
