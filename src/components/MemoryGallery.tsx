"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GalleryImage } from "@/types/eternity";
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, ZoomIn, Camera } from "lucide-react";

interface MemoryGalleryProps {
  images: GalleryImage[];
}

export default function MemoryGallery({ images }: MemoryGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeImageIndex === null) return;
      if (e.key === "Escape") setActiveImageIndex(null);
      if (e.key === "ArrowRight") {
        setActiveImageIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
      }
      if (e.key === "ArrowLeft") {
        setActiveImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeImageIndex, images.length]);

  const activeImage = activeImageIndex !== null ? images[activeImageIndex] : null;

  return (
    <section id="gallery-section" className="relative py-36 px-6 sm:px-12 max-w-7xl mx-auto z-10 border-t border-[#D6B779]/15">
      {/* Header */}
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-20">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151519] border border-[#D6B779]/20 text-[10px] tracking-[0.3em] uppercase text-[#D6B779] mb-4 font-mono"
        >
          <Camera className="w-3 h-3 text-[#D6B779]" />
          <span>ACT III • THE ARCHIVE</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.1 }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#F5F0E8] font-normal tracking-tight mb-4"
        >
          Little Moments. Infinite Meaning.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-sm sm:text-base text-[#A3A3A8] font-light leading-relaxed max-w-lg"
        >
          Some memories are photographs. Others are feelings we somehow managed to keep.
        </motion.p>
      </div>

      {/* Empty State */}
      {images.length === 0 ? (
        <div className="text-center py-20 px-6 rounded-2xl bg-[#151519]/40 border border-[#D6B779]/20 max-w-lg mx-auto">
          <p className="font-serif text-2xl text-[#F5F0E8] mb-2">No Memories Uploaded Yet</p>
          <p className="text-sm text-[#A3A3A8] font-light">
            Visit the curator portal to upload cherished photos and stories.
          </p>
        </div>
      ) : (
        /* Editorial Asymmetric Masonry Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-[320px]">
          {images.map((item, index) => {
            const isTall = item.aspect_ratio === "portrait" || (index % 5 === 0 && !item.aspect_ratio);
            const isWide = item.aspect_ratio === "wide" || item.is_featured;

            const gridSpanClass = isWide
              ? "md:col-span-2 row-span-1 md:row-span-2"
              : isTall
              ? "row-span-2"
              : "row-span-1";

            const figureNumeral = String(index + 1).padStart(2, "0");

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: (index % 3) * 0.12 }}
                onClick={() => setActiveImageIndex(index)}
                className={`group relative rounded-2xl overflow-hidden cursor-pointer bg-[#151519] border border-[#D6B779]/20 hover:border-[#D6B779]/60 transition-all duration-700 shadow-2xl ${gridSpanClass}`}
              >
                {/* Photo Element */}
                <img
                  src={item.url}
                  alt={item.caption || "Special moment"}
                  className="w-full h-full object-cover filter contrast-[1.03] brightness-95 transition-all duration-1000 ease-out group-hover:scale-105 group-hover:brightness-105"
                  loading="lazy"
                />

                {/* Subtle dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D]/95 via-[#0B0B0D]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                {/* Top badges: Figure Numeral, Date & Featured */}
                <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B0B0D]/80 backdrop-blur-md text-[10px] uppercase tracking-widest text-[#D6B779] border border-[#D6B779]/20 font-mono">
                    FIG. {figureNumeral}
                  </span>

                  <div className="flex items-center gap-2">
                    {item.is_featured && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#D6B779]/20 text-[#E8CF9A] border border-[#D6B779]/40 text-[9px] uppercase tracking-widest font-mono">
                        FEATURED
                      </span>
                    )}
                    <span className="w-8 h-8 rounded-full bg-[#0B0B0D]/70 backdrop-blur-md flex items-center justify-center text-[#D6B779] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ZoomIn className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                {/* Bottom Placard Caption & Details */}
                <div className="absolute bottom-5 inset-x-5 text-left pointer-events-none">
                  <div className="flex items-center gap-3 text-[10px] text-[#D6B779]/80 font-mono tracking-wider mb-1.5">
                    {item.date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#D6B779]" />
                        {item.date}
                      </span>
                    )}
                    {item.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#D6B779]" />
                        {item.location}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl text-[#F5F0E8] font-normal leading-snug line-clamp-2 mb-1">
                    {item.caption || "An unforgettable memory"}
                  </h3>

                  {item.personal_note && (
                    <p className="text-xs text-[#A3A3A8] font-serif font-light italic line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      &ldquo;{item.personal_note}&rdquo;
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal with Filmstrip Strip */}
      <AnimatePresence>
        {activeImage && activeImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#0B0B0D]/98 backdrop-blur-2xl p-4 sm:p-8"
          >
            {/* Top Bar: Counter & Close */}
            <div className="w-full flex items-center justify-between max-w-6xl mx-auto z-50">
              <span className="text-xs uppercase tracking-[0.25em] text-[#D6B779] font-mono">
                FRAME {String(activeImageIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
              </span>

              <button
                onClick={() => setActiveImageIndex(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#151519] border border-[#D6B779]/30 text-xs text-[#F5F0E8] hover:text-[#D6B779] transition-colors"
                aria-label="Close Lightbox"
              >
                <span>Close (Esc)</span>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Prev Navigation Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveImageIndex((prev) =>
                  prev !== null && prev > 0 ? prev - 1 : images.length - 1
                );
              }}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 p-3.5 rounded-full bg-[#151519]/80 border border-[#D6B779]/30 text-[#F5F0E8] hover:text-[#D6B779] hover:border-[#D6B779] transition-colors"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Navigation Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveImageIndex((prev) =>
                  prev !== null && prev < images.length - 1 ? prev + 1 : 0
                );
              }}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 p-3.5 rounded-full bg-[#151519]/80 border border-[#D6B779]/30 text-[#F5F0E8] hover:text-[#D6B779] hover:border-[#D6B779] transition-colors"
              aria-label="Next Image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Main Stage Image & Caption */}
            <div className="relative max-w-4xl w-full flex flex-col items-center my-auto">
              <motion.div
                key={activeImage.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                className="relative rounded-2xl overflow-hidden border border-[#D6B779]/35 shadow-2xl bg-[#0B0B0D] max-h-[60vh]"
              >
                <img
                  src={activeImage.url}
                  alt={activeImage.caption || "Expanded photograph"}
                  className="max-h-[60vh] w-auto max-w-full object-contain mx-auto"
                />
              </motion.div>

              {/* Caption Placard */}
              <div className="mt-6 text-center max-w-xl px-4">
                <h4 className="font-serif text-2xl sm:text-3xl text-[#F5F0E8] font-normal mb-2">
                  {activeImage.caption}
                </h4>

                {activeImage.personal_note && (
                  <p className="text-sm italic text-[#A3A3A8] font-serif leading-relaxed">
                    &ldquo;{activeImage.personal_note}&rdquo;
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Filmstrip Thumbnails */}
            <div className="w-full max-w-3xl flex items-center justify-center gap-3 overflow-x-auto py-2 z-50">
              {images.map((thumb, tIdx) => (
                <button
                  key={thumb.id}
                  onClick={() => setActiveImageIndex(tIdx)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border transition-all shrink-0 ${
                    activeImageIndex === tIdx
                      ? "border-[#D6B779] scale-105 shadow-md shadow-[#D6B779]/20"
                      : "border-white/10 opacity-50 hover:opacity-100"
                  }`}
                >
                  <img src={thumb.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
