"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Music, Play, Pause } from "lucide-react";

interface AmbientSoundtrackProps {
  musicUrl?: string;
  musicTitle?: string;
  autoplayTrigger?: boolean;
}

export default function AmbientSoundtrack({
  musicUrl,
  musicTitle = "Cinematic Atmosphere",
  autoplayTrigger = false,
}: AmbientSoundtrackProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasStartedOnce, setHasStartedOnce] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const activeNodesRef = useRef<{ oscs: OscillatorNode[]; gains: GainNode[] }>({ oscs: [], gains: [] });
  const intervalRef = useRef<number | null>(null);

  // Ethereal Hans Zimmer / Ólafur Arnalds style cinematic chord progression
  // Chords: D maj 9 -> B min 11 -> G maj 7 -> A sus 4
  const chordFrequencies = [
    [146.83, 220.0, 277.18, 369.99, 440.0], // D maj 9 (D3, A3, C#4, F#4, A4)
    [123.47, 185.0, 293.66, 369.99, 440.0], // B min 11 (B2, F#3, D4, F#4, A4)
    [98.0, 196.0, 246.94, 293.66, 369.99],  // G maj 7 (G2, G3, B3, D4, F#4)
    [110.0, 220.0, 293.66, 329.63, 440.0],  // A sus 4 (A2, A3, D4, E4, A4)
  ];

  const startCelestialSynth = () => {
    if (audioCtxRef.current) return;
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const master = ctx.createGain();
      master.gain.setValueAtTime(0.0001, ctx.currentTime);
      master.gain.exponentialRampToValueAtTime(0.065, ctx.currentTime + 3);
      master.connect(ctx.destination);
      masterGainRef.current = master;

      let currentChordIdx = 0;

      const playChord = (chordIdx: number) => {
        if (!audioCtxRef.current || audioCtxRef.current.state === "closed") return;
        const now = ctx.currentTime;
        const freqs = chordFrequencies[chordIdx];

        // Fade out old oscs
        activeNodesRef.current.gains.forEach((g) => {
          try {
            g.gain.setValueAtTime(g.gain.value, now);
            g.gain.exponentialRampToValueAtTime(0.0001, now + 3);
          } catch {
            // ignore
          }
        });

        setTimeout(() => {
          activeNodesRef.current.oscs.forEach((o) => {
            try {
              o.stop();
              o.disconnect();
            } catch {
              // ignore
            }
          });
          activeNodesRef.current.oscs = [];
          activeNodesRef.current.gains = [];
        }, 3200);

        // Spawn new chord oscillators
        const newOscs: OscillatorNode[] = [];
        const newGains: GainNode[] = [];

        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          // Warm analog style filtering
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(800 + idx * 200, now);

          osc.type = idx === 0 ? "sine" : "triangle";
          osc.frequency.setValueAtTime(freq, now);

          // Gentle chorus detune
          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.value = 0.1 + idx * 0.04;
          lfoGain.gain.value = 1.0;
          lfo.connect(osc.frequency);
          lfo.start();

          // Soft envelope
          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.exponentialRampToValueAtTime(0.18 / freqs.length, now + 2.5);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(master);

          osc.start();
          newOscs.push(osc);
          newGains.push(gain);
        });

        activeNodesRef.current = { oscs: newOscs, gains: newGains };
      };

      // Play initial chord
      playChord(currentChordIdx);

      // Cycle chords every 8 seconds
      intervalRef.current = window.setInterval(() => {
        currentChordIdx = (currentChordIdx + 1) % chordFrequencies.length;
        playChord(currentChordIdx);
      }, 8000);
    } catch (e) {
      console.warn("Web Audio API not supported:", e);
    }
  };

  const stopCelestialSynth = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (!audioCtxRef.current || !masterGainRef.current) return;
    const ctx = audioCtxRef.current;
    try {
      masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, ctx.currentTime);
      masterGainRef.current.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.5);
    } catch {
      // ignore
    }

    setTimeout(() => {
      activeNodesRef.current.oscs.forEach((o) => {
        try {
          o.stop();
          o.disconnect();
        } catch {
          // ignore
        }
      });
      activeNodesRef.current = { oscs: [], gains: [] };
      if (audioCtxRef.current?.state !== "closed") {
        audioCtxRef.current?.close();
      }
      audioCtxRef.current = null;
    }, 1600);
  };

  const togglePlay = () => {
    if (musicUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            setHasStartedOnce(true);
          })
          .catch((err) => console.log("Audio play prevented:", err));
      }
    } else {
      if (isPlaying) {
        stopCelestialSynth();
        setIsPlaying(false);
      } else {
        startCelestialSynth();
        setIsPlaying(true);
        setHasStartedOnce(true);
      }
    }
  };

  const toggleMute = () => {
    if (musicUrl && audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    } else if (masterGainRef.current && audioCtxRef.current) {
      if (isMuted) {
        masterGainRef.current.gain.setValueAtTime(0.065, audioCtxRef.current.currentTime);
        setIsMuted(false);
      } else {
        masterGainRef.current.gain.setValueAtTime(0.0001, audioCtxRef.current.currentTime);
        setIsMuted(true);
      }
    }
  };

  useEffect(() => {
    if (autoplayTrigger && !hasStartedOnce) {
      togglePlay();
    }
  }, [autoplayTrigger]);

  return (
    <div className="fixed top-6 right-6 z-50 flex items-center gap-2 select-none">
      {musicUrl && (
        <audio
          ref={audioRef}
          src={musicUrl}
          loop
          preload="none"
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Expanded Track Badge */}
      {isExpanded && (
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#151519]/90 border border-[#D6B779]/25 backdrop-blur-md text-xs text-[#E8CF9A] shadow-xl animate-fadeIn">
          <Music className="w-3.5 h-3.5 text-[#D6B779]" />
          <span className="max-w-[150px] truncate font-serif italic">{musicTitle}</span>
        </div>
      )}

      {/* Main Luxury Audio Pill */}
      <div className="flex items-center rounded-full bg-[#151519]/90 border border-[#D6B779]/35 backdrop-blur-md p-1 shadow-2xl shadow-black/60">
        <button
          onClick={togglePlay}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
          className="relative flex items-center justify-center w-9 h-9 rounded-full bg-[#0B0B0D] text-[#D6B779] hover:text-[#F5F0E8] hover:border-[#D6B779]/60 transition-all duration-300 cursor-pointer"
          aria-label={isPlaying ? "Pause soundtrack" : "Play soundtrack"}
          title={isPlaying ? "Pause soundtrack" : "Play soundtrack"}
        >
          {isPlaying ? (
            <div className="flex items-center justify-center relative">
              <span className="absolute -inset-1 rounded-full border border-[#D6B779]/40 animate-ping opacity-30" />
              <div className="flex items-end gap-0.5 h-3.5">
                <span className="w-0.5 bg-[#D6B779] h-3.5 animate-pulse" />
                <span className="w-0.5 bg-[#D6B779] h-2 animate-pulse delay-75" />
                <span className="w-0.5 bg-[#D6B779] h-3 animate-pulse delay-150" />
              </div>
            </div>
          ) : (
            <Play className="w-4 h-4 ml-0.5 text-[#D6B779]/80" />
          )}
        </button>

        {isPlaying && (
          <button
            onClick={toggleMute}
            className="p-1.5 ml-1 text-[#A3A3A8] hover:text-[#F5F0E8] transition-colors cursor-pointer"
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-[#D6B779]" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
