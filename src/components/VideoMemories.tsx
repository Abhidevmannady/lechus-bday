"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VideoMemory } from "@/types/eternity";
import { Play, Pause, Volume2, VolumeX, Maximize, X, Film, AlertCircle } from "lucide-react";

interface VideoMemoriesProps {
  videos: VideoMemory[];
}

export default function VideoMemories({ videos }: VideoMemoriesProps) {
  const [selectedVideo, setSelectedVideo] = useState<VideoMemory | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const modalContainerRef = useRef<HTMLDivElement | null>(null);

  // Reset player when changing video
  useEffect(() => {
    if (selectedVideo) {
      setIsLoading(true);
      setHasError(false);
      setIsPlaying(false);
      setProgress(0);
    }
  }, [selectedVideo]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 1;
    setProgress((current / dur) * 100);
    setDuration(dur);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * (videoRef.current.duration || 1);
  };

  const toggleFullscreen = () => {
    if (!modalContainerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      modalContainerRef.current.requestFullscreen().catch(() => {});
    }
  };

  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <section className="relative py-28 px-6 sm:px-12 max-w-7xl mx-auto z-10 border-t border-[#D6B779]/15">
      {/* Header */}
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#D6B779] font-light mb-4"
        >
          <Film className="w-3.5 h-3.5 text-[#D6B779]" />
          <span>Cinematic Archive</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.1 }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#F5F0E8] font-normal tracking-tight mb-6"
        >
          Not Just Memories. Little Pieces of Time.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-sm sm:text-base text-[#A3A3A8] font-light leading-relaxed"
        >
          Capturing movement, laughter, and the sounds of days we wish we could replay forever.
        </motion.p>
      </div>

      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {videos.map((vid, idx) => (
          <motion.div
            key={vid.id}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: idx * 0.15 }}
            onClick={() => setSelectedVideo(vid)}
            className="group relative rounded-2xl overflow-hidden cursor-pointer bg-[#151519] border border-[#D6B779]/20 hover:border-[#D6B779]/50 transition-all duration-500 shadow-2xl"
          >
            {/* Poster / Thumbnail Image */}
            <div className="relative aspect-video w-full overflow-hidden bg-[#0B0B0D]">
              <img
                src={
                  vid.poster_url ||
                  "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=800&q=80"
                }
                alt={vid.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Dark film overlay */}
              <div className="absolute inset-0 bg-[#0B0B0D]/50 group-hover:bg-[#0B0B0D]/30 transition-colors duration-300" />

              {/* Central Glowing Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#151519]/80 border border-[#D6B779]/60 text-[#D6B779] shadow-2xl backdrop-blur-md group-hover:scale-110 group-hover:bg-[#D6B779] group-hover:text-[#0B0B0D] transition-all duration-300">
                  <Play className="w-5 h-5 ml-1 fill-current" />
                </div>
              </div>

              {/* Date tag */}
              {vid.date && (
                <span className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-[#0B0B0D]/80 backdrop-blur-md text-[10px] uppercase tracking-widest text-[#D6B779] border border-[#D6B779]/20">
                  {vid.date}
                </span>
              )}
            </div>

            {/* Video Meta info */}
            <div className="p-6">
              <h3 className="font-serif text-2xl text-[#F5F0E8] font-normal mb-2 group-hover:text-[#D6B779] transition-colors">
                {vid.title || "Untitled Motion"}
              </h3>
              <p className="text-xs sm:text-sm text-[#A3A3A8] font-light leading-relaxed">
                {vid.caption}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Video Modal Player */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0B0D]/95 backdrop-blur-2xl p-4 sm:p-8"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-6 right-6 z-50 p-2.5 rounded-full bg-[#151519]/80 border border-[#D6B779]/30 text-[#F5F0E8] hover:text-[#D6B779] hover:border-[#D6B779] transition-colors"
              aria-label="Close Video"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Player Container */}
            <div
              ref={modalContainerRef}
              className="relative max-w-4xl w-full rounded-2xl overflow-hidden bg-black border border-[#D6B779]/30 shadow-2xl flex flex-col"
            >
              {/* Actual Video Element */}
              <div className="relative aspect-video w-full bg-black flex items-center justify-center">
                {hasError ? (
                  <div className="flex flex-col items-center gap-3 text-center p-6">
                    <AlertCircle className="w-8 h-8 text-rose-400" />
                    <p className="text-sm text-[#F5F0E8]">Unable to play this video stream.</p>
                    <p className="text-xs text-[#A3A3A8]">
                      Verify the video format (MP4/WebM) or check browser permissions.
                    </p>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      src={selectedVideo.url}
                      poster={selectedVideo.poster_url}
                      playsInline
                      muted={isMuted}
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedData={() => setIsLoading(false)}
                      onError={() => {
                        setIsLoading(false);
                        setHasError(true);
                      }}
                      onClick={togglePlay}
                      className="w-full h-full object-contain cursor-pointer"
                    />

                    {/* Loading Spinner */}
                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <div className="w-10 h-10 border-2 border-[#D6B779]/20 border-t-[#D6B779] rounded-full animate-spin" />
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Custom Control Bar */}
              <div className="p-4 bg-[#151519] border-t border-[#D6B779]/20 flex flex-col gap-3">
                {/* Scrub Progress Bar */}
                <div
                  onClick={handleSeek}
                  className="w-full h-1.5 bg-[#0B0B0D] rounded-full cursor-pointer overflow-hidden relative group"
                >
                  <div
                    className="h-full bg-gradient-to-r from-[#D6B779] to-[#E8CF9A] rounded-full transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  {/* Left: Play/Pause, Title */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={togglePlay}
                      className="p-2 rounded-full bg-[#0B0B0D] text-[#D6B779] hover:text-[#F5F0E8] transition-colors"
                      aria-label={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                    </button>

                    <div>
                      <p className="font-serif text-base text-[#F5F0E8] leading-none mb-1">
                        {selectedVideo.title}
                      </p>
                      <p className="text-[11px] text-[#A3A3A8]">{selectedVideo.date || "Film Clip"}</p>
                    </div>
                  </div>

                  {/* Right: Audio mute & Fullscreen */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-2 text-[#A3A3A8] hover:text-[#D6B779] transition-colors"
                      aria-label={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={toggleFullscreen}
                      className="p-2 text-[#A3A3A8] hover:text-[#D6B779] transition-colors"
                      aria-label="Toggle Fullscreen"
                    >
                      <Maximize className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
