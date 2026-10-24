"use client";

import React, { useEffect, useState } from "react";
import ThreeCanvasBackground from "@/components/ThreeCanvasBackground";
import ParticleBackground from "@/components/ParticleBackground";
import AmbientSoundtrack from "@/components/AmbientSoundtrack";
import CinematicOpening from "@/components/CinematicOpening";
import HeroSection from "@/components/HeroSection";
import MemoryGallery from "@/components/MemoryGallery";
import VideoMemories from "@/components/VideoMemories";
import StoryTimeline from "@/components/StoryTimeline";
import HeartfeltLetter from "@/components/HeartfeltLetter";
import BirthdaySurprise from "@/components/BirthdaySurprise";
import ThingsThatMakeYouYou from "@/components/ThingsThatMakeYouYou";
import FinalScene from "@/components/FinalScene";
import { EternityData } from "@/types/eternity";
import { defaultEternityData } from "@/lib/defaults";
import { loadEternityData } from "@/lib/supabase";

export default function EternityHome() {
  const [data, setData] = useState<EternityData>(defaultEternityData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const siteData = await loadEternityData();
      setData(siteData);
      setIsLoaded(true);
    }
    fetchData();
  }, []);

  return (
    <main className="relative min-h-screen bg-[#0B0B0D] text-[#EDEDED] selection:bg-[#D6B779]/30 selection:text-[#F5F0E8] overflow-x-hidden">
      {/* Subtle Film Grain Overlay */}
      <div className="film-grain" />

      {/* 3D WebGL Canvas Background: Celestial Rings, 3D Crystals & Interactive Starfield */}
      <ThreeCanvasBackground />

      {/* Floating Stardust Particles */}
      <ParticleBackground />

      {/* Discreet Atmospheric Audio Controller */}
      <AmbientSoundtrack
        musicUrl={data.config.music_url}
        musicTitle={data.config.music_title}
        autoplayTrigger={hasEntered}
      />

      {/* The Cinematic Opening Sequence */}
      {!hasEntered && (
        <CinematicOpening
          recipientName={data.config.recipient_name}
          introQuote={data.config.intro_quote}
          introTitle={data.config.intro_title}
          heroImageUrl={data.config.hero_image_url}
          onEnter={() => setHasEntered(true)}
        />
      )}

      {/* The Hero Section */}
      <HeroSection
        recipientName={data.config.recipient_name}
        birthdayDate={data.config.birthday_date}
        tagline={data.config.tagline}
        headline={data.config.hero_headline}
        subheadline={data.config.hero_subheadline}
        heroImageUrl={data.config.hero_image_url}
      />

      {/* 4. Memory Gallery */}
      {data.config.show_gallery && <MemoryGallery images={data.gallery} />}

      {/* 5. Video Memories Archive */}
      {data.config.show_videos && <VideoMemories videos={data.videos} />}

      {/* 6. Story Timeline */}
      {data.config.show_timeline && <StoryTimeline entries={data.timeline} />}

      {/* 7. The Heartfelt Letter */}
      {data.config.show_letter && (
        <HeartfeltLetter letter={data.letter} recipientName={data.config.recipient_name} />
      )}

      {/* 8. Birthday Surprise & Interactive Cake */}
      {data.config.show_cake && (
        <BirthdaySurprise surprise={data.surprise} recipientName={data.config.recipient_name} />
      )}

      {/* 9. Things That Make You, You */}
      {data.config.show_quirks && <ThingsThatMakeYouYou quirks={data.quirks} />}

      {/* 11. Final Scene */}
      <FinalScene
        recipientName={data.config.recipient_name}
        finalQuote={data.config.final_quote}
        finalSubtext={data.config.final_subtext}
        heroImageUrl={data.config.hero_image_url}
      />
    </main>
  );
}
